const jwt = require("jsonwebtoken");

const createJWT = async (myId = '', nombreUsuario = '', rol = '') => {

    const payload = { myId, nombreUsuario, rol };

    return new Promise((resolve, reject) => {
        let secretKey;

        if (rol === 'ADMIN-USER') {
            secretKey = process.env.ADMIN_KEY;
        }

        if (rol === 'CLIENT-USER') {
            secretKey = process.env.CLIENT_KEY;
        }
        jwt.sign(payload,
            secretKey,
            { expiresIn: '72h' },

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