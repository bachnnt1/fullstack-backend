import patientService from "../services/patientService";
let postAppointment = async (req, res) => {
  try {
    let infor = await patientService.postAppointment(req.body);
    if (infor) {
      return res.status(200).json({
        infor,
      });
    }
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let postVerifyAppointment = async (req, res) => {
  try {
    let infor = await patientService.postVerifyAppointment(req.body);
    if (infor) {
      return res.status(200).json({
        infor,
      });
    }
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

module.exports = {
  postAppointment,
  postVerifyAppointment,
};
