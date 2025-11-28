import React, { useRef, useCallback } from 'react';
import './glow.scss';

/**
 * Обёртка с «подсвеченными краями», эффект следует за курсором.
 * Применение:
 *   <GlowWrap className="my-section"><YourContent/></GlowWrap>
 */
export default function GlowWrap({ className = '', style, children }) {
  const ref = useRef(null);

  const updateVars = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;   // px внутри
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // проценты внутри
    const perX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const perY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // угол (в градусах) от центра к курсору (0° вверх)
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // близость к ближайшему краю 0..1 (0 — центр, 1 — прямо у края)
    const kx = cx / Math.max(1, Math.abs(dx));
    const ky = cy / Math.max(1, Math.abs(dy));
    const closeness = Math.max(0, Math.min(1, 1 / Math.min(kx, ky)));

    el.style.setProperty('--pointer-x', `${perX}%`);
    el.style.setProperty('--pointer-y', `${perY}%`);
    el.style.setProperty('--pointer-°', `${angle}deg`);
    el.style.setProperty('--pointer-d', `${Math.round(closeness * 100)}`);
    el.classList.remove('glow-animating');
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--pointer-d', `0`);
  }, []);

  return (
    <div
      ref={ref}
      className={`glow-card ${className}`}
      style={style}
      onPointerMove={updateVars}
      onPointerLeave={onLeave}
    >
      <span className="glow" aria-hidden />
      <div className="glow-inner">
        {children}
      </div>
    </div>
  );
}
