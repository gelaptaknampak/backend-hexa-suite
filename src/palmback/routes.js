// routes/mp30Routes.js
const express = require("express");
const router = express.Router();
const deviceController = require("./conts");

// Semua method: POST (sesuai dokumen)
router.post("/access/deviceApi/MV930/getCurrentTimeMillis", deviceController.getCurrentTimeMillis);
router.post("/access/deviceApi/MV930/addWaitAddDevice", deviceController.addWaitAddDevice);
router.post("/access/deviceApi/MV930/uploadDeviceInfo", deviceController.uploadDeviceInfo);
router.post("/access/deviceApi/MV930/updateDeviceConfig", deviceController.updateDeviceConfig);
router.post("/access/deviceApi/MV930/uploadAccessInfo", deviceController.uploadAccessInfo);
router.post("/access/deviceApi/MV930/getLatestVersion", deviceController.getLatestVersion);
router.post("/access/deviceApi/MV930/getWorkflowUsers", deviceController.getWorkflowUsers);
router.post("/access/deviceApi/MV930/updateWorkflowUsers", deviceController.updateWorkflowUsers);

module.exports = router;
