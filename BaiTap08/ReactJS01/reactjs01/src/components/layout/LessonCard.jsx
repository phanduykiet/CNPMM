import { Card } from "antd";

const LessonCard = ({ title, thumbnail, price, viewCount }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={title}
          src={thumbnail}
          style={{
            height: 180,
            objectFit: "cover",
            borderBottom: "1px solid #eee",
          }}
        />
      }
      style={{
        width: 240,
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Meta
        title={title}
        description={
          <div style={{ marginTop: 8 }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#3a7d6b" }}>
              Giá: {price?.toLocaleString("vi-VN")} ₫
            </p>
            <p style={{ margin: 0, color: "#888" }}>👀 {viewCount || 0} lượt xem</p>
          </div>
        }
      />
    </Card>
  );
};

export default LessonCard;
