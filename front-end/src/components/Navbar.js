import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
import { assets } from "../assets/assets";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/logo_ecommerce_complete.png";
import logoMobile from "../assets/logo_ecommerce_mobile.png";
import { AiOutlineSearch } from "react-icons/ai";

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
    <nav className={`${styles.navbar} ${menuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.navbarContainer} ref={navbarRef}>
        <div className={styles.navbarToggle} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
        <Link className={styles.navbarLogo}>
          {/* <span>Ecommerce</span>
          <span className={styles.logoHighlight}>Project</span> */}
          <img src={logo} alt="Ecommerce Project" className={styles.logoFull} />
          <div className={styles.logoShort}>
            <img src={logoMobile} alt="EP" className={styles.logoMobile} />
          </div>
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
              <li className={styles.navbarItem}>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.active}`
                      : styles.navbarLink
                  }
                  onClick={closeMenu}
                >
                  MANAGE USERS
                </NavLink>
              </li>
            </>
          )}

          {/* Enlaces de Autenticación en el menú móvil */}
          {!isAuthenticated && (
            <>
              {/* <li className={styles.navbarItem}>
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
              </li> */}
              {/* <li className={styles.navbarItem}>
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
              </li> */}
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
            </>
          )}
        </ul>

        <div className={styles.navbarSearch}>
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
          />
          <button className={styles.searchBtn}>
            <AiOutlineSearch />
          </button>
        </div>
        <div className={styles.navbarActions}>
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
                    <p
                      className={styles.profileMenuItem}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </p>
                    {isAdmin && <></>}
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
                      Iniciar Sesion
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
