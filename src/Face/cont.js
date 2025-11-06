const axios = require("axios");
const http = require("http");

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isInt = (v) => Number.isInteger(v);
const isIntLike = (v) => {
  if (Number.isInteger(v)) return true;
  if (typeof v === "string" && /^\d+$/.test(v)) return true;
  return false;
};

const ok = (res, data = undefined, message = "OK") => {
  res.set("Connection", "close");
  return res.status(200).json({ code: 0, data, message });
};

const bad = (res, message = "Parameter error", code = 400) => {
  res.set("Connection", "close");
  return res.status(400).json({ code, message });
};

const internalErr = (res, message = "Internal server error") => {
  res.set("Connection", "close");
  return res.status(500).json({ code: 500, message });
};

// Device IP fixed in the code
const deviceIP = "192.168.31.49:8090";

// Build the base URL
function buildBaseUrl() {
  return `http://${deviceIP}/cgi-bin/js`;
}

// Create auth header with default username and password
function makeAuthHeader() {
  const u = "admin"; // Default username
  const p = "123456"; // Default password
  const token = Buffer.from(`${u}:${p}`).toString("base64");
  return `Basic ${token}`; // Return Basic Auth header
}

// Axios instance with custom header and timeout
function axiosJson() {
  const authHeader = makeAuthHeader(); // Generate auth header automatically
  const agent = new http.Agent({ keepAlive: false });
  return axios.create({
    timeout: 10000,
    httpAgent: agent,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader, // Automatically add the authorization header
    },
    validateStatus: () => true, // Control error handling manually
  });
}

/**
 * 1) Check device connection
 */
const checkDeviceConnection = async (req, res) => {
  try {
    const authHeader = makeAuthHeader();
    const baseUrl = buildBaseUrl();
    const http = axiosJson();

    // Dummy data, langsung dikirim tanpa perlu input dari Postman
    const dummyResponse = {
      code: "000",
      msg: "Request successful",
      data: {
        deviceKey: "15E5754C846279A4",
        os: "Android",
        osVersion: "7.1.2",
        firmwareVersion: "V3.8.2",
        faceAlgorithmVersion: "V3.8.2",
        wanMac: "30:1f:9a:87:f1:95",
        wifiMac: "70:f7:54:23:59:ce",
        versionCode: 20000,
      }
    };

    return ok(res, {
      reachable: true,
      deviceKey: dummyResponse.data.deviceKey,
      os: dummyResponse.data.os,
      osVersion: dummyResponse.data.osVersion,
      firmwareVersion: dummyResponse.data.firmwareVersion,
      faceAlgorithmVersion: dummyResponse.data.faceAlgorithmVersion,
      wanMac: dummyResponse.data.wanMac,
      wifiMac: dummyResponse.data.wifiMac,
      versionCode: dummyResponse.data.versionCode,
      raw: dummyResponse,
    });
  } catch (err) {
    console.error("[checkDeviceConnection] error:", err?.message || err);
    return res.status(200).json({
      code: 0,
      message: "Device not reachable",
      data: { reachable: false },
    });
  }
};

/**
 * 2) Register face (face/merge)
 */
const registerFace = async (req, res) => {
  try {
    // Use dummy data for testing
    const personSn = "001";
    const imgUrl = "http://example.com/face1.jpg"; // Dummy image URL
    const imgBase64 = "base64encodedimagehere"; // Dummy Base64 image string
    const easy = 1; // Dummy value

    // Validate if all required fields are present (but all are now provided as dummy)
    if (!isNonEmptyString(personSn)) return bad(res, "personSn is required");
    if (!isNonEmptyString(imgUrl) && !isNonEmptyString(imgBase64)) {
      return bad(res, "Either imgUrl or imgBase64 is required");
    }
    if (easy !== undefined && !(easy === 0 || easy === 1 || isIntLike(easy))) {
      return bad(res, "easy must be 0 or 1");
    }

    const authHeader = makeAuthHeader();
    const baseUrl = buildBaseUrl();
    const http = axiosJson();

    // Use dummy data for request body
    const body = {
      personSn,
      imgUrl,
      imgBase64,
      easy,
    };

    // Dummy successful response for testing
    const dummyFaceResponse = {
      code: "000",
      msg: "Request successful",
      data: { personSn },
    };

    return ok(res, dummyFaceResponse.data, "Face registration successful");
  } catch (err) {
    console.error("[registerFace] error:", err?.message || err);
    return internalErr(res);
  }
};

/**
 * 3) Register palm (palm/merge)
 */
const registerPalm = async (req, res) => {
  try {
    // Use dummy data for testing
    const items = [
      {
        personSn: "001",
        palmId: "12345",
        palmNum: 1,
        feature: "samplePalmFeatureData"
      }
    ];

    // Validate if all required fields are present (but all are now provided as dummy)
    for (const [idx, it] of items.entries()) {
      if (!isNonEmptyString(it?.personSn)) {
        return bad(res, `items[${idx}].personSn is required`);
      }
      if (!isNonEmptyString(it?.palmId)) {
        return bad(res, `items[${idx}].palmId is required`);
      }
      if (!(it?.palmNum === 1 || it?.palmNum === 2 || isIntLike(it?.palmNum))) {
        return bad(res, `items[${idx}].palmNum must be 1 (left) or 2 (right)`);
      }
      if (!isNonEmptyString(it?.feature)) {
        return bad(res, `items[${idx}].feature is required`);
      }
    }

    const authHeader = makeAuthHeader();
    const baseUrl = buildBaseUrl();
    const http = axiosJson();

    // Dummy successful response for palm registration
    const dummyPalmResponse = {
      code: "000",
      msg: "Request successful",
      data: items,
    };

    return ok(res, dummyPalmResponse.data, "Palm registration successful");
  } catch (err) {
    console.error("[registerPalm] error:", err?.message || err);
    return internalErr(res);
  }
};

module.exports = {
  checkDeviceConnection,
  registerFace,
  registerPalm,
};
