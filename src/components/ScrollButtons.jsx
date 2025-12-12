import React from "react";
import "./ScrollButtons.scss";

const ScrollButtons = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollBottom = () => {
    // скролл к TheExtraInfo
    const el = document.getElementById("extra-info");

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="scroll-buttons">
      {/* кнопка вверх */}
      <button className="btn up" onClick={scrollTop} title="Наверх">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2d66ff"          
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* кнопка вниз */}
      <button className="btn down" onClick={scrollBottom} title="Вниз">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2d66ff"         
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollButtons;
