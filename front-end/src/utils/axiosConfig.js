// src/utils/axiosConfig.js
import axios from "axios";

// Define la URL base de tu API
axios.defaults.baseURL = `http://${window.location.hostname}:5000/api`; // Prefijo para todas las rutas API

// Interceptor para añadir el token a cada solicitud si está disponible en localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios; // Exporta la instancia configurada de axios
