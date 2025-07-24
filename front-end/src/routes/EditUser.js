import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/EditUser.module.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "customer" });
  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    axios.get(`${API_URL}/api/users/${id}`).then((res) => {
      setUser(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/api/users/${id}`, user);
    navigate("/users");
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Editar Usuario</h2>

      <div className={styles.formGroup}>
        <label>Nombre:</label>
        <input name="name" value={user.name} onChange={handleChange} required />
      </div>

      <div className={styles.formGroup}>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Rol:</label>
        <select name="role" value={user.role} onChange={handleChange}>
          <option value="customer">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>
          Guardar
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditUser;
