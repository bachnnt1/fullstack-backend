import db from "../models/index";
require("dotenv").config();
import _, { __ } from "lodash";
const MAX_NUMBER_SHCEDULE = process.env.MAX_NUMBER_SHCEDULE;
let getTopDoctor = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.action) {
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: data.doctorId },
          raw: false,
        });
        if (doctorMarkdown) {
          doctorMarkdown.contentHTML = data.contentHTML;
          doctorMarkdown.contentMarkdown = data.contentMarkdown;
          doctorMarkdown.description = data.description;
          doctorMarkdown.updateAt = new Date();
          await doctorMarkdown.save();
        }
      } else {
        await db.Markdown.create({
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
          description: data.description,
          doctorId: data.doctorId,
        });
      }
      let doctorInfo = await db.Doctor_info.findOne({
        where: { doctorId: data.doctorId },
        raw: false,
      });
      if (doctorInfo) {
        doctorInfo.doctorId = data.doctorId;
        doctorInfo.priceId = data.selectedPrice;
        doctorInfo.provinceId = data.selectedProvince;
        doctorInfo.paymentId = data.selectedPayment;
        doctorInfo.addressClinic = data.addressClinic;
        doctorInfo.nameClinic = data.nameClinic;
        doctorInfo.note = data.note;
        doctorInfo.updateAt = new Date();
        doctorInfo.clinicId = data.selectedClinic;
        doctorInfo.specialtyId = data.selectedSpecialty;
        await doctorInfo.save();
      } else {
        await db.Doctor_info.create({
          doctorId: data.doctorId,
          priceId: data.contentHTML,
          provinceId: data.contentMarkdown,
          paymentId: data.description,
          addressClinic: data.addressClinic,
          nameClinic: data.nameClinic,
          note: data.note,
          updateAt: new Date(),
          clinicId: data.selectedClinic,
          specialtyId: data.selectedSpecialty,
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Success",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findOne({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Markdown,
            attributes: [
              "id",
              "contentHTML",
              "contentMarkdown",
              "description",
              "doctorId",
            ],
          },
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["id", "valueEn", "valueVi"],
          },
          {
            model: db.Doctor_info,
            attributes: {
              exclude: ["id", "doctorId"],
            },
            include: [
              {
                model: db.Allcode,
                as: "priceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "provinceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "paymentTypeData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      if (data && data.image) {
        data.image = new Buffer(data.image, "base64").toString("binary");
      }
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let schedule = data.arrResult;
      if (schedule && schedule.length > 0) {
        schedule = schedule.map((item) => {
          item.maxNumber = MAX_NUMBER_SHCEDULE;
          return item;
        });
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(schedule);
        }
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getScheduleByDate = (id, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Schedule.findAll({
        where: { doctorId: id, date: date },
        include: [
          {
            model: db.Allcode,
            as: "timeTypeData",
            attributes: ["id", "valueEn", "valueVi"],
          },
          {
            model: db.User,
            as: "doctorData",
            attributes: ["firstName", "lastName"],
          },
        ],
        raw: false,
        nest: true,
      });
      if (!data) {
        data = [];
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

let getProfileById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Markdown,
            attributes: ["contentHTML", "contentMarkdown", "description"],
          },
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["id", "valueEn", "valueVi"],
          },
          {
            model: db.Doctor_info,
            attributes: {
              exclude: ["id", "doctorId"],
            },
            include: [
              {
                model: db.Allcode,
                as: "priceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "provinceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "paymentTypeData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      if (user && user.image) {
        user.image = new Buffer(user.image, "base64").toString("binary");
      }
      resolve({
        errCode: 0,
        data: user,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctor,
  getAllDoctors,
  saveDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getProfileById,
};
