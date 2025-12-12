import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TheHeader from '../components/TheHeader';
import InfoRow from '../components/InfoRow';
import TheOfferToFindSchool from '../components/TheOfferToFindSchool';
import ThePossibilities from '../components/ThePossibilities';
import TheRegionalStatistics from '../components/TheRegionalStatistics';
import TheOfferMobileApp from '../components/TheOfferMobileApp';
import TheApplication from '../components/TheApplication';
import TheProcess from '../components/TheProcess';
import TheFooter from '../components/TheFooter';

import TheExtraInfo from '../components/TheExtraInfo';

import ScrollButtons from '../components/ScrollButtons';  

import './Index.scss';

const Index = () => {
  const [submissionMessage, setSubmissionMessage] = useState('');

  const submitApplication = async (applicationData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/applications', applicationData);
      console.log('Заявка успешно отправлена:', response.data);
      setSubmissionMessage('Заявка отправлена!');
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
    }
  };

  return (
    <div>
      <TheHeader />
      <InfoRow />

      {/* обернутый заголовок так же как остальные блоки */}
      <div className="container">
        <h1 className="partners-title">Наши партнёры</h1>
      </div>
      {/* выравнивается точно по сетке сайта */}

      {/* Бывший блок записи в спортшколу, теперь — партнёры */}
      <TheOfferToFindSchool />

      <div id="possibilities" className="container possibilities">
        <h1>Возможности онлайн-платформы</h1>
        <ThePossibilities />
      </div>

      <div id="statistics" className="container regional-statistics">
        <TheRegionalStatistics />
      </div>

      <h1 className="mobile-title container">Мобильное приложение</h1>

      <div id="offer-mobile-app" className="container offer-mobile-app">
        <TheOfferMobileApp />
      </div>

      <div id="application" className="container application">
        <TheApplication submitApplication={submitApplication} />
        {submissionMessage && <h2>{submissionMessage}</h2>}
      </div>

      <h1 className="process-title-main container">Что будет дальше?</h1>

      <TheProcess />

      <div id="extra-info">
        <TheExtraInfo />
      </div>

      {/* кнопки вверх/вниз */}
      <ScrollButtons />

      <TheFooter />
    </div>
  );
};

export default Index;
