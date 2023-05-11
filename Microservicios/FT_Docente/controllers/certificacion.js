"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let certificacionController = {}

//Agregar una nueva certificación
certificacionController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar certificación", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let certificacion = {};
    const params = req.body;

    // Verificar que la certificación no este registrado
    let resultFind = await dbhelper.findCertificacion(params.nombre, params.institucion, params.fecha, params.id_docente);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "El certificado ya está registrado para este docente");
    } else {
      certificacion.nombre      = params.nombre;
      certificacion.institucion = params.institucion;
      certificacion.fecha       = params.fecha;
      certificacion.constancia  = params.constancia;
      certificacion.id_docente  = params.id_docente;

      resultSave = await dbhelper.saveCertificacion(certificacion);
    }
    console.log(await dbhelper.disconnect());
  }

  return resultSave;
}

/* GET certificaciones by id_docente. */
certificacionController.get = async (req, res) => {
  let result = { action: "Obtener certificaciones del docente", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id_docente = req.params.id_docente;
  result = await dbhelper.findCertificacionByIdDocente(id_docente);
  console.log(await dbhelper.disconnect());

  return result;
}

/* DELETE certificacion by id. */
certificacionController.delete = async (req, res) => {
  let result = { action: "Eliminar certificacion", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id = req.params.id;
  result = await dbhelper.deleteCertificacionById(id);
  console.log(await dbhelper.disconnect());

  return result;
}

/* UPDATE certificacion by id. */
certificacionController.update = async (req, res) => {
  let result = { action: "Actualizar certificacion", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(connected);

  if (!connected.value) {
    return result;
  }

  const id = req.body.id;
  const params = req.body.params;
  result = await dbhelper.updateCertificacionById(id, params);
  console.log(await dbhelper.disconnect());

  return result;
}


module.exports = certificacionController;