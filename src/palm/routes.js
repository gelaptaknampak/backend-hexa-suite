const express = require("express");
const router = express.Router();
const mp30Controller = require("./conts");

// Test connection to the device
router.post("/test", mp30Controller.testDevice);

router.post("/clear", mp30Controller.clearEnrollmentData);

// Start palmprint recognition
router.post("/start", mp30Controller.startPalmPrint);

// Get enrolled palm image
router.post("/getEnrollImg", mp30Controller.getPalmImage);

// Get palm features
router.post("/getEnrollFeat", mp30Controller.getPalmFeatures);

// Save palm data to the database
router.post("/savePalmData", mp30Controller.savePalmData);

// Get device status
router.post("/getState", mp30Controller.getDeviceStatus);

// Register a new user
router.post("/registerUser", mp30Controller.registerUser);  // New route for user registration

// Verify palmprint
router.post("/verifyPalm", mp30Controller.verifyPalm);  // New route for palm verification

// change mode
router.post("/switch", mp30Controller.switchWorkingMode);  
router.get("/getall", mp30Controller.getPalmsData);


module.exports = router;
