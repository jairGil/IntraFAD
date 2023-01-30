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
    fecha_fin: {
        type: Date,
        required: true
    },
    certificado: {
        type: String,
        required: true
    },
    id_docente: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Idioma", idiomaSchema);