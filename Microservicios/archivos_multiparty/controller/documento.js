const mv = require('mv');
const fs = require('fs');

const path = require('path');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const dbhelper = require('../bin/db');
const config = require('../bin/config');


let documentoController = {}

documentoController.cargarDocumento = (req, res) => {
    let resultUpload = {};
    let form = new multiparty.Form();
    let docenteID = req.params.docenteID;
    let tipo = req.params.tipo;

    utilResponse.init(resultUpload, "cargar documento");
    //Error al cargar documento
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


    //Emite el progreso de cargar documento
    form.on("progress", (bytesReceived, bytesExpected) => {
        //console.log("bytes: " + (bytesReceived + " / " + bytesExpected));
    });

    //Guardar el archivo en el disco
    form.on("file", (name, file) => {
        let tipoArchivo = directorios.getTipoArchivo(tipo);
        let filename = file.originalFilename;
        let ext = path.extname(filename);
        let tmpPath = file.path;
        let targetPath = config.routes.files + docenteID + '/' + tipoArchivo + '/';

        if (!(ext === ".pdf")) {
            utilResponse.error(resultUpload, "Tipo de archivo no soportado");
            res.status(resultUpload.code).send(resultUpload);
            return;
        }

        if (tipoArchivo === "RFC" || tipoArchivo === "CURP") {
            targetPath += docenteID + ext;
        } else {
            targetPath += filename;
        }

        //Crear directorios necesarios
        directorios.createDir(config.routes.files, docenteID, tipoArchivo);

        mv(tmpPath, targetPath, async (err) => {
            if (err) {
                utilResponse.innerError(resultUpload, err, "Error al cambiar la ruta");
                res.status(resultUpload.code).send(resultUpload);
                return;
            }
            utilResponse.success(resultUpload, "Documento guardado");
            
            const connected = await dbhelper.connect();
            
            if (!connected.value) { 
                utilResponse.innerError(resultUpload, err, "Error al conectar con la base de datos");
                res.status(resultUpload.code).send(resultUpload);
                return;
            }
            
            await dbhelper.setPDF(docenteID, tipo, targetPath.replaceAll("/", "-"));
            
            dbhelper.disconnect();

            utilResponse.success(resultUpload, "Documento guardado");
            resultUpload.doc = targetPath;
            console.log(resultUpload);
            console.log("Documento guardado");
            res.status(resultUpload.code).send(resultUpload);
        });
    });


    form.parse(req);
};

// Enviar documento al cliente
documentoController.getDoc = async (req, res) => {
    const pathFile = req.params.doc.replaceAll("-", "/");
    let result = { doc: "" };
    
    result = utilResponse.init(result, "get document");

    if (fs.existsSync(pathFile)) {
        utilResponse.success(result, "Documento enviado correctamente");
        result.doc = pathFile;
    } else {
        utilResponse.error(result, "No existe el documento");
    }
    
    return result;
}

module.exports = documentoController;