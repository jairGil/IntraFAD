const mv = require('mv');

const path = require('path');
const multiparty = require('multiparty');

const utilResponse = require("../util/util");
const directorios = require('../util/dir');
const dbhelper = require('../bin/db');

let imagenController = {}

imagenController.cargarImagen = (req, res) => {
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
        let targetPath = __dirname + '/uploads/' + docenteID + '/Imagen Perfil/' + docenteID + ext;

        if (!(ext === ".jpg" || ext === ".jpeg")) {
            utilResponse.error(resultUpload, "Tipo de archivo no soportado");
            res.status(resultUpload.code).send(resultUpload);
        }

        directorios.createDir(__dirname + '/uploads/', docenteID, 'Imagen Perfil');

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

            await dbhelper.setImagen(docenteID, targetPath);

            dbhelper.disconnect();
            
            res.status(resultUpload.code).send(resultUpload);
        });
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

module.exports = imagenController;