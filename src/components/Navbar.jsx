import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import Logo from "../images/chiro_r.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          <img src={Logo} alt="Logo" className="logo" />
        </NavLink>

        <div className={`nav__menu ${isMenuOpen ? true : ""}`} id="nav-menu">
          <div className="hamburger" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>

          {isMenuOpen && (
            <div className="whitescreen">
            <ul className="hamburger__list">
              <li className="nav__item">
                <NavLink to="/" className="nav__link" onClick={toggleMenu}>
                  Home
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/fotos" className="nav__link" onClick={toggleMenu}>
                  Foto's
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/inschrijvingen"
                  className="nav__link"
                >
                  Inschrijvingen
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/info" className="nav__link" onClick={toggleMenu}>
                  Info
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/Leiding" className="nav__link" onClick={toggleMenu}>
                  Leiding
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/login" className="nav__link" onClick={toggleMenu}>
                  Log in
                </NavLink>
              </li>
              <span className="cross" onClick={toggleMenu}>
                  &times;
              </span>
            </ul>
            </div>
          )}

          <ul className="nav__list">
              <li className="nav__item">
                <NavLink to="/" className="nav__link">
                  Home
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/fotos" className="nav__link">
                  Foto's
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/inschrijvingen"
                  className="nav__link"
                >
                  Inschrijvingen
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/info" className="nav__link">
                  Info
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/Leiding" className="nav__link">
                  Leiding
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/login" className="nav__link">
                  Log in
                </NavLink>
              </li>
            </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;