/* CORE MODULES */
const express = require("express");
const router = express.Router();

/* USER MODULES */
const { createNewDocente, login, updateOneDocente, getDocenteByID } = require("../controllers/docentes");
const validate = require('../validators/usersValidator');



/* SIGN IN  - add docente. */
//router.post("/register", docenteController.createNewDocente);
router.post("/", validate.CreateDocente, createNewDocente);


/* LOG IN - login docente */
router.post("/login", login);

/* UPDATE - update datos personales */
//router.put("/update-dp", docenteController.updateOneDocente);
router.put("/", updateOneDocente);



/* GET docente by id. */
router.get("/:id_docente", getDocenteByID);















router.post('/register-noi', async (req, res, next) => {
  await docenteController.addNoInstitutional(req, res).then(
    (resultSave) => {
      console.log(JSON.stringify(resultSave));
      res.status(resultSave.code).send(resultSave);
    });
});



router.post("/login-noi", async (req, res) => {
  await docenteController.loginNoInstitutional(req, res).then(
    (resultSave) => {
      console.log(JSON.stringify(resultSave));
      res.status(resultSave.code).send(resultSave);
    });
});




module.exports = router;