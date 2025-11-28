import React, { useEffect, useRef, useState } from 'react';
import AppProgressbar from './AppProgressbar';
import './TheMap.scss';

const TheMap = () => {
  const [ymaps, setYmaps] = useState(null);
  const [bars, setBars] = useState([]); // Данные для колонок (с сервера)
  const [regions, setRegions] = useState(null); // границы регионов
  const [map, setMap] = useState(null); // объект карты
  const [max, setMax] = useState(0); // Максимум для баров
  const mapRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false); 
 
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (isInitialized) return;

    const loadYmaps = () => {
      return new Promise((resolve, reject) => {
        if (window.ymaps) {
          console.log("Ymaps уже загружен");
          resolve(window.ymaps);
          return;
        }

        const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
        if (existingScript) {
          console.log("Ymaps скрипт уже существует");
          resolve(window.ymaps);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=726413f1-409a-4632-a65a-d67e3a1f7062&load=package.full';
        script.onload = () => {
          console.log("Ymaps успешно загружен");
          resolve(window.ymaps);
        };
        script.onerror = () => {
          console.error('Не удалось загрузить Яндекс.Карты');
          reject(new Error('Не удалось загрузить Яндекс.Карты'));
        };
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        const ymapsInstance = await loadYmaps();
        if (ymapsInstance) {
          setYmaps(ymapsInstance);
          ymapsInstance.ready(() => {
            console.log("Ymaps готов к работе");
            loadStats(ymapsInstance);
          });
        } else {
          console.error("Ymaps не загружен");
        }
      } catch (error) {
        console.error("Ошибка при инициализации карты:", error);
      }
    };

    initializeMap();
    setIsInitialized(true);
  }, [isInitialized]);

  const loadStats = async (ymapsInstance) => {
    const requestData = { type: 'orgs', sportID: '', start: '01.01.2021', end: '31.12.2021' };
    try {
      const response = await fetch('https://api.saferegion.net/Home/LoadStats/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`Сервер ответил: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        const mockData = [
          { Name: "Москва", Count: 80 },
          { Name: "Санкт-Петербург", Count: 60 },
          { Name: "Краснодарский край", Count: 40 },
          { Name: "Свердловская область", Count: 90 },
          { Name: "Московская область", Count: 50 }
        ];
        setBars(mockData);
        setMax(100);
        if (ymapsInstance) renderMap(mockData, ymapsInstance);
        return;
      }

      setBars(data);
      setMax(Math.max(...data.map(item => item.Count)) || 100);

      if (ymapsInstance) renderMap(data, ymapsInstance);

    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  
  const setMapData = (regMap, newMap, data) => {
    if (!regMap || !newMap) return;
    const currentMax = Math.max(...data.map(item => item.Count)) || 100;

    Object.entries(regMap).forEach(([key, value]) => {
      const name = value.get(0).properties.get('name') || key;
      const normalize = (str) => str.toLowerCase().replace(/[^а-я\s]/g, '').trim();

      let rc = data.find(item => {
        const v1 = normalize(item.Name);
        const v2 = normalize(name);
        return v1 === v2 || v1.includes(v2) || v2.includes(v1);
      });

      const count = rc ? rc.Count : 0;
      value.get(0).properties.set('hintContent', `${name}: ${count}`);

      const opacity = count / currentMax;
      const blueHex = Math.floor(opacity * 255).toString(16).padStart(2,'0');
      value.options.set('fillColor', `#447BE0${blueHex}`);
      value.options.set('fillOpacity', opacity);
    });
  };

  
  const renderMap = (data, ymapsInstance) => {
    if (!ymapsInstance || !mapRef.current) return;

    if (!map) {
      const newMap = new ymapsInstance.Map(mapRef.current, {
        center: [65,100],
        zoom: 3,
        controls: []
      });

      newMap.behaviors.disable(['scrollZoom','drag','dblClickZoom']);

      ymapsInstance.borders.load('RU',{lang:'ru',quality:2})
      .then(result=>{
        const regMap={};
        result.features.forEach(feature=>{
          const iso=feature.properties.iso3166;
          const name=feature.properties.name;

          const geoObject=new ymapsInstance.GeoObjectCollection(null,{
            fillColor:'#447BE0',
            strokeColor:'#00000050',
            strokeOpacity:1,
            fillOpacity:0.5
          });

          geoObject.add(new ymapsInstance.GeoObject(feature));

          geoObject.events.add('click',()=>{
            const hint=geoObject.get(0).properties.get('hintContent')||name;
            setPopup(hint);
            geoObject.options.set('fillColor','#FF0000');
            setTimeout(()=>setPopup(null),5000);
          });

          geoObject.events.add('mouseenter',()=>geoObject.options.set('fillOpacity',0.8));
          geoObject.events.add('mouseleave',()=>geoObject.options.set('fillOpacity',0.5));

          regMap[name]=geoObject;
          regMap[iso]=geoObject;
          newMap.geoObjects.add(geoObject);
        });
        setRegions(regMap);
        setMap(newMap);
        setMapData(regMap,newMap,data);
      });
    }
    else setMapData(regions,map,data);
  };

  return (
    <div className="map">
      <div id="hm-map" ref={mapRef} style={{width:'100%',height:'500px'}}/>

      <h2 className="stats-subtitle">
        Количество спортивных организаций, подключенных к системе LSPORT в разных регионах
      </h2>

      <div className="columns">
        {bars.length>0?(<>
          <div className="left">
            {bars.filter((item,i)=>(i+1)<=Math.ceil(bars.length/2)).map((item,i)=>(
              <div key={i} className="item">
                <div>{item.Name}</div>
                <AppProgressbar max={max} current={item.Count}/>
              </div>
            ))}
          </div>
          <div className="right">
            {bars.filter((item,i)=>(i+1)>Math.ceil(bars.length/2)).map((item,i)=>(
              <div key={i} className="item">
                <div>{item.Name}</div>
                <AppProgressbar max={max} current={item.Count}/>
              </div>
            ))}
          </div>
        </>):(<p>Загружаем статистику…</p>)}
      </div>

      {popup && (
        <div className="map-popup-overlay" onClick={()=>setPopup(null)}>
          <div className="map-popup" onClick={(e)=>e.stopPropagation()}>
            <button className="popup-close" onClick={()=>setPopup(null)}>×</button>
            <p>
              В регионе <b>{popup.split(':')[0]}</b> в системе LSPORT уже <b>{popup.split(':')[1]}</b> организаций!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheMap;
