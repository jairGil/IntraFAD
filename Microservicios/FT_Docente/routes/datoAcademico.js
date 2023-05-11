const express = require("express");
const router = express.Router();

const DatoAcademicoController = require("../controllers/datoAcademico");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add datoAcademico. */
router.post("/", async (req, res, next) => {
  const result = await validateHelper.validarDatoAcademico(req);
  console.log(result);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await DatoAcademicoController.add(req, res).then(
      (resultSave) => {
        console.log(resultSave);
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/* GET datoAcademico by id_docente. */
router.get("/:id_docente", async (req, res, next) => {
  await DatoAcademicoController.get(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* DELETE datoAcademico by id. */
router.delete("/:id", async (req, res, next) => {
  await DatoAcademicoController.delete(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* PUT update datoAcademico by id. */
router.put("/", async (req, res, next) => {
  await DatoAcademicoController.update(req, res).then(
    (resultSave) => {
      console.log(resultSave);
      res.status(resultSave.code).send(resultSave);
    });
});


module.exports = router;