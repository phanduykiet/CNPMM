import { Request, Response } from "express";
import db from "../models/index"; // import database
import CRUDService from "../services/CRUDService"; // import service

// Hàm getHomePage
const getHomePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.User.findAll(); // lấy dữ liệu từ models/index
    console.log(".......................");
    console.log(data);
    console.log(".......................");
    res.render("homepage.ejs", {
      data: JSON.stringify(data), // trả dữ liệu data về view
    });
  } catch (e) {
    console.log(e);
  }
};

// Hàm getAbout
const getAboutPage = (req: Request, res: Response): void => {
  res.render("test/about.ejs");
};

// Hàm CRUD
const getCRUD = (req: Request, res: Response): void => {
  res.render("crud.ejs");
};

// Hàm findAll CRUD
const getFindAllCrud = async (req: Request, res: Response): Promise<void> => {
  const data = await CRUDService.getAllUser();
  res.render("users/findAllUser.ejs", {
    datalist: data,
  });
};

// Hàm post CRUD
const postCRUD = async (req: Request, res: Response): Promise<void> => {
  const message = await CRUDService.createNewUser(req.body);
  console.log(message);
  res.send("Post crud to server");
};

// Hàm lấy dữ liệu để edit
const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
  const userId = req.query.id as string;
  if (userId) {
    const userData = await CRUDService.getUserInfoById(Number(userId));
    res.render("users/updateUser.ejs", {
      data: userData,
    });
  } else {
    res.send("không lấy được id");
  }
};

// Hàm update
const putCRUD = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const updatedUsers = await CRUDService.updateUser(data);
  res.render("users/findAllUser.ejs", {
    datalist: updatedUsers,
  });
};

// Hàm delete
const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
  const id = req.query.id as string;
  if (id) {
    await CRUDService.deleteUserById(Number(id));
    res.send("Deleted!!!!!!!!!!!");
  } else {
    res.send("Not find user");
  }
};

// Export ra object
export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
