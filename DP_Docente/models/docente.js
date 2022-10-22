"use strict"

// imagen. contrasena roles validar datos

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docenteSchema = Schema({
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