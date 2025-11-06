const pool = require("../../db");
const check = require("../../public");
const kehadiran = require("../Kehadiran/cont");
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isInt = (v) => Number.isInteger(v);
const isIntLike = (v) => {
  if (Number.isInteger(v)) return true;
  if (typeof v === "string" && /^\d+$/.test(v)) return true;
  return false;
};

function formatDateTime(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function toSafeString(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    try {
      const buf = Buffer.from(String(v));
      return buf.toString('base64');
    } catch {
      return String(v);
    }
  }
}

const ok = (res) => {
  res.set("Connection", "close");
  return res.status(200).json({ code: 0, message: "OK" });
};

const bad = (res, message = "Parameter error") => {
  res.set("Connection", "close");
  return res.status(400).json({ code: 400, message });
};

// 3.3.1 Get the current time of the server
const getCurrentTimeMillis = async (req, res) => {
  const timestamp = Date.now(); // Linux timestamp (ms)
  res.set("Connection", "close");
  return res.status(200).json({ code: 0, data: timestamp, message: "OK" });
};

// 3.3.2 Add device to waiting list
const addWaitAddDevice = async (req, res) => {
  const { deviceType, deviceSn, ip, mac, firmwareVersion, veinAlgVersion } = req.body || {};

  if (
    !isNonEmptyString(deviceType) ||
    !isNonEmptyString(deviceSn) ||
    !isNonEmptyString(ip) ||
    !isNonEmptyString(mac) ||
    !isNonEmptyString(firmwareVersion) ||
    !isNonEmptyString(veinAlgVersion)
  ) {
    return bad(res, "Parameter error");
  }

  // Add device to waiting list
  return ok(res);
};

// 3.3.3 Upload device information
const uploadDeviceInfo = async (req, res) => {
  const { deviceType, deviceSn } = req.body || {};
  if (!isNonEmptyString(deviceType) || !isNonEmptyString(deviceSn)) {
    return bad(res, "Device does not exist");
  }
  return ok(res);
};

// 3.3.4 Upload the device configuration
const updateDeviceConfig = async (req, res) => {
  const { deviceSn, maxUserNum } = req.body || {};

  if (!isNonEmptyString(deviceSn)) {
    return bad(res, "The device configuration does not exist");
  }
  if (maxUserNum !== undefined && !isInt(maxUserNum)) {
    return bad(res, "Parameter error");
  }
  return ok(res);
};


const uploadAccessInfo = async (req, res) => {
  console.log("[uploadAccessInfo] body:", req.body);
  const {
    deviceSn,
    authenType,  // dokumen: string (kita izinkan number juga)
    passState,   // dokumen: int (kita izinkan string numerik)
    authenTime,  // dokumen: string
    // opsional:
    userId,
    cardId,
    qrdata,
  } = req.body || {};

  // Terima authenType: string/number; passState: int-like
  const authTypeOk =
    (typeof authenType === "string" && authenType.trim().length > 0) ||
    Number.isInteger(authenType);

  if (!isNonEmptyString(deviceSn) || !authTypeOk || !isIntLike(passState) || !isNonEmptyString(authenTime)) {
    return bad(res, "Parameter error");
  }

  // === Tambahan: log sukses absen sesuai permintaan ===
  // Jika passState sukses (1) dan payload berisi data seperti contoh, cetak pesan keberhasilan.
  if (String(passState) === "1") {
    console.log("data absen telah berhasil");
    // log detail untuk jejak audit (tidak memblokir device)
    console.log(
      `[absen] success | userId=${userId ?? "-"} | deviceSn=${deviceSn} | authenType=${authenType} | authenTime=${authenTime} | passState=${passState}`
    );
  }

  // Jangan ada proses berat di sini. Simpan/log async kalau perlu.
  return ok(res);
};

// 3.3.6 Get the latest software version number information
const getLatestVersion = async (req, res) => {
  const { deviceType, deviceSn } = req.body || {};
  if (!isNonEmptyString(deviceType) || !isNonEmptyString(deviceSn)) {
    return bad(res, "no valid version information");
  }

  res.set("Connection", "close");
  return res.status(200).json({
    code: 0,
    data: {
      deviceType,
      version: "1.6.0",
      url: "http://192.168.31.231:9080/test.zip",
    },
    message: "OK",
  });
};

