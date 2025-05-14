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

exports.addProduct = (db, newProduct, callback) => {
  const sql = `
    INSERT INTO products (name, description, price, sizes, date, bestseller, id_image, id_category, id_subcategory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const {
    name,
    description,
    price,
    sizes,
    date,
    bestseller,
    id_image,
    id_category,
    id_subcategory,
  } = newProduct;
  db.query(
    sql,
    [
      name,
      description,
      price,
      sizes,
      date,
      bestseller,
      id_image,
      id_category,
      id_subcategory,
    ],
    callback
  );
};

exports.getSizesBySubcategory = (db, idSubcategory, callback) => {
  const sql = `
    SELECT size
    FROM sizes_by_subcategory
    WHERE id_subcategory = ?
    ORDER BY size ASC
  `;
  console.log("Ejecutando consulta para tallas:", sql, [idSubcategory]);
  db.query(sql, [idSubcategory], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta de tallas:", err);
      return callback(err, null);
    }
    console.log("Resultados de la consulta de tallas:", results);
    const sizes = results.map((row) => row.size);
    console.log("Tallas formateadas:", sizes);
    callback(null, sizes);
  });
};
