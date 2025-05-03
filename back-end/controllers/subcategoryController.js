const SubcategoryModel = require("../models/subcategoryModel");

exports.getSubcategoriesByCategory = (req, res) => {
  const categoryId = req.query.categoryId;
  if (!categoryId) {
    return res.status(400).json({ error: "Se requiere el ID de la categoría" });
  }
  SubcategoryModel.getSubcategoriesByCategory(
    req.db,
    categoryId,
    (err, subcategories) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener las subcategorías por categoría" });
      }
      res.json(subcategories);
    }
  );
};

exports.getAllSubcategories = (req, res) => {
  SubcategoryModel.getAllSubcategories(req.db, (err, subcategories) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener todas las subcategorías" });
    }
    res.json(subcategories);
  });
};
