import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.scss";

import errorImg from "../../assets/images/network.png";

export default function NetworkError() {
  return (
    <div className="error-page">
      <img src={errorImg} alt="network error" />

      <h1>Сеть недоступна</h1>
      <p>Не удалось подключиться к серверу. Проверьте интернет или попробуйте позже.</p>

      <Link to="/">На главную</Link>
    </div>
  );
}
