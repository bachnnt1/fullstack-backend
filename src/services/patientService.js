import db from "../models/index";
import nodemailer from "nodemailer";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";
let buildUrl = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-book-appointment?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let token = uuidv4();
      await sendSimpleEmail({
        receiveEmail: data.email,
        patientName: data.fullName,
        timeType:
          data.timeDetail && data.timeDetail.timeTypeData
            ? data.timeDetail.timeTypeData.valueVi
            : "",
        redirectLink: buildUrl(data.doctorId, token),
      });
      let user = await db.User.findOrCreate({
        where: { email: data.email },
        defaults: {
          email: data.email,
          roleId: "R3",
          gender: data.gender,
        },
      });

      //create booking record
      if (user && user[0]) {
        await db.Booking.findOrCreate({
          where: { patientId: user[0] },
          defaults: {
            statusId: "S1",
            doctorId: data.doctorId,
            patientId: user[0].id,
            date: data.timeDetail ? data.timeDetail.date : 0,
            timeType: data.timeType,
            token: token,
          },
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let sendSimpleEmail = async (data) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Bách bạo chúa" <bachcvb@gmail.com>', // sender address
    to: data.receiveEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh (test full stack)", // Subject line
    html: `<b>Người đặt lịch khám: ${data.patientName}</b>
    <p>Thời gian khám: ${data.timeType}</p>
    <a href=${data.redirectLink}><p>Xác nhận</p></a>
    `, // html body
  });
};

let postVerifyAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let appointment = await db.Booking.findOne({
        where: {
          doctorId: data.doctorId,
          token: data.token,
          statusId: "S1",
        },
        raw: false,
      });
      if (appointment) {
        appointment.statusId = "S2";
        await appointment.save();
        resolve({
          errCode: 0,
          errMessage: "Booking done",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Not exits",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Specialty.create({
        name: data.name,
        image: data.previewImage,
        descriptionHTML: data.contentHTML,
        descriptionMarkdown: data.contentMarkdown,
      });
      resolve({
        errCode: 0,
        errMessage: "Create done",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Clinic.create({
        name: data.name,
        image: data.previewImage,
        descriptionHTML: data.contentHTML,
        descriptionMarkdown: data.contentMarkdown,
        address: data.address,
      });
      resolve({
        errCode: 0,
        errMessage: "Create done",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getAllSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getAllClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getSpecialById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findOne({
        where: { id: inputId },
        attributes: ["name", "descriptionHTML", "descriptionMarkdown"],
      });
      if (data) {
        let doctorSpecialty = [];
        if (location === "ALL") {
          doctorSpecialty = await db.Doctor_info.findAll({
            where: { specialtyId: inputId },
            attributes: ["doctorId", "provinceId"],
          });
        } else {
          doctorSpecialty = await db.Doctor_info.findAll({
            where: { specialtyId: inputId, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
        }
        data.doctorSpecialty = doctorSpecialty;
      } else {
        data = {};
      }

      resolve({
        errCode: 0,
        data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findOne({
        where: { id: inputId },
        attributes: [
          "name",
          "address",
          "descriptionHTML",
          "descriptionMarkdown",
        ],
      });
      if (data) {
        let doctorClinic = [];
        doctorClinic = await db.Doctor_info.findAll({
          where: { clinicId: inputId },
          attributes: ["doctorId", "provinceId"],
        });
        data.doctorClinic = doctorClinic;
      } else {
        data = {};
      }
      resolve({
        errCode: 0,
        data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getlistPatient = (id, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Booking.findAll({
        where: { statusId: "S2", doctorId: id, date: date },
        include: [
          {
            model: db.User,
            as: "patientData",
            attributes: ["email", "firstName", "address", "gender"],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  postAppointment,
  sendSimpleEmail,
  postVerifyAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getSpecialById,
  createNewClinic,
  getAllClinic,
  getClinicById,
  getlistPatient,
};
