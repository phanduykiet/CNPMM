import React, { useState, useEffect } from "react";
import { Card, List, Button, Empty, message } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { getFavoriteLessonApi, removeToFavoriteApi } from "../util/api";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/header";

const FavoriteLesson = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [savedLessons, setSavedLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await getFavoriteLessonApi(id, 1, 10);
        setSavedLessons(res.data || []);
      } catch (err) {
        message.error("Không thể tải danh sách bài học yêu thích");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [id]);

  const removeLesson = async (lessonId) => {
    // Lưu state cũ để rollback nếu API fail
    const prevLessons = [...savedLessons];
  
    // Xóa ngay UI
    setSavedLessons(prev => prev.filter(lesson => lesson._id !== lessonId));
  
    try {
      await removeToFavoriteApi(lessonId, id);
      message.success("Đã xóa bài học khỏi yêu thích");
    } catch (err) {
      // Nếu API fail, rollback state
      setSavedLessons(prevLessons);
      message.error("Xóa bài học thất bại");
    }
  };
  

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px" }}>

        {savedLessons.length === 0 ? (
          <Empty description="Bạn chưa lưu bài học nào" />
        ) : (
          <List
            dataSource={savedLessons}
            renderItem={(lesson) => (
              <List.Item key={lesson._id}>
                <Card
                  hoverable
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    padding: 16,
                    gap: 16,
                    cursor: "pointer", // để cả card có thể click
                  }}
                  bodyStyle={{ padding: 0, flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  actions={[
                    <Button
                      danger
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh click Card khi bấm Xóa
                        removeLesson(lesson._id);
                      }}
                      key="remove"
                    >
                      Xóa
                    </Button>
                  ]}
                  onClick={() => navigate(`/lessondetail/${lesson._id}`)}
                >
                  {/* Ảnh bên trái */}
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    style={{ width: 120, height: 90, objectFit: "contain", borderRadius: 8 }}
                  />

                  {/* Nội dung chính bên phải */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingLeft: 16 }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{lesson.title}</h3>
                      <p style={{ margin: "4px 0", color: "#555" }}>Chủ đề: {lesson.category}</p>
                    </div>
                    <div style={{ fontWeight: "bold", color: "green" }}>
                      {lesson.price === 0 ? "Miễn phí" : `${lesson.price.toLocaleString()} ₫`}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default FavoriteLesson;