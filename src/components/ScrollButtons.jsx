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
      <button className="btn up" onClick={scrollTop}>▲</button>
      <button className="btn down" onClick={scrollBottom}>▼</button>
    </div>
  );
};

export default ScrollButtons;
