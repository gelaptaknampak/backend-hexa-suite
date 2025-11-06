// controllers/mp30Controller.js
const axios = require("axios");
const pool = require("../../db"); // <= pakai pg Pool

// Device Host (recorder-mode HTTP server)
const HOST = "http://192.168.31.5:12305";

// Helper HTTP ke device
const requestDevice = async (url, method = "POST", data = {}) => {
  try {
    const response = await axios({ method, url: `${HOST}${url}`, data });
    console.log(`Request to ${url} successful. Response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`Error communicating with MP30 device at ${url}: ${error.message}`);
    throw new Error(`Error communicating with MP30 device: ${error.message}`);
  }
};

// ---------------- Controller Methods ----------------

const testDevice = async (req, res) => {
  try {
    const result = await requestDevice("/test");
    res.status(200).json({ message: "Device test successful", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearEnrollmentData = async (req, res) => {
  try {
    console.log("Clearing previous enrollment data...");
    const result = await requestDevice("/palm/clear", "POST");
    res.status(200).json({
      message: "Previous enrollment data cleared successfully",
      result,
    });
  } catch (error) {
    console.error(`Error clearing enrollment data: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const startPalmPrint = async (req, res) => {
  try {
    console.log("Clearing previous enrollment data...");
    await requestDevice("/palm/clear");

    console.log("Starting palmprint recognition...");
    const result = await requestDevice("/palm/start", "POST");

    res.status(200).json({ message: "Palm print recognition started", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPalmImage = async (req, res) => {
  try {
    const { img_index } = req.body;
    console.log(`Getting enrolled palm image at index: ${img_index}`);
    const result = await requestDevice("/palm/getEnrollImg", "POST", { img_index });
    res.status(200).json({ image: result.image });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPalmFeatures = async (req, res) => {
  try {
    console.log("Getting palm print features...");
    const result = await requestDevice("/palm/getEnrollFeat");
    res.status(200).json({ palmprint: result.palmprint, palmvein: result.palmvein });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility kecil: pastiin JSONB valid (kalau string, bungkus dengan JSON.stringify)
const toJsonbParam = (val) => {
  if (val === null || val === undefined) return JSON.stringify(null);
  if (typeof val === "string") return JSON.stringify(val); // jadi JSON string valid
  try { return JSON.stringify(val); } catch { return JSON.stringify(String(val)); }
};

// Simpan data “statis” ke DB (ganti users[] jadul)
const savePalmData = async ({ name, palmprint, palmvein }) => {
  // name kita simpan sebagai userId saja, biar simpel
  const userId = String(name || "").trim();
  if (!userId) throw new Error("Invalid user name");

  // Cek duplikat sederhana berdasarkan userId + status aktif (opsional)
  const checkSql = `SELECT 1 FROM palms WHERE "userId" = $1 LIMIT 1`;
  const exists = await pool.query(checkSql, [userId]);
  if (exists.rowCount > 0) {
    throw new Error("User already exists");
  }

  const now = new Date();
  const insertSql = `
    INSERT INTO palms
      ("userid","idpengguna","cardId","palmprint1","palmvein1","palmprint2","palmvein2","updatetime","status","createdAt","updatedAt")
    VALUES
      ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8, $9, $10, $11)
    RETURNING id
  `;
  const params = [
    userId,
    null,                           // idpengguna
    Date.now().toString(),          // BIGINT aman dikirim sebagai string
    toJsonbParam(palmprint),
    toJsonbParam(palmvein),
    toJsonbParam(palmprint),
    toJsonbParam(palmvein),
    now,                            // updateTime
    '101',                          // default status
    now,                            // createdAt
    now,                            // updatedAt
  ];

  const { rows } = await pool.query(insertSql, params);
  return { id: rows[0].id, userId };
};

const getDeviceStatus = async (req, res) => {
  try {
    console.log("Getting device status...");
    const result = await requestDevice("/palm/getState");
    if (result.status === 100) {
      res.status(200).json({ message: "Device is running", status: result.status });
    } else {
      res.status(200).json({ message: "Device is stopped", status: result.status });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const switchWorkingMode = async (req, res) => {
  const { mode } = req.body || {};
  if (typeof mode !== "number" || ![0, 3, 4, 5].includes(mode)) {
    return res.status(400).json({ code: 400, message: "Invalid mode value" });
  }

  try {
    const url = `${HOST}/manage/setWorkingMode`;
    console.log(`[switchWorkingMode] Sending to ${url} | mode: ${mode}`);

    const response = await axios.post(
      url,
      { mode },
      { headers: { "Content-Type": "application/json" }, timeout: 5000 }
    );

    const { code, message } = response.data || {};
    console.log("[switchWorkingMode] device response:", response.data);

    if (code === 200) {
      return res.json({ code: 200, message: "Switch successful" });
    }

    return res.status(400).json({
      code: code || 400,
      message: message || "Device returned error",
    });
  } catch (err) {
    console.error("[switchWorkingMode] error:", err.message);

    if (err.code === "ECONNREFUSED") {
      return res.status(500).json({ code: 500, message: "Cannot connect to MP30 device" });
    }
    if (err.code === "ECONNABORTED") {
      return res.status(500).json({ code: 500, message: "Request to MP30 timed out" });
    }
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

// Register user: ambil fitur dari device lalu INSERT ke PostgreSQL palms
const registerUser = async (req, res) => {
  const { userId, name } = req.body || {};

  try {
    console.log(`Registering new user: ${name || userId}`);

    // 1) clear
    await requestDevice("/palm/clear", "POST");

    // 2) start
    await requestDevice("/palm/start", "POST");

    // 3) poll status
    let enrollStatus;
    do {
      enrollStatus = await requestDevice("/palm/getState", "POST");
      console.log(`Enrollment status: ${enrollStatus.status}`);
      if (enrollStatus.status === 101) {
        return res.status(400).json({ message: "Failure Record" });
      }
      await new Promise(r => setTimeout(r, 1000));
    } while (enrollStatus.status !== 100);

    // 4) features
    const palmFeatures = await requestDevice("/palm/getEnrollFeat", "POST");
    // 5) image (opsional, contoh ambil index 0)
    const palmImage = await requestDevice("/palm/getEnrollImg", "POST", { img_index: 0 });

    // 6) insert ke DB palms
    const now = new Date();
    const insertSql = `
      INSERT INTO palms
        ("userid","idpengguna","cardId","palmprint1","palmvein1","palmprint2","palmvein2","updatetime","status","createdAt","updatedAt")
      VALUES
        ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8, $9, $10, $11)
      RETURNING id
    `;
    const params = [
      userId || String(name || "").trim(),
      null,                                    // idpengguna
      Date.now().toString(),                   // BIGINT
      toJsonbParam(palmFeatures.palmprint),
      toJsonbParam(palmFeatures.palmvein),
      toJsonbParam(palmFeatures.palmprint),
      toJsonbParam(palmFeatures.palmvein),
      now,                                     // updateTime
      '101',                                   // status default add
      now,                                     // createdAt
      now,                                     // updatedAt
    ];

    const { rows } = await pool.query(insertSql, params);

    return res.status(200).json({
      message: "User successfully registered",
      id: rows[0].id,
      palmFeatures,
      palmImage: palmImage.image, // simpan terpisah kalau mau
    });
  } catch (error) {
    console.error(`Registration failed for ${name || userId}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Opsional: list data palms dari DB (biar keliatan “narik data dari database”)
const listPalms = async (req, res) => {
  try {
    const { status = '101', limit = 50, offset = 0 } = req.query;
    const sql = `
      SELECT id, "userid", "cardId", "updatetime", status, "createdAt", "updatedAt"
      FROM palms
      WHERE status = $1
      ORDER BY "updateTime" DESC NULLS LAST, id DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(sql, [String(status), Number(limit), Number(offset)]);
    res.json({ code: 0, message: 'OK', data: rows });
  } catch (e) {
    console.error('[listPalms] error:', e);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

// Palm verification
const verifyPalm = async (req, res) => {
  try {
    const response = await requestDevice("/palm/setLocalRecg", "POST");
    if (response.code === 200) {
      res.status(200).json({ message: "Palmprint identification test initiated successfully" });
    } else if (response.code === 301) {
      res.status(503).json({ message: "Palmprint identification service is busy" });
    } else {
      res.status(500).json({ message: "Unexpected error during palmprint identification", response });
    }
  } catch (error) {
    console.error(`Palmprint identification failed: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getPalmsData = async (req, res) => {
  try {
    // Menjalankan query SQL untuk mengambil data dari tabel palms
    const query = 'SELECT "userid", "cardId", status, "updatetime" FROM palms';
    const result = await pool.query(query);

    // Jika data ditemukan, kirimkan sebagai response
    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No data found",
      });
    }
  } catch (error) {
    console.error("Error fetching data from database:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  testDevice,
  startPalmPrint,
  getPalmImage,
  getPalmFeatures,
  savePalmData,     // sekarang masuk ke DB, bukan array statis
  getDeviceStatus,
  clearEnrollmentData,
  registerUser,     // INSERT via pool.query
  verifyPalm,
  switchWorkingMode,
  listPalms,
  getPalmsData,  // bonus: tarik data dari DB
};
