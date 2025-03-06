const express = require("express");
const router = express.Router();
const controllers = require("./loader");
const routes = require("@/src/config/customRoutes");
const { splitPath, isValidMethod } = require("@/utils/helpers");

router.all("*", (req, res, next) => {
  const segments = splitPath(req.path);
  let controllerName = segments[0] || routes.default;
  let methodName = segments[1] || "index";

  if (routes.aliases[controllerName]) {
    [controllerName, methodName] = routes.aliases[controllerName].split("/");
  }

  const controller = controllers[controllerName];

  if (controller && isValidMethod(controller, methodName)) {
    controller[methodName](req, res, next);
  } else {
    res.status(404).json({ error: "Route not found" });
  }
});

module.exports = router;
