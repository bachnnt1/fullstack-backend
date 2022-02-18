import userService from "../services/userService";
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email && password) {
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
      user: userData,
    });
  } else {
    return res.status(500).json({
      errCode: 1,
      message: "Missing param, pls try again",
    });
  }
};

let getAllUser = async (req, res) => {
  let id = req.query.id;
  let user = await userService.getAllUser(id);
  return res.status(200).json({
    user: user,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json({
    message,
  });
};

let handleDeleteUser = async (req, res) => {
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json({
    message,
  });
};
let handleEditNewUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUser(data);
  return res.status(200).json({
    message,
  });
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCode(req.query.type);
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMess: "Err from server",
    });
  }
};
module.exports = {
  handleLogin,
  getAllUser,
  handleCreateNewUser,
  handleEditNewUser,
  handleDeleteUser,
  getAllCode,
};
