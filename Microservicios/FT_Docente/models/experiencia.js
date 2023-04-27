"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienciaSchema = Schema({
    puesto: {
        type: String,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
    },
    fecha_ingreso: {
        type: Date,
        required: true
    },
    fecha_egreso: {
        type: Date,
        required: true
    },
    funciones: {
        type: String,
        required: true
    },
    observaciones: {
        type: String,
    },
    id_docente: {	
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Experiencia", experienciaSchema);