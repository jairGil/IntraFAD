const jwt = require("jsonwebtoken");
const util = require("../util/util");

let authService = {};

authService.verify = (req, res, next) => {
    /* VALIDAR TOKEN */
console.log("aqui estoy")

    const bearerHeader = req.headers['authorization'];

    //console.log("beareheader" + bearerHeader)
    const secret = "AdminFAD";

    if(bearerHeader){
        const bearerToken = bearerHeader.split(' ');
        const token = bearerToken[1].replaceAll("'", "").replaceAll('"', "");
        //console.log("bearerHeader " + bearerHeader)
        try{
            //si el token es válido devuelve la imagen
            let decoded = jwt.verify(token, secret);
            req._id = decoded._id;
            console.log("SI entra")
            next();
        }catch(e){
            console.log("SI entra pero esta mal")
            let error = {}
            util.error(error, e);
            console.log("error: " + JSON.stringify(error));
            res.status(error.code).send(error);
        }        
    }else{
        console.log("No entra")
        let error = {}
        util.error(error, "Token inválido");
        console.log(JSON.stringify(error));
        res.status(error.code).send(error);
    }
}

module.exports = authService;