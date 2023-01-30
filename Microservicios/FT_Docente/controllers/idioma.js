"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let idiomaController = {}

//Agregar un nuevo idioma
idiomaController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar idioma", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let idioma = {};
    const params = req.body;

    // Verificar que el idioma no este registrado
    let resultFind = await dbhelper.findIdioma(params.nombre, params.fecha_fin, params.institucion, params.id_docente);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "El idioma ya está registrado para este docente");
    } else {
      idioma.nombre      = params.nombre;
      idioma.nivel       = params.nivel;
      idioma.fecha_fin   = params.fecha_fin;
      idioma.institucion = params.institucion;
      idioma.certificado  = params.certificado;
      idioma.id_docente  = params.id_docente;

      resultSave = await dbhelper.saveIdioma(idioma);
    }
    dbhelper.disconnect();
  }
  console.log(resultSave);
  return resultSave;
}


module.exports = idiomaController;