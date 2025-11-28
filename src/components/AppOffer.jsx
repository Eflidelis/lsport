import React from 'react';
import './AppOffer.scss';


const AppOffer = ({ children }) => {
  return (
    <div className="plate glow-card is-pastel">
      {/* слой для яркого свечения по кромке */}
      <span className="glow" aria-hidden="true"></span>

      <div className="left">
        {children[0]}
      </div>

      <div className="right">
        {children[1]}
      </div>
    </div>
  );
};

export default AppOffer;
