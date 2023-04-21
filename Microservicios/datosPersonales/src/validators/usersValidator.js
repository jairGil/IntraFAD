const { body } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper')

let validate = {}

 validate.CreateDocente = async (req, res, next) => {

  await body('correo_institucional')
    .exists()  
    .trim()
    .not().isEmpty().withMessage("Debe ingresar el correo electrónico")
    .matches('^[a-zA-Z0-9]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(uaemex|profesor\.uaemex)\.mx$').withMessage("El correo electrónico debe ser del dominio @uaemex o @profesor.uaemex.mx")
    .escape()
    .run(req);

  await body('contrasena')
    .exists()
    .not().isEmpty().withMessage("Debe ingresar la contraseña")
    .escape()
    .trim()
    .run(req);

  await body('confirma_contrasena')
  .exists()
  .not().isEmpty().withMessage("Debe confirmar la contraseña")
  .escape()
  .trim()
  .run(req);

  validateResult(req, res, next)
}


module.exports = validate;