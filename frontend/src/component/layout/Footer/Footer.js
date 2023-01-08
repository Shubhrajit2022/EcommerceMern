import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/appstore.png";
import "./Footer.css";
import logo from "../../../images/logo.png";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
      <img src={logo} alt="playstore" />
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Shubhr@coder</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/snarky_xoxo">Instagram</a>
        <a href="https://www.linkedin.com/in/shubhrajit-nath">LinkedIn</a>
        <a href="https://www.facebook.com/shubhrajit.nath.50">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;