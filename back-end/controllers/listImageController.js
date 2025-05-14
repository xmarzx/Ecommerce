// const fs = require("fs");
// const path = require("path");
// const ImageModel = require("../models/listImageModel");

// exports.uploadImage = (req, res) => {
//   const type = req.file.mimetype;
//   const name = req.file.originalname;
//   const data = fs.readFileSync(
//     path.join(__dirname, "../images/", req.file.filename)
//   );

//   const extension = path.extname(name).toLowerCase();

//   ImageModel.saveImage(
//     req.db,
//     { type, name, data, extension },
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: "Error al guardar la imagen" });
//       }
//       res.status(200).send("Imagen guardada");

//       // Borrar imagen temporal
//       fs.unlink(
//         path.join(__dirname, "../images/", req.file.filename),
//         (err) => {
//           if (err) console.error("Error al eliminar archivo:", err);
//         }
//       );
//     }
//   );
// };

// exports.getImages = (req, res) => {
//   ImageModel.getAllImages(req.db, (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: "Error al listar imágenes" });
//     }

//     rows.forEach((img) => {
//       fs.writeFileSync(
//         path.join(__dirname, "../dbimages/", `${img.id_image}${img.extension}`),
//         img.data
//       );
//     });

//     const imagesdir = fs.readdirSync(path.join(__dirname, "../dbimages"));
//     res.json(imagesdir);
//   });
// };
