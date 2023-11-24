const authenticateToken = require('../middleware/auth.middleware.js');

module.exports = app => {
  const order = require("../controllers/order.controller.js");

  const router = require("express").Router();

  router.get("/", order.getAll);
  router.post("/", order.create);
  router.patch("/:id", order.update);
  router.delete("/:id", order.delete);

  app.use("/api/order", authenticateToken, router);
};
