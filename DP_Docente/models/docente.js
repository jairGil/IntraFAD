"use strict"

// imagen. contrasena roles validar datos

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docenteSchema = Schema({
    img: {
        type: String,
        required: true
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
        trim: true
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
        trim: true
    },
    correo_institucional: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    contrasena: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        requierd: true,
        default: "BASIC_ROLE",
        enum: ["BASIC_ROLE", "USER_ROLE", "ADMIN_ROLE", "ROOT_ROLE"]
    },
    no_empleado: {
        type: String,
        required: false,
        trim: true
    },
    rfc: {
        type: String,
        required: true,
        trim: true
    },
    curp: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Docente", docenteSchema);