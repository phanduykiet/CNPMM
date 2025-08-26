"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../models/index"));
const salt = bcrypt_1.default.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await index_1.default.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });
            resolve('OK create a new user successfull');
        }
        catch (e) {
            reject(e);
        }
    });
};
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt_1.default.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch (e) {
            reject(e);
        }
    });
};
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await index_1.default.User.findAll({
                raw: true,
            });
            resolve(users);
        }
        catch (e) {
            reject(e);
        }
    });
};
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (user) {
                resolve(user);
            }
            else {
                resolve([]);
            }
        }
        catch (e) {
            reject(e);
        }
    });
};
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allusers = await index_1.default.User.findAll();
                resolve(allusers);
            }
            else {
                resolve(void 0);
            }
        }
        catch (e) {
            reject(e);
        }
    });
};
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
            }
            resolve(void 0);
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.default = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById
};
//# sourceMappingURL=CRUDService.js.map