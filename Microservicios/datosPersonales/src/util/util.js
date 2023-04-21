"use strict"

const bcrypt = require("bcrypt");

const util = {}

util.setResult = async (result, value, code, msg) => {
    result.value = value;
    result.code = code;
    result.msg = msg;
    return result;
}

util.encriptaContrasena = async (contrasena) => {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(contrasena, saltRounds, (error, hash) => {
            if (error) {
                resolve(null);
                return util.setResult(resultSave, false, 500, error + " - Error al encriptar la contraseña");
            } else
                resolve(hash);
        });
    });
}

util.comparaContrasenas = async (contrasena1, contrasena2) => {
    return await bcrypt.compare(contrasena1, contrasena2);
}


module.exports = util;