const mongoose  = require("mongoose");
const config    = require("../bin/config");
const util      = require("../util/util");
const { initResult, setResult } = require('../util/utilResult.js');


const Docente   = require("../models/docente");


// Conexión a la base de datos
const connectDB  = async () => {
  let conn = initResult('CONNECT')

  await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
      conn = setResult("system", "CONNECT", true, 200, "Conectado a la base de datos")
    }, error => {
      conn = setResult("system", "CONNECT", false, error.code, error.codeName)
    });

  return conn;
}


//Desconectar de la base de datos
const disconnect = async () => {
  let resultDisconnect = initResult("DISCONNECT")

  await mongoose.disconnect().then(
    () => {
      resultDisconnect = setResult("system", "DISCONNECT",  true, 200, "Desconectado de la BD");
    }, error => {
      resultDisconnect = setResult("system", "DISCONNECT",  false, 500, error.code + " - " + error.codeName);
    });

  return resultDisconnect;
}



// Guardar un docente
const saveDocente = async (docente) => {
  let resultSave = initResult("SAVE DOCENTE");

  const auxDocente = new Docente(docente);

  /** FECHA DE SOLICITUD DE REGISTRO */
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  auxDocente.fechaRegistro = hoy;

  await auxDocente.save().then(
    (saveDocente) => {
      resultSave = setResult(saveDocente._id, "SAVE DOCENTE", true, 200, "Docente guardado exitosamente");
    }, error => {
      resultSave = setResult(docente.correo_institucional, "SAVE DOCENTE", false, 500, error + " - Error al guardar el docente");
    }
  );

  return resultSave;
}


// Buscar docente por email institucional
const findDocenteByInstitutionalEmail = async (correo_institucional, action) => {
  let resultFind = initResult(action);

  await Docente.findOne({ correo_institucional: correo_institucional }).then(
    (docente) => {
      if (docente) {
        resultFind = setResult(correo_institucional, action, true, 200, "Docente encontrado")

        if (action === "LOGIN")
          resultFind.docente = docente;

      } else {
        resultFind = setResult(correo_institucional, action, false, 400, "El correo electronico no está registrado");
      }
    }, error => {
      resultFind = setResult(correo_institucional, action, false, 500, error + " - Error en la petición")
    }
  );

  return resultFind;
}



// Buscar docente por id
const findDocenteById = async (id_docente, action) => {
  let resultFind = initResult(action)

  await Docente.findById(id_docente).then(
    (docente) => {
      if (docente) {
        resultFind = setResult(id_docente, action, true, 200, "Correo electrónico registrado en la BD");
        if (action === "login" || action === "getDocente"){
          resultFind = setResult(id_docente, action, true, 200, "Docente enviado");
          Object.assign(resultFind, { docente:docente })
        }
      } else {
        resultFind = setResult(id_docente, action, false, 400, "Correo electrónico no registrado");
      }
    }, error => {
      resultFind = setResult(id_docente, action, false, 500, error + " - Error en la petición");
    }
  );

  return resultFind;
}


// Actualizar un docente
const updateDocente = async (data) => {
  let resultUpdate = initResult("UpdateOneDocente")

  let docente = data.params;
  const idDocente = data.id.DocenteID;

  //docente.doc_rfc = docente.doc_rfc.replaceAll("/", "|");
  //docente.doc_curp = docente.doc_curp.replaceAll("/", "|");

  docente.curp = docente.curp.toUpperCase();
  docente.rfc = docente.rfc.toUpperCase();


  await Docente.findByIdAndUpdate(idDocente, docente, { new: true }).then(
    (docente) => {
      resultUpdate = setResult(idDocente, "UpdateOneDocente", true, 200, "Docente actualizado")
      resultUpdate.docente = docente;
    }, error => {
      resultUpdate = setResult(idDocente, "UpdateOneDocente", false, 500,error + " - Error al guardar el docente" );
    }
  );


  return resultUpdate;
}


const updateOneDocDocente = async (data) => {
  let resultUpdate = initResult("UpdateOneDocDocente")

  const docUpdate = data.params;
  const idDocente = data.id.DocenteID;

  await Docente.findByIdAndUpdate(idDocente, docUpdate).then(
    (docente) => {
      resultUpdate = setResult(idDocente, "UpdateOneDocDocente", true, 200, "Docente actualizado")
      //resultUpdate.docente = docente;
    }, error => {
      resultUpdate = setResult(idDocente, "UpdateOneDocDocente", false, 500,error + " - Error al guardar el docente" );
    }
  );


  console.log(JSON.stringify(resultUpdate))

  return resultUpdate;
}


// Buscar docente por email
const findDocenteByEmail = async (correo_personal, action) => {
  let resultFind = { action: action, value: false, code: 500, msg: "No inicializado" }

  await Docente.findOne({ correo_personal: correo_personal }).then(
    (docente) => {
      if (docente) {
        resultFind = util.setResult(resultFind, true, 200, "Correo electrónico registrado en la BD");
        if (action === "login")
        resultFind = { action: action, value: true, code: 200, msg: "Docente enviado", docente: docente }
      } else {
        resultFind = util.setResult(resultFind, false, 400, "Correo electrónico no registrado");
      }
    }, error => {
      resultFind = util.setResult(resultFind, false, 500, error + " - Error en la petición");
    }
  );
  return resultFind;
}


module.exports = { connectDB, saveDocente, findDocenteByInstitutionalEmail, findDocenteById, updateDocente, updateOneDocDocente, disconnect };