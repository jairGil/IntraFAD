const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
    try{
        let result = validationResult(req);
        if(result.errors.length > 0){
            console.log(result)
            throw(result)
        }
        return next();
    }catch(err){
        res.status(400);
        res.send(err.errors)
    }
}

module.exports = { validateResult }