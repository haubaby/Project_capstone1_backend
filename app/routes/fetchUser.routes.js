const authenticateToken = require('../middleware/auth.middleware');

module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  const userRouter = require("express").Router();

  userRouter.get("/fetchUser",authenticateToken,auth.fetchUser)

  app.use("/api",userRouter);
};
