// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
// import { CartContext } from "../context/CartContext"; // Importa el contexto del carrito
// import { assets } from "../assets/assets";
// import styles from "../styles/Navbar.module.css";

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const navbarRef = useRef(null);
//   const profileRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const { cartItems } = useContext(CartContext); // Usa el contexto para obtener los items del carrito

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//     // Cierra el menú de perfil si está abierto al abrir/cerrar el menú principal
//     if (profileMenuOpen) setProfileMenuOpen(false);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   const toggleProfileMenu = () => {
//     setProfileMenuOpen(!profileMenuOpen);
//   };

//   // Efecto para manejar el scroll del navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   // // Efecto para manejar el clic fuera del menú móvil y del menú de perfil
//   // useEffect(() => {
//   //   const handleClickOutside = (event) => {
//   //     // Cierra el menú móvil si está abierto y el clic fue fuera del navbar
//   //     if (
//   //       navbarRef.current &&
//   //       !navbarRef.current.contains(event.target) &&
//   //       menuOpen
//   //     ) {
//   //       setMenuOpen(false);
//   //     }
//   //     // Cierra el menú de perfil si está abierto y el clic fue fuera del grupo de perfil
//   //     if (
//   //       profileRef.current &&
//   //       !profileRef.current.contains(event.target) &&
//   //       profileMenuOpen
//   //     ) {
//   //       setProfileMenuOpen(false);
//   //     }
//   //   };
//   //   document.addEventListener("mousedown", handleClickOutside);
//   //   return () => {
//   //     document.removeEventListener("mousedown", handleClickOutside);
//   //   };
//   // }, [menuOpen, profileMenuOpen]); // Dependencias: menuOpen y profileMenuOpen

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Cierra el menú móvil si está abierto y el clic fue fuera del menú móvil
//       // y no fue en el botón de toggle (hamburguesa/X)
//       if (
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(event.target) &&
//         navbarRef.current && // Asegúrate de que el clic no sea en el toggle del navbar
//         !navbarRef.current
//           .querySelector(`.${styles.navbarToggle}`)
//           .contains(event.target) &&
//         menuOpen
//       ) {
//         setMenuOpen(false);
//       }

//       // Cierra el menú de perfil si está abierto y el clic fue fuera del grupo de perfil
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target) &&
//         profileMenuOpen
//       ) {
//         setProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuOpen, profileMenuOpen]);

