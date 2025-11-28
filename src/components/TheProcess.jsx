import React from 'react';
import './TheProcess.scss';

import img1 from '../assets/images/steps/img1.png';
import img2 from '../assets/images/steps/img2.png';
import img3 from '../assets/images/steps/img3.png';
import img4 from '../assets/images/steps/img4.png';
import img5 from '../assets/images/steps/img5.png';

const steps = [
  {
    text: 'Мы получаем вашу заявку и перезваниваем, чтобы подробнее ответить на все вопросы',
    img: img1,
    reverse: false,
  },
  {
    text: 'Предоставляем вам доступ к системе и настраиваем её под необходимый вид спорта',
    img: img2,
    reverse: true,
  },
  {
    text: 'Готовим для вас всю необходимую документацию по комфортной работе в системе',
    img: img3,
    reverse: false,
  },
  {
    text: 'Закрепляем за вами ответственного менеджера',
    img: img4,
    reverse: true,
  },
  {
    text: 'Производим доработку системы и оптимизируем наши бизнес-процессы под ваш конкретный случай',
    img: img5,
    reverse: false,
  },
];

const TheProcess = () => {
  return (
    <div className="process">
      {steps.map((s, i) => (
        <div className={`process-item ${s.reverse ? 'reverse' : ''}`} key={i}>
          <div className="text">{s.text}</div>

          <div className="img-wrap">
            <img src={s.img} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TheProcess;
