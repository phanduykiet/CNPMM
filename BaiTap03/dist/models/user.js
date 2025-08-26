"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserModel = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static associate(models) {
    }
}
const initUserModel = (sequelize) => {
    User.init({
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        address: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        phoneNumber: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        gender: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
        image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        roleId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        positionId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    }, {
        sequelize,
        modelName: "User",
        tableName: "Users",
    });
    return User;
};
exports.initUserModel = initUserModel;
exports.default = User;
//# sourceMappingURL=user.js.map