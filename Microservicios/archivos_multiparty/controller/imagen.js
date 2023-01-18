const mv = require('mv');
const fs = require('fs');

const path = require('path');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const dbhelper = require('../bin/db');

let imageController = {}

imageController.cargarImagen = (req, res) => {
    let resultUpload = {};
    utilResponse.init(resultUpload, "cargar imagen");
    let form = new multiparty.Form();
    let docenteID = req.params.docenteID;

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
            utilResponse.error(resultUpload, "Tipo de archivo no soportado");
            res.status(resultUpload.code).send(resultUpload);
        }

        directorios.createDir(__dirname + '/uploads/', docenteID, 'ImagenPerfil');

        mv(tmpPath, targetPath, async (err) => {
            if (err) {
                console.log(err);
                utilResponse.innerError(resultUpload, err, "Error al cambiar la ruta");
                res.status(resultUpload.code).send(resultUpload);
            }
            utilResponse.success(resultUpload, "Imagen guardada");
            console.log("Imagen guardada");
            const connected = await dbhelper.connect();
            console.log(connected);

            if (!connected.value) {
                utilResponse.error(resultUpload, "Error al conectar con la base de datos");
            }

            resultUpload = await dbhelper.setImagen(docenteID, targetPath);

            dbhelper.disconnect();
            console.log(resultUpload);

            res.status(resultUpload.code).send(resultUpload);
        });
    });


    form.parse(req);
};


// Enviar imagen al cliente
imageController.getImage = async (req, res) => {
    const docenteID = req.params.docenteID;
    const pathFile = __dirname + '/uploads/' + docenteID + '/Imagen Perfil/' + docenteID + '.jpg';
    let result = { img: "" };
    result = utilResponse.init(result, "get image");

    if (!fs.existsSync(pathFile)) {
        result.img = __dirname + '/uploads/default.jpg';
        utilResponse.error(result, "No existe la imagen");
        return result;
    } 
    
    utilResponse.success(result, "Imagen enviada correctamente");
    result.img = pathFile;
    return result;
};


module.exports = imageController;