// 3.3.7 Getting Workflow information for people (paging)
const getWorkflowUsers = async (req, res) => {
  try {
    const { deviceSn, status, pageIndex = 1, pageSize = 10 } = req.body || {};
    if (!deviceSn || !status) {
      return res.status(400).json({ code: 400, message: 'Parameter error' });
    }

    const page = Math.max(parseInt(pageIndex, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 5000);

    // Query to get total count of records
    const totalResult = await pool.query(
      "SELECT COUNT(*) AS total FROM palms WHERE status = $1", // Parameterized query for count
      [String(status)]
    );
    const total = totalResult.rows[0].total;

    // Query to get data rows with pagination
    const result = await pool.query(
      `SELECT * FROM palms WHERE status = $1 ORDER BY updateTime DESC, id DESC LIMIT $2 OFFSET $3`, // Perbaikan: menggunakan 'updateTime'
      [String(status), size, (page - 1) * size]
    );

    const rows = result.rows;

    // Ensure rows is iterable (array)
    if (!Array.isArray(rows)) {
      return res.status(500).json({ code: 500, message: "Data is not iterable." });
    }

    let data;
    if (String(status) === '101') {
      // Map the result to the required object structure
      data = rows.map(r => {
        const obj = {
          userId: r.userId || '',
          updateTime: r.updateTime ? formatDateTime(r.updateTime) : '',  // Pastikan menggunakan 'updateTime' yang benar
          palmprint1: toSafeString(r.palmprint1),
          palmvein1: toSafeString(r.palmvein1),
          palmprint2: toSafeString(r.palmprint2),
          palmvein2: toSafeString(r.palmvein2),
        };
        if (typeof r.cardId === 'number') obj.cardId = r.cardId;
        return obj;
      });
    } else if (String(status) === '102') {
      data = rows
        .map(r => r.userId)
        .filter(u => typeof u === 'string' && u.length > 0);
    } else {
      return res.status(400).json({ code: 400, message: 'Parameter error' });
    }

    // Calculate pagination information
    const rawPages = Math.ceil(total / size);
    const pageTotal = total === 0 ? 0 : Math.max(1, rawPages);

    const payload = {
      code: 0,
      message: 'OK',
      data,
      dataTotal: total,
      pageTotal,
      pageIndex: page,
      pageSize: size,
    };

    return res.json(payload);
  } catch (err) {
    console.error('[getWorkflowUsers] error:', err);
    return res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

// 3.3.8 Modifying a person's Workflow information
const updateWorkflowUsers = async (req, res) => {
  const { deviceSn, userStatusMap } = req.body || {};
  console.log('[updateWorkflowUsers] body:', req.body);

  if (!isNonEmptyString(deviceSn) || typeof userStatusMap !== 'object' || userStatusMap === null) {
    return res.status(400).json({ code: 400, message: 'Parameter error' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Begin transaction
    // Process each userId → status
    for (const [userIdRaw, statRaw] of Object.entries(userStatusMap)) {
      const userId = String(userIdRaw || '').trim();
      const stat = String(statRaw);

      if (!userId) continue;

      if (stat === '200') {
        // Update user status to '200' (added successfully)
        await client.query(
          `UPDATE palms SET status = '200', updatedAt = $1 WHERE userId = $2 AND status = '101'`,
          [new Date(), userId]
        );
      } else if (stat === '300') {
        // Update user status to '300' (deleted successfully)
        await client.query(
          `UPDATE palms SET status = '300', updatedAt = $1 WHERE userId = $2 AND status = '102'`,
          [new Date(), userId]
        );
      } else {
        continue; // Ignore invalid status
      }
    }

    await client.query('COMMIT'); // Commit transaction
  } catch (e) {
    console.warn('[updateWorkflowUsers] DB update warning:', e);
    try { await client.query('ROLLBACK'); } catch { }
    return res.json({ code: 0, message: 'OK' });
  } finally {
    client.release(); // Release the client connection
  }

  return res.json({ code: 0, message: 'OK' });
};

module.exports = {
  getCurrentTimeMillis,
  addWaitAddDevice,
  uploadDeviceInfo,
  updateDeviceConfig,
  uploadAccessInfo,
  getLatestVersion,
  getWorkflowUsers,
  updateWorkflowUsers,
};
