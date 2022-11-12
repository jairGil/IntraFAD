const express = require("express");
const router = express.Router();

const DatoAcademicoController = require("../controllers/datoAcademico");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");

});

/* POST add datoAcademico. */
router.post("/upload", async (req, res, next) => {
  const result = await validateHelper.validarDatoAcademico(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  }else{
    await DatoAcademicoController.add(req, res).then(
      (resultSave) => {
          res.status(resultSave.code).send(resultSave);
      });
  }
});


module.exports = router;