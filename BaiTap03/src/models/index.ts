import { Sequelize } from "sequelize";
import process from "process";
import configFile from "../config/config.json";

import { initUserModel } from "../models/user"; // import hàm khởi tạo User

const env = (process.env.NODE_ENV as "development" | "production" | "test") || "development";
const config = (configFile as any)[env];

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User?: ReturnType<typeof initUserModel>;
}

const db = {} as DB;

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ===== Khởi tạo các models =====
db.User = initUserModel(sequelize);

// Nếu sau này có Post, Comment,... thì import rồi init như User
// db.Post = initPostModel(sequelize);

// ===== Gọi associate nếu có =====
Object.values(db).forEach((model: any) => {
  if (model && typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
