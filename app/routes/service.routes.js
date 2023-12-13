const adminCheck = require("../middleware/admin.middleware.js");
const authenticateToken = require("../middleware/auth.middleware");

module.exports = (app) => {
  const service = require("../controllers/service.controller.js");

  const router = require("express").Router();

  router.get("/", service.getAll);
  router.get("/service_pack", service.getAllWithCustom);
  router.post("/", adminCheck, service.create);
  router.post("/:id/setting", adminCheck, service.addSettingOption);
  router.patch("/:id", adminCheck, service.update);
  router.delete("/:id", adminCheck, service.delete);
  router.get("/:id", service.findById);
  router.get("/:id/setting", service.getRentersByOption);

  app.use("/api/service", authenticateToken, router);
};
