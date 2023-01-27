"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let datoAcademicoController = {}

//Agregar un nuevo dato academico
datoAcademicoController.add = async (req, res) => {
  let resultSave = { action: "Agregar dato academico", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(connected);


  if (!connected.value) {
    return resultSave;
  }

  let datoAcademico = {};
  const params = req.body;

  //Verificar que la cédula profesional no esté registrada
  let resultFind = await dbhelper.findDatoAcademicoByCP(params.cedula_profesional);

  if (resultFind.value) {
    resultSave = await util.setResult(resultSave, false, 400, "La cédula profesional ya está registrada");
    return resultSave;
  }

  datoAcademico.grado_academico = params.grado_academico;
  datoAcademico.grado_obtenido = params.grado_obtenido;
  datoAcademico.doc_grado_acad = params.doc_grado_acad;
  datoAcademico.institucion_emisora = params.institucion_emisora;
  datoAcademico.fecha_obtencion = params.fecha_obtencion;
  datoAcademico.cedula_profesional = params.cedula_profesional;
  datoAcademico.doc_ced_prof = params.doc_ced_prof;
  datoAcademico.id_docente = params.id_docente;
  datoAcademico.validado = false;

  resultSave = await dbhelper.saveDatoAcademico(datoAcademico);

  console.log(dbhelper.disconnect());

  console.log(resultSave);
  return resultSave;
}

datoAcademicoController.update = async (req, res) => {
  let resultSave = { action: "Actualizar dato academico", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return resultSave;
  }

  let datoAcademico = {};
  const params = req.body;

  //Verificar que la cédula profesional esté registrada
  let resultFind = await dbhelper.findDatoAcademicoByCP(params.cedula_profesional);

  if (!resultFind.value) {
    resultSave = await util.setResult(resultSave, false, 400, "La cédula profesional no está registrada");
    return resultSave;
  }

  datoAcademico.grado_academico = params.grado_academico;
  datoAcademico.grado_obtenido = params.grado_obtenido;
  datoAcademico.institucion_emisora = params.institucion_emisora;
  datoAcademico.fecha_obtencion = params.fecha_obtencion;
  datoAcademico.cedula_profesional = params.cedula_profesional;
  datoAcademico.id_docente = params.id_docente;
  datoAcademico.validado = params.validado;
  
  resultSave = await dbhelper.updateDatoAcademico(datoAcademico);

  console.log(dbhelper.disconnect());
  
  console.log(resultSave);
  return resultSave;
}


/* GET datoAcademico by id_docente. */
datoAcademicoController.get = async (req, res) => {
  let result = { action: "Obtener datos academicos del docente", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id_docente = req.params.id_docente;

  result = await dbhelper.findDatoAcademicoByIdDocente(id_docente);

  console.log(dbhelper.disconnect());

  return result;
}

/* DELETE datoAcademico by id. */
datoAcademicoController.delete = async (req, res) => {
  let result = { action: "Eliminar dato academico", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id = req.params.id;

  result = await dbhelper.deleteDatoAcademicoById(id);

  console.log(dbhelper.disconnect());

  console.log(result);
  return result;
}


module.exports = datoAcademicoController;