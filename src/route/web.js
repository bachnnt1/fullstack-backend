import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
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
  router.get("/api/get-top-doctor", doctorController.getTopDoctor);
  router.get("/api/get-all-doctor", doctorController.getAllDoctors);
  router.post("/api/save-info-doctor", doctorController.saveDoctor);
  router.get("/api/get-detail-doctor", doctorController.getDetailDoctorById);
  router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate);
  router.get("/api/get-profile-by-id", doctorController.getProfileById);
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.post("/api/book-appointment", patientController.postAppointment);
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyAppointment
  );
  router.post(
    "/api/create-new-specialty",
    patientController.createNewSpecialty
  );
  return app.use("/", router);
};

export default initWebRoute;
