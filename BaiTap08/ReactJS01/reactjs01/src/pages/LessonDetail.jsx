import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spinner,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Button,
  ListGroup,
  Form,
} from "react-bootstrap";
import { getLessonDetailApi, getSimilarLessonsApi, addCommentApi, getCommentApi } from "../util/api";
import Header from "../components/layout/header";

const LessonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [relatedLessons, setRelatedLessons] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);



  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getLessonDetailApi(id);
        setLesson(res.data);

        // gọi API thật để lấy comments
        const commentRes = await getCommentApi(id);
        setComments(commentRes.data.comments || []); // luôn là array

        // gọi API lấy bài học liên quan
        const relRes = await getSimilarLessonsApi(id, 6);
        setRelatedLessons(relRes.data);
      } catch (err) {
        setError("Không thể tải chi tiết bài học!");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await getCommentApi(id);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Lỗi khi tải bình luận:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const userId = localStorage.getItem("id");
      const userName = localStorage.getItem("name");
  
      // Gửi bình luận mới
      await addCommentApi(id, userId, newComment);
  
      // Lấy danh sách bình luận mới nhất từ server
      const res = await getCommentApi(id);
      setComments(res.data.comments || []);
  
      setNewComment("");
    } catch (err) {
      console.error("Lỗi khi thêm bình luận:", err);
      alert("Không thể gửi bình luận!");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  if (!lesson) {
    return <p className="text-center my-5">Không tìm thấy bài học</p>;
  }

  return (
    <>
      <Header />
      <Container className="my-4">
        <Row>
          {/* Main content */}
          <Col md={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <div className="row">
                  {/* Cột trái: Thumbnail */}
                  <div className="col-md-4 d-flex align-items-start">
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  </div>

                  {/* Cột phải: Thông tin chi tiết */}
                  <div className="col-md-8">
                    <h3 className="fw-bold mb-3">{lesson.title}</h3>

                    <p className="mb-1">
                      <b>Môn học:</b> {lesson.subject}
                    </p>
                    <p className="mb-1">
                      <b>Chương:</b> {lesson.category}
                    </p>
                    <p className="mb-3">
                      <b>Mô tả:</b> {lesson.description}
                    </p>

                    <div className="mb-3">
                      <b>Nội dung:</b>
                      <div className="mt-2 text-secondary" style={{ whiteSpace: "pre-line" }}>
                        {lesson.content}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-4">
                      <span className="fw-bold fs-5 text-success">
                        Giá: {lesson.price?.toLocaleString()} VNĐ
                      </span>
                      <Button variant="primary">Bắt đầu học</Button>
                    </div>

                    <div className="text-muted text-end mt-3">
                      💬 {comments.length}{" "}
                      <a
                        href="#"
                        className="text-muted"
                        style={{ textDecoration: "none" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowComments(!showComments);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        bình luận
                      </a>
                    </div>
                  </div>
                </div>
              </Card.Body>

            </Card>

            {showComments && (
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Bình luận</Card.Title>
                  <Form className="mb-3 d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Nhập bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                      className="ms-2"
                      onClick={handleAddComment}
                      variant="success"
                    >
                      Gửi
                    </Button>
                  </Form>
                  <ListGroup variant="flush">
                    {comments.map((cmt) => (
                      <ListGroup.Item key={cmt.id}>
                        <b>{cmt.user}:</b> {cmt.content}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            )}

          </Col>

          {/* Sidebar: Related lessons */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Khóa học tương tự</Card.Title>
                <ListGroup variant="flush">
                  {relatedLessons.map((rel) => (
                    <ListGroup.Item
                      key={rel.id}
                      action  // 👈 để item có hiệu ứng hover
                      onClick={() => navigate(`/lessondetail/${rel._id}`)} // 👈 chuyển trang
                      className="d-flex align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                    >
                      {/* Thumbnail */}
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 10,
                        }}
                      />
                    
                      {/* Thông tin */}
                      <div className="flex-grow-1 ms-2">
                        <div className="fw-bold">{rel.title}</div>
                        <div className="text-muted small">{rel.category}</div>
                      </div>
                    
                      {/* Giá */}
                      <span className="fw-bold text-success">
                        {rel.price?.toLocaleString()} VNĐ
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LessonDetail;