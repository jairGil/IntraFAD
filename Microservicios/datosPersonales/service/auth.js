"use strict"
const jwt = require("jsonwebtoken");

const secret = "AdminFAD";

let authService = {};

/* ***** VERIFICAR TOKEN ***** */
authService.verify = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        const bearerToken = bearerHeader.split(' ');
        const token = bearerToken[1];

        try{
            //si el token es válido devuelve la imagen
            let decoded = jwt.verify(token, secret);
            req._id = decoded.id;

            next();
        }catch(e){
            let error = {}
            util.error(error, e);
            console.log(error);
            res.status(error.code).send(error);
        }        
    }else{
        let error = {}
        util.error(error, "Token inválido");
        console.log(error);
        res.status(error.code).send(error);
    }
}

authService.createToken = (docente) =>{
    let payload = {
        id: docente._id,
        img: docente.img,
        nombre: docente.nombre,
        apellido_p: docente.apellido_p,
        apellido_m: docente.apellido_m,
        direccion: docente.direccion,
        telefono: docente.telefono,
        correo_personal: docente.correo_personal,
        correo_institucional: docente.correo_institucional,
        no_empleado: docente.no_empleado,
        rfc: docente.rfc,
        curp: docente.curp,
        doc_rfc: docente.doc_rfc,
        doc_curp: docente.doc_curp,
        ldg: docente.ldg,
        ldi: docente.ldi,
        arq: docente.arq,
        apou: docente.apou,
    }
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}


module.exports = authService;