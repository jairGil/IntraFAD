const initResult = (action) => {
    //Se genera la hora de solicitud
    const today = new Date();
    const now = today.toLocaleString();

    let event = {
        "local": now,
        "id": "system",
        "action": action,
        "value": false,
        "code": 500,
        "msg": "INIT"
    }

    return event;
}


const setResult = (id, action, value, code, msg) => {
    //Se genera la hora de solicitud
    const today = new Date();
    const now = today.toLocaleString();

    let event = {
        "local": now,
        "id": id,
        "action": action,
        "value": value,
        "code": code,
        "msg": msg
    }

    return event;
}

module.exports = { initResult, setResult };