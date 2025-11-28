import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppBtn from './AppBtn';
import SvgArrowRight from './svg/SvgArrowRight';

const AppBtnWithArrow = ({ text = '', small = false, onClick, ...props }) => {
  const navigate = useNavigate(); 

  const handleClick = (event) => {
    event.stopPropagation(); 
    if (onClick) {
      onClick(); 
    }
    navigate('/statistics'); 
  };

  return (
    <AppBtn {...props} small={small} text={text} onClick={handleClick}>
      <span className="after">
        <SvgArrowRight />
      </span>
    </AppBtn>
  );
};

export default AppBtnWithArrow;
