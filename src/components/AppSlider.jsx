import React, { useEffect, useRef, useState, useCallback } from 'react';
import './AppSlider.scss';


export default function AppSlider({ items = [], onSlideChange, children }) {
  const [active, setActive] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navRef = useRef(null);
  const animRef = useRef(null);

  const setActiveSafe = useCallback((i) => {
    setActive(i);
    onSlideChange && onSlideChange(i);
    
    setIsMobileOpen(false);
  }, [onSlideChange]);

  
  useEffect(() => { setActiveSafe(0); }, [items, setActiveSafe]);

  const getCurrentX = () =>
    parseFloat(navRef.current?.style.getPropertyValue('--translate-x')) || 0;

  const getCenterX = (el) => {
    const nav = navRef.current;
    if (!nav || !el) return 0;
    return el.getBoundingClientRect().left
      + el.offsetWidth / 2
      - nav.getBoundingClientRect().left
      - 6;
  };

  const animateTo = (to) => {
    if (!navRef.current) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const start = performance.now();
    const from = getCurrentX();

    const step = (t) => {
      const p = Math.min((t - start) / 500, 1);
      const e = 1 - Math.pow(1 - p, 3);          
      const x = from + (to - from) * e;
      const y = -38 * (4 * e * (1 - e));         
      const r = 180 * Math.sin(p * Math.PI);     

      navRef.current.style.setProperty('--translate-x', `${x}px`);
      navRef.current.style.setProperty('--translate-y', `${y}px`);
      navRef.current.style.setProperty('--rotate-x', `${r}deg`);

      if (p < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        navRef.current.style.setProperty('--translate-y', '0px');
        navRef.current.style.setProperty('--rotate-x', '0deg');
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  const moveToItem = (index) => {
    const list = navRef.current?.querySelectorAll('li > a');
    if (!list || !list[index]) return;
    animateTo(getCenterX(list[index]));
    navRef.current.classList.add('show-indicator');
  };

  const handleEnter = (i) => { moveToItem(i); };
  const handleLeave = () => { moveToItem(active); };
  const handleClick = (i) => { setActiveSafe(i); moveToItem(i); };

  
  useEffect(() => {
    const id = setTimeout(() => moveToItem(0), 80);
    return () => clearTimeout(id);
  }, []);

  
  useEffect(() => {
    const id = setTimeout(() => moveToItem(active), 0);
    return () => clearTimeout(id);
  }, [items, active]);

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <div className="poss-slider">
      {/* svg фильтр для жидкого стекла */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="wave-distort" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0038 0.0038"
              numOctaves="1"
              seed="2"
              result="roughNoise"
            />
            <feGaussianBlur in="roughNoise" stdDeviation="8.5" result="softNoise" />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="2"
              k4="0"
              in="softNoise"
              result="mergedMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="mergedMap"
              scale="-42"
              xChannelSelector="G"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav className={`glass-nav ${isMobileOpen ? 'is-open' : ''}`}>
        {/* бургер */}
        <button
          type="button"
          className="glass-nav__burger"
          aria-label="Открыть меню возможностей"
          onClick={toggleMobile}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="mobile-current-tab">{items[active]}</div>


        <ul ref={navRef} onMouseLeave={handleLeave}>
          {items.map((label, i) => (
            <li key={i}>
              <a
                className={active === i ? 'active' : ''}
                onMouseEnter={() => handleEnter(i)}
                onClick={() => handleClick(i)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="poss-view">
        {Array.isArray(children) ? children[active] : children}
      </div>
    </div>
  );
}
