import React from "react";
import "./TheFooter.scss";
import AppArrowButton from "./AppArrowButton";

const TheFooter = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <AppArrowButton text="Вход для сотрудников" to="/applications" />
      </div>
    </footer>
  );
};

export default TheFooter;
