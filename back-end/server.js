const express = require("express");
const imageRoutes = require("./routes/listImageRoutes");
const heroImageRoutes = require("./routes/heroImageRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.stack);
    return;
  }
  console.log("Conexión a la base de datos exitosa con el ID " + db.threadId);
});

app.use(cors());

// Middleware para pasar DB
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.static(path.join(__dirname, "dbimages")));
app.use(express.static(path.join(__dirname, "dbheroimages")));

// app.use("/images", express.static(path.join(__dirname, "dbimages")));
// app.use(
//   "/hero-images-static",
//   express.static(path.join(__dirname, "dbheroimages"))
// );

app.use("/", imageRoutes);
app.use("/", heroImageRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);

app.listen(5000, () => {
  console.log("Servidor iniciado en el puerto 5000");
});
