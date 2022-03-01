import db from "../models/index";
import nodemailer from "nodemailer";
require("dotenv").config();
let postAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await sendSimpleEmail({
        receiveEmail: data.email,
        patientName: data.fullName,
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
    html: `<b>Hello ${data.patientName}</b>`, // html body
  });
};

module.exports = {
  postAppointment,
  sendSimpleEmail,
};
