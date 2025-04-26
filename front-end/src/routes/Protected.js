import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ Component }) => {
  const navigate = useNavigate();
  const login = localStorage.getItem("login");

  useEffect(() => {
    if (!login) {
      navigate("/", { replace: true }); // Si no está logueado, redirige al login
    } else if (window.location.pathname === "/signup") {
      navigate("/dashboard", { replace: true }); // Si intenta ir a signup logueado, lo manda al dashboard
    }
  }, [navigate, login]);

  return <Component />;
};

export default Protected;
