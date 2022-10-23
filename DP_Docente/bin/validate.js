//Constante para la validación de datos
const { body, validationResult } = require("express-validator");
const validateCurp = require('curp');
const validateRfc = require('validate-rfc');

let validateHelper = {};

validateHelper.validarDocente = async (req) => {

    /*** Validación Imagen ***/
    await body("img")
        .trim()
        .not().isEmpty().withMessage("Elemento vacío")
        .custom(val => {
            str = new String(val);
            if (str.includes(".jpg") || str.includes(".jpeg")) {
                return true;
            }
            return false;
        }).withMessage("Los formatos de imagen admitidos son jpg y jpeg")
        .escape().run(req);

    /*** Validación Nombre ***/
    await body("nombre")
        .trim()
        .not().isEmpty().withMessage("Elemento vacío")
        .isLength({ min: 3 }).withMessage("El nombre debe tener por lo menos 3 letras")
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);

    /*** Validación Apellido paterno ***/
    await body("apellido_p")
        .trim()
        .not().isEmpty().withMessage("Elemento vacío")
        .isLength({ min: 3 }).withMessage("El apellido paterno debe tener por lo menos 3 letras")
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);

    /*** Validación apellido materno ***/
    await body("apellido_m")
        .trim()
        .not().isEmpty().withMessage("Elemento vacío")
        .isLength({ min: 3 }).withMessage("El apellido materno debe tener por lo menos 3 letras")
        .isAlpha().withMessage("Debe ingresar solo letras")
        .escape().run(req);

    if (req.body.role === "ADMIN_ROLE" || req.body.role === "ROOT_ROLE" || req.body.role === "USER_ROLE") {
        
        /*** Validación dirección ***/
        await body("direccion")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isLength({ min: 20 }).withMessage("La dirección debe tener por lo menos 20 letras")
            .escape().run(req);

        /*** Validación telefono ***/
        await body("telefono")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isLength({ min: 10 }).withMessage("El número de telefono debe tener 10 digitos")
            .isNumeric().withMessage("El número de telefono debe tener solo números")
            .escape().run(req);

        /*** Validación correo personal ***/
        await body("correo_personal")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isEmail().withMessage("Debe ingresar un correo electrónico")
            .custom(val => {
                str = new String(val)
                if (str.includes("uaemex.mx")) {
                    return false;
                }
                return true;
            }).withMessage("Debe ingresar un correo electrónico que NO pertenezca al dominio 'uaemex.mx'")
            .escape().run(req);

        /*** Validación correo institucional ***/
        await body("correo_institucional")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isEmail().withMessage("Debe ingresar un correo electrónico")
            .custom(val => {
                str = new String(val)
                if (str.includes("uaemex.mx")) {
                    return true;
                }
                return false;
            }).withMessage("Debe ingresar un correo electrónico que pertenezca al dominio 'uaemex.mx'")
            .escape().run(req);

        /*** Validación contrasena ***/
        await body("contrasena")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
            .withMessage("La contraseña debe contener de 8 a 15 caracteres y al menos una letra mayúscula, una letra minúscula, un dígito, un caracter especial y sin espacios")
            .escape().run(req);

        /*** Validación número empleado ***/
        await body("no_empleado")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isLength({ min: 7 }).withMessage("El número de empleado debe tener 7 dígitos")
            .isNumeric().withMessage("El número de empleado debe contener solo números")
            .escape().run(req);

        /*** Validación RFC ***/
        await body("rfc")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isLength({ min: 12, max: 13 }).withMessage("El RFC debe tener 13 letras")
            .custom(val => {
                return validateRfc(val).isValid;
            }).withMessage("Debe ingresar un RFC válido")
            .escape().run(req)

        /*** Validación CURP ***/
        await body("curp")
            .trim()
            .not().isEmpty().withMessage("Elemento vacío")
            .isLength({ min: 18, max: 18 }).withMessage("La clave CURP debe tener 18 letras")
            .custom(val => {
                return validateCurp.validar(val);
            }).withMessage("Debe ingresar una clave CURP válida")
            .escape().run(req)
    }

    const result = validationResult(req);
    return result;
}

module.exports = validateHelper;