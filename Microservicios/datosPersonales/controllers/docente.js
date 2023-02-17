"use strict"

const dbhelper = require("../bin/db");
const util = require("../util/util")
const jwt = require("../service/auth");

let docenteController = {}

//Agregar un nuevo docente
docenteController.add = async (req, res) => {
  const params = req.body;
  const connected = await dbhelper.connect();
  let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultSave;

  let docente = {};
  let resultFind = await dbhelper.findDocenteByInstitutionalEmail(params.correo_institucional, "signin");

  //Verificar que el correo electónico no está en uso
  if (resultFind.value)
    return await util.setResult(resultSave, false, 400, "El correo electrónico ya está registrado");

  // Verificar si las contraseñas coinciden
  if (!params.contrasena == params.confirma_contrasena)
    return await util.setResult(resultSave, false, 400, "Las contraseñas no coinciden");

  //Encriptar contraseña
  docente.contrasena = await util.encriptaContrasena(params.contrasena).then((hash) => { return hash; });
  docente.correo_institucional = params.correo_institucional;


  resultSave = await dbhelper.saveDocente(docente);
  dbhelper.disconnect();
  return resultSave;
}

//Agregar un nuevo docente sin correo institucional
docenteController.addNoInstitutional = async (req, res) => {
  const params = req.body;
  const connected = await dbhelper.connect();
  let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultSave;

  let docente = {};
  let resultFind = await dbhelper.findDocenteByEmail(params.correo_personal, "signin");

  //Verificar que el correo electónico no está en uso
  if (resultFind.value)
    return await util.setResult(resultSave, false, 400, "El correo electrónico ya está registrado");

  // Verificar si las contraseñas coinciden
  if (!params.contrasena == params.confirma_contrasena)
    return await util.setResult(resultSave, false, 400, "Las contraseñas no coinciden");

  //Encriptar contraseña
  docente.contrasena = await util.encriptaContrasena(params.contrasena).then((hash) => { return hash; });
  docente.correo_personal = params.correo_personal;

  resultSave = await dbhelper.saveDocente(docente);
  dbhelper.disconnect();
  return resultSave;
}

docenteController.login = async (req, res) => {
  let resultFind = { action: "login", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultFind;

  const params = req.body;
  resultFind = await dbhelper.findDocenteByInstitutionalEmail(params.correo_institucional, resultFind.action);

  if (!resultFind.value)
    return await util.setResult(resultFind, false, 400, "El correo institucional no está registrado");

  const compare = await util.comparaContrasenas(params.contrasena, resultFind.docente.contrasena);

  if (!compare)
    return await util.setResult(resultFind, false, 400, "La contraseña es incorrecta");

  /* TOKEN */
  resultFind.token = jwt.createToken(resultFind.docente);
  resultFind = await util.setResult(resultFind, true, 200, "Login exitoso");

  delete resultFind.docente;
  dbhelper.disconnect();
  return resultFind;
}

docenteController.loginNoInstitutional = async (req, res) => {
  let resultFind = { action: "login", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultFind;

  const params = req.body;
  resultFind = await dbhelper.findDocenteByEmail(params.correo_personal, resultFind.action);

  if (!resultFind.value)
    return await util.setResult(resultFind, false, 400, "El correo personal no está registrado");

  const compare = await util.comparaContrasenas(params.contrasena, resultFind.docente.contrasena);

  if (!compare)
    return await util.setResult(resultFind, false, 400, "La contraseña es incorrecta");

  /* TOKEN */
  resultFind.token = jwt.createToken(resultFind.docente);
  resultFind = await util.setResult(resultFind, true, 200, "Login exitoso");

  delete resultFind.docente;
  dbhelper.disconnect();
  return resultFind;
}

// Modificar los datos de un docente
docenteController.updateDatosPersonales = async (req, res) => {
  let resultSave = { action: "Actualizar datos personales", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  const connected = await dbhelper.connect();
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultSave;

  const params = req.body;
  resultSave = await dbhelper.updateDocente(params);
  console.log(JSON.stringify(resultSave));

  if (!resultSave.value)
    return await util.setResult(resultSave, false, 500, "No se pudieron actualizar los datos personales");

  /* TOKEN */
  resultSave.token = jwt.createToken(resultSave.docente);
  resultSave = await util.setResult(resultSave, true, 200, "Datos personales actualizados");

  delete resultSave.docente;
  dbhelper.disconnect();
  return resultSave;
}


/** OBTENER UN DOCENTE */
docenteController.getDocente = async (req, res) => {
  let resultFind = { action: "getDocente", value: false, code: 500, msg: "Error al conectar con la base de datos" };
  const connected = await dbhelper.connect();
  console.log(JSON.stringify(connected));

  if (!connected.value) return resultFind;

  const id_docente = req.params.id_docente;
  resultFind = await dbhelper.findDocenteById(id_docente, resultFind.action);

  if (!resultFind.value)
    return await util.setResult(resultFind, false, 400, "El docente no existe");

  resultFind = await util.setResult(resultFind, true, 200, "Docente encontrado");
  dbhelper.disconnect();
  return resultFind;
}


module.exports = docenteController;