import React from 'react';
import './AppHeaderInfo.scss';


const AppHeaderInfo = ({ text, tone = 'blue', children, className = '', ...rest }) => {
  const cls = ['hi', `hi--${tone}`, className].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      <span className="hi__plate">
        
        {children}
      </span>
      <span className="hi__text">{text}</span>
    </div>
  );
};

export default AppHeaderInfo;
