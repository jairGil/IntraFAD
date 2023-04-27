"use strict"

// imagen. contrasena roles validar datos

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cfg = require("../bin/config");
const planEstudio = require("./planEstudio");

// const docenteSchema = Schema({
//     img: {
//         type: String,
//         required: true,
//         //default: cfg.routes.files.replaceAll("/", "-")
//         default: "/data/default.jpg".replaceAll("/", "-")
//     },
//     nombre: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "No ingresado"
//     },
//     apellido_p: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "No ingresado"
//     },
//     apellido_m: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "No ingresado"
//     },
//     direccion: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "No ingresado"
//     },
//     telefono: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "0000000000"
//     },
//     correo_personal: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "no_inicializado@mail.com"
//     },
//     correo_institucional: {
//         type: String,
//         required: false,
//         default: "",
//         trim: true,
//         default: "no_inicializado@uaemex.com"
//     },
//     contrasena: {
//         type: String,
//         required: true,
//         trim: true,
//         default: "No_inicializado"
//     },
//     rol: {
//         type: String,
//         requierd: true,
//         default: "BASIC_ROLE",
//         enum: ["BASIC_ROLE", "USER_ROLE", "ADMIN_ROLE", "ROOT_ROLE"]
//     },
//     no_empleado: {
//         type: String,
//         trim: true,
//         default: "0000000"
//     },
//     rfc: {
//         type: String,
//         requierd: true,
//         trim: true,
//         default: "ABCD123456789"
//     },
//     doc_rfc: {
//         type: String,
//         requierd: true,
//         trim: true,
//         default: "no_inicializado.pdf"
//     },
//     curp: {
//         type: String,
//         requierd: true,
//         trim: true,
//         default: "ABCD123456EFGHIJK0"
//     },
//     doc_curp: {
//         type: String,
//         requierd: true,
//         trim: true,
//         default: "no_inicializado.pdf"
//     },
//     ldg: {
//         type: Boolean,
//         default: false
//     },
//     ldi: {
//         type: Boolean,
//         default: false
//     },
//     arq: {
//         type: Boolean,
//         default: false
//     },
//     apou: {
//         type: Boolean,
//         default: false
//     },
//     fechaRegistro: {
//         type: Date,
//         default: "07/12/1990"
//     },
//     tipoContrato: {
//         type: String,
//         trim: true,
//         enum: [ "Profesor de asignatura",
//                 "Profesor tiempo completo",
//                 "Profesor medio tiempo",
//                 "Técnico académico de tiempo completo",
//                 "Técnico académico de medio tiempo",
//                 "Administrativo de confianza",
//                 "Administrativo sindicalizado",
//             ],
//         default: "Profesor de asignatura"
//     },
//     contratoDefinitivo: {
//         type: Boolean,
//         default: false
//     }
// });

const docenteSchema = Schema({
    img: {
        type: String,
        required: true,
        default: cfg.routes.files.replaceAll("/", "-") + "default.jpg"
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        default: "No ingresado"
    },
    apellido_p: {
        type: String,
        required: true,
        trim: true,
        default: "No ingresado"
    },
    apellido_m: {
        type: String,
        required: true,
        trim: true,
        default: "No ingresado"
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        default: "No ingresado"
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        default: "0000000000"
    },
    correo_personal: {
        type: String,
        required: true,
        trim: true,
        default: "no_inicializado@mail.com"
    },
    correo_institucional: {
        type: String,
        required: false,
        default: "",
        trim: true,
        default: "no_inicializado@uaemex.com"
    },
    contrasena: {
        type: String,
        required: true,
        trim: true,
        default: "No_inicializado"
    },
    rol: {
        type: String,
        requiered: true,
        default: "BASIC_ROLE",
        enum: ["BASIC_ROLE", "USER_ROLE", "ADMIN_ROLE", "ROOT_ROLE"]
    },
    no_empleado: {
        type: String,
        trim: true,
        default: "0000000"
    },
    rfc: {
        type: String,
        requiered: true,
        trim: true,
        default: "ABCD123456789"
    },
    doc_rfc: {
        type: String,
        requiered: false,
        trim: true,
        default: "no_inicializado.pdf"
    },
    curp: {
        type: String,
        requiered: false,
        trim: true,
        default: "ABCD123456EFGHIJK0"
    },
    doc_curp: {
        type: String,
        requiered: true,
        trim: true,
        default: "no_inicializado.pdf"
    },
    planes_estudio: {
        type: [],
        default: []
    },
    fechaRegistro: {
        type: Date,
        default: "07/12/1990"
    },
    tipoContrato: {
        type: String,
        trim: true,
        enum: [ 
            "Profesor de asignatura",
            "Profesor tiempo completo",
            "Profesor medio tiempo",
            "Técnico académico de tiempo completo",
            "Técnico académico de medio tiempo",
            "Administrativo de confianza",
            "Administrativo sindicalizado",
            ],
        default: ""
    },
    contratoDefinitivo: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Docente", docenteSchema);