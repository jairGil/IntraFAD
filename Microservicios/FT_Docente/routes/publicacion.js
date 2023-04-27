const express = require("express");
const router = express.Router();

const PublicacionController = require("../controllers/publicacion");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add publicación. */
router.post("/add", async (req, res, next) => {
//   const result = await validateHelper.validarIdioma(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  } else {
    await PublicacionController.add(req, res).then(
      (resultSave) => {
        console.log(resultSave);
        res.status(resultSave.code).send(resultSave);
      });
  }
});

/* GET publicación by id_docente. */
router.get("/get/:id", async (req, res, next) => {
  await PublicacionController.get(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});

/* DELETE publicación by id. */
router.delete("/delete/:id", async (req, res, next) => {
  await PublicacionController.delete(req, res).then(
    (result) => {
      console.log(result);
      res.status(result.code).send(result);
    });
});


module.exports = router;