const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
    const service = require("../controllers/service.controller.js");

    const router = require("express").Router();

    router.get("/", service.getAll);
    router.post("/", service.create);
    router.patch("/:id", service.update);
    router.delete("/:id", service.delete);

    app.use("/api/service", authenticateToken, router);
};
