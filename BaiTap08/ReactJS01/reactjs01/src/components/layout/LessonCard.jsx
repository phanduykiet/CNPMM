import { Card } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInfoLessonApi, increaseViewApi, addToFavoriteApi, getFavoriteLessonApi, removeToFavoriteApi } from "../../util/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons"; // 👈 thêm icon

const LessonCard = ({ id, title, thumbnail, price }) => {
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  // Lấy số lượt xem ban đầu
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = localStorage.getItem("id") || "";
        console.log("userId: ", userId);
        const res = await getInfoLessonApi(id, userId);
        setCount(res?.data?.views || 0);

        // Lấy danh sách favorite của user
        const resFav = await getFavoriteLessonApi(userId);
        const favList = resFav.data || []; // dữ liệu danh sách bài học
        // kiểm tra nếu lesson hiện tại đã có trong danh sách favorite
        const isFavorited = favList.some((lesson) => lesson._id === id);
        if (isFavorited) setSaved(true); // tô đỏ icon nếu đã favorite
      } catch (err) {
        console.error("Lỗi khi lấy viewCount:", err);
      }
    };
    if (id) fetchCounts();
  }, [id]);

  // Khi click vào card: tăng view và navigate
  const handleClick = async () => {
    try {
      await increaseViewApi(id); // gọi API tăng view
      setCount((prev) => prev + 1); // tăng số view ngay lập tức trên UI
    } catch (err) {
      console.error("Lỗi khi tăng view:", err);
    }
    navigate(`/lessondetail/${id}`);
  };

  // Khi click vào icon lưu
  const toggleSave = async (e) => {
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
  
    try {
      const userId = localStorage.getItem("id") || "";
      if (newSaved) {
        await addToFavoriteApi(id, userId);
        console.log("Đã thêm vào yêu thích:", id);
      } else {
        await removeToFavoriteApi(id, userId);
        console.log("Đã bỏ yêu thích:", id);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý yêu thích:", err);
      setSaved(!newSaved); // revert nếu lỗi
    }
  };
  

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={
        <div style={{ position: "relative" }}>
          <img
            alt={title}
            src={thumbnail}
            style={{
              height: 180,
              objectFit: "contain",
              borderBottom: "1px solid #eee",
              width: "100%",
            }}
          />
          {/* Icon lưu ở góc trên phải */}
          <span
            onClick={toggleSave}
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              fontSize: 20,
              color: saved ? "red" : "#888",
              cursor: "pointer",
            }}
          >
            {saved ? <HeartFilled /> : <HeartOutlined />}
          </span>
        </div>
      }
      style={{
        width: 240,
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Card.Meta
        title={title}
        description={
          <div style={{ marginTop: 8 }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#3a7d6b" }}>
              Giá: {price?.toLocaleString("vi-VN")} ₫
            </p>
            <p style={{ margin: 0, color: "#888" }}>👀 {count} lượt xem</p>
          </div>
        }
      />
    </Card>
  );
};

export default LessonCard;