
const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next(); // Si llega a este punto, continua con el sigte middleware
}

module.exports = {
    validarCampos
}