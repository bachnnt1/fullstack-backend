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

let createNewSpecialty = async (req, res) => {
  try {
    let infor = await patientService.createNewSpecialty(req.body);
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

let getAllSpecialty = async (req, res) => {
  try {
    let infor = await patientService.getAllSpecialty();
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
let getAllClinic = async (req, res) => {
  try {
    let infor = await patientService.getAllClinic();
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

let getSpecialById = async (req, res) => {
  try {
    let infor = await patientService.getSpecialById(
      req.query.id,
      req.query.location
    );
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
let getClinicById = async (req, res) => {
  try {
    let infor = await patientService.getClinicById(req.query.id);
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

let createNewClinic = async (req, res) => {
  try {
    let infor = await patientService.createNewClinic(req.body);
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
let getlistPatient = async (req, res) => {
  try {
    let infor = await patientService.getlistPatient(
      req.query.doctorId,
      req.query.date
    );
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
  createNewSpecialty,
  getAllSpecialty,
  getSpecialById,
  createNewClinic,
  getAllClinic,
  getClinicById,
  getlistPatient,
};
