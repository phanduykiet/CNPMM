const { Schema, model } = require("mongoose");

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, enum: ["physics", "chemistry", "biology"], required: true },
    category: { type: String, required: true },
    thumbnail: String
  },
  { timestamps: true } // tự động thêm createdAt, updatedAt
);

module.exports = model("Lesson", LessonSchema);
