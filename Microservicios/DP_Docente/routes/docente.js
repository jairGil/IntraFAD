const express = require("express");
const router = express.Router();

const docenteController = require("../controllers/docente");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add docente. */
router.post("/register", async (req, res, next) => {
  console.log(req.body)
  const result = await validateHelper.validarDocente(req);
  // console.log(result);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await docenteController.add(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/*** Login docente ***/
router.post("/login", async (req, res) => {
  await docenteController.login(req, res).then(
    (resultSave) => {
      res.status(resultSave.code).send(resultSave);
    });
});


module.exports = router;