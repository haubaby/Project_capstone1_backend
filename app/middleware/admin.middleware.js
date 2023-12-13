const { responseData } = require("../constant/responseData");

function adminCheck(req, res, next) {
    console.log(req.user);
    if (req.user.role !== "admin") {
        return res.json(responseData(false, {}, "Bạn không phải admin"))
    }
    next()
}

module.exports = adminCheck;