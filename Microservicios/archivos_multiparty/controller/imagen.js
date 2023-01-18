const mv = require('mv');
const fs = require('fs');

const path = require('path');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const errores = require('../util/errors');
const dbhelper = require('../bin/db');

let imageController = {}

imageController.cargarImagen = async (req, res) => {
    let resultUpload = {};
    let form = new multiparty.Form();
    let docenteID = req.params.docenteID;

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
        let targetPath = __dirname + '/uploads/' + docenteID + '/ImagenPerfil/' + docenteID + ext;

        if (!(ext === ".jpg" || ext === ".jpeg")) { 
            errores.setGlobalError(1);
            console.log(errores.getGlobalError());
            return;
        }

        directorios.createDir(__dirname + '/uploads/', docenteID, 'ImagenPerfil');

        mv(tmpPath, targetPath, async (err) => {
            if (err) { 
                errores.setGlobalError(2);
                return;
            }

            const connected = await dbhelper.connect();

            if (!connected.value) { 
                errores.setGlobalError(3);
                return;
            }

            await dbhelper.setImagen(docenteID, targetPath.replaceAll("\\", "-").replaceAll("/", "-"));
            console.log("Imagen guardada");

            dbhelper.disconnect();
        });

        console.log("G1:"+errores.getGlobalError());
        switch (errores.getGlobalError()) {
            case 0:
                resultUpload = utilResponse.success(resultUpload, "Imagen guardada");
                break;
            case 1:
                resultUpload = utilResponse.error(resultUpload, "Tipo de archivo no soportado");
                break;
            case 2:
                resultUpload = utilResponse.error(resultUpload, "Error al cambiar la ruta");
                break;
            case 3:
                resultUpload = utilResponse.error(resultUpload, "Error al conectar con la base de datos");
                break;
        }
        console.log("G2:"+errores.getGlobalError());
    });
    console.log("G3:"+errores.getGlobalError());
    form.parse(req);
    return resultUpload;
};


// Enviar imagen al cliente
imageController.getImage = async (req, res) => {
    const pathFile = req.params.img.replaceAll("-", "/");
    let result = { img: "" };
    result = utilResponse.init(result, "get image");
    console.log(pathFile);
    if (fs.existsSync(pathFile)) {
        utilResponse.success(result, "Imagen enviada correctamente");
        result.img = pathFile;
    } else {
        result.img = __dirname.replaceAll("\\", "/") + '/uploads/default.jpg';
        utilResponse.error(result, "No existe la imagen");
    }
    
    return result;
};


module.exports = imageController;