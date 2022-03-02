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
            date: data.date,
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

module.exports = {
  postAppointment,
  sendSimpleEmail,
  postVerifyAppointment,
};
