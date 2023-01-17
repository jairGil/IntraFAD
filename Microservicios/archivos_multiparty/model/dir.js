"use strict"

const fs = require('fs');

const tipos = new Map();
tipos.set("rfc", "RFC");
tipos.set("curp", "CURP");
tipos.set("gradoAcad", "Grado Académico");
tipos.set("cedulaProf", "Cedula Profesional");
tipos.set("certificacion", "Certificaciones");
tipos.set("cursos", "Cursos");
tipos.set("dominio", "Dominio de Idiomas");
tipos.set("conocimientosEspec", "Conocimientos Específicos");
tipos.set("experiencia", "Experiencia Profesional no Docente");

const campos = new Map();
campos.set("rfc", "doc_rfc");
campos.set("curp", "doc_rfc");
campos.set("gradoAcad", "doc_grado_acad");
campos.set("cedulaProf", "doc_ced_prof");
campos.set("certificacion", "constancia");
campos.set("cursos", "constancia");


const dir = {
    createDir: (path, id, tipo) => {
        path += id + '/';
        //Crear directorio del docente en caso de no existir
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        
        path += tipo + '/';
        //Crear directorio del tipo de documento en caso de no existir
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    },
    getTipoArchivo: (tipo) => {
        return tipos.get(tipo);
    }
};

module.exports = dir;