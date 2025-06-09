import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axiosConfig";
import styles from "../styles/Checkout.module.css";
import { toast } from "react-hot-toast";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Peru",
    paymentMethod: "cash_on_delivery",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);

    if (cartItems.length === 0 && !isSubmittingRef.current) {
      toast.error(
        "Tu carrito está vacío. Agrega productos para proceder al pago."
      );
      navigate("/cart");
    }

    if (isAuthenticated && user) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [cartItems, navigate, isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim())
      errors.fullName = "El nombre completo es requerido.";
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El correo electrónico no es válido.";
    }
    if (!formData.address.trim()) errors.address = "La dirección es requerida.";
    if (!formData.city.trim()) errors.city = "La ciudad es requerida.";
    if (!formData.postalCode.trim())
      errors.postalCode = "El código postal es requerido.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);
    isSubmittingRef.current = true;
    try {
      const orderData = {
        total: subtotal,
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
        })),
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        payment_method: formData.paymentMethod,
      };

      console.log("Datos de la orden a enviar:", orderData);

      const response = await axios.post("/orders", orderData);

      console.log("Orden procesada exitosamente:", response.data);
      toast.success("¡Tu orden ha sido procesada exitosamente!");

      clearCart();
      navigate("/order-confirmation", {
        state: { orderId: response.data.orderId },
      });
    } catch (error) {
      console.error("Error durante el checkout:", error);
      const errorMessage =
        error.response?.data?.message || "Error al procesar la orden.";
      toast.error(`Error al procesar la orden: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Checkout</h1>
      <div className={styles.checkoutContent}>
        <div className={styles.shippingDetails}>
          <h2>Detalles de Envío y Contacto</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={formErrors.fullName ? styles.inputError : ""}
                disabled={loading}
              />
              {formErrors.fullName && (
                <p className={styles.errorText}>{formErrors.fullName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? styles.inputError : ""}
                disabled={loading}
              />
              {formErrors.email && (
                <p className={styles.errorText}>{formErrors.email}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Dirección</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={formErrors.address ? styles.inputError : ""}
                disabled={loading}
              />
              {formErrors.address && (
                <p className={styles.errorText}>{formErrors.address}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">Ciudad</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={formErrors.city ? styles.inputError : ""}
                disabled={loading}
              />
              {formErrors.city && (
                <p className={styles.errorText}>{formErrors.city}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postalCode">Código Postal</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={formErrors.postalCode ? styles.inputError : ""}
                disabled={loading}
              />
              {formErrors.postalCode && (
                <p className={styles.errorText}>{formErrors.postalCode}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country">País</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <h2>Método de Pago</h2>
            <div className={styles.formGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === "cash_on_delivery"}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                Pago contra entrega
              </label>
            </div>

            <button
              type="submit"
              className={styles.placeOrderButton}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : `Confirmar Compra ($${subtotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        <div className={styles.orderSummary}>
          <h2>Resumen del Pedido</h2>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <img
                src={`${axios.defaults.baseURL.replace("/api", "")}/${
                  item.image
                }`}
                alt={item.name}
                className={styles.orderItemImage}
              />
              <div className={styles.orderItemDetails}>
                <h3>{item.name}</h3>
                <p>Cantidad: {item.quantity}</p>
                {item.size && <p>Talla: {item.size}</p>}
                <p>Precio: ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className={styles.summaryTotals}>
            <p>
              Subtotal: <span>${subtotal.toFixed(2)}</span>
            </p>
            <p>
              Envío: <span>$0.00</span>
            </p>
            <h3>
              Total: <span>${subtotal.toFixed(2)}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
