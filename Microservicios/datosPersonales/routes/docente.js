const express = require("express");
const router = express.Router();

const docenteController = require("../controllers/docente");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* GET docente by id. */
router.get("/get-docente/:id_docente", async (req, res, next) => {
  await docenteController.getDocente(req, res).then(
    (result) => {
      console.log(JSON.stringify(result));
      res.status(result.code).send(result);
    });
});

/* POST add docente. */
router.post("/register", async (req, res, next) => {
  const result = await validateHelper.validarDocente(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await docenteController.add(req, res).then(
      (resultSave) => {
        console.log(JSON.stringify(resultSave));
        res.status(resultSave.code).send(resultSave);
      });
  }
});

router.post('/register-noi', async (req, res, next) => {
  await docenteController.addNoInstitutional(req, res).then(
    (resultSave) => {
      console.log(JSON.stringify(resultSave));
      res.status(resultSave.code).send(resultSave);
    });
});

/*** Login docente ***/
router.post("/login", async (req, res) => {
  
  await docenteController.login(req, res).then(
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


//Actualizar datos personales docente
router.put("/update-dp", async (req, res) => {
  await docenteController.updateDatosPersonales(req, res).then(
    (resultSave) => {
      console.log(JSON.stringify(resultSave));
      res.status(resultSave.code).send(resultSave);
    });
});

module.exports = router;