const express = require("express");
const router = express.Router();

const CertificacionController = require("../controllers/certificacion");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add certificacion. */
router.post("/add_cert", async (req, res, next) => {
  const result = await validateHelper.validarCertificacion(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  }else{
    await CertificacionController.add(req, res).then(
      (resultSave) => {
          res.status(resultSave.code).send(resultSave);
      });
  }
});


module.exports = router;