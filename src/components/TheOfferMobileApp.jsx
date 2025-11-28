import React from 'react';
import GlowWrap from './ui/GlowWrap';
import AppIconPlate from './AppIconPlate';
import './TheOfferMobileApp.scss';

import phones from '../assets/images/phones.png';

/* иконки */
import SvgTrophy from './svg/SvgTrophy';
import SvgMedal from './svg/SvgMedal';
import SvgCalendar from './svg/SvgCalendar';
import SvgGooglePlay from './svg/SvgGooglePlay';
import SvgAppStore from './svg/SvgAppStore';

const TheOfferMobileApp = () => {
  return (
    <section id="offer-mobile-app" className="offer-mobile-app">
      <div className="container">
        {/* рамка вокруг блока */}
        <GlowWrap className="mobile-card is-pastel glow-border-only">
          <div className="left">
            <h2 className="title">
              Ключ в мир спорта<br />у вас в кармане!
            </h2>

            <p className="lead">
              Единое приложение для родителя, спортсмена, тренера и администратора
            </p>

            <p className="desc">
              Расписание, индивидуальные задания, календарь соревнований и личные достижения
              всегда под рукой!
            </p>

            {/* Кнопки магазинов */}
            <div className="stores">
              <a href="#" className="store-btn" aria-label="Google Play">
                <SvgGooglePlay />
              </a>
              <a href="#" className="store-btn" aria-label="App Store">
                <SvgAppStore />
              </a>
            </div>
          </div>

          <div className="right">
            <div className="phone">
              <img className="phones" src={phones} alt="phones preview" loading="lazy" />

              <AppIconPlate color="yellow" className="phone__icon phone__icon--trophy">
                <SvgTrophy />
              </AppIconPlate>

              <AppIconPlate color="red" className="phone__icon phone__icon--medal">
                <SvgMedal />
              </AppIconPlate>

              <AppIconPlate color="green" className="phone__icon phone__icon--calendar">
                <SvgCalendar />
              </AppIconPlate>
            </div>
          </div>
        </GlowWrap>
      </div>
    </section>
  );
};

export default TheOfferMobileApp;
