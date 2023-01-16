//const fs = require('fs');
const mv = require('mv');

const path = require('path');
const util = require('util');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const dbhelper = require('../bin/db');

const tipos = new Map();
tipos.set("rfc", "RFC");
tipos.set("curp", "CURP");
tipos.set("gradoAcad", "Grado Académico");
tipos.set("cedulaProf", "Cedula Profesional");
tipos.set("certificacion", "Certificaciones");
tipos.set("cursos", "Cursos");
tipos.set("dominio", "Dominio de Idiomas");
tipos.set("conocimientosEspec", "Conocimientos Específicos");
tipos.set("experiencia", "Experiencia Profesional no Docente");


let documentoController = {}

documentoController.cargarDocumento = (req, res) => {
    let resultUpload = {};
    utilResponse.init(resultUpload, "cargar documento");
    let form = new multiparty.Form();
    let docenteID = req.params.docenteID;
    let tipo = req.body.tipo;

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
        let tipoArchivo = tipos.get(tipo);
        let filename = file.originalFilename;
        let ext = path.extname(filename);

        if (ext === ".pdf") {
            let tmpPath = file.path;
            let targetPath = __dirname + '/uploads/' + docenteID + '/' + tipoArchivo + '/' + filename;

            mv(tmpPath, targetPath, (err) => {
                if (err) {
                    utilResponse.innerError(resultUpload, err, "Error al cambiar la ruta");
                    res.status(resultUpload.code).send(resultUpload);
                } else {
                    utilResponse.success(resultUpload, "Documento guardado");
                    console.log("Documento guardado");
                    res.status(resultUpload.code).send(resultUpload);
                }
            });
        } else {
            utilResponse.error(resultUpload, "Tipo de archivo no soportado");
            res.status(resultUpload.code).send(resultUpload);
        }
    });


    form.parse(req);
};








/* documentoController.getImage = async (req, res) => {
    const file = req.params.image;
    const pathFile = './uploads/imagenes' + file;

    fs.exists(pathFile, (exists) => {
        if (exists) return res.sendFile(path.resolve(pathFile));
        else return res.status(404).send({ message: 'No existe la imagen.' });
    });
}; */


/*   documentoController.getDoc = async (req, res) => {
    const file = req.params.image;
    const pathFile = './uploads/imagenes' + file;

    fs.exists(pathFile, (exists) => {
        if (exists) return res.sendFile(path.resolve(pathFile));
        else return res.status(404).send({ message: 'No existe el archivo.' });
    });
} */

module.exports = documentoController;