const ProductModel = require("../models/productModel");
const ImageModel = require("../models/imageModel");
const fs = require("fs");
const path = require("path");

exports.getLatestProducts = (req, res) => {
  // Log para verificar la solicitud de los últimos productos
  // console.log("Solicitud para obtener los últimos productos.");
  ProductModel.getLatestProducts(req.db, 10, (err, products) => {
    if (err) {
      console.error("Error al obtener los últimos productos:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los últimos productos" });
    }
    // console.log("Últimos productos obtenidos exitosamente:", products);
    res.json(products);
  });
};

exports.getBestSellers = (req, res) => {
  // console.log("Solicitud para obtener los best sellers.");
  ProductModel.getBestSellers(req.db, 5, (err, bestSellers) => {
    if (err) {
      console.error("Error al obtener los best sellers:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los best sellers" });
    }
    // console.log("Best sellers obtenidos exitosamente:", bestSellers);
    res.json(bestSellers);
  });
};

exports.getAllProducts = (req, res) => {
  // console.log("Solicitud para obtener todos los productos.");
  ProductModel.getAllProducts(req.db, (err, products) => {
    if (err) {
      console.error("Error al obtener todos los productos:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener todos los productos" });
    }
    // console.log("Todos los productos obtenidos exitosamente:", products);
    res.json(products);
  });
};

exports.getFilteredProducts = (req, res) => {
  console.log("Solicitud para filtrar productos. Filtros:", req.query);
  const filters = {
    category: req.query.category,
    subCategory: req.query.subCategory,
  };

  ProductModel.getFilteredProducts(req.db, filters, (err, products) => {
    if (err) {
      console.error("Error al filtrar los productos:", err);
      return res.status(500).json({ error: "Error al filtrar los productos" });
    }
    console.log("Productos filtrados obtenidos exitosamente:", products);
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;
  console.log(`Solicitud para obtener el producto con ID: ${productId}`);
  ProductModel.getProductById(req.db, productId, (err, product) => {
    if (err) {
      console.error(`Error al obtener el producto con ID ${productId}:`, err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (!product || product.length === 0) {
      console.log(`Producto con ID ${productId} no encontrado.`);
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productData = product[0];
    if (productData.sizes) {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {
        console.error(
          `Error al parsear 'sizes' para el producto ID ${productId}:`,
          e
        );
        productData.sizes = [];
      }
    } else {
      productData.sizes = [];
    }
    console.log(
      `Producto con ID ${productId} obtenido exitosamente:`,
      productData
    );
    res.json(productData);
  });
};

exports.getRelatedProducts = (req, res) => {
  const productId = req.params.productId;
  console.log(
    `Solicitud para obtener productos relacionados con el ID: ${productId}`
  );
  ProductModel.getRelatedProducts(
    req.db,
    productId,
    4,
    (err, relatedProducts) => {
      if (err) {
        console.error(
          `Error al obtener productos relacionados con el ID ${productId}:`,
          err
        );
        return res
          .status(500)
          .json({ error: "Error al obtener productos relacionados" });
      }
      console.log(
        `Productos relacionados con el ID ${productId} obtenidos exitosamente:`,
        relatedProducts
      );
      res.json(relatedProducts);
    }
  );
};

exports.addProduct = (req, res) => {
  console.log(
    "Solicitud para agregar un nuevo producto. Cuerpo de la solicitud:",
    req.body
  );

  if (!req.file) {
    console.error("Error: No se recibió ninguna imagen del producto.");
    return res
      .status(400)
      .json({ message: "Debe subir una imagen del producto." });
  }

  const {
    name,
    description,
    price,
    category_id,
    subcategory_id,
    bestseller,
    sizes,
    date,
  } = req.body;
  const type = req.file.mimetype;
  const imageName = req.file.originalname;
  const extension = path.extname(imageName).toLowerCase();
  const imageData = fs.readFileSync(req.file.path); // Leer desde la carpeta temporal

  console.log("Información de la imagen recibida:", {
    type,
    imageName,
    extension,
    size: req.file.size,
  });

  ImageModel.saveImage(
    req.db,
    { type, name: imageName, extension, data: imageData },
    (err, imageResult) => {
      if (err) {
        console.error("Error al guardar la imagen en la base de datos:", err);
        fs.unlinkSync(req.file.path); // Eliminar archivo temporal en caso de error
        return res.status(500).json({
          error: "Error al guardar la imagen del producto en la base de datos.",
        });
      }

      const id_image = imageResult.insertId;
      const sizesString = Array.isArray(sizes)
        ? JSON.stringify(sizes)
        : JSON.stringify([sizes]); // Asegurar que sizes sea un array JSON

      const newProduct = {
        name,
        description,
        price,
        sizes: sizesString,
        date,
        bestseller,
        id_image,
        id_category: category_id,
        id_subcategory: subcategory_id,
      };

      console.log("Datos del producto a guardar:", newProduct);

      ProductModel.addProduct(req.db, newProduct, (err, productResult) => {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.renameSync(
            req.file.path,
            path.join(__dirname, "../dbimages/", `${id_image}${extension}`)
          ); // Mover imagen a dbimages
          console.log(`Imagen movida a dbimages/${id_image}${extension}`);
        } else {
          console.warn(
            "Advertencia: El archivo temporal de la imagen no se encontró para mover."
          );
        }

        if (err) {
          console.error("Error al guardar los detalles del producto:", err);
          // Considerar eliminar la imagen guardada en caso de fallo al guardar el producto
          return res
            .status(500)
            .json({ error: "Error al guardar los detalles del producto." });
        }
        console.log(
          "Producto agregado exitosamente. ID:",
          productResult.insertId
        );
        res.status(201).json({
          message: "Producto agregado exitosamente.",
          productId: productResult.insertId,
        });
      });
    }
  );
};

exports.getSizesForSubcategory = (req, res) => {
  const db = req.app.get("db");
  const { idSubcategory } = req.params;

  console.log(
    "Solicitud para obtener tallas para la subcategoría ID:",
    idSubcategory
  );

  if (!idSubcategory) {
    console.log("Error: ID de subcategoría no proporcionado.");
    return res
      .status(400)
      .json({ message: "Se requiere el ID de la subcategoría." });
  }

  ProductModel.getSizesBySubcategory(db, idSubcategory, (err, sizes) => {
    if (err) {
      console.error("Error al obtener las tallas (modelo):", err);
      return res.status(500).json({ message: "Error al obtener las tallas." });
    }
    console.log("Tallas obtenidas del modelo:", sizes);
    return res.json(sizes);
  });
};
