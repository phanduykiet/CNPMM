"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const process_1 = __importDefault(require("process"));
const config_json_1 = __importDefault(require("../config/config.json"));
const user_1 = require("../models/user");
const env = process_1.default.env.NODE_ENV || "development";
const config = config_json_1.default[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
    sequelize = new sequelize_1.Sequelize(process_1.default.env[config.use_env_variable], config);
}
else {
    sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
}
db.User = (0, user_1.initUserModel)(sequelize);
Object.values(db).forEach((model) => {
    if (model && typeof model.associate === "function") {
        model.associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map