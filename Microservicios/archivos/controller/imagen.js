/* *** CORE MODULES *** */
const mv = require('mv');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');

/* *** USER MODULES *** */
const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const config = require('../bin/config');

let imageController = {}

imageController.cargarImagen = async (req, res) => {
    let resultUpload = { img: config.routes.files +"default.jpg" };
    let form = new multiparty.Form();
    let docenteID = req._id;

    utilResponse.init(resultUpload, "cargar imagen");

    //Error al cargar imagen
    form.on("error", (error) => {
        console.log("error");
        console.log(error);
    });

    //Archivo recibido
    form.on("close", () => {
        console.log("Archivo recibido");
    });

    //Abortado
    form.on("aborted", (error) => {
        console.log("aborted");
        console.log(error);
    });


    //Emite el progreso de cargar imagen
    form.on("progress", (bytesReceived, bytesExpected) => {
        //console.log("bytes: " + (bytesReceived + " / " + bytesExpected));
    });

    //Guardar el archivo en el disco
    form.on("file", (name, file) => {
        let filename = file.originalFilename;
        let ext = path.extname(filename);
        let tmpPath = file.path;
        let targetPath = config.routes.files + docenteID + '/ImagenPerfil/' + docenteID + ext;

        if (!(ext === ".jpg" || ext === ".jpeg")) { 
            utilResponse.error(resultUpload, "Tipo de archivo no soportado");
            res.status(resultUpload.code).send(resultUpload);
            return;
        }

        directorios.createDir(config.routes.files, docenteID, 'ImagenPerfil');

        mv(tmpPath, targetPath, async (err) => {
            if (err) { 
                utilResponse.innerError(resultUpload, err, "Error al cambiar la ruta");
                res.status(resultUpload.code).send(resultUpload);
                return;
            }

            targetPath = targetPath.replaceAll("-", "/");

            utilResponse.success(resultUpload, "Imagen guardada correctamente");
            resultUpload.img = targetPath;
            console.log(JSON.stringify(resultUpload))
            res.status(resultUpload.code).send(resultUpload);
        });
    });
    
    form.parse(req);
};


// Enviar imagen al cliente
imageController.getImage = async (req, res) => {
    const pathFile = "/data/" + req._id + "/ImagenPerfil/" + req._id;

    //console.log("pathImage: " + pathFile)
    let result = { img: "" };
    result = utilResponse.init(result, "get image");
    
    if (fs.existsSync(pathFile + ".jpg")) {
        utilResponse.success(result, "Imagen enviada correctamente");
        result.img = pathFile + ".jpg";
    } else {
        if(fs.existsSync(pathFile + ".jpeg")){
            utilResponse.success(result, "Imagen enviada correctamente");
            result.img = pathFile + ".jpeg";
        }else{
            result.img = config.routes.files + 'default.jpg';
            utilResponse.error(result, "No existe la imagen");
        }
    }
    return result;
};


module.exports = imageController;