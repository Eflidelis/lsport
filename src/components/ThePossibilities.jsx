import React, { useMemo, useEffect, useState } from 'react';
import AppSlider from './AppSlider';
import AppPossibilitiesItem from './AppPossibilitiesItem';

import apple1 from '../assets/images/apple1.png';
import apple2 from '../assets/images/apple2.png';
import apple3 from '../assets/images/apple3.png';
import apple4 from '../assets/images/apple4.png';
import apple5 from '../assets/images/apple5.png';
import apple6 from '../assets/images/apple6.png';
import apple7 from '../assets/images/apple7.png';

import './ThePossibilities.scss';

const BASE_DATA = [
  {
    title: 'Родителям и спортсменам',
    bg: 'linear-gradient(180deg, #EAF2FF 0%, #F6FAFF 100%)',
    list: [
      'Профиль спортсмена в мобильном приложении (данные, результаты соревнований, спортивные достижения)',
      'Дневник посещаемости спортсмена',
      'Расписание тренировок и соревнований, задания на тренировку, уведомление об изменениях в тренировках',
      'Возможность предоставления необходимых документов (прямо в приложении)',
      'Оповещения об отметке посещения, заявках и истечении документов',
      'Аккредитация спортсмена',
      'Заявки на участие в соревнованиях',
    ],
    image: apple6,
  },
  {
    title: 'Администраторам',
    bg: 'linear-gradient(180deg,#F1E9FF 0%, #F9F4FF 100%)',
    list: [
      'Контроль посещения и наполненности групп',
      'Электронный журнал тренировок',
      'Рейтинг и оценка деятельности спортсменов',
      'План подготовки и формирование сборных',
      'Рейтинг и оценка деятельности тренеров',
      'Электронное присвоение спортивных разрядов',
      'Интеграция с СКУД',
      'Прием платежей',
    ],
    image: apple4,
  },
  {
    title: 'Федерациям',
    bg: 'linear-gradient(180deg,#FFF2E6 0%, #FFF9F3 100%)',
    list: [
      'Аккредитация и электронные профили спортсменов и судей',
      'Календарь мероприятий, электронные заявки в ЕКП',
      'Присвоение разрядов и судейских категорий',
      'Формирование сборных команд',
      'CMS для сайта федерации',
      'Отчеты и шаблоны',
      'Электронные системы судейства',
    ],
    image: apple3,
  },
  {
    title: 'Регионам',
    bg: 'linear-gradient(180deg,#E9F9F3 0%, #F5FFFC 100%)',
    list: [
      'Формирование и ведение ЕКП региона',
      'Полные результаты по прошедшим мероприятиям',
      'Электронное присвоение разрядов и судейских категорий',
      'Утверждение состава сборных',
      'Сервис подбора и записи в спортшколу',
      'Учет и аккредитация региональных федераций',
      'Отчеты (в т.ч. 1-ФК, 3-АФК, 5-ФК)',
      'Сравнение показателей с другими регионами',
    ],
    image: apple1,
  },
  {
    title: 'Муниципалитетам',
    bg: 'linear-gradient(180deg,#E8F0FF 0%, #F4F8FF 100%)',
    list: [
      'Контроль муниципальных заданий и платных услуг',
      'Электронное присвоение разрядов, судейских и квалификационных категорий',
      'Электронная запись в спортшколу',
      'Реестр спортивных объектов',
      'Анализ эффективности программ подготовки',
    ],
    image: apple2,
  },
  {
    title: 'Тренерам',
    bg: 'linear-gradient(180deg, #FFEAF2 0%, #FFF6FA 100%)',
    list: [
      'Расписание тренировок. Индивидуальные и групповые занятия',
      'Электронный журнал тренировок',
      'Рейтинг и оценка деятельности спортсменов',
      'Уведомления об окончании документов',
      'Доступ к календарному плану соревнований',
      'Подача/прием заявок на мероприятия',
      'Коммуникация с родителями и спортсменами',
      'Аналитика динамики показателей',
    ],
    image: apple5,
  },
  {
    title: 'Календарь',
    bg: 'linear-gradient(180deg, #FFF9E6 0%, #FFFDF5 100%)',
    list: [
      'Профиль спортсмена (данные, достижения, результаты)',
      'Подача заявок на включение в ЕКП',
      'Электронные системы судейства',
      'Импорт/экспорт данных',
      'Push-уведомления об изменениях',
      'Онлайн-видеотрансляции с результатами',
      'Результаты и протоколы соревнований',
    ],
    image: apple7,
  },
];

// сопоставление id из InfoRow и заголовка в блоке Возможности
const ID_TO_TITLE = {
  athletes:       'Родителям и спортсменам',
  admins:         'Администраторам',
  federations:    'Федерациям',
  municipalities: 'Муниципалитетам',
};

const SLUG_TO_TITLE = {
  parents: 'Родителям и спортсменам',
  admins:  'Администраторам',
  feds:    'Федерациям',
  muni:    'Муниципалитетам',
};
function parseHashTarget() {
  const raw = (window.location.hash || '').toLowerCase();
  const mEq = raw.match(/#poss(?:ibilities)?=([a-z]+)/);
  if (mEq && SLUG_TO_TITLE[mEq[1]]) return SLUG_TO_TITLE[mEq[1]];
  const mShort = raw.match(/^#(parents|admins|feds|muni)$/);
  if (mShort && SLUG_TO_TITLE[mShort[1]]) return SLUG_TO_TITLE[mShort[1]];
  return null;
}

export default function ThePossibilities() {
  const [targetTitle, setTargetTitle] = useState(() => parseHashTarget());

  useEffect(() => {
    const onSet = (e) => {
      const id = e?.detail?.id;
      if (id && ID_TO_TITLE[id]) {
        setTargetTitle(ID_TO_TITLE[id]);
      }
    };
    window.addEventListener('set-possibility', onSet);
    return () => window.removeEventListener('set-possibility', onSet);
  }, []);

  useEffect(() => {
    const onHash = () => setTargetTitle(parseHashTarget());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // переставляем выбранный раздел первым
  const dataOrdered = useMemo(() => {
    if (!targetTitle) return BASE_DATA;
    const found = BASE_DATA.find(d => d.title === targetTitle);
    if (!found) return BASE_DATA;
    const rest = BASE_DATA.filter(d => d.title !== targetTitle);
    return [found, ...rest];
  }, [targetTitle]);

  const titles = dataOrdered.map(i => i.title);

  return (
    <section className="possibilities" id="possibilities">
      <AppSlider key={titles[0]} items={titles}>
        {dataOrdered.map((it, i) => (
          <AppPossibilitiesItem
            key={i}
            list={it.list}
            image={it.image}
            bg={it.bg}
          />
        ))}
      </AppSlider>
    </section>
  );
}
