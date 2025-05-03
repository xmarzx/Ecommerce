import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { CartContext } from "../context/CartContext"; // Importa el contexto del carrito
import { assets } from "../assets/assets";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const { cartItems } = useContext(CartContext); // Usa el contexto para obtener los items del carrito

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Calcula la cantidad total de items en el carrito
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={styles.navbarContainer} ref={navbarRef}>
      <img src={assets.logo_idat} className={styles.navbarLogo} alt="" />
      <ul className={`${styles.navbarLinks} ${menuOpen ? styles.active : ""}`}>
        <li className={styles.mobileCloseButton} onClick={closeMenu}>
          Back
        </li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.navbarLink} ${styles.active}`
              : styles.navbarLink
          }
          onClick={closeMenu}
        >
          {({ isActive }) => (
            <>
              <p className={styles.navbarLinkText}>HOME</p>
              {isActive && <hr className={styles.navbarLinkLine} />}
            </>
          )}
        </NavLink>

        <NavLink
          to="/collection"
          className={({ isActive }) =>
            isActive
              ? `${styles.navbarLink} ${styles.active}`
              : styles.navbarLink
          }
          onClick={closeMenu}
        >
          {({ isActive }) => (
            <>
              <p className={styles.navbarLinkText}>COLLECTION</p>
              {isActive && <hr className={styles.navbarLinkLine} />}
            </>
          )}
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? `${styles.navbarLink} ${styles.active}`
              : styles.navbarLink
          }
          onClick={closeMenu}
        >
          {({ isActive }) => (
            <>
              <p className={styles.navbarLinkText}>ABOUT</p>
              {isActive && <hr className={styles.navbarLinkLine} />}
            </>
          )}
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? `${styles.navbarLink} ${styles.active}`
              : styles.navbarLink
          }
          onClick={closeMenu}
        >
          {({ isActive }) => (
            <>
              <p className={styles.navbarLinkText}>CONTACT</p>
              {isActive && <hr className={styles.navbarLinkLine} />}
            </>
          )}
        </NavLink>
        {/* <NavLink
          to="/listImages"
          className={({ isActive }) =>
            isActive
              ? `${styles.navbarLink} ${styles.active}`
              : styles.navbarLink
          }
          onClick={closeMenu}
        >
          {({ isActive }) => (
            <>
              <p className={styles.navbarLinkText}>LISTIMAGES</p>
              {isActive && <hr className={styles.navbarLinkLine} />}
            </>
          )}
        </NavLink> */}
      </ul>
      <div className={styles.navbarIcons}>
        <img src={assets.search_icon} className={styles.icon} alt="Search" />

        <div className={styles.profileGroup}>
          <img
            src={assets.profile_icon}
            className={styles.icon}
            alt="Profile"
          />
          <div className={styles.profileDropdown}>
            <div className={styles.profileMenu}>
              <p className={styles.profileMenuItem}>My Profile</p>
              <p className={styles.profileMenuItem}>Orders</p>
              <p className={styles.profileMenuItem}>Logout</p>
            </div>
          </div>
        </div>

        <Link to="/cart" className={styles.cartLink}>
          <img src={assets.cart_icon} className={styles.icon} alt="Cart" />
          <p className={styles.cartCount}>{itemCount}</p>{" "}
          {/* Usa itemCount aquí */}
        </Link>

        <div className={styles.menuIcon} onClick={toggleMenu}>
          {menuOpen ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
