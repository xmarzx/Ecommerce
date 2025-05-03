import React from "react";
import styles from "../styles/ProductCard.module.css";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const API_URL = `http://${window.location.hostname}:5000`;
  let imageUrl = "default_image";

  if (product && product.image) {
    imageUrl = `${API_URL}/${product.image}`;
  }

  // console.log(imageUrl);
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className={styles.productCard}
      onClick={handleProductClick}
      style={{ cursor: "pointer" }}
    >
      <img src={imageUrl} alt={product.name} className={styles.productImage} />
      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.productPrice}>${product.price}</p>
    </div>
  );
}

export default ProductCard;
