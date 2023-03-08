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
        _id: docente._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}


module.exports = authService;