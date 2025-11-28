import React, { useEffect, useRef, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';
import GlowWrap from './ui/GlowWrap';
import './TheHeader.scss';

import headerImg from '../assets/header.png';
import promoVideo from '../assets/header.mp4';

const DAY_MS = 24 * 60 * 60 * 1000;

const TheHeader = () => {
  const videoRef = useRef(null);

  const [showVideo, setShowVideo] = useState(false);
  const [canReplay, setCanReplay] = useState(false);

  const [fadeText, setFadeText] = useState(false);
  const [fadeBg, setFadeBg] = useState(false);

  
  const [screen, setScreen] = useState(() => ({
    isMobile: window.innerWidth <= 640,
    isTablet: window.innerWidth > 640 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
  }));

  useEffect(() => {
    const handleResize = () => {
      setScreen({
        isMobile: window.innerWidth <= 640,
        isTablet: window.innerWidth > 640 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isMobile, isTablet } = screen;

  
  useEffect(() => {
    if (isMobile) {
      setShowVideo(false);
      setFadeText(true);
      setFadeBg(true);
      return;
    }

    const autoplayBlocked =
      localStorage.getItem('headerVideoAutoplayBlocked') === '1';

    if (autoplayBlocked) {
      setShowVideo(false);
      setCanReplay(true);
      setFadeText(true);
      setFadeBg(true);
      return;
    }

    const lastShown = localStorage.getItem('headerVideoLastShown');
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > DAY_MS) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
      setCanReplay(true);
      setFadeText(true);
      setFadeBg(true);
    }
  }, [isMobile]);

  
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;

    videoRef.current
      .play()
      .then(() => {
        localStorage.setItem('headerVideoLastShown', Date.now().toString());
      })
      .catch(() => {
        setShowVideo(false);
        setCanReplay(true);
        setFadeText(true);
        setFadeBg(true);
        localStorage.setItem('headerVideoAutoplayBlocked', '1');
      });
  }, [showVideo]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    const remain = v.duration - v.currentTime;
    if (remain < 1.2) {
      setFadeText(true);
      setFadeBg(true);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setCanReplay(true);
  };

  const replayVideo = () => {
    if (isMobile) return;

    setShowVideo(true);
    setCanReplay(false);
    setFadeText(false);
    setFadeBg(false);

    setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {
          setShowVideo(false);
          setCanReplay(true);
          setFadeText(true);
          setFadeBg(true);
        });
      }
    }, 50);
  };

  
  return (
    <div className="header">
      <div className="header-bg-wrapper">
        {showVideo ? (
          <video
            ref={videoRef}
            className="header-video-bg"
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          >
            <source src={promoVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={headerImg}
            className={`header-img-bg ${fadeBg ? 'fade-in-bg' : ''}`}
            alt="header background"
          />
        )}
      </div>

      {!isMobile && canReplay && (
        <button className="header-replay-btn" onClick={replayVideo}>
          ►
        </button>
      )}

      <GlowWrap
        className="hero-wrap"
        style={{
          '--card-bg': fadeBg
            ? `
              linear-gradient(rgba(73, 79, 182, 0.3), rgba(148, 204, 236, 0.3)),
              linear-gradient(0deg, #FFF 4%, rgba(136, 159, 227, 0) 39%),
              url('../assets/header.png')
            `
            : 'none',
        }}
      >
        {fadeText && (
          <div className="grid container header-soft-fade">
            <div className="title">
              <AnimatedLogo
                text="LSPORT"
                mode={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
              />
              <div className="tag">— твой проводник в мире спорта!</div>
            </div>

            <div className="subtitle">
              Универсальная платформа для сферы спорта
            </div>
          </div>
        )}
      </GlowWrap>
    </div>
  );
};

export default TheHeader;
