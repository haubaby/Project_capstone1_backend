const adminCheck = require('../middleware/admin.middleware.js');
const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
    const service = require("../controllers/service.controller.js");

    const router = require("express").Router();

    router.get("/", service.getAll);
    router.post("/", adminCheck, service.create);
    router.patch("/:id", adminCheck, service.update);
    router.delete("/:id", adminCheck, service.delete);

    app.use("/api/service", authenticateToken, router);
};
