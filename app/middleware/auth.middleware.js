const jwt = require('jsonwebtoken');
const {responseData} = require("../constant/responseData");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Kiểm tra xem yêu cầu có Header 'Authorization' và có dạng 'Bearer <token>' không.

    if (!token) {
        return res.json(responseData(false, {}, 'Token không hợp lệ.'));
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.json(responseData(false, {}, 'Xác thực thất bại.'));
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;