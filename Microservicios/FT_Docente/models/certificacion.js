"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificacionSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    doc_constancia: {
        type: String,
    },
    id_docente: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Certificacion", certificacionSchema);