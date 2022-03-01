import patientService from "../services/patientService";
let postAppointment = async (req, res) => {
  try {
    let infor = await patientService.postAppointment(req.body);
    if (response) {
      return res.status(200).json({
        response,
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
};
