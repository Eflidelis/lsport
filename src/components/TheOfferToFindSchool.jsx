import React, { useEffect, useState, useRef } from "react";
import "./TheOfferToFindSchool.scss";

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

// Слоты (ряды/места)
const SLOTS = [
  // ряд 1
  { top: "10%", left: "10%", size: "large", emblems: [1, 3] },
  { top: "8%", left: "45%", size: "medium", emblems: [0, 6] },
  { top: "14%", left: "72%", size: "small", emblems: [2, 5] },

  // ряд 2
  { top: "52%", left: "16%", size: "medium", emblems: [8, 14] },
  { top: "42%", left: "49%", size: "small", emblems: [7, 9] },
  { top: "45%", left: "78%", size: "large", emblems: [4, 10] },

  // ряд 3
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
  // состояние слотов
  const [slotsState, setSlotsState] = useState(() =>
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
    let loadedCount = 0;
    const total = EMBLEM_IMAGES.length;

    EMBLEM_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount += 1;
        if (loadedCount === total) {
          setAllLoaded(true);
        }
      };
    });
  }, []);

  // анимация смены эмблем
  useEffect(() => {
    let fadeTimeoutId;

    const intervalId = setInterval(() => {
      const slotToChange = nextSlotRef.current;
      nextSlotRef.current = (nextSlotRef.current + 1) % SLOTS.length;

      setSlotsState((prev) => {
        const next = [...prev];
        next[slotToChange].isVisible = false;
        return next;
      });

      fadeTimeoutId = setTimeout(() => {
        setSlotsState((prev) => {
          const updated = [...prev];
          const current = updated[slotToChange];

          const slotData = SLOTS[current.slotIndex];
          const total = slotData.emblems.length;
          const nextVisibleIndex = (current.visibleIndex + 1) % total;

          updated[slotToChange] = {
            ...current,
            visibleIndex: nextVisibleIndex,
            isVisible: true,
            version: current.version + 1,
          };

          return updated;
        });
      }, 400);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
    };
  }, []);

  return (
    <section
      className="edge-card edge-card--collage"
      aria-label="Эмблемы спортивных федераций"
    >
      <div className="edge-card__inner-collage">
        <div className="edge-card__inner-collage-content">
          {allLoaded &&
            slotsState.map((slotState) => {
              const slot = SLOTS[slotState.slotIndex];
              const emblemIndex = slot.emblems[slotState.visibleIndex];
              const src = EMBLEM_IMAGES[emblemIndex];
              const width = getWidthForEmblem(slot.size, emblemIndex);

              return (
                <div
                  key={`${slotState.slotIndex}-${slotState.version}`}
                  className="edge-card__slot"
                  style={{
                    top: slot.top,
                    left: slot.left,
                    width: `${width}px`,
                    zIndex: 10 + slotState.slotIndex,
                  }}
                >
                  <img
                    src={src}
                    className="edge-card__image"
                    alt={`Эмблема федерации ${emblemIndex + 1}`}
                    style={{ opacity: slotState.isVisible ? 1 : 0 }}
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
