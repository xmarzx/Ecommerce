import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/AddUser.module.css";
import Swal from "sweetalert2";

function AddUser() {
  const navigate = useNavigate();
  const API_URL = `http://${window.location.hostname}:5000`;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users`, user);
      navigate("/users");
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      if (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.toLowerCase().includes("correo")
      ) {
        Swal.fire({
          icon: "error",
          title: "Correo ya registrado",
          text: "Por favor, utiliza otro correo electrónico.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al crear el usuario.",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Agregar Nuevo Usuario (Admin)</h2>

        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <label>Rol:</label>
        <select name="role" value={user.role} onChange={handleChange}>
          <option value="admin">Administrador</option>
          <option value="customer">Cliente</option>
        </select>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveBtn}>
            Guardar
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/users")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
