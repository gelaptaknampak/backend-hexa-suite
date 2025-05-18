const { Router } = require("express");
const cont = require("./cont");
const verifyToken = require("../../verifyToken");  // Middleware untuk memverifikasi token

const router = Router();

// Gunakan verifyToken middleware jika perlu verifikasi
router.use(verifyToken);

// Route untuk menerima data aktivitas
router.post("/activity", cont.postActivity);

router.get("/activity/:idk", cont.getActivity);

module.exports = router;
