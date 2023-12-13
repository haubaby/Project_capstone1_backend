const adminCheck = require('../middleware/admin.middleware.js');
const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
    const renter = require("../controllers/renter.controller.js");

    const router = require("express").Router();

    router.get("/", renter.getAll);
    router.post("/",adminCheck, renter.create);
    router.patch("/:id",adminCheck, renter.update);
    router.delete("/:id",adminCheck, renter.delete);
    router.get("/:id", renter.findById);

    app.use("/api/renter", authenticateToken, router);
};
