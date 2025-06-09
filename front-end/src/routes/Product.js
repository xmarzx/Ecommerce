import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Product.module.css";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";

function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/products/${productId}`
        );
        setProduct(response.data);
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(null);
        } else {
          setSelectedSize(null);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/related/${productId}`
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos relacionados:", error);
      }
    };

    fetchProductDetails();
    fetchRelatedProducts();
  }, [productId, API_URL]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (
      product.sizes &&
      Array.isArray(product.sizes) &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      toast.error(
        "Por favor, selecciona una talla antes de agregar al carrito."
      );
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.image,
    };

    addToCart(cartItem);
    toast.success(
      `${quantity} ${product.name} ${
        selectedSize ? `(Talla: ${selectedSize})` : ""
      } agregado(s) al carrito!`
    );
    // setTimeout(() => navigate("/cart"), 1000);
  };

  if (loading) {
    return <div>Cargando producto...</div>;
  }

  if (error) {
    return <div>Error al cargar el producto: {error}</div>;
  }

  if (!product) {
    return <div>Producto no encontrado.</div>;
  }

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.productMainInfo}>
        <div className={styles.productImage}>
          <img src={`${API_URL}/${product.image}`} alt={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productPrice}>${product.price.toFixed(2)}</p>

          <p className={styles.productDescription}>{product.description}</p>

          {product.sizes &&
            Array.isArray(product.sizes) &&
            product.sizes.length > 0 && (
              <div className={styles.sizes}>
                <label>Talla:</label>
                <div className={styles.sizeOptions}>
                  {Array.isArray(product.sizes) &&
                    product.sizes.map((size) => (
                      <div
                        key={size}
                        className={`${styles.sizeOption} ${
                          selectedSize === size ? styles.selected : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </div>
                    ))}
                </div>
              </div>
            )}
          <div className={styles.quantity}>
            <label>Cantidad:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </div>
          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Productos Relacionados</h2>
          <div className={styles.relatedProductsList}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
