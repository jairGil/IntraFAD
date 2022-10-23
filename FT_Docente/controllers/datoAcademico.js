"use strict"

// const bcrypt = require("bcrypt");
const dbhelper = require("../bin/db");
const util = require("../util/util")
// const jwt = require("../services/jwt");


let datoAcademicoController = {};

//Agregar un nuevo usuario
datoAcademicoController.add = async (req, res) => {
    const connected = await dbhelper.connect();
    console.log(connected);

    let resultSave = { action: "signin", value: false, code: 500, msg: "Error al conectar con la base de datos" }
    if (connected.value) {
        let datoAcademico = {};
        const params = req.body;

        //Verificar que el correo electónico no está en uso
        let resultFind = await dbhelper.findDatoAcademicoByCP(params.cedula_profesional, "signin");
        if (resultFind.value) {
            // resultSave.value = false;
            // resultSave.code = 400;
            // resultSave.msg = "La cédula profesional ya está registrada";
            resultSave = await util.setResult(resultSave, false, 400, "La cédula profesional ya está registrada");
        } else {
            datoAcademico.grado_academico = params.grado_academico;
            datoAcademico.doc_grad_acad = params.doc_grad_acad;
            datoAcademico.institucion_emisora = params.institucion_emisora;
            datoAcademico.fecha_obtencion = params.fecha_obtencion;
            datoAcademico.cedula_profesional = params.cedula_profesional;
            datoAcademico.doc_ced_prof = params.doc_ced_prof;
            datoAcademico.id_docente = params.id_docente;

            resultSave = await dbhelper.saveDatoAcademico(datoAcademico);
        }
        dbhelper.disconnect();
    }
    console.log(resultSave);
    return resultSave;
}

// docenteController.login = async (req, res) => {
//     const connected = await dbhelper.connect();
//     console.log(connected);

//     let resultFind = {action: "login", value: false, code: 500, msg: "No inicializado"};
//     if(connected.value){
//         const params = req.body;
//         resultFind = await dbhelper.findDocenteByEmail(params.correo_personal, "login");
//         if(resultFind.value){
//             const compare = await bcrypt.compare(params.pass, resultFind.user.pass);
//             resultFind.value = compare;
//             if(compare){
//                 // resultFind.value = true;
//                 // resultFind.code = 200;
//                 // resultFind.msg = "Login éxitoso";
//                 resultFind = util.setResult(resultFind, true, 200, "Login exitoso")
//                 /* TOKEN */
//                 resultFind.token = jwt.createToken(resultFind.user);
//             }else{
//                 // resultFind.value = false;
//                 // resultFind.code = 400;
//                 // resultFind.msg = "Las contraseñas no coinciden";
//                 resultFind = util.setResult(resultFind, false, 400, "Las contraseñas no coinciden")
//             }
//             delete resultFind.user;
//         }else{
//             // resultFind.value = false;
//             // resultFind.code = 400;
//             // resultFind.msg = "El usuario no está registrado";
//             resultFind = util.setResult(resultFind, false, 400, "El usuario no está registrado")
//         }
//         dbhelper.disconnect();
//     }else{
//         // resultFind.value = false;
//         // resultFind.code = 500;
//         // resultFind.msg = "Error al conectar con la base de datos";
//         resultFind = util.setResult(resultFind, false, 500, "Error al conectar con la base de datos")
//     }

//     console.log(resultFind);
//     return resultFind;
// }

module.exports = datoAcademicoController;