const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
    const renter = require("../controllers/renter.controller.js");

    const router = require("express").Router();

    router.get("/", renter.getAll);
    router.post("/", renter.create);
    router.patch("/:id", renter.update);
    router.delete("/:id", renter.delete);
    router.get("/:id", renter.findById);

    app.use("/api/renter", authenticateToken, router);
};
