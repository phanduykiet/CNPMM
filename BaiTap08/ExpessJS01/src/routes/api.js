const express = require("express");
const { 
  createUser, 
  handleLogin, 
  getUser, 
  getAccount 
} = require("../controllers/userController");

const { 
  getLessons,
  createLesson,
  getFiltersFromDB,
  getLessonById,
  addFavorite,
  removeFavorite,
  listFavoritesByUser,
  markViewed,
  listViewedByUser,
  getSimilarLessons,
  getLessonCounts,
  addComment,
  addBuyer
} = require("../controllers/lessonController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

// middleware auth cho tất cả API
routerAPI.use(auth);

// test API
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello Phan Duy Kiet");
});

// ===== USER =====
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// ===== LESSON =====
routerAPI.get("/lessons", getLessons);            // danh sách + search + filter
routerAPI.post("/create_lesson", createLesson);   // tạo bài học
routerAPI.get("/lesson/:lessonId", getLessonById); // chi tiết

// filter
routerAPI.get("/get-filter", getFiltersFromDB);

// favorite
routerAPI.post("/lessons/:lessonId/favorite", addFavorite);
routerAPI.post("/lessons/:lessonId/unfavorite", removeFavorite);
routerAPI.get("/users/:userId/favorites", listFavoritesByUser);

// viewed
routerAPI.post("/lessons/:lessonId/view", markViewed);
routerAPI.get("/users/:userId/viewed", listViewedByUser);

// similar + counts
routerAPI.get("/lessons/:lessonId/similar", getSimilarLessons);
routerAPI.get("/lessons/:lessonId/counts", getLessonCounts);

// comments
routerAPI.post("/lessons/:lessonId/comments", addComment);

// buy
routerAPI.post("/lessons/:lessonId/buy", addBuyer);

module.exports = routerAPI;
