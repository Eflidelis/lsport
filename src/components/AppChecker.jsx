import React, { useEffect, useState } from 'react';
import './AppChecker.scss';

const AppChecker = ({ checked = false, onChange }) => {
  // сыграть одноразовую анимацию при включении
  const [justChecked, setJustChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setJustChecked(true);
      const t = setTimeout(() => setJustChecked(false), 800); 
      return () => clearTimeout(t);
    } else {
      setJustChecked(false);
    }
  }, [checked]);

  const toggle = () => onChange(!checked);

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={`checker ${checked ? 'is-checked' : ''} ${
        justChecked ? 'just-checked' : ''
      }`}
      onClick={toggle}
      onKeyDown={onKey}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked ? 'true' : 'false'}
    >
      
      <input className="checker__input" checked={checked} type="checkbox" readOnly />

      
      <div className="checker__circle">
        
        <svg className="checker__svg" viewBox="0 0 24 24" aria-hidden="true">
          
          <path className="checker__tick" pathLength="100" d="M6 12l4 4 8-8" />
        </svg>
      </div>
    </div>
  );
};

export default AppChecker;
