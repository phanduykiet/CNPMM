const { getLessonsService } = require("../services/lessonService");

// Lấy danh sách bài học với phân trang và lọc
const getLessons = async (req, res) => {
  try {
    const page = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subject = req.query.subject;
    const category = req.query.category;
    const result = await getLessonsService( page, limit, subject, category);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLessons };
