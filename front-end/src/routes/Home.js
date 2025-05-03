import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "../styles/Home.module.css";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();
  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/latest-products`);
        setLatestProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los últimos productos:", error);
      }
    };

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/best-sellers`);
        setBestSellers(response.data);
      } catch (error) {
        console.error("Error al obtener los best sellers:", error);
      }
    };

    fetchLatestProducts();
    fetchBestSellers();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Hero />
      <div className={styles.section}>
        <h2>Latest Collections</h2>
        <div className={styles.productList}>
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h2>Best Sellers</h2>
        <div className={styles.productList}>
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
