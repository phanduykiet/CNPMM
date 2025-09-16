import { useEffect, useState } from "react";
import { Card, List, Pagination, Spin, message, Select, Input } from "antd";
import { getLessonsApi } from "../util/api";
import LessonCard from "../components/layout/LessonCard";

const { Option } = Select;
const { Search } = Input;

const HomePage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);

  const [subject, setSubject] = useState();
  const [category, setCategory] = useState();
  const [keyword, setKeyword] = useState(""); // từ khóa fuzzy search

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
        // truyền thêm keyword vào API
        const res = await getLessonsApi(currentPage, pageSize, subject, category, keyword);
        setLessons(res.data || []);
        setTotal(res.total || 0);
      } catch (error) {
        message.error("Không thể tải danh sách bài học!");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [currentPage, pageSize, subject, category, keyword]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Card
        title="Danh sách bài học"
        style={{ 
          textAlign: "center", 
          width: "90%",
          border: "1px solid #3a7d6b", // viền đậm hơn
          borderRadius: "8px"
        }}
        headStyle={{ 
          background: "#63c9a7", // nền của phần tiêu đề
          color: "#fff" 
        }}
      >
        {/* Bộ lọc + tìm kiếm */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, justifyContent: "center" }}>
          <Search
            placeholder="Nhập từ khóa tìm kiếm"
            allowClear
            onSearch={(value) => {
              setKeyword(value);
              setCurrentPage(1);
            }}
            style={{ width: 400 }}
          />

          <Select
            value={subject}
            placeholder="Chọn môn học"
            style={{ width: 150 }}
            onChange={(value) => {
              if (value === "all") {
                setSubject(undefined);   // bỏ lọc môn
                setCategory(undefined);  // bỏ lọc chương luôn
              } else {
                setSubject(value);
                setCategory(undefined);  // reset category khi đổi subject
}
              setCurrentPage(1);
            }}
          >
            <Option value="all">Tất cả</Option>
            {subjects.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>

          <Select
            value={category}
            placeholder="Chọn chương"
            style={{ width: 150 }}
            onChange={(value) => {
              if (value === "all") {
                setCategory(undefined); // bỏ lọc chương
              } else {
                setCategory(value);
              }
              setCurrentPage(1);
            }}
            disabled={!subject} // chưa chọn môn thì disable
          >
            <Option value="all">Tất cả</Option>
            {(categories[subject] || []).map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ minHeight: "60vh", marginBottom: 24 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={lessons}
              locale={{ emptyText: "Không có bài học nào" }}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <LessonCard
                    title={item.title}
                    thumbnail={
                      item.thumbnail ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgh394OQoFRXqpvGzCs27NNoLCqMGhTjgQGw&s"
                    }
                  />
                </List.Item>
              )}
              style={{ minHeight: 550 }} // cố định chiều cao danh sách
            />
          )}
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default HomePage;