"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let publicacionController = {}

//Agregar un nueva publicacion
publicacionController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar publicación", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let publicacion = {};
    const params = req.body;

    // Verificar que la publicación no este registrada
    let resultFind = await dbhelper.findPublicacion(params);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "La publicación ya está registrada para este docente");
    } else {
      publicacion.formato    = params.formato;
      publicacion.tipo       = params.tipo;
      publicacion.autores    = params.autores;
      publicacion.titulo     = params.titulo;
      publicacion.fecha      = params.fecha;
      publicacion.editorial  = params.editorial;
      publicacion.doi_url    = params.doi_url;
      publicacion.id_docente = params.id_docente;

      resultSave = await dbhelper.savePublicacion(publicacion);
    }
    console.log(await dbhelper.disconnect());
  }
  
  return resultSave;
}

// Obtener todas las publicaciones
publicacionController.get = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  
  let resultGet = { action: "Obtener todas las publicaciones", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    const id_docente = req.params.id;
    resultGet = await dbhelper.findPublicacionByIdDocente(id_docente);
    console.log(await dbhelper.disconnect());
  }
  
  return resultGet;
}

// Eliminar una publicación
publicacionController.delete = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultDelete = { action: "Eliminar publicación", value: false, code: 500, msg: "Error al conectar con la base de datos" }

  if (connected.value) {
    const id = req.params.id;
    resultDelete = await dbhelper.deletePublicacionById(id);
    console.log(await dbhelper.disconnect());
  }
  
  return resultDelete;
}


module.exports = publicacionController;