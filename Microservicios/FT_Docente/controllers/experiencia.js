"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let experienciaController = {}

//Agregar un nueva experiencia profesional
experienciaController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar experiencia profesional", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let experiencia = {};
    const params = req.body;

    // Verificar que la experiencia profesional no este registrada
    let resultFind = await dbhelper.findExperiencia(params);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "La experiencia profesional ya está registrada para este docente");
    } else {
      experiencia.puesto        = params.puesto;
      experiencia.empresa       = params.empresa;
      experiencia.fecha_ingreso = params.fecha_ingreso;
      experiencia.fecha_egreso  = params.fecha_egreso;
      experiencia.funciones     = params.funciones;
      experiencia.observaciones = params.observaciones;
      experiencia.id_docente    = params.id_docente;

      resultSave = await dbhelper.saveExperiencia(experiencia);
    }
    console.log(await dbhelper.disconnect());
  }
  
  return resultSave;
}

// Obtener todas las experiencias profesionales
experienciaController.get = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  
  let resultGet = { action: "Obtener todas las experiencias profesionales", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    const id_docente = req.params.id;
    resultGet = await dbhelper.findExperienciaByIdDocente(id_docente);
    console.log(await dbhelper.disconnect());
  }
  
  return resultGet;
}

// Eliminar una experiencia profesional
experienciaController.delete = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultDelete = { action: "Eliminar experiencia profesional", value: false, code: 500, msg: "Error al conectar con la base de datos" }

  if (connected.value) {
    const id = req.params.id;
    resultDelete = await dbhelper.deleteExperienciaById(id);
    console.log(await dbhelper.disconnect());
  }
  
  return resultDelete;
}


module.exports = experienciaController;