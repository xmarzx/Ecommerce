const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_jwt_secret_key_very_secret_and_long";

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. No se proporcionó token." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          message: "Token expirado. Por favor, inicia sesión de nuevo.",
        });
      }
      return res.status(403).json({ message: "Token inválido." });
    }
    req.user = user;
    next();
  });
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Rol de usuario no definido." });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No tienes el rol requerido." });
    }
    next();
  };
};
