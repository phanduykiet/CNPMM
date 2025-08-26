import express, { Application } from "express";

// Khai báo kiểu cho app
const configViewEngine = (app: Application): void => {
  app.use(express.static("./src/public")); // thư mục tĩnh
  app.set("view engine", "ejs"); // thiết lập view engine
  app.set("views", "./src/views"); // thư mục chứa views
};

// Xuất hàm ra
export default configViewEngine;
