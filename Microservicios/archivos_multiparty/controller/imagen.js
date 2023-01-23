const mv = require('mv');
const fs = require('fs');

const path = require('path');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const dbhelper = require('../bin/db');
const config = require('../bin/config');

let imageController = {}

imageController.cargarImagen = async (req, res) => {
    let resultUpload = { img: "D:-Documentos-SevicioSocial-Proyectos-Microservicios-archivos_multiparty-controller-uploads-default.jpg" };
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

            const connected = await dbhelper.connect();

            if (!connected.value) { 
                utilResponse.innerError(resultUpload, err, "Error al conectar con la base de datos");
                res.status(resultUpload.code).send(resultUpload);
                return;
            }

            await dbhelper.setImagen(docenteID, targetPath.replaceAll("/", "-"));
            
            dbhelper.disconnect();

            utilResponse.success(resultUpload, "Imagen guardada correctamente");
            resultUpload.img = targetPath;
            console.log("Imagen guardada");
            console.log(resultUpload);
            res.status(resultUpload.code).send(resultUpload);
        });
    });
    
    form.parse(req);
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
        result.img = config.routes.files + 'default.jpg';
        utilResponse.error(result, "No existe la imagen");
    }
    
    return result;
};


module.exports = imageController;