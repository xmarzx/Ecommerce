// //COMANDO PARA IMPORTAR REACT
// // rfce
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Validation from "../validations/LoginValidation";
// import logoIdat from "../assets/logo_idat.png";
// import styles from "../styles/Login.module.css";
// import stylesLogo from "../styles/Logo.module.css";

// function Login() {
//   const navigate = useNavigate();

//   const [values, setValues] = useState({
//     user: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [authError, setAuthError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   // ************************************** //
//   const [stateLoginError, setStateLoginError] = useState("");
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     let login = localStorage.getItem("login");
//     if (login) {
//       navigate("/");
//     }
//     let loginStatus = localStorage.getItem("loginStatus");
//     console.log(loginStatus);
//     //Cerrar Sesión
//     if (loginStatus) {
//       setStateLoginError(loginStatus);
//       setTimeout(function () {
//         localStorage.clear();
//         window.location.reload();
//       }, 1000);
//     }
//     setTimeout(function () {
//       setMsg("");
//     }, 2000);
//   }, [msg, navigate]);

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     const validationError = Validation({ [name]: value });

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: validationError[name],
//     }));
//   };

//   function handleSubmit(event) {
//     event.preventDefault();

//     const validationErrors = Validation(values);
//     setErrors(validationErrors);

//     if (!validationErrors.user && !validationErrors.password) {
//       axios
//         .post(`http://${window.location.hostname}:5000/login`, values)
//         .then((res) => {
//           if (res.data.message === "Login Seccessfully") {
//             setAuthError("");
//             setSuccessMessage("Login exitoso, redireccionando...");
//             setTimeout(() => {
//               localStorage.setItem("login", "true");
//               localStorage.setItem("userRole", res.data.role);
//               localStorage.setItem("usuario", res.data.usuario);
//               localStorage.setItem("year", res.data.year);
//               navigate("/");
//             }, 2000);
//           } else if (res.data.message === "Usuario o contraseña incorrectos") {
//             setAuthError("Usuario o contraseña incorrectos");
//             setSuccessMessage("");
//           } else if (res.data.message === "Usuario inhabilitado") {
//             setAuthError(
//               "Usuario inhabilitado, ponganse en contacto con soporte"
//             );
//             setSuccessMessage("");
//           }
//         })
//         .catch((err) => console.log(err));
//     } else {
//       console.log("No pasó el if", validationErrors);
//     }
//   }

//   return (
//     <>
//       <div className={styles.loginContainer}>
//         <div className={stylesLogo.contenedorLogoIdat}>
//           <img className={stylesLogo.logoIdat} src={logoIdat} alt="" />
//         </div>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <h1 className={styles.tituloLogin}>Iniciar Sesión</h1>
//           <input
//             placeholder="Por favor, ingresa tu usuario"
//             className={styles.input}
//             type="text"
//             onChange={handleInput}
//             name="user"
//           />
//           {errors.user && <span className={styles.error}>{errors.user}</span>}

//           <input
//             placeholder="Y aquí tu contraseña"
//             className={styles.input}
//             type="password"
//             onChange={handleInput}
//             name="password"
//           />
//           {errors.password && (
//             <span className={styles.error}>{errors.password}</span>
//           )}
//           {authError && <span className={styles.error}>{authError}</span>}
//           {successMessage && (
//             <span className={styles.success}>{successMessage}</span>
//           )}

//           <label> </label>
//           <input type="submit" value="Login" className={styles.button} />

//           <div className={styles.contenedorLink}>
//             <Link className={styles.link} to="/">
//               ¿Olvidaste la contraseña?
//             </Link>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }

// export default Login;
