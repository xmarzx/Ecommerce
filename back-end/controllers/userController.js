const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_jwt_secret_key_very_secret_and_long";

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ message: "Formato de correo electrónico inválido." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres." });
  }

  UserModel.createUser(req.db, { name, email, password }, (err, result) => {
    if (err) {
      if (err.message === "El correo electrónico ya está registrado.") {
        return res.status(409).json({ message: err.message });
      }
      console.error("Error al registrar usuario:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor al registrar usuario." });
    }
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Correo electrónico y contraseña son obligatorios." });
  }

  UserModel.findUserByEmail(req.db, email, (err, results) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error al comparar contraseñas:", err);
        return res.status(500).json({ message: "Error interno del servidor." });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas." });
      }

      const token = jwt.sign(
        { id: user.id_user, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Inicio de sesión exitoso.",
        token,
        userId: user.id_user,
        userName: user.name,
        userRole: user.role,
      });
    });
  });
};
