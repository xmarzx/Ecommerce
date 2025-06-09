const OrderModel = require("../models/orderModel");

exports.createOrder = (req, res) => {
  const userId = req.user ? req.user.id : null;

  const { total, items, shipping_address, payment_method } = req.body;

  if (
    !total ||
    !items ||
    items.length === 0 ||
    !shipping_address ||
    !payment_method
  ) {
    return res.status(400).json({
      message:
        "Todos los campos requeridos (total, items, shipping_address, payment_method) son obligatorios.",
    });
  }

  const orderData = {
    total: total,
    status: "pending",
    shipping_address: shipping_address,
    payment_method: payment_method,
  };

  OrderModel.create(req.db, orderData, items, userId, (err, orderId) => {
    if (err) {
      console.error("Error al crear la orden:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor al crear la orden." });
    }
    res
      .status(201)
      .json({ message: "Orden creada exitosamente", orderId: orderId });
  });
};

exports.getUserOrders = (req, res) => {
  const userId = req.user.id;

  OrderModel.getOrdersByUserId(req.db, userId, (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos del usuario:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor al obtener pedidos." });
    }
    res.status(200).json(results);
  });
};

exports.getAllOrders = (req, res) => {
  OrderModel.getAllOrders(req.db, (err, results) => {
    if (err) {
      console.error("Error al obtener todos los pedidos:", err);
      return res.status(500).json({
        message: "Error interno del servidor al obtener todos los pedidos.",
      });
    }
    res.status(200).json(results);
  });
};

exports.getSingleOrderDetails = (req, res) => {
  const { id } = req.params;

  OrderModel.getOrderDetails(req.db, id, (err, results) => {
    if (err) {
      console.error("Error al obtener detalles del pedido:", err);
      return res.status(500).json({
        message: "Error interno del servidor al obtener detalles del pedido.",
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    if (req.user.role === "customer" && results[0].user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Este pedido no te pertenece." });
    }

    const orderDetails = {
      id: results[0].id,
      total: results[0].total,
      status: results[0].status,
      created_at: results[0].created_at,
      shipping_address: results[0].shipping_address,
      payment_method: results[0].payment_method,
      user_name: results[0].user_name,
      user_email: results[0].user_email,
      items: results.map((item) => ({
        product_id: item.id_product,
        product_name: item.product_name,
        product_image_filename: item.product_image_filename,
        quantity: item.quantity,
        item_price: item.item_price,
        size: item.size,
      })),
    };
    res.status(200).json(orderDetails);
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ message: "El estado del pedido es obligatorio." });
  }

  OrderModel.updateOrderStatus(req.db, id, status, (err, result) => {
    if (err) {
      console.error("Error al actualizar estado del pedido:", err);
      return res.status(500).json({
        message:
          "Error interno del servidor al actualizar el estado del pedido.",
      });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Pedido no encontrado para actualizar." });
    }
    res
      .status(200)
      .json({ message: "Estado del pedido actualizado exitosamente." });
  });
};
