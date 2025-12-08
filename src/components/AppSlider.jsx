import React, { useEffect, useRef, useState, useCallback } from 'react';
import './AppSlider.scss';

export default function AppSlider({ items = [], onSlideChange, children }) {

  const [active, setActive] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navRef = useRef(null);

  const setActiveSafe = useCallback((i) => {
    setActive(i);
    onSlideChange && onSlideChange(i);
    setDropdownOpen(false);
  }, [onSlideChange]);

  useEffect(() => { setActiveSafe(0); }, [items, setActiveSafe]);

  const moveUnderline = (index) => {
    const list = navRef.current?.querySelectorAll('li > a');
    if (!list || !list[index]) return;

    const rect = list[index].getBoundingClientRect();
    const parent = navRef.current.getBoundingClientRect();

    navRef.current.style.setProperty('--ux', `${rect.left - parent.left}px`);
    navRef.current.style.setProperty('--uw', `${rect.width}px`);
  };

  const handleClick = (i) => {
    setActiveSafe(i);
    moveUnderline(i);
  };

  useEffect(() => {
    const id = setTimeout(() => moveUnderline(0), 150);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => moveUnderline(active), [active, items]);


  return (
    <div className="poss-slider">

      {/* ===== DESKTOP MENU ===== */}
      <nav className="glass-nav desktop">
        <ul ref={navRef}>
          {items.map((label,i)=>(
            <li key={i}>
              <a
                className={active===i ? "active":""}
                onClick={()=>handleClick(i)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>



      {/* ===== MOBILE + TABLET MENU ===== */}
      <nav className="glass-nav mobile">

        {/* бургер слева */}
        <button className="poss-burger" onClick={()=>setDropdownOpen(s=>!s)}>
          ☰
        </button>

        {/* справа отображается текущий выбранный пункт */}
        <div className="poss-current">{items[active]}</div>

        {/* выпадающий список */}
        <div className={`poss-dropdown ${dropdownOpen?'open':''}`}>
          <ul>
            {items.map((label,i)=>(
              <li key={i}>
                <a
                  className={active===i?'active':''}
                  onClick={()=>handleClick(i)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>


      <div className="poss-view">
        {Array.isArray(children) ? children[active] : children}
      </div>

    </div>
  );
}
