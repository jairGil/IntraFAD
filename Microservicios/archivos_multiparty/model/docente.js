"use strict"

// imagen. contrasena roles validar datos

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docenteSchema = Schema({
    img: {
        type: String,
        required: true,
        default: "D:-Documentos-SevicioSocial-Proyectos-Microservicios-archivos_multiparty-controller-uploads-default.jpg"
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido_p: {
        type: String,
        required: true,
        trim: true
    },
    apellido_m: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        default: "no_inicializado"
    },
    telefono: {
        type: String,
        required: true,
        default: "0000000000",
        trim: true
    },
    correo_personal: {
        type: String,
        required: true,
        trim: true,
        default: "no_inicializado@mail.com"
    },
    correo_institucional: {
        type: String,
        required: false,
        default: "",
        trim: true,
        default: "no_inicializado@uaemex.com"
    },
    contrasena: {
        type: String,
        required: true,
        trim: true,
        default: "No_inicializado"
    },
    rol: {
        type: String,
        requierd: true,
        default: "BASIC_ROLE",
        enum: ["BASIC_ROLE", "USER_ROLE", "ADMIN_ROLE", "ROOT_ROLE"]
    },
    no_empleado: {
        type: String,
        trim: true,
        default: "0000000"
    },
    rfc: {
        type: String,
        trim: true,
        default: ""
    },
    doc_rfc: {
        type: String,
        trim: true,
        default: "no_inicializado.pdf"
    },
    curp: {
        type: String,
        trim: true,
        default: ""
    },
    doc_curp: {
        type: String,
        trim: true,
        default: "no_inicializado.pdf"
    },
});

module.exports = mongoose.model("Docente", docenteSchema);