//   // Calcula la cantidad total de items en el carrito
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <nav
//       className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
//         menuOpen ? styles.menuOpen : ""
//       }`}
//     >
//       <div className={styles.navbarContainer} ref={navbarRef}>
//         {/* Botón de Hamburguesa (visible cuando el menú está cerrado) */}
//         <div
//           className={styles.navbarToggle}
//           onClick={toggleMenu} // Añadimos una clase condicional para ocultarlo cuando el menú está abierto // Ya no transformamos el mismo elemento en X, la X será un elemento nuevo. // Por lo tanto, quitamos el active del navbarToggle aquí.
//         >
//           <span className={styles.bar}></span>
//           <span className={styles.bar}></span>
//           <span className={styles.bar}></span>
//         </div>
//         {/* logo */}
//         <Link to="/" className={styles.navbarLogo}>
//           <span>Ecommerce</span>
//           <span className={styles.logoHighlight}>Project</span>
//         </Link>
//         {/* Overlay del menú (nuevo elemento) */}
//         {menuOpen && (
//           <div className={styles.mobileMenuOverlay} onClick={closeMenu}></div>
//         )}
//         {/* Menu Principal (los enlaces de navegación) - Ahora con ref */}
//         <ul
//           className={`${styles.navbarMenu} ${menuOpen ? styles.active : ""}`}
//           ref={mobileMenuRef}
//         >
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               HOME
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/collection"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               COLLECTION
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               ABOUT
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/contact"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               CONTACT
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/addproducts"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               ADD PRODUCT
//             </NavLink>
//           </li>
//         </ul>
//         {/* Acciones del Navbar (buscador, perfil, carrito) */}
//         <div className={styles.navbarActions}>
//           {/* Campo de búsqueda y botón */}
//           <div className={styles.navbarSearch}>
//             <input
//               type="text"
//               placeholder="Buscar..."
//               className={styles.searchInput}
//             />
//             <button className={styles.searchBtn}>
//               <i className="fas fa-search"></i>
//             </button>
//           </div>
//           {/* Ícono de Perfil con Dropdown */}
//           <div className={styles.profileGroup} ref={profileRef}>
//             <img
//               src={assets.profile_icon}
//               className={styles.icon}
//               alt="Profile"
//               onClick={toggleProfileMenu}
//             />
//             <div
//               className={`${styles.profileDropdown} ${
//                 profileMenuOpen ? styles.show : ""
//               }`}
//             >
//               <div className={styles.profileMenu}>
//                 <p className={styles.profileMenuItem}>My Profile</p>
//                 <p className={styles.profileMenuItem}>Orders</p>
//                 <p className={styles.profileMenuItem}>Logout</p>
//               </div>
//             </div>
//           </div>
//           {/* Ícono de Carrito */}
//           <Link to="/cart" className={styles.cartLink}>
//             <img src={assets.cart_icon} className={styles.icon} alt="Cart" />
//             <p className={styles.cartCount}>{itemCount}</p>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
// import { assets } from "../assets/assets";
// import styles from "../styles/Navbar.module.css";

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const navbarRef = useRef(null);
//   const profileRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const { cartItems } = useContext(CartContext);
//   const { isAuthenticated, user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//     if (profileMenuOpen) setProfileMenuOpen(false); // Cierra menú de perfil si se abre/cierra menú principal
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   const toggleProfileMenu = () => {
//     setProfileMenuOpen(!profileMenuOpen);
//   };

//   const handleLogout = () => {
//     logout(); // Llama a la función de logout del AuthContext
//     setProfileMenuOpen(false); // Cierra el menú de perfil después de cerrar sesión
//     closeMenu(); // Cierra el menú móvil si está abierto
//     navigate("/"); // Opcional: Redirige al inicio después de cerrar sesión
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Cierra el menú móvil si está abierto y el clic fue fuera del menú móvil
//       if (
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(event.target) &&
//         navbarRef.current &&
//         !navbarRef.current
//           .querySelector(`.${styles.navbarToggle}`)
//           .contains(event.target) &&
//         menuOpen
//       ) {
//         setMenuOpen(false);
//       }

//       // Cierra el menú de perfil si está abierto y el clic fue fuera del grupo de perfil
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target) &&
//         profileMenuOpen
//       ) {
//         setProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuOpen, profileMenuOpen]);

