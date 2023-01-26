const express = require("express");
const router = express.Router();

const IdiomaController = require("../controllers/idioma");
const validateHelper = require("../bin/validate.js");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(403).send("Acceso denegado");
});

/* POST add curso. */
router.post("/add_idioma", async (req, res, next) => {
  const result = await validateHelper.validarIdioma(req);
  if (!result.isEmpty()) {
    res.status(400).send(result);
  }else{
    await IdiomaController.add(req, res).then(
      (resultSave) => {
          res.status(resultSave.code).send(resultSave);
      });
  }
});


module.exports = router;