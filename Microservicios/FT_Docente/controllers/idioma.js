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
      idioma.certificado = params.certificado;
      idioma.id_docente  = params.id_docente;

      resultSave = await dbhelper.saveIdioma(idioma);
    }
    console.log(await dbhelper.disconnect());
  }
  
  return resultSave;
}

// Obtener todos los idiomas
idiomaController.get = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  const id_docente = req.params.id_docente;

  let resultGet = { action: "Obtener todos los idiomas", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    resultGet = await dbhelper.findIdiomaByIdDocente(id_docente);
    console.log(await dbhelper.disconnect());
  }
  
  return resultGet;
}

// Eliminar un idioma
idiomaController.delete = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultDelete = { action: "Eliminar idioma", value: false, code: 500, msg: "Error al conectar con la base de datos" }

  if (connected.value) {
    const id = req.params.id;
    resultDelete = await dbhelper.deleteIdiomaById(id);
    console.log(await dbhelper.disconnect());
  }
  
  return resultDelete;
}


module.exports = idiomaController;