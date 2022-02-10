import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config(); // giup chayj dc dong process.env

let app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true };

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is running on the port: " + port);
});
