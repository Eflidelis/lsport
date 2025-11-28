import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import TheMap from '../components/TheMap';
import TheFooter from '../components/TheFooter';
import './Statistics.scss';

const StatisticsPage = () => {

  // popup вместо alert()
  const [toast, setToast] = useState(null);

  const handleRegionClick = (region, count) => {
    setToast(`В регионе ${region} в системе LSPORT уже ${count} организаций!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <div className="statistics-page">

        <Helmet>
          <title>Статистика LSPORT по регионам</title>
        </Helmet>

        {/* карта */}
        <div className="map">
          <TheMap onRegionClick={handleRegionClick}/>
        </div>

        

        {/* прогрессбары */}
        <div className="columns">
        </div>

        <section className="statistics-dashboard-section">
          <h1 className="dashboard-title">
            Общероссийская статистика и показатели LSPORT по количеству спортсменов,
            тренеров, судей и мероприятий
          </h1>

          <div className="dashboard-wrapper">
            <div className="dashboard-inner">
              <iframe
                src="https://datalens.yandex/ydf0v9uof40uj?state=4b5ce47d4224"
                className="dashboard-iframe"
                title="LSPORT Dashboard"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* popup уведомление */}
        {toast && <div className="toast-popup">{toast}</div>}
      </div>

      <TheFooter/>
    </>
  );
};

export default StatisticsPage;
