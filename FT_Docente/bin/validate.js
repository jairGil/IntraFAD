//Constante para la validación de datos
const { body, validationResult } = require("express-validator");
const moment = require("moment")

let validateHelper = {};

validateHelper.validarDatoAcademico = async (req) => {

  /*** Validación grado academico ***/
  await body("grado_academico")
    //Eliminar los espacios vacíos al principio y final de la cadena    
    .trim()
    //No debe estar vacío
    .not().isEmpty().withMessage("Elemento vacío")
    //Longitud mínima de 3 caractéres
    .isLength({ min: 3 }).withMessage("El grado academico debe tener por lo menos 3 letras")
    //Debe tener solo letras
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);

  /*** Validación Documento de grado academico ***/
  await body("doc_grado_acad")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .custom(val => {
      str = new String(val);
      if (str.includes(".pdf"))
        return true
      return false
    }).withMessage("Debe ingresar un archivo en formato PDF")
    .escape().run(req);

  /*** Validación Institucion emisora ***/
  await body("institucion_emisora")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("La institución emisora debe tener por lo menos 3 letras")
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);

  /*** Validación fecha de obtención ***/
  await body("fecha_obtencion")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Erro de formato, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha")
    .escape().run(req);

  /*** Validación cédula profesional ***/
  await body("cedula_profesional")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isNumeric({ min: 7, max: 8 }).withMessage("La cédula profesional debe tener por lo menos 7 numeros")
    .escape().run(req);

  /*** Validación Documento de cedula profesional ***/
  await body("doc_ced_prof")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .custom(val => {
      str = new String(val);
      if (str.includes(".pdf"))
        return true
      return false
    }).withMessage("Debe ingresar un archivo en formato PDF")
    .escape().run(req);

  const result = validationResult(req);
  return result;
}


module.exports = validateHelper;