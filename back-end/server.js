const express = require("express");
const imageRoutes = require("./routes/imageRoutes");
const heroImageRoutes = require("./routes/heroImageRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.static(path.join(__dirname, "dbimages")));
app.use(express.static(path.join(__dirname, "dbheroimages")));

app.use("/", imageRoutes);
app.use("/", heroImageRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Servidor iniciado en el puerto 5000");
});
