"use strict"

const docenteService = require("../services/docenteService")


const createNewDocente = (req, res) => {
  docenteService.createNewDocente(req.body).then(
    (resultCreate) => {
      delete(resultCreate.id)
      res.status(resultCreate.code).send(resultCreate);
    }
  );
}


const login = (req, res) => {
  docenteService.login(req.body).then(
    (resultLogin) => {
      res.status(resultLogin.code).send(resultLogin);
    });
}



const getDocenteByID = (req, res) => {
  docenteService.getOneDocente(req.params.id_docente).then(
    (resultDocente) => {
      res.status(resultDocente.code).send(resultDocente);
    }); 
}



const updateOneDocente = (req, res) => {
  const data = req.body;
  console.log("DATA",data)
   /* Actualiza el campo doc_rfc */
   if(data.params.hasOwnProperty('doc_rfc') || data.params.hasOwnProperty('doc_curp')){
    /* Actualiza el docente */
    docenteService.updateDocDocente(data).then(
      (resultUpdated) => {
        res.status(resultUpdated.code).send(resultUpdated);
      });
  }else{
    /* Actualiza el docente */
    docenteService.updateOneDocente(data).then(
      (resultUpdated) => {
        res.status(resultUpdated.code).send(resultUpdated);
      });
  }
  
}



module.exports = { 
  createNewDocente,
  updateOneDocente,
  login,
  getDocenteByID
}




















let docenteController = {}



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







//module.exports = docenteController;