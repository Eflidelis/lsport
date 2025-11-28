import React from "react";
import "./TheExtraInfo.scss";

import qrVK from "../assets/images/qr/vk.png";
import qrTG from "../assets/images/qr/telegram.png";

const TheExtraInfo = () => {
  return (
    <div className="extra-info container">
      <h2 className="extra-title">А если вы не организация?</h2>
      <p className="extra-subtitle">
        Больше информации для частных лиц
      </p>

      <div className="extra-qr-row">
        {/* ВК */}
        <div className="qr-card">
          <a href="https://m.vk.com/lsport_net" target="_blank" rel="noreferrer">
            <img src={qrVK} alt="QR VK" className="qr-image" />
          </a>
          <p>
            Наша <a href="https://m.vk.com/lsport_net" target="_blank" rel="noreferrer">страничка ВКонтакте</a>
          </p>
        </div>

        {/* Telegram */}
        <div className="qr-card">
          <a href="https://t.me/business_lsport" target="_blank" rel="noreferrer">
            <img src={qrTG} alt="QR Telegram" className="qr-image" />
          </a>
          <p>
            Наш <a href="https://t.me/business_lsport" target="_blank" rel="noreferrer">чат техподдержки</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheExtraInfo;
