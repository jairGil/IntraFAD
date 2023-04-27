"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicacionSchema = Schema({
    formato: {
        type: String,
        required: true,
        enum: ["Digital", "Impreso"],
        default: "Digital"
    },
    tipo: {
        type: String,
        required: true,
        enum: ["Publicación", "Artículo"],
        default: "Publicación"
    },
    autores: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    editorial: {
        type: String,
    },
    doi_url: {
        type: String,
    },
    id_docente: {	
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Publicacion", publicacionSchema);