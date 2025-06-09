import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../styles/OrderConfirmation.module.css";

function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      // navigate('/');
    }
  }, [orderId]);

  return (
    <div className={styles.confirmationContainer}>
      <h1 className={styles.confirmationTitle}>¡Gracias por tu compra!</h1>
      <p className={styles.confirmationMessage}>
        Tu pedido ha sido procesado exitosamente.
      </p>
      {orderId && (
        <p className={styles.orderId}>
          Número de Orden: <strong>#{orderId}</strong>
        </p>
      )}
      <p className={styles.instructions}>
        Recibirás una confirmación por correo electrónico con los detalles de tu
        pedido.
      </p>
      <div className={styles.actionButtons}>
        <Link to="/collection" className={styles.continueShoppingButton}>
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
