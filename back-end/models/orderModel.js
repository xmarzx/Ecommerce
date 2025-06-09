exports.create = (db, orderData, items, userId, callback) => {
  db.beginTransaction((err) => {
    if (err) return callback(err);

    const { total, status, shipping_address, payment_method } = orderData;
    const orderSql = `
            INSERT INTO orders (user_id, total, status, shipping_address, payment_method, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

    db.query(
      orderSql,
      [userId, total, status, shipping_address, payment_method],
      (err, orderResult) => {
        if (err) {
          return db.rollback(() => callback(err));
        }
        const orderId = orderResult.insertId;

        const itemValues = items.map((item) => [
          orderId,
          item.id,
          item.quantity,
          item.price,
          item.size,
        ]);

        const itemSql = `
                    INSERT INTO order_items (order_id, product_id, quantity, price, size)
                    VALUES ?
                `;

        db.query(itemSql, [itemValues], (err, itemResult) => {
          if (err) {
            console.error("Error al insertar ítems de la orden:", err);
            return db.rollback(() => callback(err));
          }
          db.commit((err) => {
            if (err) {
              return db.rollback(() => callback(err));
            }
            callback(null, orderId);
          });
        });
      }
    );
  });
};

exports.getOrdersByUserId = (db, userId, callback) => {
  const sql = `
        SELECT o.id, o.total, o.status, o.created_at,
        u.name AS user_name, u.email AS user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id_user
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;
  db.query(sql, [userId], callback);
};

exports.getAllOrders = (db, callback) => {
  const sql = `
        SELECT o.id, o.total, o.status, o.created_at,
        u.name AS user_name, u.email AS user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id_user
        ORDER BY o.created_at DESC
    `;
  db.query(sql, callback);
};

exports.getOrderDetails = (db, orderId, callback) => {
  const sql = `
      SELECT
          o.id,
          o.total,
          o.status,
          o.created_at,
          o.shipping_address,
          o.payment_method,
          o.user_id, -- <--- ¡Asegúrate de agregar esta línea!
          u.name AS user_name,
          u.email AS user_email,
          oi.quantity,
          oi.price AS item_price,
          oi.size,
          p.name AS product_name,
          p.id AS product_id,
          CONCAT(p.id_image, img.extension) AS product_image_filename
      FROM
          orders o
      LEFT JOIN users u ON o.user_id = u.id_user
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN images img ON p.id_image = img.id_image
      WHERE
          o.id = ?;
    `;
  db.query(sql, [orderId], callback);
};

exports.updateOrderStatus = (db, orderId, newStatus, callback) => {
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [newStatus, orderId], callback);
};
