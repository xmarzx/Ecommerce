import React from "react";
import styles from "../styles/Logo.module.css";

function Logo({ imagen }) {
  return <img className={styles.contenedorLogo} src={imagen} alt="logo" />;
}

export default Logo;
