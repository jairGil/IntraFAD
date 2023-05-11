//Constante para la validación de datos
const { body, validationResult } = require("express-validator");
const moment = require("moment")

let validateHelper = {};
let validator = {};

validator.validaPDF = async (val) => {
  str = new String(val);
  if (str.includes(".pdf"))
    return true
  return false
}

/*** Validaciones de datos academicos ***/
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
  // await body("doc_grado_acad")
  //   .trim()
  //   .not().isEmpty().withMessage("Elemento vacío")
  //   .custom(val => {
  //     return validator.validaPDF(val)
  //   }).withMessage("Debe ingresar un archivo en formato PDF")
  //   .escape().run(req);

  /*** Validación Institucion emisora ***/
  await body("institucion_emisora")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("La institución emisora debe tener por lo menos 3 letras")
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
  // await body("doc_ced_prof")
  //   .trim()
  //   .not().isEmpty().withMessage("Elemento vacío")
  //   .custom(val => {
  //     return validator.validaPDF(val)
  //   }).withMessage("Debe ingresar un archivo en formato PDF")
  //   .escape().run(req);

  const result = validationResult(req);
  return result;
}


/*** Validaciones de certificaciones ***/
validateHelper.validarCertificacion = async (req) => {

  /*** Validación nombre ***/
  await body("nombre")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la certificación debe tener por lo menos 3 letras")
    .escape().run(req);

  /*** Validación institucion ***/
  await body("institucion")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la institución debe tener por lo menos 3 letras")
    .escape().run(req);

  /*** Validación fecha***/
  await body("fecha")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  /*** Validación constancia ***/
  // await body("doc_constancia")
  //   .trim()
  //   .not().isEmpty().withMessage("Elemento vacío")
  //   .custom(val => {
  //     return validator.validaPDF(val)
  //   }).withMessage("Debe ingresar un archivo en formato PDF")
  //   .escape().run(req);

  const result = validationResult(req);
  return result;
}


/*** Validaciones de cursos ***/
validateHelper.validarCurso = async (req) => {

  /*** Validación tipo ***/
  await body("tipo")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El tipo de certificación debe tener por lo menos 3 letras")
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);

  /*** Validación nombre ***/
  await body("nombre")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la certificación debe tener por lo menos 3 letras")
    .escape().run(req);

  /*** Validación fecha_fin ***/
  await body("fecha_fin")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  /*** Validación institucion ***/
  await body("institucion")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la institución debe tener por lo menos 3 letras")
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);
    
  /*** Validación duracion ***/
  await body("duracion")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    // .isLength({ min: 3 }).withMessage("El nombre de la institución debe tener por lo menos 3 letras")
    // .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);

  /*** Validación constancia ***/
  // await body("doc_constancia")
  //   .trim()
  //   .not().isEmpty().withMessage("Elemento vacío")
  //   .custom(val => {
  //     return validator.validaPDF(val)
  //   }).withMessage("Debe ingresar un archivo en formato PDF")
  //   .escape().run(req);
    
    const result = validationResult(req);
    return result;
  }

/*** Validaciones de idiomas ***/
validateHelper.validarIdioma = async (req) => {

  /*** Validación nombre ***/
  await body("nombre")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la certificación debe tener por lo menos 3 letras")
    .escape().run(req);
    
  /*** Validación nivel ***/
  await body("nivel")   
  .trim()
  .not().isEmpty().withMessage("Elemento vacío")
  .isLength({ min: 2 }).withMessage("El nivel de idioma debe tener por lo menos 2 letras")
  .escape().run(req);

  /*** Validación fecha ***/
  await body("fecha_fin")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  /*** Validación institucion ***/
  await body("institucion")   
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la institución debe tener por lo menos 3 letras")
    .escape().run(req);
    
  /*** Validación constancia ***/
  // await body("doc_certificado")
  //   .trim()
  //   .not().isEmpty().withMessage("Elemento vacío")
  //   .custom(val => {
  //     return validator.validaPDF(val)
  //   }).withMessage("Debe ingresar un archivo en formato PDF")
  //   .escape().run(req);

  const result = validationResult(req);
  return result;
}

/*** Validaciones de publicaciones ***/
validateHelper.validarPublicacion = async (req) => {

  /*** Validación de formato ***/
  await body("formato")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El formato de publicación debe tener por lo menos 3 letras")
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);
    
  
  /*** Validación tipo ***/
  await body("tipo")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El tipo de publicación debe tener por lo menos 3 letras")
    .isAlpha().withMessage("Debe ingresar solo letras")
    .escape().run(req);
  
  /*** Validación autores ***/
  await body("autores")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de los autores debe tener por lo menos 3 letras")
    // .matches(/^[a-zA-Z]+\s[a-zA-Z]+(\s*;\s*[a-zA-Z]+\s[a-zA-Z]+)*/).withMessage("Error en el formato de entrada, debe ser: nombre1 apellido1; nombre2 apellido2; ...")
    .escape().run(req);

  /*** Validación titulo ***/
  await body("titulo")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El titulo de la publicación debe tener por lo menos 3 letras")
    .escape().run(req);

  /*** Validación fecha ***/
  await body("fecha")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  const result = validationResult(req);
  return result;
}

/*** Validaciones de experiencia profesional ***/
validateHelper.validarExperiencia = async (req) => {

  /*** Validación de puesto de contratación ***/
  await body("puesto")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El puesto de contratacion debe tener por lo menos 3 letras")
    .escape().run(req);
    
  
  /*** Validación nombre de la empresa ***/
  await body("empresa")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 3 }).withMessage("El nombre de la empresa debe tener por lo menos 3 letras")
    .escape().run(req);

  /*** Validación fecha_ingreso ***/
  await body("fecha_ingreso")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  /*** Validación fecha_egreso ***/
  await body("fecha_egreso")
    .trim()
    .not().isEmpty().withMessage("Elemento vacío")
    .isLength({ min: 10 }).withMessage("Error de formato de fecha, debe contener mínimo 10 caracteres")
    .custom(val => {
      return moment(val, 'YYYY-MM-DD').isValid();
    }).withMessage("Debe ingresar una fecha válida")
    .escape().run(req);

  /*** Validación funciones ***/
  await body("funciones")
  .trim()
  .not().isEmpty().withMessage("Elemento vacío")
  .isLength({ min: 3 }).withMessage("El nombre de la empresa debe tener por lo menos 3 letras")
  .escape().run(req);

  const result = validationResult(req);
  return result;
}
module.exports = validateHelper;