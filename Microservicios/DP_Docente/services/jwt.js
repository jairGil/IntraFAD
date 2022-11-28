"use strict"
const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "AdminFAD";

exports.createToken = (docente) => {
    let payload = {
        id: docente._id,
        img: docente.img,
        nombre: docente.nombre,
        apellido_p: docente.apellido_p,
        apellido_m: docente.apellido_m,
        direccion: docente.direccion,
        telefono: docente.telefono,
        correo_personal: docente.correo_personal,
        correo_institucional: docente.correo_institucional,
        no_empleado: docente.no_empleado,
        rfc: docente.rfc,
        curp: docente.curp,
        doc_rfc: docente.doc_rfc,
        doc_curp: docente.doc_curp,
        ait: moment().unix(),
        exp: moment().add(1, "days").unix()
    }

    return jwt.encode(payload, secret);
};