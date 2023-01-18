"use strict"

const fs = require('fs');

const tipos = new Map();
tipos.set("rfc", "RFC");
tipos.set("curp", "CURP");
tipos.set("gradoAcad", "GradoAcadémico");
tipos.set("cedulaProf", "CedulaProfesional");
tipos.set("certificacion", "Certificaciones");
tipos.set("cursos", "Cursos");
tipos.set("dominio", "DominioDeIdiomas");
tipos.set("conocimientosEspec", "ConocimientosEspecíficos");
tipos.set("experiencia", "ExperienciaProfesionalNoDocente");


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