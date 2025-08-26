"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = __importDefault(require("../controllers/homeController"));
const router = express_1.default.Router();
const initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.send("Phan Duy Kiet");
    });
    router.get("/home", homeController_1.default.getHomePage);
    router.get("/about", homeController_1.default.getAboutPage);
    router.get("/crud", homeController_1.default.getCRUD);
    router.post("/post-crud", homeController_1.default.postCRUD);
    router.get("/get-crud", homeController_1.default.getFindAllCrud);
    router.get("/edit-crud", homeController_1.default.getEditCRUD);
    router.post("/put-crud", homeController_1.default.putCRUD);
    router.get("/delete-crud", homeController_1.default.deleteCRUD);
    return app.use("/", router);
};
exports.default = initWebRoutes;
//# sourceMappingURL=web.js.map