const { Schema, model } = require("mongoose");

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },

    // Bộ lọc
    subject: { type: String, enum: ["physics", "chemistry", "biology"], required: true },
    category: { type: String, required: true },

    // Ảnh đại diện
    thumbnail: {
      type: String,
      default:
        "https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX329_BO1,204,203,200_.jpg",
    },

    // Giá sản phẩm/bài học
    price: { type: Number, required: true, min: 0 },

    // Người đã mua (có thể lưu id User)
    buyers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Người đã xem (tracking lượt xem)
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 }, // tối ưu query nhanh

    // Người đã thêm vào yêu thích
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favoriteCount: { type: Number, default: 0 },

    // Bình luận
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("Lesson", LessonSchema);
