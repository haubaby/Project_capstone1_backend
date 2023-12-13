const adminCheck = require("../middleware/admin.middleware.js");
const authenticateToken = require("../middleware/auth.middleware.js");

module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  const router = require("express").Router();

  router.get("/",adminCheck, user.getAll);
  router.patch("/me", user.updateSelfProfile);
  router.patch("/:id",adminCheck, user.update);
  router.delete("/:id", user.delete);
  router.patch("/inviteAdmin/:id",adminCheck, user.inviteAdmin);

  app.use("/api/user", authenticateToken,  router);
};
