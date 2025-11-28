import React from 'react';
import './AppProgressbar.scss'; 

const AppProgressbar = ({ current = 0, max = 100 }) => {
  const percent = Math.floor((current / max) * 100);
  const width = `${percent}%`;

  return (
    <div className="progressbar">
      <div className="progressbar__progress" style={{ width }}>
        {current}
      </div>
    </div>
  );
};

export default AppProgressbar;
