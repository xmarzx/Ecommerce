import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import styles from "../styles/OrderDetails.module.css";

function OrderDetails() {
  const { orderId } = useParams();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        toast.error(
          "Necesitas iniciar sesión para ver los detalles del pedido."
        );
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`/orders/${orderId}`);

        setOrder(response.data);
        setNewStatus(response.data.status);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          "Error al cargar los detalles del pedido. Asegúrate de que el pedido exista y tienes permisos."
        );
        toast.error("Error al cargar detalles del pedido.");
        if (
          err.response &&
          (err.response.status === 403 || err.response.status === 404)
        ) {
          navigate("/orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isAuthenticated, isAdmin, navigate]);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        await axios.put(`/admin/orders/${orderId}/status`, {
          status: newStatus,
        });
        toast.success("Estado del pedido actualizado!");
        setOrder((prev) => ({ ...prev, status: newStatus }));
      } else {
        toast.error("No tienes permisos para actualizar el estado del pedido.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Error al actualizar el estado del pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>Cargando detalles del pedido...</div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!order) {
    return <div className={styles.noOrder}>Pedido no encontrado.</div>;
  }

  const getProductImageUrl = (filename) => {
    const baseUrl = axios.defaults.baseURL.replace("/api", "");
    const imageUrl = `${baseUrl}/${filename}`;
    console.log("URL de imagen generada:", imageUrl);
    return imageUrl;
  };

  return (
    <div className={styles.orderDetailsContainer}>
      <h2>Detalles del Pedido #{order.id}</h2>
      <div className={styles.orderSummary}>
        <p>
          <strong>Fecha del Pedido:</strong>{" "}
          {new Date(order.created_at).toLocaleDateString()}{" "}
          {new Date(order.created_at).toLocaleTimeString()}
        </p>
        <p>
          <strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={`${styles.status} ${styles[order.status.toLowerCase()]}`}
          >
            {order.status}
          </span>
        </p>
        <p>
          <strong>Dirección de Envío:</strong> {order.shipping_address}
        </p>
        <p>
          <strong>Método de Pago:</strong> {order.payment_method}
        </p>
        {order.user_name && (
          <p>
            <strong>Cliente:</strong> {order.user_name} ({order.user_email})
          </p>
        )}
      </div>

      <h3>Productos en el Pedido:</h3>
      <ul className={styles.itemsList}>
        {order.items.map((item, index) => (
          <li key={item.product_id + "-" + index} className={styles.itemCard}>
            <img
              src={getProductImageUrl(item.product_image_filename)}
              alt={item.product_name}
              className={styles.itemImage}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.product_name}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio Unitario: ${parseFloat(item.item_price).toFixed(2)}</p>
              <p>
                Subtotal: $
                {(parseFloat(item.item_price) * item.quantity).toFixed(2)}
              </p>
              {item.size && <p>Talla: {item.size}</p>}
            </div>
          </li>
        ))}
      </ul>

      {isAdmin && (
        <div className={styles.adminActions}>
          <h3>Actualizar Estado:</h3>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button
            onClick={handleStatusChange}
            disabled={loading}
            className={styles.updateStatusButton}
          >
            {loading ? "Actualizando..." : "Actualizar Estado"}
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
