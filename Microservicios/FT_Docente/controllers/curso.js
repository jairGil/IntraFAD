"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let cursoController = {}

//Agregar un nuevo curso
cursoController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar curso", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let curso = {};
    const params = req.body;

    // Verificar que el curso no este registrado
    let resultFind = await dbhelper.findCurso(params.nombre, params.fecha_fin, params.institucion, params.id_docente);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "El curso ya está registrado para este docente");
    } else {
      curso.tipo        = params.tipo;
      curso.nombre      = params.nombre;
      curso.fecha_fin   = params.fecha_fin;
      curso.institucion = params.institucion;
      curso.duracion    = params.duracion;
      curso.constancia  = params.constancia;
      curso.id_docente  = params.id_docente;

      resultSave = await dbhelper.saveCurso(curso);
    }
    console.log(await dbhelper.disconnect());
  }
  
  return resultSave;
}

/* GET cursos by id_docente. */
cursoController.get = async (req, res) => {
  let result = { action: "Obtener cursos del docente", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id_docente = req.params.id_docente;
  result = await dbhelper.findCursoByIdDocente(id_docente);
  console.log(await dbhelper.disconnect());

  return result;
}

/* DELETE certificacion by id. */
cursoController.delete = async (req, res) => {
  let result = { action: "Eliminar Curso", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id = req.params.id;
  result = await dbhelper.deleteCursoById(id);
  console.log(await dbhelper.disconnect());

  return result;
}


module.exports = cursoController;