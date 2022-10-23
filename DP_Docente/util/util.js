"use strict"

const util = {
    setResult: async (result, value, code, msg) => {
        result.value = value;
        result.code = code;
        result.msg = msg;
        return result;
    }
};

module.exports = util;