import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/ListImages.module.css";

function ListHeroImages() {
  const [file, setFile] = useState(null);
  const [heroImagesList, setHeroImagesList] = useState([]);

  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/hero-images/get`);
        setHeroImagesList(res.data);
      } catch (error) {
        console.error("Error al obtener imágenes:", error);
      }
    };
    fetchImages();
  }, []);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Debes escoger algún archivo");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`${API_URL}/hero-images/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      document.getElementById("fileinput").value = null;

      const res = await axios.get(`${API_URL}/hero-images/get`);
      setHeroImagesList(res.data);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <span className={styles.brand}>Hero Image</span>
      </nav>

      <div className={styles.main}>
        <div className={styles.uploadCard}>
          <input
            id="fileinput"
            type="file"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          <button onClick={handleUpload} className={styles.uploadButton}>
            Upload
          </button>
        </div>

        <div className={styles.grid}>
          {heroImagesList.map((image, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                <img
                  // src={`${API_URL}/hero-images-static/${image}`}
                  src={`${API_URL}/${image}`}
                  alt={`img-${idx}`}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListHeroImages;
