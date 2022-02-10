import express from "express";
let router = express.Router();

const initAPIRoute = (app) => {
  return app.use("/api/v1/", router);
};

export default initAPIRoute;
