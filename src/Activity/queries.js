// src/Activity/queries.js
const insertPalmTemplate = `
  INSERT INTO palm_templates (user_id, palmvein, palmprint, created_at)
  VALUES ($1, $2, $3, NOW()) RETURNING *;
`;

const insertPalmImage = `
  INSERT INTO palm_images (user_id, image_data, created_at)
  VALUES ($1, $2, NOW()) RETURNING *;
`;

const getPalmTemplates = `SELECT * FROM palm_templates ORDER BY created_at DESC`;
const getPalmImages = `SELECT * FROM palm_images ORDER BY created_at DESC`;

module.exports = {
  insertPalmTemplate,
  insertPalmImage,
  getPalmTemplates,
  getPalmImages,
};
