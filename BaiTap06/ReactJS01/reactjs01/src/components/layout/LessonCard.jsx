import { Card } from "antd";

const LessonCard = ({ title, thumbnail }) => {
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
      style={{ width: 240, borderRadius: 8 }}
    >
      <Card.Meta title={title} />
    </Card>
  );
};

export default LessonCard;