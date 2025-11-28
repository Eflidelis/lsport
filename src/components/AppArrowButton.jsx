import React from "react";
import { useNavigate } from "react-router-dom";
import SvgArrowRight from "./svg/SvgArrowRight";
import "./AppArrowButton.scss";

const AppArrowButton = ({
  text,
  to = null,
  onClick,
  size = "normal",
  className = "",
  ...props
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (to) navigate(to);
  };

  return (
    <button
      type="button"
      className={`arrow-btn ${size === "small" ? "arrow-btn--small" : ""} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="circle">
        <span className="icon arrow" />
      </span>
      <span className="label">{text}</span>
    </button>
  );
};

export default AppArrowButton;
