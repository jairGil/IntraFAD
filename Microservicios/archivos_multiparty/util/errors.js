"use strict"

var Errors = {
    GlobalError: -1,
    setGlobalError: (error) => {
        Errors.GlobalError = error;
    },
    getGlobalError: () => {
        return Errors.GlobalError;
    }
};


module.exports = Errors;