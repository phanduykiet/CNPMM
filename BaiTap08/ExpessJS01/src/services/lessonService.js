const Lesson = require("../models/Lesson");
const { esClient } = require("../config/elasticSearch");
const mongoose = require("mongoose");

const LESSON_INDEX = "search-263b";

// Hàm đồng bộ MongoDB → Elasticsearch (bản fix)
const syncLessonsToES = async () => {
  try {
    // 1) XÓA SẠCH INDEX (nếu có)
    const exists = await esClient.indices.exists({ index: LESSON_INDEX });
    if (exists) {
      await esClient.indices.delete({ index: LESSON_INDEX });
      console.log(`[ES] Deleted index ${LESSON_INDEX}`);
    }
    // 2) (TUỲ CHỌN) Tạo lại index + mapping
    await esClient.indices.create({
      index: LESSON_INDEX,
    });
    console.log(`[ES] Created index ${LESSON_INDEX}`);
    // 3) Lấy dữ liệu từ MongoDB
    const lessons = await Lesson.find().lean(); // lean cho object phẳng
    if (!lessons.length) {
      console.log("[SYNC] No lessons found in MongoDB. Index remains empty.");
      return;
    }
    // 4) Chuẩn bị payload cho bulk
    const ops = [];
    for (const lesson of lessons) {
      const { _id, __v, ...doc } = lesson; // loại bỏ _id, __v khỏi body
      ops.push({ index: { _index: LESSON_INDEX, _id: _id.toString() } });
      ops.push(doc);
    }
    // 5) Bulk index
    const bulkRes = await esClient.bulk({
      refresh: true,     // để search thấy ngay
      operations: ops,
    });
    if (bulkRes.errors) {
      const itemsWithError = bulkRes.items.filter(i => i.index && i.index.error);
      console.error("[ES] Bulk had errors:", itemsWithError.slice(0, 5));
      throw new Error(`Bulk indexing failed for ${itemsWithError.length} items`);
    }
    console.log(`[SYNC] Reindexed ${lessons.length} lessons into ${LESSON_INDEX} successfully!`);
  } catch (error) {
    console.error("Error syncing lessons (full reload):", error);
    throw error; // propagate để caller biết thất bại
  }
};

// Hàm lấy danh sách bài học từ Elasticsearch
const getLessonsService = async (page = 1, limit = 10, subject, category, search) => {
  const filters = [];

  if (subject && subject.trim()) {
    filters.push({ term: { "subject.keyword": subject.trim() } });
  }
  if (category && category.trim()) {
    filters.push({ term: { "category.keyword": category.trim() } });
  }

  const must = [];
  if (search && search.trim()) {
    must.push({
      multi_match: {
        query: search.trim(),
        fields: ["title^2", "description"],
        fuzziness: 1,              // kiểm soát độ sai khác ký tự
        operator: "AND",           // bắt buộc khớp tất cả từ khóa
        minimum_should_match: "80%"
      },
    });
  }

  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: LESSON_INDEX,
    from,
    size: limit,
    track_total_hits: true,
    query: {
      bool: {
        must: must.length ? must : [{ match_all: {} }],
        filter: filters, // <-- dùng filter cho subject/category
      },
    },
    sort: [{ createdAt: { order: "desc" } }],
  });

  const hits = result.hits.hits.map(h => ({ id: h._id, ...h._source }));

  return {
    page,
    limit,
    total: result.hits.total.value,
    totalPages: Math.ceil(result.hits.total.value / limit),
    data: hits,
  };
};

// Tạo lesson
const createLessonService = async (lessonData) => {
  const lesson = new Lesson(lessonData); // nhận cả object
  return await lesson.save();
};

// ========== FAVORITE ==========
const addFavoriteService = async (lessonId, userId) => {
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $addToSet: { favoritedBy: userId } },
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");

  // đồng bộ lại favoriteCount
  lesson.favoriteCount = (lesson.favoritedBy || []).length;
  await lesson.save();

  // loại bỏ _id, __v trước khi sync ES
  const { _id, __v, ...doc } = lesson.toObject();

  await esClient.index({
    index: LESSON_INDEX,
    id: lesson._id.toString(), // _id chỉ dùng ở đây
    document: doc,             // không chứa _id nữa
    refresh: true
  });

  return lesson;
};


const removeFavoriteService = async (lessonId, userId) => {
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $pull: { favoritedBy: userId } },
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");

  // cập nhật lại số lượng yêu thích
  lesson.favoriteCount = (lesson.favoritedBy || []).length;
  await lesson.save();

  // loại bỏ _id, __v trước khi sync sang Elasticsearch
  const { _id, __v, ...doc } = lesson.toObject();

  await esClient.index({
    index: LESSON_INDEX,
    id: lesson._id.toString(), // set _id ở tham số id
    document: doc,             // body không còn _id
    refresh: true
  });

  return lesson;
};


const listFavoritesByUserService = async (userId, page = 1, limit = 10) => {
  const q = { favoritedBy: userId };
  const total = await Lesson.countDocuments(q);
  const lessons = await Lesson.find(q)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { page, limit, total, totalPages: Math.ceil(total / limit), data: lessons };
};

