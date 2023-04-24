"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planEstudioSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "Licenciatura en Arquitectura",
            "Licenciatura en Diseño Gráfico",
            "Licenciatura en Diseño Industrial",
            "Licenciatura en Administración y Promoción de la Obra Urbana",
            "Especialidad en Accesibilidad Universal en la Arquitectura y la Ciudad",
            "Especialidad en Valuación de Bienes Inmuebles",
            "Maestría en Diseño",
            "Maestria en Estudios Sustentables",
            "Doctorado en Diseño",
            "Diplomado Superior de Fotografía Profesional",
        ]
    },
    clave: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "ARQ",
            "LDG",
            "LDI",
            "APOU",
            "EAUAC",
            "EVBI",
            "MD",
            "MES",
            "DD",
            "DSFP",
        ]
    },
});

module.exports = mongoose.model("PlanEstudio", planEstudioSchema);