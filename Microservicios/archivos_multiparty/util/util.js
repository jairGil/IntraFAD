"use strict"

const fs = require('fs');

const utility = {
    setResult: (result, value, code, msg) => {
        result.value = value;
        result.code = code;
        result.msg = msg;
        return result;
    },
    init: (result, action) =>{
        result.action = action;
        result.value = false;
        result.code = 500;
        result.msg = "No incializado";
        return result;
    },
    success: (result, msg) => {
        result.value = true;
        result.code = 200;
        result.msg = msg;
        return result;
    },
    error: (result, msg) => {
        result.value = false;
        result.code = 400;
        result.msg = msg;
        return result;
    },
    innerError: (result, err, msg) => {
        result.value = false;
        result.code = 500;
        result.msg = msg;
        result.error = err;
        return result;
    },
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
    }
};

module.exports = utility;