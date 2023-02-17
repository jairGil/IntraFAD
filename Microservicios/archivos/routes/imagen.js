
//Core modules
const path = require('path');
const express = require("express");
const router = express.Router();

/* *** USER MODULES *** */
const imagenController = require("../controller/imagen");
const authService = require("../service/auth");


/* *** RUTA PARA SUBIR IMAGEN *** */ 
router.post('/upload-image/', authService.verify, imagenController.cargarImagen);

/* *** RUTA PARA OBTENER IMAGEN *** */ 
router.get('/get-image/', authService.verify, async (req, res, next) => {
  if(req._id){
    await imagenController.getImage(req, res).then(
      (resultFind) => {
        console.log(JSON.stringify(resultFind));
        res.sendFile(path.resolve(resultFind.img));
      });
    }else{
      console.log("No existe el req.id")
    }
});

module.exports = router;