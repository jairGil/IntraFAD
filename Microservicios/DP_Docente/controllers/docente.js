"use strict"

const bcrypt = require("bcrypt");
const dbhelper = require("../bin/db");
const util = require("../util/util")
const jwt = require("../services/jwt");

let docenteController = {}

//Agregar un nuevo docente
docenteController.add = async (req, res) => {
  const params = req.body;
  const connected = await dbhelper.connect();
  let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  console.log(connected);

  if (!connected.value) {
    return resultSave;
  }

  let docente = {};
  let resultFind = await dbhelper.findDocenteByInstitutionalEmail(params.correo_institucional, "signin");
  //Verificar que el correo electónico no está en uso
  if (resultFind.value) {
    return await util.setResult(resultSave, false, 400, "El correo electrónico ya está registrado");
  }

  // Verificar si las contraseñas coinciden
  if (!params.contrasena == params.confirma_contrasena) {
    return await util.setResult(resultSave, false, 400, "Las contraseñas no coinciden");
  }

  //Encriptar contraseña
  const saltRounds = 10;
  docente.contrasena = await new Promise((resolve, reject) => {
    bcrypt.hash(params.contrasena, saltRounds, (error, hash) => {
      if (error) {
        resolve(null);
        return util.setResult(resultSave, false, 500, error + " - Error al encriptar la contraseña");
      } else
        resolve(hash);
    });
  });

  docente.correo_institucional = params.correo_institucional;
  resultSave = await dbhelper.saveDocente(docente);
  dbhelper.disconnect();
  console.log(resultSave);
  return resultSave;
}

//Agregar un nuevo docente sin correo institucional
docenteController.addNoInstitutional = async (req, res) => {
  const params = req.body;
  const connected = await dbhelper.connect();
  let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  console.log(connected);

  if (!connected.value) {
    return resultSave;
  }

  let docente = {};
  let resultFind = await dbhelper.findDocenteByEmail(params.correo_personal, "signin");
  //Verificar que el correo electónico no está en uso
  if (resultFind.value) {
    return await util.setResult(resultSave, false, 400, "El correo electrónico ya está registrado");
  }

  // Verificar si las contraseñas coinciden
  if (!params.contrasena == params.confirma_contrasena) {
    return await util.setResult(resultSave, false, 400, "Las contraseñas no coinciden");
  }

  //Encriptar contraseña
  const saltRounds = 10;
  docente.contrasena = await new Promise((resolve, reject) => {
    bcrypt.hash(params.contrasena, saltRounds, (error, hash) => {
      if (error) {
        resolve(null);
        return util.setResult(resultSave, false, 500, error + " - Error al encriptar la contraseña");
      } else
        resolve(hash);
    });
  });

  docente.correo_personal = params.correo_personal;
  resultSave = await dbhelper.saveDocente(docente);
  dbhelper.disconnect();
  console.log(resultSave);
  return resultSave;
}

docenteController.login = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultFind = { action: "login", value: false, code: 500, msg: "No inicializado" };
  if (connected.value) {
    const params = req.body;
    resultFind = await dbhelper.findDocenteByInstitutionalEmail(params.correo_institucional, resultFind.action);
    if (resultFind.value) {
      const compare = await bcrypt.compare(params.contrasena, resultFind.docente.contrasena);
      resultFind.value = compare;
      if (compare) {
        resultFind = await util.setResult(resultFind, true, 200, "Login exitoso");
        /* TOKEN */
        resultFind.token = jwt.createToken(resultFind.docente);
      } else {
        resultFind = await util.setResult(resultFind, false, 400, "La contraseña es incorrecta");
      }
      delete resultFind.docente;
    } else {
      resultFind = await util.setResult(resultFind, false, 400, "El correo institucional no está registrado");
    }
    dbhelper.disconnect();
  } else {
    resultFind = await util.setResult(resultFind, false, 500, "Error al conectar con la base de datos");
  }
  console.log(resultFind);
  return resultFind;
}

docenteController.loginNoInstitutional = async (req, res) => {
  const connected = await dbhelper.connect();
  console.log(connected);

  let resultFind = { action: "login", value: false, code: 500, msg: "No inicializado" };
  if (connected.value) {
    const params = req.body;
    resultFind = await dbhelper.findDocenteByEmail(params.correo_personal, resultFind.action);
    if (resultFind.value) {
      const compare = await bcrypt.compare(params.contrasena, resultFind.docente.contrasena);
      resultFind.value = compare;
      if (compare) {
        resultFind = await util.setResult(resultFind, true, 200, "Login exitoso");
        /* TOKEN */
        resultFind.token = jwt.createToken(resultFind.docente);
      } else {
        resultFind = await util.setResult(resultFind, false, 400, "La contraseña es incorrecta");
      }
      delete resultFind.docente;
    } else {
      resultFind = await util.setResult(resultFind, false, 400, "El correo personal no está registrado");
    }
    dbhelper.disconnect();
  } else {
    resultFind = await util.setResult(resultFind, false, 500, "Error al conectar con la base de datos");
  }
  console.log(resultFind);
  return resultFind;
}

docenteController.updateDatosPersonales = async (req, res) => {
  const params = req.body;
  const connected = await dbhelper.connect();
  let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
  console.log(connected);

  if (!connected.value) {
    return resultSave;
  }
}


module.exports = docenteController;