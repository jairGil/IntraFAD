const express = require("express");
const router = express.Router();

const CursoController = require("../controllers/curso");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add curso. */
router.post("/add_curso", async (req, res, next) => {
  const result = await validateHelper.validarCurso(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  }else{
    await CursoController.add(req, res).then(
      (resultSave) => {
          res.status(resultSave.code).send(resultSave);
      });
  }
});


module.exports = router;