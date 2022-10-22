//Constante para la validación de datos
const { body, validationResult} = require("express-validator");

let validateHelper = {};

validateHelper.validarDocente =  async (req) => {

    /*** Validación Nombre   ***/
    await body("nombre")
        //Eliminar los espacios vacíos al principio y final de la cadena    
        .trim() 
        //No debe estar vacío
        .not().isEmpty().withMessage("Elemento vacío") 
        //Longitud mínima de 3 caractéres
        .isLength({min: 3}).withMessage("Debe tener por lo menos 3 letras") 
        //Debe tener solo letras
        .isAlpha().withMessage("Debe ingresar solo letras") 
        .escape().run(req);

    /*** Validación Apellido paterno ***/
    await body("apellido_p")
        .trim() 
        .isLength({min: 3}).withMessage("Debe tener por lo menos 3 letras") 
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);

    /*** Validación apellido materno ***/
    await body("apellido_m")
        .trim() 
        .isLength({min: 3}).withMessage("Debe tener por lo menos 3 letras") 
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);
    
    /*** Validación dirección ***/
    await body("direccion")
    .trim() 
    .isLength({min: 20}).withMessage("Debe tener por lo menos 20 letras")
    .escape().run(req);

    /*** Validación telefono ***/
    await body("telefono")
    .trim() 
    .isLength({min: 10}).withMessage("Debe tener 10 digitos")
    .isNumeric()
    .escape().run(req);
    
    /*** Validación correo personal ***/
    await body("correo_personal")
    .trim() 
    .isEmail()
    .escape().run(req);

    /*** Validación correo institucional ***/
    await body("correo_institucional")
    .trim() 
    .isEmail()
    .escape().run(req);

    /*** Validación número empleado ***/
    await body("no_empleado")
    .trim() 
    .isLength({min: 7}).withMessage("Debe tener 7 digitos")
    .isNumeric()
    .escape().run(req);

    /*** Validación RFC ***/
    await body("rfc")
    .trim() 
    .isLength({min: 13}).withMessage("Debe tener por lo menos 13 letras")
    .escape().run(req)

    /*** Validación CURP ***/
    await body("curp")
    .trim() 
    .isLength({min: 18}).withMessage("Debe tener por lo menos 18 letras")
    .escape().run(req)

    const result = validationResult(req);
    return result;
}


module.exports = validateHelper;

