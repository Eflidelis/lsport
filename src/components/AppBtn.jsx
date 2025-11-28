import React, { useRef, useEffect } from 'react';
import './AppBtn.scss'; 

const AppBtn = ({
  border = false,
  text = '',
  color = '#FFF',
  backgroundColor = 'bg-blue',
  type = 'button',
  small = false,
  disabled = false,
  onClick, 
  children
}) => {
  const btnRef = useRef(null);

  const bgAsStyle = backgroundColor.match(/(#|rgb|rgba)/g) ? backgroundColor : false;
  const colorAsStyle = color.match(/(#|rgb|rgba)/g) ? color : false;

  const classes = ['btn',
    { [backgroundColor]: !bgAsStyle },
    { [color]: !colorAsStyle },
    { small }
  ];

  const styles = {
    color: colorAsStyle,
    borderColor: border ? colorAsStyle : 'rgba(0, 0, 0, 0)',
    backgroundColor: bgAsStyle
  };

  useEffect(() => {
    clear();
  }, [color, backgroundColor, border]);

  const clear = () => {
    if (btnRef.current) {
      btnRef.current.setAttribute('style', objectToStyle(styles));
      btnRef.current.setAttribute('class', arrayToClass(classes));
    }
  };

  const objectToStyle = (object) => {
    return Object.entries(object)
      .filter(([key, value]) => value !== false)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  };

  const arrayToClass = (array) => {
    return array
      .filter((value) => {
        if (typeof value === 'object') {
          return value[Object.keys(value)[0]];
        } else {
          return true;
        }
      })
      .map((value) => {
        if (typeof value === 'object') {
          return Object.keys(value)[0];
        } else {
          return value;
        }
      })
      .join(' ');
  };

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick} // обработчик клика
    >
      {children && <span>{children.before}</span>}
      {text}
      {children && <span>{children.after}</span>}
    </button>
  );
};

export default AppBtn;
