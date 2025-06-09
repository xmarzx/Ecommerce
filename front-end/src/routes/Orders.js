import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import styles from "../styles/Orders.module.css";

function Orders() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        let response;
        if (isAdmin) {
          response = await axios.get("/admin/orders");
        } else {
          response = await axios.get("/orders/user");
        }
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          "Error al cargar los pedidos. Por favor, inténtalo de nuevo más tarde."
        );
        toast.error("Error al cargar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return <div className={styles.loading}>Cargando pedidos...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.message}>
        Por favor, inicia sesión para ver tus pedidos.
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <h2>{isAdmin ? "Todos los Pedidos" : "Mis Pedidos"}</h2>
      {orders.length === 0 ? (
        <div className={styles.noOrders}>No hay pedidos para mostrar.</div>
      ) : (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <div className={styles.orderHeader}>
                <span>Pedido #{order.id}</span>
                <span>
                  Fecha: {new Date(order.created_at).toLocaleDateString()}
                </span>
                <span>Total: ${parseFloat(order.total).toFixed(2)}</span>
                <span
                  className={`${styles.status} ${
                    styles[order.status.toLowerCase()]
                  }`}
                >
                  Estado: {order.status}
                </span>
                {isAdmin && order.user_name && (
                  <span className={styles.userName}>
                    Cliente: {order.user_name} ({order.user_email})
                  </span>
                )}
              </div>
              <div className={styles.orderDetailsLink}>
                <Link to={`/orders/${order.id}`}>Ver Detalles</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;
