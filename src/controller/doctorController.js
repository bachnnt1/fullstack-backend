import doctorService from "../services/doctorService";
let getTopDoctor = async (req, res) => {
  let limit = req.query.limit;
  limit = limit ? limit : 10;
  try {
    let doctors = await doctorService.getTopDoctor(+limit);
    return res.status(200).json({
      doctors,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    if (doctors) {
      return res.status(200).json({
        doctors,
      });
    }
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let saveDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDoctor(req.body);
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

let getDetailDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorById(req.query.id);
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

let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateSchedule(req.body);
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

let getScheduleByDate = async (req, res) => {
  try {
    let response = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
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

let getProfileById = async (req, res) => {
  try {
    let response = await doctorService.getProfileById(req.query.doctorId);
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
  getTopDoctor,
  getAllDoctors,
  saveDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getProfileById,
};
