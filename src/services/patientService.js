import db from "../models/index";
let postAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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

module.exports = {
  postAppointment,
};
