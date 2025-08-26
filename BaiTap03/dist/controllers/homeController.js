"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../models/index"));
const CRUDService_1 = __importDefault(require("../services/CRUDService"));
const getHomePage = async (req, res) => {
    try {
        const data = await index_1.default.User.findAll();
        console.log(".......................");
        console.log(data);
        console.log(".......................");
        res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    }
    catch (e) {
        console.log(e);
    }
};
const getAboutPage = (req, res) => {
    res.render("test/about.ejs");
};
const getCRUD = (req, res) => {
    res.render("crud.ejs");
};
const getFindAllCrud = async (req, res) => {
    const data = await CRUDService_1.default.getAllUser();
    res.render("users/findAllUser.ejs", {
        datalist: data,
    });
};
const postCRUD = async (req, res) => {
    const message = await CRUDService_1.default.createNewUser(req.body);
    console.log(message);
    res.send("Post crud to server");
};
const getEditCRUD = async (req, res) => {
    const userId = req.query.id;
    if (userId) {
        const userData = await CRUDService_1.default.getUserInfoById(Number(userId));
        res.render("users/updateUser.ejs", {
            data: userData,
        });
    }
    else {
        res.send("không lấy được id");
    }
};
const putCRUD = async (req, res) => {
    const data = req.body;
    const updatedUsers = await CRUDService_1.default.updateUser(data);
    res.render("users/findAllUser.ejs", {
        datalist: updatedUsers,
    });
};
const deleteCRUD = async (req, res) => {
    const id = req.query.id;
    if (id) {
        await CRUDService_1.default.deleteUserById(Number(id));
        res.send("Deleted!!!!!!!!!!!");
    }
    else {
        res.send("Not find user");
    }
};
exports.default = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    getFindAllCrud,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
//# sourceMappingURL=homeController.js.map