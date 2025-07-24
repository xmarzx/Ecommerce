import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/UserList.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const API_URL = `http://${window.location.hostname}:5000`;
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/api/users`);
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/api/users/${id}`);
      fetchUsers();
      Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Usuarios</h2>
      <button className={styles.addBtn} onClick={() => navigate("/add-user")}>
        + Agregar Usuario
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id_user}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => navigate(`/edit-user/${u.id_user}`)}
                >
                  Editar
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteUser(u.id_user)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
