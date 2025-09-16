const { getLessonsService, createLessonService } = require("../services/lessonService");

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
    const { title, description, content, subject, category, thumbnail } = req.body;
    const lesson = await createLessonService(title, description, content, subject, category, thumbnail);

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

module.exports = { getLessons, createLesson };