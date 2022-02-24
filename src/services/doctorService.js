import db from "../models/index";
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
      await db.Markdown.create({
        contentHTML: data.contentHTML,
        contentMarkdown: data.contentMarkdown,
        description: data.description,
        doctorId: data.doctorId,
      });
      resolve({
        errCode: 0,
        errMessage: "Success",
      });
    } catch (e) {
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

module.exports = {
  getTopDoctor,
  getAllDoctors,
  saveDoctor,
  getDetailDoctorById,
};
