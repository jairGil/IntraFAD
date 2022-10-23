//Constante para la validación de datos
const { body, validationResult} = require("express-validator");

let validateHelper = {};

validateHelper.validarDatoAcademico =  async (req) => {

    /*** Validación grado academico ***/
    await body("grado_academico")
        //Eliminar los espacios vacíos al principio y final de la cadena    
        .trim() 
        //No debe estar vacío
        .not().isEmpty().withMessage("Elemento vacío") 
        //Longitud mínima de 3 caractéres
        .isLength({min: 3}).withMessage("Debe tener por lo menos 3 letras") 
        //Debe tener solo letras
        .isAlpha().withMessage("Debe ingresar solo letras") 
        .escape().run(req);

    /*** Validación Institucion emisora ***/
    await body("institucion_emisora")
        .trim() 
        .isLength({min: 3}).withMessage("Debe tener por lo menos 3 letras") 
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);

    /*** Validación fecha de obtención ***/
    await body("fecha_obtencion")
        .trim() 
        .isLength({min: 10}).withMessage("Debe tener por lo menos 8 letras") 
        .escape().run(req);
    
    /*** Validación cédula profesional ***/
    await body("cedula_profesional")
    .trim() 
    .isNumeric({min: 7, max: 8}).withMessage("Debe tener por lo menos 7 numeros")
    .escape().run(req);

    const result = validationResult(req);
    return result;
}


module.exports = validateHelper;

