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

exports.findUserByEmail = (db, email, callback) => {
  const sql =
    "SELECT id_user, name, email, password, role FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};
