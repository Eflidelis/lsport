import React, { useEffect, useRef, useState } from 'react';
import './TheProcess.scss';

import img1 from '../assets/images/steps/img1.png';
import img2 from '../assets/images/steps/img2.png';
import img3 from '../assets/images/steps/img3.png';
import img4 from '../assets/images/steps/img4.png';
import img5 from '../assets/images/steps/img5.png';

const steps = [
  {
    text:'Мы получаем вашу заявку и перезваниваем, чтобы подробнее ответить на все вопросы',
    img:img1,
    reverse:false,
  },
  {
    text:'Предоставляем вам доступ к системе и настраиваем её под необходимый вид спорта',
    img:img2,
    reverse:true,
  },
  {
    text:'Готовим для вас всю необходимую документацию по комфортной работе в системе',
    img:img3,
    reverse:false,
  },
  {
    text:'Закрепляем за вами ответственного менеджера',
    img:img4,
    reverse:true,
  },
  {
    text:'Производим доработку системы и оптимизируем наши бизнес-процессы под ваш конкретный случай',
    img:img5,
    reverse:false,
  },
];

const TheProcess = () => {
  const processRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!processRef.current) return;
      const rect = processRef.current.getBoundingClientRect();
      const visible = window.innerHeight - rect.top;
      const ratio = Math.min(Math.max(visible / rect.height, 0), 1);
      setProgress(ratio);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="process" ref={processRef}>
      {/* Вертикальная линия справа */}
      <div className="timeline-line" style={{ height: `${progress * 100}%` }}></div>

      {steps.map((s, i) => (
        <div className={`process-item ${s.reverse ? 'reverse' : ''}`} key={i}>
          {/* Маркер шага: по центру строки, справа от линии */}
          <div className="marker">
            <div className="dot"></div>
            <span>Шаг {i + 1}</span>
          </div>

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
