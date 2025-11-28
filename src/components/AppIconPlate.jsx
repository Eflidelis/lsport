import React from 'react';
import SvgTrophy from './svg/SvgTrophy';
import './AppIconPlate.scss';


export default function AppIconPlate({
  className = '',
  color = 'yellow',
  children,
  title,
  ...rest
}) {
  return (
    <div
      className={`icon-plate icon-plate--${color} ${className}`}
      aria-hidden={title ? undefined : true}
      title={title}
      {...rest}
    >
      {children ?? <SvgTrophy />}
    </div>
  );
}
