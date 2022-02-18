import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
let router = express.Router();

const initWebRoute = (app) => {
  router.get("/crud", homeController.getCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  router.get("/api/get-all-user", userController.getAllUser);
  router.post("/api/login", userController.handleLogin);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditNewUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);
  return app.use("/", router);
};

export default initWebRoute;
