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
  let id = req.body.id;
  let user = await userService.getAllUser(id);
  return res.status(200).json({
    user: user,
  });
};

module.exports = {
  handleLogin,
  getAllUser,
};
