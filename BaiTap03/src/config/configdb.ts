import { Sequelize } from "sequelize";

// Tạo instance Sequelize
const sequelize = new Sequelize("node_fulltask", "root", "Phanduykiet@2910", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Hàm kết nối DB
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Nếu bạn muốn export default
export default connectDB;
