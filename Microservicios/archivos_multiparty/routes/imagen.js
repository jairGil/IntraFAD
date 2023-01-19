
const path = require('path');

const express = require("express");
const router = express.Router();

const imagenController = require("../controller/imagen");


router.put('/upload-image/:docenteID', imagenController.cargarImagen);

router.get('/get-image/:img', async (req, res, next) => {
  await imagenController.getImage(req, res).then(
    (resultFind) => {
      console.log(resultFind);
      // res.status(resultFind.code).send(resultFind);
      res.sendFile(path.resolve(resultFind.img));
    });
});


module.exports = router;