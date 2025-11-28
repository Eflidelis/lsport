import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBtn from "./AppBtn";
import logo from "../assets/logo2.png";
import "./TheNavigation.scss";

const TheNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* кнопки вход и рега */
  const attributes = {
    static: {
      btnLogin: {
        border: true,
        backgroundColor: "transparent",
        color: "text-blue",
        small: true,
      },
      btnReg: {
        backgroundColor: "bg-blue",
        color: "#FFF",
        small: true,
      },
    },
  };

  const btnLoginAttributes = attributes.static.btnLogin;
  const btnRegAttributes = attributes.static.btnReg;

  /* прокрутка */
  const scrollTo = (selector) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
      return;
    }
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const goHome = () => navigate("/");
  const goPoss = () => scrollTo("#possibilities");
  const goStatPage = () => navigate("/statistics");
  const goMobile = () => scrollTo("#offer-mobile-app");
  const goApp = () => scrollTo("#application");

  const isOnApps = location.pathname === "/applications";
  const isOnArchive = location.pathname === "/applications/archive";
  const isStaffPage = isOnApps || isOnArchive;

  let navItems = [
    { key: "home", label: "Главная", onClick: goHome },
    { key: "poss", label: "Возможности", onClick: goPoss },
    { key: "stat", label: "Статистика", onClick: goStatPage },
    { key: "mob", label: "Приложение", onClick: goMobile },
    { key: "app", label: "Заявка", onClick: goApp },
  ];

  if (isStaffPage) {
    navItems = [
      { key: "home", label: "Главная", onClick: goHome },
      !isOnApps ? { key: "active", label: "Активные заявки", to: "/applications" } : null,
      !isOnArchive ? { key: "archive", label: "Архив заявок", to: "/applications/archive" } : null,
      { key: "statpage", label: "Статистика", to: "/statistics" },
    ].filter(Boolean);
  }

  const navRef = useRef(null);
  const rafRef = useRef(null);
  const mountedRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const setActiveSafe = useCallback((i) => setActiveIdx(i), []);

  const getCurrentX = () => {
    const nav = navRef.current;
    if (!nav) return 0;
    const val = parseFloat(nav.style.getPropertyValue("--translate-x"));
    return Number.isFinite(val) ? val : 0;
  };

  const getCenterX = (el) => {
    const nav = navRef.current;
    if (!nav || !el) return 0;

    const rectNav = nav.getBoundingClientRect();
    const rectEl = el.getBoundingClientRect();
    return rectEl.left + rectEl.width / 2 - rectNav.left - 6;
  };

  const stopRAF = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const animateTo = (to) => {
    const nav = navRef.current;
    if (!nav) return;

    stopRAF();
    const start = performance.now();
    const from = getCurrentX();

    const step = (now) => {
      if (!mountedRef.current) return;

      const p = Math.min((now - start) / 460, 1);
      const e = 1 - Math.pow(1 - p, 3);

      const x = from + (to - from) * e;
      const y = (-28 + 6) * (4 * e * (1 - e));
      const r = 140 * Math.sin(p * Math.PI);

      nav.style.setProperty("--translate-x", `${x}px`);
      nav.style.setProperty("--translate-y", `${y}px`);
      nav.style.setProperty("--rotate-x", `${r}deg`);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        nav.style.setProperty("--translate-y", "0px");
        nav.style.setProperty("--rotate-x", "0deg");
        stopRAF();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const moveToItem = (i) => {
    const nav = navRef.current;
    if (!nav) return;

    const links = nav.querySelectorAll("li > a, li > .as-link");
    if (!links || !links[i]) return;

    animateTo(getCenterX(links[i]));
    nav.classList.add("show-indicator");
  };

  const handleEnter = (i) => moveToItem(i);
  const handleLeave = () => moveToItem(activeIdx);

  const handleClick = (i, action) => {
    setActiveSafe(i);
    moveToItem(i);
    if (action) action();
  };

  useLayoutEffect(() => {
    mountedRef.current = true;
    const id = requestAnimationFrame(() => moveToItem(0));

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(id);
      stopRAF();
    };
  }, []);

  /* скролл на другие блоки */
  useEffect(() => {
    if (isStaffPage) return;

    const sections = [
      { idx: 0, selector: ".header" },
      { idx: 1, selector: "#possibilities" },
      { idx: 2, selector: "#statistics" },
      { idx: 3, selector: "#offer-mobile-app" },
      { idx: 4, selector: "#application" },
    ];

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;

      let closestIdx = 0;
      let minDist = Infinity;

      sections.forEach((s) => {
        const el = document.querySelector(s.selector);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - viewportCenter);

        if (dist < minDist) {
          minDist = dist;
          closestIdx = s.idx;
        }
      });

      if (closestIdx !== activeIdx) {
        setActiveSafe(closestIdx);
        moveToItem(closestIdx);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isStaffPage, activeIdx, setActiveSafe]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((s) => !s);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => closeMobile(), [location.pathname]);

  return (
    <nav className="navigation">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMobile}>
          <img className="logo" src={logo} alt="logo" />
        </Link>

        <div className="glass-nav desktop-only">
          <ul ref={navRef} onMouseLeave={handleLeave}>
            {navItems.map((it, i) => {
              const isActive = i === activeIdx;

              if (it.to) {
                return (
                  <li key={it.key}>
                    <Link
                      to={it.to}
                      className={isActive ? "active as-link" : "as-link"}
                      onMouseEnter={() => handleEnter(i)}
                      onClick={() => handleClick(i)}
                    >
                      {it.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={it.key}>
                  <a
                    className={isActive ? "active" : ""}
                    href="#"
                    onMouseEnter={() => handleEnter(i)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(i, it.onClick);
                    }}
                  >
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-actions desktop-only">
          <AppBtn
            className="navigation__btn"
            text="Регистрация"
            {...btnRegAttributes}
            onClick={() => (window.location.href = "https://lsport.net/Person/Register")}
          />
          <AppBtn
            className="navigation__btn"
            text="Вход"
            {...btnLoginAttributes}
            onClick={() =>
              (window.location.href = "https://lsport.net/Home/Login?blank=true")
            }
          />
        </div>

        <button
          className={`burger mobile-only ${mobileOpen ? "is-open" : ""}`}
          aria-label="Открыть меню"
          onClick={toggleMobile}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* мобильное меню */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-glass">
          <ul>
            {navItems.map((it) => (
              <li key={it.key}>
                {it.to ? (
                  <Link to={it.to} onClick={closeMobile}>
                    {it.label}
                  </Link>
                ) : (
                  <button
                    className="as-button"
                    onClick={() => {
                      closeMobile();
                      it.onClick();
                    }}
                  >
                    {it.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="mobile-actions">
            <AppBtn
              className="navigation__btn"
              text="Регистрация"
              {...btnRegAttributes}
              onClick={() => {
                closeMobile();
                window.location.href = "https://lsport.net/Person/Register";
              }}
            />
            <AppBtn
              className="navigation__btn"
              text="Вход"
              {...btnLoginAttributes}
              onClick={() => {
                closeMobile();
                window.location.href =
                  "https://lsport.net/Home/Login?blank=true";
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TheNavigation;
