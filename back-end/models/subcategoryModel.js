exports.getSubcategoriesByCategory = (db, categoryId, callback) => {
  const sql =
    "SELECT id_subcategory, name FROM subcategories WHERE id_category = ? ORDER BY name ASC";
  db.query(sql, [categoryId], callback);
};

exports.getAllSubcategories = (db, callback) => {
  const sql =
    "SELECT id_subcategory, name, id_category FROM subcategories ORDER BY name ASC";
  db.query(sql, callback);
};
