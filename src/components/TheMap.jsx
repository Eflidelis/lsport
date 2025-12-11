import React, { useEffect, useRef, useState } from 'react';
import AppProgressbar from './AppProgressbar';
import './TheMap.scss';

const TheMap = () => {
  const [ymaps, setYmaps] = useState(null);
  const [bars, setBars] = useState([]);
  const [regions, setRegions] = useState(null);
  const [map, setMap] = useState(null);
  const [max, setMax] = useState(0);
  const mapRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (isInitialized) return;

    const loadYmaps = () => {
      return new Promise((resolve, reject) => {
        if (window.ymaps) {
          resolve(window.ymaps);
          return;
        }

        const script = document.createElement('script');
        script.src =
          'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=726413f1-409a-4632-a65a-d67e3a1f7062&load=package.full';
        script.onload = () => resolve(window.ymaps);
        script.onerror = () => reject(new Error('Не удалось загрузить Яндекс.Карты'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        const ymapsInstance = await loadYmaps();
        if (ymapsInstance) {
          setYmaps(ymapsInstance);
          ymapsInstance.ready(() => loadStats(ymapsInstance));
        }
      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
      }
    };

    initializeMap();
    setIsInitialized(true);
  }, [isInitialized]);

  const loadStats = async (ymapsInstance) => {
    const requestData = {
      type: 'orgs',
      sportID: '',
      start: '01.01.2021',
      end: '31.12.2021',
    };

    try {
      const response = await fetch('https://api.saferegion.net/Home/LoadStats/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      let data = [];

      if (!response.ok) {
        console.warn("Используем mock данные");
        data = [
          { Name: 'Москва', Count: 80 },
          { Name: 'Санкт-Петербург', Count: 60 },
          { Name: 'Краснодарский край', Count: 40 },
          { Name: 'Свердловская область', Count: 90 },
          { Name: 'Московская область', Count: 50 },
        ];
      } else {
        data = await response.json();
      }

      setBars(data);
      setMax(Math.max(...data.map((i) => i.Count)) || 100);

      renderMap(data, ymapsInstance);
    } catch (e) {
      console.error('Ошибка загрузки данных', e);
    }
  };

  const setMapData = (regMap, newMap, data) => {
    if (!regMap || !newMap) return;

    const currentMax = Math.max(...data.map((i) => i.Count)) || 100;

    Object.entries(regMap).forEach(([key, value]) => {
      const name = value.get(0).properties.get('name') || key;
      const normalize = (s) => s.toLowerCase().replace(/[^а-я\s]/g, '').trim();

      let rc = data.find((item) => {
        const v1 = normalize(item.Name);
        const v2 = normalize(name);
        return v1 === v2 || v1.includes(v2) || v2.includes(v1);
      });

      const count = rc ? rc.Count : 0;

      value
        .get(0)
        .properties.set('hintContent', `${name}: ${count}`);

      const opacity = count / currentMax;
      const blueHex = Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, '0');

      value.options.set('fillColor', `#447BE0${blueHex}`);
      value.options.set('fillOpacity', opacity);
    });
  };

  const renderMap = (data, ymapsInstance) => {
  if (!ymapsInstance || !mapRef.current) return;

  if (!map) {
    const width = window.innerWidth;
    let zoomValue = 3;      // десктоп

    if (width < 992) zoomValue = 2.9;   // планшет
    if (width < 600) zoomValue = 2.9;   // мобилка

    const newMap = new ymapsInstance.Map(mapRef.current, {
      center: [65, 100],
      zoom: zoomValue,
      controls: [],
    });


      // ★ управление картой
      if (window.innerWidth < 992) {
        newMap.behaviors.disable(['scrollZoom', 'dblClickZoom']);
        newMap.behaviors.enable(['drag']);
        newMap.options.set('touchScroll', true);
      } else {
        newMap.behaviors.disable(['scrollZoom', 'dblClickZoom']);
      }

      ymapsInstance.borders.load('RU', { lang: 'ru', quality: 2 }).then((result) => {
        const regMap = {};

        result.features.forEach((feature) => {
          const name = feature.properties.name;

          const geoObject = new ymapsInstance.GeoObjectCollection(null, {
            fillColor: '#447BE0',
            strokeColor: '#00000050',
            strokeOpacity: 1,
            fillOpacity: 0.5,
          });

          geoObject.add(new ymapsInstance.GeoObject(feature));

          geoObject.events.add('click', () => {
            const hint = geoObject.get(0).properties.get('hintContent') || name;
            setPopup(hint);
          });

          geoObject.events.add('mouseenter', () => geoObject.options.set('fillOpacity', 0.8));
          geoObject.events.add('mouseleave', () => geoObject.options.set('fillOpacity', 0.5));

          regMap[name] = geoObject;
          newMap.geoObjects.add(geoObject);
        });

        setRegions(regMap);
        setMap(newMap);
        setMapData(regMap, newMap, data);
      });
    } else {
      setMapData(regions, map, data);
    }
  };

  return (
    <div className="map">
      <div id="hm-map" className="hm-map-element" ref={mapRef} />

      <h2 className="stats-subtitle">
        Спортивные организации в системе LSPORT в разных регионах
      </h2>

      <div className="columns">
        {bars.length > 0 ? (
          <>
            <div className="left">
              {bars
                .filter((_, i) => i < Math.ceil(bars.length / 2))
                .map((item, i) => (
                  <div key={i} className="item">
                    <div>{item.Name}</div>
                    <AppProgressbar max={max} current={item.Count} />
                  </div>
                ))}
            </div>

            <div className="right">
              {bars
                .filter((_, i) => i >= Math.ceil(bars.length / 2))
                .map((item, i) => (
                  <div key={i} className="item">
                    <div>{item.Name}</div>
                    <AppProgressbar max={max} current={item.Count} />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <p>Загружаем статистику…</p>
        )}
      </div>

      {popup && (
        <div className="map-popup-overlay" onClick={() => setPopup(null)}>
          <div className="map-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setPopup(null)}>
              ×
            </button>
            <p>
              В регионе <b>{popup.split(':')[0]}</b> в системе LSPORT уже{' '}
              <b>{popup.split(':')[1]}</b> организаций!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheMap;
