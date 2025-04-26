import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  function logoutSubmit() {
    localStorage.removeItem("login");
    localStorage.setItem("loginStatus", "Cierre de sesion exitoso");
    navigate("/");
  }

  //   logoutSubmit();

  return <div>Dashboard</div>;
}

export default Dashboard;
