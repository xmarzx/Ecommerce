const fs = require("fs");
const path = require("path");
const HeroImageModel = require("../models/heroImageModel");

exports.uploadHeroImage = (req, res) => {
  const type = req.file.mimetype;
  const name = req.file.originalname;
  const data = fs.readFileSync(
    path.join(__dirname, "../images/", req.file.filename)
  );

  HeroImageModel.saveHeroImage(req.db, { type, name, data }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al guardar la imagen" });
    }
    res.status(200).send("Imagen guardada");

    fs.unlink(path.join(__dirname, "../images/", req.file.filename), (err) => {
      if (err) console.error("Error al eliminar archivo:", err);
    });
  });
};

exports.getHeroImages = (req, res) => {
  HeroImageModel.getAllHeroImages(req.db, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al listar imágenes" });
    }

    const filenames = [];

    rows.forEach((img) => {
      const filename = `${img.id_hero_image}-hero_image.webp`;
      const filepath = path.join(__dirname, "../dbheroimages/", filename);

      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, img.data);
      }

      filenames.push(filename);
    });

    res.json(filenames);
  });
};
