exports.getLatestProducts = (db, limit = 10, callback) => {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.id_image,
    CONCAT(i.id_image,i.extension) AS image,
    c.name AS categoryName,
    s.name AS subCategoryName
    FROM products p
    LEFT JOIN categories c ON p.id_category = c.id_category
    LEFT JOIN subcategories s ON p.id_subcategory = s.id_subcategory
    LEFT JOIN images i ON p.id_image = i.id_image
    ORDER BY p.date DESC
    LIMIT ?
  `;
  db.query(sql, [limit], callback);
};

exports.getBestSellers = (db, limit = 5, callback) => {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.id_image,
    CONCAT(i.id_image,i.extension) AS image,
    c.name AS categoryName,
    s.name AS subCategoryName
    FROM products p
    LEFT JOIN categories c ON p.id_category = c.id_category
    LEFT JOIN subcategories s ON p.id_subcategory = s.id_subcategory
    LEFT JOIN images i ON p.id_image = i.id_image
    WHERE p.bestseller = 1
    LIMIT ?
  `;
  db.query(sql, [limit], callback);
};

exports.getAllProducts = (db, callback) => {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.id_image,
    CONCAT(i.id_image,i.extension) AS image,
      c.name AS categoryName,
      s.name AS subCategoryName,
      p.id_category,
      p.id_subcategory
    FROM products p
    LEFT JOIN categories c ON p.id_category = c.id_category
    LEFT JOIN subcategories s ON p.id_subcategory = s.id_subcategory
    LEFT JOIN images i ON p.id_image = i.id_image
  `;
  db.query(sql, callback);
};

exports.getProductById = (db, productId, callback) => {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.sizes, p.id_image,
    CONCAT(i.id_image,i.extension) AS image
    FROM products p
    LEFT JOIN images i ON p.id_image = i.id_image
    WHERE p.id = ?
  `;
  db.query(sql, [productId], callback);
};

exports.getRelatedProducts = (db, productId, limit = 4, callback) => {
  const sql = `
    SELECT p.id, p.name, p.price, p.id_image,
    CONCAT(i.id_image,i.extension) AS image
    FROM products p
    LEFT JOIN images i ON p.id_image = i.id_image
    WHERE p.id != ?
    ORDER BY RAND()
    LIMIT ?
  `;
  db.query(sql, [productId, limit], callback);
};
