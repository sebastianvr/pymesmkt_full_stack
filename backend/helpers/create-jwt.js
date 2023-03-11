const jwt = require("jsonwebtoken");

const createJWT = async (myId = '', nombreUsuario = '') => {

    const payload = { myId, nombreUsuario };

    return new Promise((resolve, reject) => {

        jwt.sign(payload,
            process.env.SECRETORPRIVATEKEY,
            { expiresIn: '24h' },

            (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(token);
                }
            });
    });
}

module.exports = {
    createJWT
};