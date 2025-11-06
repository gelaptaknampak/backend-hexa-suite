const express = require("express");
const cors = require("cors");
const http = require("http");
const check = require("./public");

require("dotenv").config();
// Routes for various functionalities
const karyawanRoutes = require("./src/DataKaryawan/routes");
const absensiRoutes = require("./src/Absensi/routes");
const pengajuanRoutes = require("./src/Pengajuan_izin&cuti/routes");
const authRoutes = require("./src/Authentikasi/routes");
const reimburstRoutes = require("./src/Reimburst/routes");
const resignRoutes = require("./src/Resign/routes");
const laporanRoutes = require("./src/Laporan/routes");
const payrollRoutes = require("./src/Payroll/routes");
const exportRoutes = require("./src/ExcelGenerator/routes");
const autoAPI = require("./src/autoAPI");
const testApi = require("./src/FlutterTest/testAPIReq");
const overtimeRoutes = require("./src/overtime/routes");
const biodataRoutes = require("./src/CompanyBio/routes");
const companyAsset = require("./src/asset/routes");
const Announce = require("./src/Announcment/routes");
const Schedjul = require("./src/schedjule/routes");
const Cfile = require("./src/Companyfile/routes");
const userRole = require("./src/Role/routes");
const summaryKehadiran = require("./src/Kehadiran/routes");
const absensiWeekend = require("./src/Absensi_Weekend/routes");
const geoLoc = require("./src/Geolocation/routes");
const Act = require("./src/Activity/routes");
const palm = require("./src/palm/routes");
const palmback = require("./src/palmback/routes");

const app = express();

// Menentukan port untuk server
const port = process.env.PORT || 3000; // Default port is 5000 if not specified in environment variable

// Middleware untuk mengizinkan CORS
app.use(cors({
  origin: '*', // Untuk mengizinkan semua domain (bisa juga disesuaikan)
}));

// Middleware untuk parsing JSON dan URL encoded requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving
app.use(express.static("public"));
app.options("*", cors());

// Middlewares
let temp = "";
let temptime = Date.now();
let temptimedelay = 5;

// Initiate today absence if server just turned on
let isServerOff = true;

// Middleware for logging request payload
app.use((req, res, next) => {
  if (
    temp != req.originalUrl &&
    Date.now() - temptime >= temptimedelay * 1000
  ) {
    console.log("Request to API:", req.method, req.originalUrl);
    console.log(
      "Request payload size:",
      JSON.stringify(req.body).length.toString()
    );
    temp = req.originalUrl;
    temptime = Date.now();
  }
  next();
});

// Logging untuk MP30 requests
app.use((req, _res, next) => {
  if (req.path.startsWith("/access/deviceApi/MV930")) {
    console.log("MP30 >>", {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
    });
  }
  next();
});

// Routing for various API paths
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/absensi", absensiRoutes);
app.use("/api/pengajuan", pengajuanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reimburst", reimburstRoutes);
app.use("/api/resign", resignRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/export", exportRoutes);
app.use("/test", testApi);
app.use("/api/overtime", overtimeRoutes);
app.use("/api/perusahaan", biodataRoutes);
app.use("/api/asset", companyAsset);
app.use("/api/announcment", Announce);
app.use("/api/schedjul", Schedjul);
app.use("/api/CompanyFile", Cfile);
app.use("/api/role", userRole);
app.use("/api/kehadiran", summaryKehadiran);
app.use("/api/weekendabsensi", absensiWeekend);
app.use("/api/geolocation", geoLoc);
app.use("/api/Act", Act);
app.use("/api/palm", palm);
app.use("/api/palmback", palmback);

// Middleware untuk route MP30 device API tanpa prefix tambahan
app.use(palmback); // This will handle requests to `/access/deviceApi/MV930/*`

// Root endpoint
app.get("/", (req, res) => {
  res.send(`Hello ini root api Absensi HBM`);
});

// Starting the server with HTTP
const server = http.createServer(app);
server.maxHeadersCount = 3000; // Set max headers for the HTTP server

// Start listening on the specified port
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  if (isServerOff) {
    check.initiateAbsence(); // Call function to initiate absence on server startup
    isServerOff = false;
  }
});

// Start autoAPI
autoAPI; // Ensure autoAPI is invoked if needed

