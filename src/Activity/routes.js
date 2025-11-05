// src/Activity/routes.js
const express = require("express");
const controller = require("./cont");

const router = express.Router();

router.post("/test", controller.testDevice);
router.post("/start", controller.startPalm);
router.post("/state", controller.getPalmState);
router.post("/feature", controller.getPalmFeature);
router.post("/image", controller.getPalmImage);
router.get("/templates", controller.listPalmTemplates);
router.get("/images", controller.listPalmImages);

module.exports = router;
