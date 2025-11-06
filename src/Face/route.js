// routes/deviceFacePalmRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("./cont");

// Semua method: POST (sesuai dokumen pakai POST ke device)
router.post("/device/check-connection", controller.checkDeviceConnection);
router.post("/face/register", controller.registerFace);
router.post("/palm/register", controller.registerPalm);

module.exports = router;
