const bcrypt = require("bcrypt");
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBycrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBycrypt,
        firstName: data.firstname,
        lastName: data.lastname,
        address: data.address,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleid,
        phoneNumber: data.phonenumber,
      });
      resolve("Ok create done");
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({ raw: true });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: true });
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: data.id } });
      if (user) {
        user.firstName = data.firstname;
        user.lastName = data.lastname;
        user.address = data.address;
        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve(user);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });
      await user.destroy();
      let allUsers = await db.User.findAll();
      resolve(allUsers);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
