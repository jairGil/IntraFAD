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

/* GET certificacion by id_docente. */
router.get("/get_certs/:id_docente", async (req, res, next) => {
  await CertificacionController.get(req, res).then(
    (result) => {
      res.status(result.code).send(result);
    });
});

/* DELETE certificacion by id. */
router.delete("/delete_cert/:id", async (req, res, next) => {
  await CertificacionController.delete(req, res).then(
    (result) => {
      res.status(result.code).send(result);
    });
});


module.exports = router;