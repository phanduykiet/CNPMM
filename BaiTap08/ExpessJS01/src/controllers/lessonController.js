const {
  getLessonsService,
  createLessonService,
  syncLessonsToES,
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
} = require("../services/lessonService");
const Lesson = require("../models/Lesson");

// Lấy danh sách bài học với phân trang và lọc và tìm kiếm
const getLessons = async (req, res) => {
  try {
    const page = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subject = req.query.subject;
    const category = req.query.category;
    const search = req.query.search;
    const result = await getLessonsService(page, limit, subject, category, search);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLesson = async (req, res) => {
  try {
    // lấy toàn bộ body gửi từ client
    const lessonData = req.body;

    // gọi service, truyền cả object
    const lesson = await createLessonService(lessonData);

    // đồng bộ sang Elasticsearch
    await syncLessonsToES();

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Lấy danh sách subject và category từ MongoDB
const getFiltersFromDB = async (req, res) => {
  try {
    const subjects = await Lesson.distinct("subject");
    const categoriesBySubject = {};

    for (const subj of subjects) {
      categoriesBySubject[subj] = await Lesson.distinct("category", { subject: subj });
    }

    res.json({ subjects, categories: categoriesBySubject });
  } catch (error) {
    console.error("Error getting filters from DB:", error);
    res.status(500).json({ message: "Error getting filters from DB" });
  }
}

// ====== FAVORITE ======
const addFavorite = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.body;
    const lesson = await addFavoriteService(lessonId, userId);
    res.json({ success: true, data: { favoriteCount: lesson.favoriteCount } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.body;
    const lesson = await removeFavoriteService(lessonId, userId);
    res.json({ success: true, data: { favoriteCount: lesson.favoriteCount } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const listFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const data = await listFavoritesByUserService(userId, +page, +limit);
    res.json(data);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ====== VIEWED ======
const markViewed = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.body; // có thể null/undefined nếu khách ẩn danh
    const lesson = await markViewedService(lessonId, userId);
    res.json({ success: true, data: { viewCount: lesson.viewCount } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const listViewedByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const data = await listViewedByUserService(userId, +page, +limit);
    res.json(data);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ====== SIMILAR ======
const getSimilarLessons = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { limit = 6 } = req.query;
    const data = await getSimilarLessonsService(lessonId, +limit);
    res.json({ data });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ====== COUNTS ======
const getLessonCounts = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const counts = await getLessonCountsService(lessonId);
    res.json({ data: counts });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ====== COMMENT ======
const addComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId, content } = req.body;
    const lesson = await addCommentService(lessonId, userId, content);
    res.json({ success: true, data: { commentCount: lesson.commentCount, comments: lesson.comments } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ====== BUY ======
const addBuyer = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.body;
    const lesson = await addBuyerService(lessonId, userId);
    res.json({ success: true, data: { buyers: lesson.buyers, totalBuyers: (lesson.buyers || []).length } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Lấy chi tiết
const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await getLessonByIdService(lessonId);
    res.json({ success: true, data: lesson });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLessons,
  createLesson,
  getFiltersFromDB,
  addFavorite,
  removeFavorite,
  listFavoritesByUser,
  markViewed,
  listViewedByUser,
  getSimilarLessons,
  getLessonCounts,
  addComment,
  addBuyer,
  getLessonById,
};