const Lesson = require("../models/Lesson");

// Lấy danh sách bài học với phân trang và lọc
const getLessonsService = async (page, limit, subject, category) => {
  const filter = {};
  if (subject) filter.subject = subject;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const [lessons, total] = await Promise.all([
    Lesson.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Lesson.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: lessons,
  };
};

module.exports = { getLessonsService };
