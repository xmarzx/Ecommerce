// import React from "react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Protected = ({ Component }) => {
//   const navigate = useNavigate();
//   const login = localStorage.getItem("login");

//   useEffect(() => {
//     if (!login) {
//       navigate("/", { replace: true });
//     } else if (window.location.pathname === "/signup") {
//       navigate("/home", { replace: true });
//     }
//   }, [navigate, login]);

//   return <Component />;
// };

// export default Protected;
