import CRUDService from "../services/CRUDService";
let getCRUD = async (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayCRUD.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);
    return res.render("editCRUD.ejs", { data: userData });
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let result = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", { dataTable: result });
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  let result = await CRUDService.deleteUserById(userId);
  return res.render("displayCRUD.ejs", { dataTable: result });
};
module.exports = {
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
