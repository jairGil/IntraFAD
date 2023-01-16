
const express = require("express");
const router = express.Router();

const documentoController = require("../controller/documento");


router.post('/upload-document/:docenteID', documentoController.cargarDocumento);


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