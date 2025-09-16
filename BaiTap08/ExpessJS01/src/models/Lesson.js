const { Schema, model } = require("mongoose");

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, enum: ["physics", "chemistry", "biology"], required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, default: "https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX329_BO1,204,203,200_.jpg" }
  },
  { timestamps: true } // tự động thêm createdAt, updatedAt
);

module.exports = model("Lesson", LessonSchema);
