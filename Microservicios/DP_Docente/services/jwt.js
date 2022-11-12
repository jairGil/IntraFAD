"use strict"
const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "AdminFAD";

exports.createToken = (docente) => {
    let payload = {
        sub: docente._id,
        nombre: docente.nombre,
        apellido_p: docente.apellido_p,
        apellido_m: docente.apellido_m,
        no_empleado: docente.no_empleado,
        rfc: docente.rfc,
        curp: docente.curp,
        ait: moment().unix(),
        exp: moment().add(1, "days").unix()
    }

    return jwt.encode(payload, secret);
};