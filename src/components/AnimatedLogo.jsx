
import React, { useRef, useCallback } from 'react';
import './TheHeader.scss';


export default function AnimatedLogo({ text = 'LSPORT', mode = 'desktop' }) {
  const refs = useRef([]);

  
  const resetAllAnimations = useCallback(() => {
    refs.current.forEach((el) => {
      if (!el) return;

      
      el.classList.remove('active');

      
      el.style.animation = 'none';
      void el.offsetWidth; 
      el.style.animation = '';

      
      el.style.setProperty('--d', '0s');
      void el.offsetWidth;
      el.style.removeProperty('--d');
    });
  }, []);

  
  const playWave = useCallback(() => {
    resetAllAnimations(); 

    const logo = refs.current[0]?.parentElement;
    if (!logo) return;

    logo.classList.remove('wave-run');
    void logo.offsetWidth;
    logo.classList.add('wave-run');
  }, [resetAllAnimations]);

  
  const restartAnim = (el) => {
    if (!el) return;

    
    resetAllAnimations();

    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
  };

  const handleClick = (i) => {
    if (mode === 'mobile') {
      playWave();
      return;
    }

    restartAnim(refs.current[i]); 
  };

  
  let lastIdx = -1;

  const handleTouchMove = (e) => {
    if (mode !== 'tablet') return;

    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const idx = refs.current.findIndex((r) => r === el);

    if (idx !== -1 && idx !== lastIdx) {
      playWave(); 
      lastIdx = idx;
    }
  };

  
  return (
    <span
      className="logo"
      onTouchMove={handleTouchMove}
      onClick={mode === 'mobile' ? playWave : undefined}
    >
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="logo__ch"
          onClick={(e) => {
            e.stopPropagation();
            handleClick(i);
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
