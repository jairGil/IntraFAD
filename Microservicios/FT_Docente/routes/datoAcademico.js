const express = require("express");
const router = express.Router();

const DatoAcademicoController = require("../controllers/datoAcademico");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add datoAcademico. */
router.post("/add_datoacad", async (req, res, next) => {
  const result = await validateHelper.validarDatoAcademico(req);
  console.log(result);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await DatoAcademicoController.add(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/* PUT update datoAcademico.
router.put("/update_datoacad", async (req, res, next) => {
  const result = await validateHelper.validarDatoAcademico(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await DatoAcademicoController.update(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
      });
  }
}); */

/* GET datoAcademico by id_docente. */
router.get("/get_datoacad/:id_docente", async (req, res, next) => {
  await DatoAcademicoController.get(req, res).then(
    (result) => {
      res.status(result.code).send(result);
    });
});

/* DELETE datoAcademico by id. */
router.delete("/delete_datoacad/:id", async (req, res, next) => {
  await DatoAcademicoController.delete(req, res).then(
    (result) => {
      res.status(result.code).send(result);
    });
});


module.exports = router;