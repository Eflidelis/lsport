import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.scss";

import errorImg from "../../assets/images/404.png";

export default function Error404() {
  return (
    <div className="error-page">
      <img src={errorImg} alt="404" />

      <h1>Страница не найдена</h1>
      <p>Похоже, такой страницы не существует. Проверьте адрес или вернитесь на главную.</p>

      <Link to="/">На главную</Link>
    </div>
  );
}
