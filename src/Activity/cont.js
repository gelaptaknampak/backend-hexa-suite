const pool = require("../../db");  // Koneksi ke database
const queries = require("./queries");

const postActivity = async (req, res) => {
    const { idk, report } = req.body;

    if (!idk || !report) {
        return res.status(400).json({ error: "Missing idk or report data" });
    }

    const timestamp = new Date().toISOString();

    try {
        // Pertama cek apakah sudah ada activity untuk user dengan idk yang sama
        const checkResult = await pool.query(queries.checkActivityQuery, [idk]);

        if (checkResult.rows.length > 0) {
            // Jika sudah ada, update data activity
            const updateResult = await pool.query(queries.updateActivityQuery, [
                JSON.stringify(report.mouseClicks), // mouseClicks
                JSON.stringify(report.keystrokes),   // keystrokes
                JSON.stringify(report.visitedTabs),  // visitedTabs
                timestamp,                           // created_at
                idk                                  // idk
            ]);
            return res.status(200).json({ message: "Activity data updated", activity: updateResult.rows[0] });
        } else {
            // Jika belum ada, insert data baru
            const result = await pool.query(queries.insertActivityQuery, [
                idk,                                   // idk
                JSON.stringify(report.mouseClicks),     // mouseClicks
                JSON.stringify(report.keystrokes),      // keystrokes
                JSON.stringify(report.visitedTabs),     // visitedTabs
                timestamp                               // created_at
            ]);
            return res.status(200).json({ message: "Activity data inserted", activity: result.rows[0] });
        }
    } catch (err) {
        console.error("Error inserting/updating activity:", err);
        res.status(500).json({ error: "Failed to insert/update activity" });
    }
};

const getActivity = async (req, res) => {
    const { idk } = req.params; // Mengambil idk dari parameter

    if (!idk) {
        return res.status(400).json({ error: "Missing idk" });
    }

    try {
        // Ambil data aktivitas dari database berdasarkan idk
        const result = await pool.query(queries.getActivityQuery, [idk]);

        if (result.rows.length > 0) {
            // Ambil data aktivitas dari baris pertama (karena idk seharusnya unik)
            const activity = result.rows[0];

            // Menyusun data activity dalam bentuk yang sesuai
            const activityData = {
                mouseClicks: activity.mouse_clicks ? activity.mouse_clicks : [],
                keystrokes: activity.keystrokes ? activity.keystrokes : [],
                visitedTabs: activity.visited_tabs ? activity.visited_tabs : [],
                createdAt: activity.created_at // Tambahkan waktu pembuatan aktivitas
            };

            return res.status(200).json({ activity: activityData });
        } else {
            return res.status(404).json({ message: "No activity found for this user" });
        }
    } catch (err) {
        console.error("Error fetching activity:", err);
        res.status(500).json({ error: "Failed to fetch activity" });
    }
};

module.exports = {
    postActivity,
    getActivity
};
