
const path = require('path');

const express = require("express");
const router = express.Router();

const imagenController = require("../controller/imagen");


router.post('/upload-image/:docenteID', imagenController.cargarImagen);

router.get('/get-image/:docenteID', async (req, res, next) => {
  await imagenController.getImage(req, res).then(
    (resultFind) => {
      console.log(resultFind);
      // res.status(resultFind.code).send(resultFind);
      res.sendFile(path.resolve(resultFind.img));
    });
});

/*
router.post("/upload-image/:docente_id", multipartMiddlewareImg, async (req, res) => {
    await documentoController.cargarImagen(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
    });
});

router.get("/get-image/:imagen", async (req, res) => {
    await documentoController.getImage(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
    });
});

router.post("/upload-doc/:docente_id", multipartMiddlewareDoc, async (req, res) => {
    await documentoController.cargarArchivo(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
    });
});

router.get("/get-doc/:doc", async (req, res) => {
    await documentoController.getArchivo(req, res).then(
      (resultSave) => {
        res.status(resultSave.code).send(resultSave);
    });
});

*/
module.exports = router;