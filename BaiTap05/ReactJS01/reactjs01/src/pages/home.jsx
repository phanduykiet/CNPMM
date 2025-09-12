import { useEffect, useState } from "react";
import { Card, List, Pagination, Spin, message, Select } from "antd";
import { getLessonsApi } from "../util/api";

const { Option } = Select;

const HomePage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // mỗi trang 6 item
  const [total, setTotal] = useState(0);

  const [subject, setSubject] = useState();
  const [category, setCategory] = useState();

  // danh sách subject cố định
  const subjects = ["physics", "chemistry", "biology"];

  // category theo từng subject
  const categories = {
    physics: ["Điện học", "Điện từ", "Cơ học"],
    chemistry: ["Cấu trúc nguyên tử", "Liên kết hoá học", "Hữu cơ", "Phản ứng"],
    biology: ["Tế bào", "Sinh học phân tử", "Chuyển hoá"],
  };

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await getLessonsApi(currentPage, pageSize, subject, category);
        setLessons(res.data || []);
        setTotal(res.total || 0);
      } catch (error) {
        message.error("Không thể tải danh sách bài học!");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [currentPage, pageSize, subject, category]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 24,
        background: "#f5f5f5",
      }}
    >
      <Card
        title="📚 Danh sách bài học"
        style={{
          width: "100%",
          maxWidth: 1000,
          borderRadius: 12,
        }}
      >
        {/* Bộ lọc chọn subject và category */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          <Select
            value={subject}
            placeholder="Chọn môn học"
            style={{ width: 200 }}
            onChange={(value) => {
              setSubject(value);
              setCategory(categories[value][0]); // reset category theo subject
              setCurrentPage(1); // reset về trang đầu
            }}
          >
            {subjects.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>

          <Select
            value={category}
            placeholder="Chọn chương"
            style={{ width: 200 }}
            onChange={(value) => {
              setCategory(value);
              setCurrentPage(1);
            }}
          >
            {(categories[subject] || []).map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ minHeight: 300 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={lessons}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={item.title}
                        src={item.thumbnail || "https://via.placeholder.com/300x180?text=No+Image"}
                        style={{ height: 180, objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                      />
                    }
                    style={{ borderRadius: 12 }}
                  >
                    <Card.Meta
                      title={item.title}
                      description={item.description || "Không có mô tả"}
                    />
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>

        <div
          style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
