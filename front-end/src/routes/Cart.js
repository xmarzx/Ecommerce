import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Cart.module.css";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantityValue = parseInt(newQuantity, 10);
    if (!isNaN(quantityValue) && quantityValue > 0) {
      const itemToUpdate = cartItems.find((item) => item.id === itemId);
      if (itemToUpdate) {
        if (quantityValue > itemToUpdate.quantity) {
          addToCart({
            ...itemToUpdate,
            quantity: quantityValue - itemToUpdate.quantity,
          });
        } else if (quantityValue < itemToUpdate.quantity) {
          removeFromCart(itemId, itemToUpdate.quantity - quantityValue);
        }
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h1>Tu Carrito de Compras</h1>
          <button className={styles.clearCartButton} onClick={clearCart}>
            Vaciar Carrito
          </button>
        </div>
        <p>Tu carrito está vacío.</p>
        <Link to="/collection">
          <button className={styles.continueShoppingButton}>
            Seguir Comprando
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1>Tu Carrito de Compras</h1>
        <button className={styles.clearCartButton} onClick={clearCart}>
          Vaciar Carrito
        </button>
      </div>
      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <img
                src={`http://${window.location.hostname}:5000/${item.image}`}
                alt={item.name}
              />
            </div>
            <div className={styles.itemDetails}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemPrice}>
                Precio: ${item.price.toFixed(2)}
              </p>
              {item.size && (
                <p className={styles.itemSize}>Talla: {item.size}</p>
              )}
              <div className={styles.itemQuantity}>
                <label>Cantidad: </label>
                {/* <span>{item.quantity}</span> */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                />
              </div>
            </div>
            <button
              className={styles.removeItem}
              onClick={() => removeFromCart(item.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className={styles.cartSummaryContainer}>
        <h2 className={styles.orderSummaryTitle}>Resumen de la Orden</h2>
        <div className={styles.cartSummary}>
          <p className={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</p>
          <Link to="/checkout">
            <button className={styles.checkoutButton}>Proceder al Pago</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
