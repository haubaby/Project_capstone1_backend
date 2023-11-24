const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
  const event = require("../controllers/event.controller.js");

  const router = require("express").Router();

  router.get("/", event.getAll);
  router.get("/:id", event.findById);
  router.post("/", event.create);

  app.use("/api/event",authenticateToken, router);
};
