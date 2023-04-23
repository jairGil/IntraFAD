/* *** CORE MODULES *** */
const path = require('path');
const express = require("express");
const router = express.Router();
const authService = require("../service/auth");

/* *** USER MODULES *** */
const documentoController = require("../controller/documento");

/* *** RUTA PARA SUBIR DOCUMENTO *** */ 
router.put('/upload-document/:tipo/', authService.verify, documentoController.cargarDocumento);

/* *** RUTA PARA OBTENER DOCUMENTO *** */ 
router.get('/get-document/:doc', authService.verify, async (req, res, next) => {
  console.log("REQ: " + JSON.stringify(req.params));
  await documentoController.getDoc(req, res).then(
    (resultFind) => {
      console.log(resultFind);
      // res.status(resultFind.code).send(resultFind);
      if (resultFind.code == 200) {
        console.log(("SI Entra"))
        res.sendFile(path.resolve(resultFind.doc));
      }else{
        console.log(("No Entra"))
      }
    });
});

module.exports = router;