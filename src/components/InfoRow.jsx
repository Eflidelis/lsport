import React from 'react';
import AppHeaderInfo from './AppHeaderInfo';

import SvgMedal from './svg/SvgMedal';
import SvgCopy from './svg/SvgCopy';
import SvgFlag from './svg/SvgFlag';
import SvgBlazon from './svg/SvgBlazon';

import './InfoRow.scss';

const InfoRow = () => {
  const goToPossibility = (id) => {
    const section = document.querySelector('#possibilities');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.dispatchEvent(
      new CustomEvent('set-possibility', { detail: { id } })
    );
  };

  return (
    <section className="info-row">
      <div className="container">
        <div className="info">

          <div
            className="info__item"
            role="button"
            tabIndex={0}
            onClick={() => goToPossibility('athletes')}
            onKeyDown={(e) => e.key === 'Enter' && goToPossibility('athletes')}
          >
            <AppHeaderInfo tone="blue" text="Родителям и спортсменам">
              <SvgMedal />
            </AppHeaderInfo>
          </div>

          <div
            className="info__item"
            role="button"
            tabIndex={0}
            onClick={() => goToPossibility('admins')}
            onKeyDown={(e) => e.key === 'Enter' && goToPossibility('admins')}
          >
            <AppHeaderInfo tone="red" text="Администраторам и тренерам">
              <SvgCopy />
            </AppHeaderInfo>
          </div>

          <div
            className="info__item"
            role="button"
            tabIndex={0}
            onClick={() => goToPossibility('federations')}
            onKeyDown={(e) => e.key === 'Enter' && goToPossibility('federations')}
          >
            <AppHeaderInfo tone="yellow" text="Спортивным федерациям">
              <SvgFlag />
            </AppHeaderInfo>
          </div>

          <div
            className="info__item"
            role="button"
            tabIndex={0}
            onClick={() => goToPossibility('municipalities')}
            onKeyDown={(e) => e.key === 'Enter' && goToPossibility('municipalities')}
          >
            <AppHeaderInfo tone="green" text="Органам власти">
              <SvgBlazon />
            </AppHeaderInfo>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoRow;
