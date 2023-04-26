const { connectDB, saveDocente, findDocenteByInstitutionalEmail, findDocenteById, updateDocente, updateOneDocDocente,  disconnect } = require('../database/db.js');
const { initResult, setResult } = require('../util/utilResult.js')
const util = require('../util/util.js')
const jwt = require("../services/auth");



const createNewDocente = async (body) => {
    const { correo_institucional, contrasena, confirma_contrasena } = body;
    
    let createResult = initResult('SIGNIN');

    const connected = await connectDB();

    if (!connected.value) return connected;

    let docente = {};
    const resultFind = await findDocenteByInstitutionalEmail(correo_institucional, "SIGNIN");

    //Verificar que el correo electónico no está en uso
    if (resultFind.value)
        return setResult(correo_institucional, 'SIGNIN', false, 400, "El correo electrónico ya está registrado")

    // Verificar si las contraseñas coinciden
    if (!contrasena == confirma_contrasena)
        return setResult(correo_institucional, 'SIGNIN', false, 400, "Las contraseñas no coinciden");

    //Encriptar contraseña
    docente.contrasena = await util.encriptaContrasena(contrasena).then((hash) => { return hash; });
    docente.correo_institucional = correo_institucional;


    createResult = await saveDocente(docente);
    disconnect();

    return createResult;
}

const login = async (body) => {
    let resultLogin = initResult("LOGIN")
    
    const connected = await connectDB();

    if (!connected.value) return connected;

    const { correo_institucional, contrasena } = body;
    
    resultLogin = await findDocenteByInstitutionalEmail(correo_institucional, "LOGIN");

    if (!resultLogin.value)
    return setResult(correo_institucional, "LOGIN", false, 400, "Las credenciales no coinciden")

    const compare = await util.comparaContrasenas(contrasena, resultLogin.docente.contrasena);

    if (!compare)
        return setResult(correo_institucional, "LOGIN", false, 400, "Las credenciales no coinciden");

    /* TOKEN */
    const auxDocente = resultLogin.docente
    resultLogin = setResult(resultLogin.docente._id, "LOGIN", true, 200, "Inicio de sesión exitoso");
    await Object.assign(resultLogin, { token: jwt.createToken(auxDocente)})

  delete resultLogin.docente;
  disconnect();

  return resultLogin;

}



const updateOneDocente = async (data) => {
    let resultUpdated = initResult("UpdateOne");
    
    const connected = await connectDB();

    if (!connected.value) return connected;

    resultUpdated = await updateDocente(data);


    if (!resultUpdated.value)
        return setResult(data.id.DocenteID, "UpdateOne", false, 500, "No se pudieron actualizar los datos personales")

  /* TOKEN */
  //resultSave.token = jwt.createToken(resultSave.docente);
    //resultUpdate = setResult(resultSave, true, 200, "Datos personales actualizados");

  delete resultUpdated.docente;
  disconnect();
  
  return resultUpdated;
}


const updateDocDocente = async (data) => {
    let resultUpdated = initResult("UpdateOneDoc");
    
    const connected = await connectDB();

    if (!connected.value) return connected;

    resultUpdated = await updateOneDocDocente(data);


    if (!resultUpdated.value)
        return setResult(data.id.DocenteID, "UpdateOne", false, 500, "No se pudieron actualizar los datos personales")

  /* TOKEN */
  //resultSave.token = jwt.createToken(resultSave.docente);
    //resultUpdate = setResult(resultSave, true, 200, "Datos personales actualizados");

  disconnect();
  
  return resultUpdated;
}



const getOneDocente = async (id_docente) => {
    let resultFind = initResult("getDocente")

    const connected = await connectDB();

    if (!connected.value) return connected;
    
    resultFind = await findDocenteById(id_docente, resultFind.action);

    if (!resultFind.value)
        return setResult(id_docente, resultFind.action, false, 400, "El docente no existe");

    const auxDocente = resultFind.docente;
    resultFind = setResult(id_docente, resultFind.action, true, 200, "Docente encontrado");
    await Object.assign(resultFind, { docente: auxDocente})
    
    disconnect();
    
    return resultFind;
}

module.exports = {
    createNewDocente,
    login,
    updateOneDocente,
    updateDocDocente,
    getOneDocente
}



