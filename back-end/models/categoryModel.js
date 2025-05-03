exports.getAllCategories = (db, callback) => {
  const sql = "SELECT id_category, name FROM categories ORDER BY name ASC";
  db.query(sql, callback);
};
