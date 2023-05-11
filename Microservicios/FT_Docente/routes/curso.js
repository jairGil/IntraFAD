const express = require("express");
const router = express.Router();

const CursoController = require("../controllers/curso");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add curso. */
router.post("/", async (req, res, next) => {
  const result = await validateHelper.validarCurso(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await CursoController.add(req, res).then(
      (resultSave) => {
        console.log(resultSave);
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/* GET curso by id_docente. */
router.get("/:id_docente", async (req, res, next) => {
  await CursoController.get(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* DELETE curso by id. */
router.delete("/:id", async (req, res, next) => {
  await CursoController.delete(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* UPDATE curso by id. */
router.put("/", async (req, res, next) => {
  await CursoController.update(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});


module.exports = router;