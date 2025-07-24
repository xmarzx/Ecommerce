const bcrypt = require("bcryptjs");

exports.createUser = (db, userData, callback) => {
  const { name, email, password } = userData;
  const role = "customer";

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return callback(err);
    }
    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hash, role], (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return callback(new Error("El correo electrónico ya está registrado."));
      }
      callback(err, result);
    });
  });
};

exports.createUserWithRole = (db, userData, callback) => {
  const { name, email, password, role } = userData;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hash, role], (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return callback(new Error("El correo electrónico ya está registrado."));
      }
      callback(err, result);
    });
  });
};

exports.findUserByEmail = (db, email, callback) => {
  const sql =
    "SELECT id_user, name, email, password, role FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

exports.getAllUsers = (db, callback) => {
  const sql = "SELECT id_user, name, email, role FROM users";
  db.query(sql, callback);
};

exports.getUserById = (db, id, callback) => {
  const sql = "SELECT id_user, name, email, role FROM users WHERE id_user = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};

exports.updateUser = (db, id, userData, callback) => {
  const { name, email, role } = userData;
  const sql =
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id_user = ?";
  db.query(sql, [name, email, role, id], callback);
};

exports.deleteUser = (db, id, callback) => {
  const sql = "DELETE FROM users WHERE id_user = ?";
  db.query(sql, [id], callback);
};
