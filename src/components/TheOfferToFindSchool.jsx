import React, { useEffect, useState, useRef } from "react";
import "./TheOfferToFindSchool.scss";
import useMediaQuery from "../hooks/useMediaQuery"; // Хук

const EMBLEM_IMAGES = [
  require("../assets/images/emblems/emblem1.png"),
  require("../assets/images/emblems/emblem2.png"),
  require("../assets/images/emblems/emblem3.png"),
  require("../assets/images/emblems/emblem4.png"),
  require("../assets/images/emblems/emblem5.png"),
  require("../assets/images/emblems/emblem6.png"),
  require("../assets/images/emblems/emblem7.png"),
  require("../assets/images/emblems/emblem8.png"),
  require("../assets/images/emblems/emblem9.png"),
  require("../assets/images/emblems/emblem10.png"),
  require("../assets/images/emblems/emblem11.png"),
  require("../assets/images/emblems/emblem12.png"),
  require("../assets/images/emblems/emblem13.png"),
  require("../assets/images/emblems/emblem14.png"),
  require("../assets/images/emblems/emblem15.png"),
  require("../assets/images/emblems/emblem16.png"),
  require("../assets/images/emblems/emblem17.png"),
  require("../assets/images/emblems/emblem18.png"),
];

const BASE_LARGE = 170;
const BASE_MEDIUM = 140;
const BASE_SMALL = 110;

const SLOTS = [
  { top: "10%", left: "10%", size: "large", emblems: [1, 3] },
  { top: "8%", left: "45%", size: "medium", emblems: [0, 6] },
  { top: "14%", left: "72%", size: "small", emblems: [2, 5] },

  { top: "52%", left: "16%", size: "medium", emblems: [8, 14] },
  { top: "42%", left: "49%", size: "small", emblems: [7, 9] },
  { top: "45%", left: "78%", size: "large", emblems: [4, 10] },

  { top: "74%", left: "14%", size: "small", emblems: [12, 15] },
  { top: "60%", left: "36%", size: "large", emblems: [11, 13] },
  { top: "80%", left: "62%", size: "medium", emblems: [16, 17] },
];

const EXTRA_BIG = [3, 4, 9, 12, 14, 15, 16, 17, 18];

const getBaseSizeForSlot = (size) => {
  if (size === "large") return BASE_LARGE;
  if (size === "medium") return BASE_MEDIUM;
  return BASE_SMALL;
};

const getWidthForEmblem = (slotSize, emblemIndexZeroBased) => {
  let width = getBaseSizeForSlot(slotSize);
  const num = emblemIndexZeroBased + 1;

  if (num === 4 || num === 12 || num === 14) width *= 1.1;
  if (num === 5) width *= 0.9;
  if (num !== 5 && num !== 11) width *= 1.1;
  if (EXTRA_BIG.includes(num)) width *= 1.1;
  if (num === 4) width *= 1.2;
  if (num === 3) width *= 1.2;
  if (num === 8 || num === 18) width *= 1.1;
  if (num === 14 || num === 16) width *= 1.2;
  if (num === 10) width *= 1.1;

  return width;
};

const TheOfferToFindSchool = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [slotsState, setSlotsState] = useState(
    SLOTS.map((_, idx) => ({
      slotIndex: idx,
      visibleIndex: 0,
      isVisible: true,
      version: 0,
    }))
  );

  const [allLoaded, setAllLoaded] = useState(false);
  const nextSlotRef = useRef(0);

  useEffect(() => {
    let loaded = 0;
    EMBLEM_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === EMBLEM_IMAGES.length) setAllLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    if (isMobile) return; // на мобильных НЕ запускаем анимацию

    let fadeTimeout;
    const intervalId = setInterval(() => {
      const slotToChange = nextSlotRef.current;
      nextSlotRef.current = (slotToChange + 1) % SLOTS.length;

      setSlotsState((prev) => {
        const next = [...prev];
        next[slotToChange].isVisible = false;
        return next;
      });

      fadeTimeout = setTimeout(() => {
        setSlotsState((prev) => {
          const next = [...prev];
          const current = next[slotToChange];
          const slot = SLOTS[current.slotIndex];

          next[slotToChange] = {
            ...current,
            visibleIndex: (current.visibleIndex + 1) % slot.emblems.length,
            isVisible: true,
            version: current.version + 1,
          };
          return next;
        });
      }, 400);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      fadeTimeout && clearTimeout(fadeTimeout);
    };
  }, [isMobile]);

  // мобильная версия, просто сетка 18 эмблем
  if (isMobile) {
    return (
      <section className="mobile-grid-emblems">
        {EMBLEM_IMAGES.map((src, i) => (
          <img key={i} src={src} className="mobile-emblem" alt={`Эмблема ${i + 1}`} />
        ))}
      </section>
    );
  }

  // анимация
  return (
    <section className="edge-card edge-card--collage">
      <div className="edge-card__inner-collage">
        <div className="edge-card__inner-collage-content">
          {allLoaded &&
            slotsState.map((slot) => {
              const emblem = SLOTS[slot.slotIndex].emblems[slot.visibleIndex];
              const src = EMBLEM_IMAGES[emblem];
              const width = getWidthForEmblem(SLOTS[slot.slotIndex].size, emblem);

              return (
                <div
                  key={`${slot.slotIndex}-${slot.version}`}
                  className="edge-card__slot"
                  style={{
                    top: SLOTS[slot.slotIndex].top,
                    left: SLOTS[slot.slotIndex].left,
                    width: `${width}px`,
                  }}
                >
                  <img
                    src={src}
                    className="edge-card__image"
                    style={{ opacity: slot.isVisible ? 1 : 0 }}
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default TheOfferToFindSchool;
