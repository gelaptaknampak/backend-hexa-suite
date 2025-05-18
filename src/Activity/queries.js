// Query untuk cek apakah sudah ada activity dengan idk yang sama
const checkActivityQuery = `
    SELECT * FROM activity_tracker WHERE idk = $1;
`;

// Query untuk update data activity jika idk sudah ada
const updateActivityQuery = `
    UPDATE activity_tracker
    SET 
        mouse_clicks = $1,
        keystrokes = $2,
        visited_tabs = $3,
        created_at = $4
    WHERE idk = $5
    RETURNING *;
`;

// Query untuk insert data activity baru
const insertActivityQuery = `
    INSERT INTO activity_tracker (idk, mouse_clicks, keystrokes, visited_tabs, created_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
`;

// Query untuk mengambil data aktivitas berdasarkan idk
const getActivityQuery = 
    `SELECT mouse_clicks, keystrokes, visited_tabs, created_at
    FROM activity_tracker
    WHERE idk = $1;`;


module.exports = {
    checkActivityQuery,
    updateActivityQuery,
    insertActivityQuery,
    getActivityQuery
};