// ========== VIEWED ==========
const markViewedService = async (lessonId, userId) => {
  // tăng viewCount mỗi lần xem, thêm user vào viewedBy (không trùng)
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $addToSet: { viewedBy: userId }, $inc: { viewCount: 1 } },
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");

  // loại bỏ _id, __v trước khi sync ES
  const { _id, __v, ...doc } = lesson.toObject();

  await esClient.index({
    index: LESSON_INDEX,
    id: lesson._id.toString(), // _id set ở đây
    document: doc,             // body sạch, không có _id
    refresh: true
  });

  return lesson;
};


const listViewedByUserService = async (userId, page = 1, limit = 10) => {
  const q = { viewedBy: userId };
  const total = await Lesson.countDocuments(q);
  const lessons = await Lesson.find(q)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { page, limit, total, totalPages: Math.ceil(total / limit), data: lessons };
};

// ========== SIMILAR ==========
const getSimilarLessonsService = async (lessonId, limit = 6) => {
  const base = await Lesson.findById(lessonId).lean();
  if (!base) throw new Error("Lesson not found");

  // Ưu tiên cùng category, fallback cùng subject
  const similar = await Lesson.find({
    _id: { $ne: base._id },
    $or: [{ category: base.category }, { subject: base.subject }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return similar;
};

// ========== COUNTS (buyers/comments/views/favorites) ==========
const getLessonCountsService = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId, {
    buyers: 1,
    comments: 1,
    viewCount: 1,
    favoriteCount: 1,
  }).lean();

  if (!lesson) throw new Error("Lesson not found");

  return {
    buyers: (lesson.buyers || []).length,
    comments: (lesson.comments || []).length, // hoặc dùng commentCount nếu đã lưu
    views: lesson.viewCount || 0,
    favorites: lesson.favoriteCount || 0,
  };
};

// ========== COMMENT ==========
const addCommentService = async (lessonId, userId, content) => {
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    {
      $push: { comments: { user: userId, content, createdAt: new Date() } },
      $inc: { commentCount: 1 },
    },
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");

  // loại bỏ _id, __v trước khi sync ES
  const { _id, __v, ...doc } = lesson.toObject();

  await esClient.index({
    index: LESSON_INDEX,
    id: lesson._id.toString(), // dùng _id làm id metadata
    document: doc,             // body sạch, không chứa _id
    refresh: true
  });

  return lesson;
};

// Phân trang mảng subdocument comments bằng Aggregation để tránh kéo cả mảng lớn về
const getCommentsService = async ({ lessonId, page, limit, sort = "desc" }) => {
  const _id = new mongoose.Types.ObjectId(lessonId);
  const skip = (page - 1) * limit;
  const sortDesc = sort === "desc";

  const pipeline = [
    { $match: { _id } },
    {
      // Đảo mảng khi cần sắp xếp desc để slice đúng cửa sổ
      $project: {
        commentCount: 1,
        comments: sortDesc ? { $reverseArray: "$comments" } : "$comments",
      },
    },
    {
      // Cắt trang
      $project: {
        commentCount: 1,
        comments: { $slice: ["$comments", skip, limit] },
      },
    },
  ];

  const docs = await Lesson.aggregate(pipeline);
  if (!docs.length) throw new Error("Lesson not found");

  const { comments, commentCount } = docs[0];

  // Meta phân trang
  const total = typeof commentCount === "number"
    ? commentCount
    : (await Lesson.findById(_id).select("comments").lean())?.comments?.length || 0;

  return {
    comments,
    total,
    page,
    limit,
    sort,
    hasMore: page * limit < total,
  };
};

// ========== BUY (mua) ==========
const addBuyerService = async (lessonId, userId) => {
  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $addToSet: { buyers: userId } }, // đảm bảo không thêm trùng
    { new: true }
  );
  if (!lesson) throw new Error("Lesson not found");

  // loại bỏ _id, __v trước khi sync Elasticsearch
  const { _id, __v, ...doc } = lesson.toObject();

  await esClient.index({
    index: LESSON_INDEX,
    id: lesson._id.toString(), // _id chỉ dùng ở metadata
    document: doc,             // body sạch sẽ, không còn _id
    refresh: true
  });

  return lesson;
};


// Lấy chi tiết
const getLessonByIdService = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId)
    .select("title description content subject category thumbnail price viewCount buyers comments favoriteCount createdAt updatedAt")
    .populate("buyers", "name email") // nếu muốn lấy info user mua
    .populate("comments.user", "name email"); // nếu muốn hiển thị user comment

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return lesson;
};

module.exports = {
  // cũ
  syncLessonsToES,
  getLessonsService,
  createLessonService,
  // mới
  addFavoriteService,
  removeFavoriteService,
  listFavoritesByUserService,
  markViewedService,
  listViewedByUserService,
  getSimilarLessonsService,
  getLessonCountsService,
  addCommentService,
  addBuyerService,
  getLessonByIdService,
  getCommentsService,
};
