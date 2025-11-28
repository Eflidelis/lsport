import React, { memo } from 'react';
import AppBtnWithArrow from './AppBtnWithArrow';
import './AppPossibilitiesItem.scss';


const AppPossibilitiesItem = memo(({ list, image, link, bg }) => {
  const handleClick = () => {
    if (link?.href) window.open(link.href, '_blank');
  };

  return (
    <section
      className="poss-item"
      style={{ '--sec-bg': bg }}
    >
      <div className="col left">
        <ul className="list">
          {list.map((t, k) => <li key={k}>{t}</li>)}
        </ul>

        {link && (
          <AppBtnWithArrow className="cta" text={link.text} onClick={handleClick} />
        )}
      </div>

      <div className="col right">
        <img src={image} alt="" loading="lazy" />
      </div>
    </section>
  );
});

export default AppPossibilitiesItem;
