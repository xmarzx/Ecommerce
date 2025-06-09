exports.getSubcategoriesByCategory = (db, categoryId, callback) => {
  const sql =
    "SELECT id_subcategory, name, available_sizes FROM subcategories WHERE id_category = ? ORDER BY name ASC";
  db.query(sql, [categoryId], callback);
};

exports.getAllSubcategories = (db, callback) => {
  const sql =
    "SELECT id_subcategory, name, id_category, available_sizes FROM subcategories ORDER BY name ASC";
  db.query(sql, callback);
};
