const CategoryModel = require("../models/categoryModel");

exports.getAllCategories = (req, res) => {
  CategoryModel.getAllCategories(req.db, (err, categories) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener las categorías" });
    }
    res.json(categories);
  });
};
