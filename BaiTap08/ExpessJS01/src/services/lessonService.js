const Lesson = require("../models/Lesson");
const { esClient } = require("../config/elasticSearch");

const LESSON_INDEX = "search-263b";

// Hàm đồng bộ MongoDB → Elasticsearch (bản fix)
const syncLessonsToES = async () => {
  try {
    const lessons = await Lesson.find().lean(); // lean cho object “phẳng”

    for (const lesson of lessons) {
      // Loại bỏ _id (và __v nếu có)
      const { _id, __v, ...doc } = lesson;

      await esClient.index({
        index: LESSON_INDEX,
        id: _id.toString(),   // set _id qua tham số id
        document: doc,        // KHÔNG còn _id trong body
        refresh: true,        // để search thấy ngay (tùy nhu cầu)
      });
    }
    console.log("Sync lessons to Elasticsearch completed!");
  } catch (error) {
    console.error("Error syncing lessons:", error);
    throw error; // QUAN TRỌNG: propagate lỗi ra ngoài nếu cần
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
        fuzziness: "AUTO",
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
};
