"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datoAcademicoSchema = Schema({
    grado_academico: {
        type: String,
        required: true,
        trim: true,
        default: "Licenciatura",
        enum: ["Licenciatura", "Maestria", "Doctorado", "Especialidad", "Diplomado"]
    },
    doc_grado_acad: {
        type: String,
        required: true,
    },
    institucion_emisora: {
        type: String,
        required: true,
        trim: true
    },
    fecha_obtencion: {
        type: Date,
        required: true,
        trim: true
    },
    cedula_profesional: {
        type: Number,
        required: true,
        trim: true
    },
    doc_ced_prof: {
        type: String,
        required: true
    },
    id_docente: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("DatoAcademico", datoAcademicoSchema);