const axios = require("axios");
const pool = require("../../db");
const queries = require("./queries");

// Alamat device MP30
const HOST = "http://192.168.0.101:60086";

// 🔹 Test koneksi
const testDevice = async (req, res) => {
  try {
    const response = await axios.post(`${HOST}/test`, { cmd: "Test" });
    console.log("TestDevice Response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("TestDevice Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Mulai proses scan
const startPalm = async (req, res) => {
  try {
    await axios.post(`${HOST}/palm/clear`, { cmd: "Clear" });
    const response = await axios.post(`${HOST}/palm/start`, { cmd: "Start" });
    console.log("StartPalm Response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("StartPalm Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Ambil state proses
const getPalmState = async (req, res) => {
  try {
    const response = await axios.post(`${HOST}/palm/getState`, { cmd: "GetState" });
    console.log("PalmState Response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("GetPalmState Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Ambil fitur palm (palmvein + palmprint) lalu simpan DB
const getPalmFeature = async (req, res) => {
  try {
    const response = await axios.post(`${HOST}/palm/getEnrollFeat`, { cmd: "GetEnrollFeat" });
    console.log("PalmFeature Response:", response.data);

    const { palmvein, palmprint } = response.data;
    const { user_id } = req.body;

    const result = await pool.query(queries.insertPalmTemplate, [
      user_id,
      palmvein,
      palmprint,
    ]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("GetPalmFeature Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Ambil image palm lalu simpan DB
const getPalmImage = async (req, res) => {
  try {
    const { img_index = 0, user_id } = req.body;
    const response = await axios.post(`${HOST}/palm/getEnrollImg`, {
      cmd: "GetEnrollImg",
      img_index,
    });
    console.log("PalmImage Response:", response.data);

    const { image } = response.data;

    const result = await pool.query(queries.insertPalmImage, [user_id, image]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("GetPalmImage Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Ambil dari DB
const listPalmTemplates = async (req, res) => {
  const result = await pool.query(queries.getPalmTemplates);
  res.json(result.rows);
};

const listPalmImages = async (req, res) => {
  const result = await pool.query(queries.getPalmImages);
  res.json(result.rows);
};

module.exports = {
  testDevice,
  startPalm,
  getPalmState,
  getPalmFeature,
  getPalmImage,
  listPalmTemplates,
  listPalmImages,
};
