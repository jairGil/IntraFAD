"use strict"

const bcrypt = require("bcrypt");
const dbhelper = require("../bin/db");
const util = require("../util/util")
const jwt = require("../services/jwt");

let docenteController = {
  //Agregar un nuevo docente
  add: async (req, res) => {
    const connected = await dbhelper.connect();
    console.log(connected);

    let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
    if (connected.value) {
      let docente = {};
      const params = req.body;

      //Verificar que el correo electónico no está en uso
      let resultFind = await dbhelper.findDocenteByEmail(params.correo_institucional, "signin");
      if (resultFind.value) {
        resultSave = await util.setResult(resultSave, false, 400, "El correo electrónico ya está registrado");
      } else {
        docente.nombre = params.nombre;
        docente.apellido_p = params.apellido_p;
        docente.apellido_m = params.apellido_m;
        docente.rol = params.rol;

        if (params.role === "ADMIN_ROLE" || params.role === "USER_ROLE" || params.role === "ROOT_ROLE") {
          docente.img = params.img;
          docente.direccion = params.direccion;
          docente.telefono = params.telefono;
          docente.correo_personal = params.correo_personal;
          docente.correo_institucional = params.correo_institucional;
          docente.no_empleado = params.no_empleado;
          docente.rfc = params.rfc;
          docente.curp = params.curp;

          if (params.contrasena == params.confirma_contrasena) {
            //Encriptar contraseña
            const saltRounds = 10;
            docente.contrasena = await new Promise((resolve, reject) => {
              bcrypt.hash(params.contrasena, saltRounds, (error, hash) => {
                if (error) {
                  resultSave = util.setResult(resultSave, false, 500, error + " - Error al encriptar la contraseña")
                  resolve(null);
                } else
                  resolve(hash);
              });
            });

            if (docente.contrasena)
              resultSave = await dbhelper.saveDocente(user);
          } else
            resultSave = await util.setResult(resultSave, false, 400, error + " - Error las contraseñas no coinciden")
        } else
          resultSave = await dbhelper.saveDocente(docente);
      }
      dbhelper.disconnect();
    }
    console.log(resultSave);
    return resultSave;
  },

  login: async (req, res) => {
    const connected = await dbhelper.connect();
    console.log(connected);

    let resultFind = { action: "login", value: false, code: 500, msg: "No inicializado" };
    if (connected.value) {
      const params = req.body;
      resultFind = await dbhelper.findDocenteByEmail(params.correo_institucional, "login");
      if (resultFind.value) {
        const compare = await bcrypt.compare(params.contrasena, resultFind.docente.contrasena);
        resultFind.value = compare;
        if (compare) {
          resultFind = await util.setResult(resultFind, true, 200, "Login exitoso")
          /* TOKEN */
          resultFind.token = jwt.createToken(resultFind.user);

        } else {
          resultFind = await util.setResult(resultFind, false, 400, "Las contraseñas no coinciden")
        }
        delete resultFind.docente;
      } else {
        resultFind = await util.setResult(resultFind, false, 400, "El usuario no está registrado")
      }
      dbhelper.disconnect();
    } else {
      resultFind = await util.setResult(resultFind, false, 500, "Error al conectar con la base de datos")
    }
    console.log(resultFind);
    return resultFind;
  }
};


module.exports = docenteController;