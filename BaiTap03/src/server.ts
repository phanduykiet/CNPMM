import express, { Application } from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/configdb";
import dotenv from "dotenv";

dotenv.config(); // nạp biến môi trường từ .env

const app: Application = express();

// Middleware config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
viewEngine(app);

// Routes
initWebRoutes(app);

// Database connection
connectDB();

// Cổng server
const port: number = parseInt(process.env.PORT || "6969", 10);

app.listen(port, () => {
  console.log(`Backend Nodejs is running on port: ${port}`);
});
