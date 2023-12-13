const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  const router = require("express").Router();

  // Create a new Tutorial
  router.post("/sign-up", auth.signup);
  router.post("/sign-in", auth.signIn);
  router.post("/logout", auth.logout);
  router.post("/change-password",authenticateToken, auth.changePassword);

  app.use("/api/auth", router);
};
