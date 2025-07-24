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

exports.createUserFromAdmin = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
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

  UserModel.createUserWithRole(
    req.db,
    { name, email, password, role },
    (err, result) => {
      if (err) {
        if (err.message === "El correo electrónico ya está registrado.") {
          return res.status(409).json({ message: err.message });
        }
        console.error("Error al crear usuario desde admin:", err);
        return res.status(500).json({ message: "Error interno del servidor." });
      }

      res.status(201).json({ message: "Usuario creado exitosamente." });
    }
  );
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

exports.getAllUsers = (req, res) => {
  UserModel.getAllUsers(req.db, (err, users) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ message: "Error al obtener usuarios." });
    }
    res.status(200).json(users);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  UserModel.getUserById(req.db, id, (err, user) => {
    if (err) {
      console.error("Error al obtener usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(200).json(user);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  UserModel.updateUser(req.db, id, { name, email, role }, (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario:", err);
      return res.status(500).json({ message: "Error al actualizar usuario." });
    }
    res.status(200).json({ message: "Usuario actualizado correctamente." });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  UserModel.deleteUser(req.db, id, (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      return res.status(500).json({ message: "Error al eliminar usuario." });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente." });
  });
};