//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <nav
//       className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
//         menuOpen ? styles.menuOpen : ""
//       }`}
//     >
//       <div className={styles.navbarContainer} ref={navbarRef}>
//         {/* Botón de Hamburguesa */}
//         <div className={styles.navbarToggle} onClick={toggleMenu}>
//           <span className={styles.bar}></span>
//           <span className={styles.bar}></span>
//           <span className={styles.bar}></span>
//         </div>
//         {/* logo */}
//         <Link to="/" className={styles.navbarLogo}>
//           <span>Ecommerce</span>
//           <span className={styles.logoHighlight}>Project</span>
//         </Link>
//         {/* Overlay del menú (nuevo elemento) */}
//         {menuOpen && (
//           <div className={styles.mobileMenuOverlay} onClick={closeMenu}></div>
//         )}
//         {/* Menu Principal (los enlaces de navegación) - Ahora con ref */}
//         <ul
//           className={`${styles.navbarMenu} ${menuOpen ? styles.active : ""}`}
//           ref={mobileMenuRef}
//         >
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               HOME
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/collection"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               COLLECTION
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               ABOUT
//             </NavLink>
//           </li>
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/contact"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               CONTACT
//             </NavLink>
//           </li>
//           {/* Solo para administradores o desarrollo: */}
//           <li className={styles.navbarItem}>
//             <NavLink
//               to="/addproducts"
//               className={({ isActive }) =>
//                 isActive
//                   ? `${styles.navbarLink} ${styles.active}`
//                   : styles.navbarLink
//               }
//               onClick={closeMenu}
//             >
//               ADD PRODUCT
//             </NavLink>
//           </li>
//           {/* Mostrar enlaces de Autenticación en el menú móvil (como antes) */}
//           {!isAuthenticated && (
//             <>
//               <li className={styles.navbarItem}>
//                 <NavLink
//                   to="/login"
//                   className={({ isActive }) =>
//                     isActive
//                       ? `${styles.navbarLink} ${styles.active}`
//                       : styles.navbarLink
//                   }
//                   onClick={closeMenu}
//                 >
//                   INICIAR SESIÓN
//                 </NavLink>
//               </li>
//               <li className={styles.navbarItem}>
//                 <NavLink
//                   to="/register"
//                   className={({ isActive }) =>
//                     isActive
//                       ? `${styles.navbarLink} ${styles.active}`
//                       : styles.navbarLink
//                   }
//                   onClick={closeMenu}
//                 >
//                   REGISTRARSE
//                 </NavLink>
//               </li>
//             </>
//           )}
//           {isAuthenticated && (
//             <>
//               <li className={styles.navbarItem}>
//                 <NavLink
//                   to="/orders"
//                   className={({ isActive }) =>
//                     isActive
//                       ? `${styles.navbarLink} ${styles.active}`
//                       : styles.navbarLink
//                   }
//                   onClick={closeMenu}
//                 >
//                   MIS PEDIDOS
//                 </NavLink>
//               </li>
//               {/* REMOVIDO: El botón de cerrar sesión principal, ahora solo estará en el dropdown */}
//               {/* <li className={styles.navbarItem}>
//                 <button onClick={handleLogout} className={styles.logoutButton}>
//                   CERRAR SESIÓN
//                 </button>
//               </li> */}
//             </>
//           )}
//         </ul>
//         {/* Acciones del Navbar (buscador, perfil, carrito) */}
//         <div className={styles.navbarActions}>
//           {/* Campo de búsqueda y botón */}
//           <div className={styles.navbarSearch}>
//             <input
//               type="text"
//               placeholder="Buscar..."
//               className={styles.searchInput}
//             />
//             <button className={styles.searchBtn}>
//               <i className="fas fa-search"></i>
//             </button>
//           </div>
//           {/* Ícono de Perfil con Dropdown */}
//           <div className={styles.profileGroup} ref={profileRef}>
//             <img
//               src={assets.profile_icon}
//               className={styles.icon}
//               alt="Profile"
//               onClick={toggleProfileMenu}
//             />
//             <div
//               className={`${styles.profileDropdown} ${
//                 profileMenuOpen ? styles.show : ""
//               }`}
//             >
//               <div className={styles.profileMenu}>
//                 {isAuthenticated ? (
//                   <>
//                     <p className={styles.profileGreeting}>
//                       Hola, {user?.name || "Usuario"}!
//                     </p>
//                     <Link
//                       to="/orders"
//                       className={styles.profileMenuItem}
//                       onClick={() => {
//                         setProfileMenuOpen(false);
//                         closeMenu();
//                       }}
//                     >
//                       Mis Pedidos
//                     </Link>
//                     {/* Botón de Cerrar Sesión DENTRO del Dropdown */}
//                     <p
//                       className={styles.profileMenuItem}
//                       onClick={handleLogout}
//                     >
//                       Cerrar Sesión
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to="/login"
//                       className={styles.profileMenuItem}
//                       onClick={() => {
//                         setProfileMenuOpen(false);
//                         closeMenu();
//                       }}
//                     >
//                       Iniciar Sesión
//                     </Link>
//                     <Link
//                       to="/register"
//                       className={styles.profileMenuItem}
//                       onClick={() => {
//                         setProfileMenuOpen(false);
//                         closeMenu();
//                       }}
//                     >
//                       Registrarse
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Ícono de Carrito */}
//           <Link to="/cart" className={styles.cartLink} onClick={closeMenu}>
//             <img src={assets.cart_icon} className={styles.icon} alt="Cart" />
//             <p className={styles.cartCount}>{itemCount}</p>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// src/components/Navbar.js (extracto)
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
import { assets } from "../assets/assets";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext); // Añadir isAdmin
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    closeMenu();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        navbarRef.current &&
        !navbarRef.current
          .querySelector(`.${styles.navbarToggle}`)
          .contains(event.target) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profileMenuOpen
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, profileMenuOpen]);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        menuOpen ? styles.menuOpen : ""
      }`}
    >
      <div className={styles.navbarContainer} ref={navbarRef}>
        <div className={styles.navbarToggle} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
        <Link to="/" className={styles.navbarLogo}>
          <span>Ecommerce</span>
          <span className={styles.logoHighlight}>Project</span>
        </Link>
        {menuOpen && (
          <div className={styles.mobileMenuOverlay} onClick={closeMenu}></div>
        )}
        <ul
          className={`${styles.navbarMenu} ${menuOpen ? styles.active : ""}`}
          ref={mobileMenuRef}
        >
          <li className={styles.navbarItem}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.active}`
                  : styles.navbarLink
              }
              onClick={closeMenu}
            >
              HOME
            </NavLink>
          </li>
          <li className={styles.navbarItem}>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.active}`
                  : styles.navbarLink
              }
              onClick={closeMenu}
            >
              COLLECTION
            </NavLink>
          </li>
          <li className={styles.navbarItem}>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.active}`
                  : styles.navbarLink
              }
              onClick={closeMenu}
            >
              ABOUT
            </NavLink>
          </li>
          <li className={styles.navbarItem}>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.active}`
                  : styles.navbarLink
              }
              onClick={closeMenu}
            >
              CONTACT
            </NavLink>
          </li>

          {/* Enlaces de ADMIN solo si el usuario es administrador */}
          {isAdmin && (
            <>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/addproducts"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  ADD PRODUCT
                </NavLink>
              </li>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/listImages"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  LIST IMAGES
                </NavLink>
              </li>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/listHeroImages"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  LIST HERO IMAGES
                </NavLink>
              </li>
            </>
          )}

          {/* Enlaces de Autenticación en el menú móvil (como antes) */}
          {!isAuthenticated && (
            <>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  INICIAR SESIÓN
                </NavLink>
              </li>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  REGISTRARSE
                </NavLink>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li className={styles.navbarItem}>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  MY ORDERS
                </NavLink>
              </li>
              {/* El botón de cerrar sesión principal se ha movido al dropdown del perfil */}
            </>
          )}
        </ul>
        <div className={styles.navbarActions}>
          <div className={styles.navbarSearch}>
            <input
              type="text"
              placeholder="Buscar..."
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className={styles.profileGroup} ref={profileRef}>
            <img
              src={assets.profile_icon}
              className={styles.icon}
              alt="Profile"
              onClick={toggleProfileMenu}
            />
            <div
              className={`${styles.profileDropdown} ${
                profileMenuOpen ? styles.show : ""
              }`}
            >
              <div className={styles.profileMenu}>
                {isAuthenticated ? (
                  <>
                    <p className={styles.profileGreeting}>
                      Hola, {user?.name || "Usuario"}!
                    </p>
                    <Link
                      to="/orders"
                      className={styles.profileMenuItem}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        closeMenu();
                      }}
                    >
                      Mis Pedidos
                    </Link>
                    {/* Botón de Cerrar Sesión DENTRO del Dropdown */}
                    <p
                      className={styles.profileMenuItem}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </p>
                    {/* Enlaces de Admin en el dropdown también, si aplica */}
                    {isAdmin && (
                      <>
                        <Link
                          to="/addproducts"
                          className={styles.profileMenuItem}
                          onClick={() => {
                            setProfileMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          Add Product
                        </Link>
                        <Link
                          to="/listImages"
                          className={styles.profileMenuItem}
                          onClick={() => {
                            setProfileMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          List Images
                        </Link>
                        <Link
                          to="/listHeroImages"
                          className={styles.profileMenuItem}
                          onClick={() => {
                            setProfileMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          List Hero Images
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.profileMenuItem}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        closeMenu();
                      }}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className={styles.profileMenuItem}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        closeMenu();
                      }}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <Link to="/cart" className={styles.cartLink} onClick={closeMenu}>
            <img src={assets.cart_icon} className={styles.icon} alt="Cart" />
            <p className={styles.cartCount}>{itemCount}</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
