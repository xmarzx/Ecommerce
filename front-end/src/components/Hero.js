import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Hero.module.css";

function Hero() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/hero-images/get`);
        setHeroImages(response.data);
      } catch (error) {
        console.error("Error al obtener las imágenes del hero:", error);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % heroImages.length
        );
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [heroImages]);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.leftContent}>
        <div className={styles.textContent}>
          <div className={styles.bestseller}>
            <p className={styles.line}></p>
            <p className={styles.bestsellerText}>OUR BESTSELLERS</p>
          </div>
          <h1 className={styles.heading}>Latest Arrivals</h1>
          <div className={styles.shopNow}>
            <p className={styles.shopNowText}>SHOP NOW</p>
            <p className={styles.lineThin}></p>
          </div>
        </div>
      </div>
      <div className={styles.rightContent}>
        {heroImages.length > 0 && (
          <img
            className={styles.heroImage}
            // src={`${API_URL}/hero-images-static/${heroImages[currentImageIndex]}`}
            src={`${API_URL}/${heroImages[currentImageIndex]}`}
            alt="Hero"
          />
        )}
        {heroImages.length === 0 && (
          <p>No hay imágenes de héroe disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Hero;
