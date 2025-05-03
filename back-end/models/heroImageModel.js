exports.saveHeroImage = (db, { type, name, data }, callback) => {
  const sql = "INSERT INTO hero_images (type, name, data) VALUES (?, ?, ?)";
  db.query(sql, [type, name, data], callback);
};

exports.getAllHeroImages = (db, callback) => {
  const sql = "SELECT * FROM hero_images WHERE state=1";
  db.query(sql, callback);
};
