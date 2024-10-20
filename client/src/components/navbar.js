import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/logo.png";

const Navbar = () => {

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
       
      </div>
    </div>
  );
};

export default Navbar;
