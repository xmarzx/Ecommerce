const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

//login
app.post("/login", (req, res) => {
  const sql = `SELECT u.username, u.password, u.id_role, u.state FROM users u 
    WHERE username=? AND password=?`;
  const values = [req.body.user, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) return res.json("Error de conexión");
    if (data.length > 0) {
      if (data[0].state === 1) {
        const userRole = data[0].id_role;
        const usuario = data[0].username;
        // const year = new Date().getFullYear();
        // return res.json("Login Seccessfully");
        console.log(data[0]);
        console.log(data[0].username);
        return res.json({
          message: "Login Seccessfully",
          role: userRole,
          usuario: usuario,
          // year: year,
        });
      } else {
        return res.json({ message: "Usuario inhabilitado" });
      }
    } else {
      // return res.json("Usuario o Contraseña incorrectos");
      return res.json({ message: "Usuario o contraseña incorrectos" });
    }
  });
});

//Conexion
app.listen(5000, () => {
  console.log("Conexion exitosa");
});
