import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.scss";

import errorImg from "../../assets/images/500.png";

export default function Error500() {
  return (
    <div className="error-page">
      <img src={errorImg} alt="500" />

      <h1>Ошибка сервера</h1>
      <p>Произошла внутренняя ошибка. Попробуйте обновить страницу или зайти позже.</p>

      <Link to="/">На главную</Link>
    </div>
  );
}
