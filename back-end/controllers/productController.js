const ProductModel = require("../models/productModel");

exports.getLatestProducts = (req, res) => {
  ProductModel.getLatestProducts(req.db, 10, (err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener los últimos productos" });
    }
    res.json(products);
  });
};

exports.getBestSellers = (req, res) => {
  ProductModel.getBestSellers(req.db, 5, (err, bestSellers) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener los best sellers" });
    }
    res.json(bestSellers);
  });
};

exports.getAllProducts = (req, res) => {
  ProductModel.getAllProducts(req.db, (err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener todos los productos" });
    }
    res.json(products);
  });
};

exports.getFilteredProducts = (req, res) => {
  const filters = {
    category: req.query.category,
    subCategory: req.query.subCategory,
  };

  ProductModel.getFilteredProducts(req.db, filters, (err, products) => {
    if (err) {
      return res.status(500).json({ error: "Error al filtrar los productos" });
    }
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;
  ProductModel.getProductById(req.db, productId, (err, product) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productData = product[0];
    if (productData.sizes) {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {
        console.error("Error al parsear sizes:", e);
        productData.sizes = [];
      }
    } else {
      productData.sizes = [];
    }
    res.json(productData);
  });
};

exports.getRelatedProducts = (req, res) => {
  const productId = req.params.productId;
  ProductModel.getRelatedProducts(
    req.db,
    productId,
    4,
    (err, relatedProducts) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener productos relacionados" });
      }
      res.json(relatedProducts);
    }
  );
};
