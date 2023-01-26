"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const idiomaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    nivel: {
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
    constancia: {
        type: String,
        required: true
    },
    id_docente: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Idioma", idiomaSchema);