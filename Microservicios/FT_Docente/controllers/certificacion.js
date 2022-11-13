"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util");


let certificacionController = {}

//Agregar un nuevo curso
certificacionController.add = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultSave = { action: "Agregar certificación", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  if (connected.value) {
    let certificacion = {};
    const params = req.body;

    // Verificar que el curso no este registrado
    let resultFind = await dbhelper.findCertificado(params.nombre, params.institucion, params.fecha, params.id_docente);
    if (resultFind.value) {
      resultSave = await util.setResult(resultSave, false, 400, "El certificado ya está registrado para este docente");
    } else {
      certificacion.nombre      = params.nombre;
      certificacion.institucion = params.institucion;
      certificacion.fecha       = params.fecha;
      certificacion.constancia  = params.constancia;
      certificacion.id_docente  = params.id_docente;

      resultSave = await dbhelper.saveCurso(certificacion);
    }
    dbhelper.disconnect();
  }
  console.log(resultSave);
  return resultSave;
}


module.exports = certificacionController;