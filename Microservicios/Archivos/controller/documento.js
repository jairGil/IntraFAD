const fs = require('fs');
const path = require('path');
const util = require('../util/util');
const dbhelper = require('../bin/db');


let documentoController = {}

documentoController.cargarImagen = async (req, res) => {
    const connected = await dbhelper.connect();
    console.log(connected);

    resultSave = { action: "cargar img", value: false, code: 500, msg: "Error al conectar con la base de datos" }

    if (req.files && connected.value) {
        const docenteId = req.params.docente_id;
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[1];
        const extSplit = fileName.split('.');
        const fileExt = extSplit[1];

        if (fileExt == 'jpg' || fileExt == 'jpeg') {
            resultSave = await dbhelper.setImagen(docenteId, fileName);
        } else {
            fs.unlink(filePath, (err) => {
                resultSave = util.setResult(resultSave, false, 500, "Extensión de archivo inválida.");
            });
        }
    }
    return resultSave;
}

documentoController.getImage = async (req, res) => {
    const file = req.params.image;
    const pathFile = './uploads/imagenes' + file;

    fs.exists(pathFile, (exists) => {
        if (exists) return res.sendFile(path.resolve(pathFile));
        else return res.status(404).send({ message: 'No existe la imagen.' });
    });
};

documentoController.cargarArchivo = async (req, res) => {
    const connected = await dbhelper.connect();
    console.log(connected);

    resultSave = { action: "cargar doc", value: false, code: 500, msg: "Error al conectar con la base de datos" }
    if (req.files && connected.value) {
        const docenteId = req.params.docente_id;
        const filePath = req.files.doc.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[1];
        const extSplit = fileName.split('.');
        const fileExt = extSplit[1];

        if (fileExt == 'pdf') {
            //resultSave = await dbhelper.setImagen(docenteId, fileName);
            //definir como guardar en la base de datos
        } else {
            fs.unlink(filePath, (err) => {
                resultSave = util.setResult(resultSave, false, 500, "Extensión de archivo inválida.");
            });
        }
    }
    return resultSave;
  }

  documentoController.getDoc = async (req, res) => {
    const file = req.params.image;
    const pathFile = './uploads/imagenes' + file;

    fs.exists(pathFile, (exists) => {
        if (exists) return res.sendFile(path.resolve(pathFile));
        else return res.status(404).send({ message: 'No existe el archivo.' });
    });
}

  module.exports = documentoController;