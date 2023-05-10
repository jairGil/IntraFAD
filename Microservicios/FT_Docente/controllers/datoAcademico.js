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

  let datoAcademico = req.body;

  //Verificar que la cédula profesional no esté registrada
  let resultFind = await dbhelper.findDatoAcademicoByCP(datoAcademico.cedula_profesional);

  if (resultFind.value) {
    resultSave = await util.setResult(resultSave, false, 400, "La cédula profesional ya está registrada");
    return resultSave;
  }

  console.log("DA:");
  console.log(datoAcademico);

  resultSave = await dbhelper.saveDatoAcademico(datoAcademico);

  console.log(await dbhelper.disconnect());

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
  console.log(await dbhelper.disconnect());

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
  console.log(await dbhelper.disconnect());

  return result;
}

/* UPDATE datoAcademico by id. */
datoAcademicoController.update = async (req, res) => {
  let result = { action: "Actualizar dato academico", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id = req.body.id;
  const datoAcademico = req.body.params;

  result = await dbhelper.updateDatoAcademicoById(id, datoAcademico);

  console.log(await dbhelper.disconnect());

  return result;
}


module.exports = datoAcademicoController;