"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursoSchema = Schema({
    tipo: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    fecha_fin: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    doc_constancia: {
        type: String,
        required: true
    },
    id_docente: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Curso", cursoSchema);