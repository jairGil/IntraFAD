const express = require("express");
const router = express.Router();

const IdiomaController = require("../controllers/idioma");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add curso. */
router.post("/", async (req, res, next) => {
  const result = await validateHelper.validarIdioma(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await IdiomaController.add(req, res).then(
      (resultSave) => {
        console.log(resultSave);
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/* GET idioma by id_docente. */
router.get("/:id_docente", async (req, res, next) => {
  await IdiomaController.get(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* DELETE idioma by id. */
router.delete("/:id", async (req, res, next) => {
  await IdiomaController.delete(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* UPDATE idioma by id. */
router.put("/", async (req, res, next) => {
  await IdiomaController.update(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});


module.exports = router;