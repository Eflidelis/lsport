import React from "react";
import "./TheRegionalStatistics.scss";
import AppArrowButton from "./AppArrowButton";


import RussiaMap from "../assets/images/russia.png";

const TheRegionalStatistics = () => {
  return (
    <section className="rs">
      <div className="rs-left">
        <h2 className="rs-title">Статистика по регионам</h2>
        <p className="rs-desc">
          Узнайте, как регионы вовлекаются в цифровой спорт: количество
          пользователей, активность тренеров и статистика проведённых мероприятий —
          на удобной карте в реальном времени
        </p>

        <AppArrowButton text="Смотреть" to="/statistics" />
      </div>

      <div className="rs-right">
        <img className="rs-map" src={RussiaMap} alt="Карта регионов России" />
      </div>
    </section>
  );
};

export default TheRegionalStatistics;
