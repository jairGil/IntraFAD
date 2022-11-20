"use strict"

const util = {
    setResult: async (result, value, code, msg) => {
        result.value = value;
        result.code = code;
        result.msg = msg;
        return result;
    },
    setResultFind: async (result, value, code, msg, docente) => {
        result.value = value;
        result.code = code;
        result.msg = msg;
        result.docente = docente;
        return result;
    }
};

module.exports = util;