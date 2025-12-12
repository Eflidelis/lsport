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

  const token = localStorage.getItem("token"); // авторизован ли сотрудник

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

  const scrollTo = (selector) => {
  const targetId = selector.replace("#", "");

  // если не на главной — просто переходим на / с параметром
  if (window.location.pathname !== "/") {
    navigate(`/?scroll=${targetId}`);
    return;
  }

  const doScroll = () => {
    const el = document.querySelector(selector);
    if (!el) return;

    // ищет стики header и берет его высоту
    const nav = document.querySelector(".navigation");
    const headerOffset = nav
      ? nav.getBoundingClientRect().height + 10 // +10px запас
      : 0;

    const rect = el.getBoundingClientRect();
    const offsetPosition = rect.top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  // скролл с нужным отступом
  setTimeout(doScroll, 50);
};


  const goHome = () => navigate("/");
  const goPoss = () => scrollTo("#possibilities");
  const goStatPage = () => navigate("/statistics");
  const goMobile = () => scrollTo("#offer-mobile-app");
  const goApp = () => scrollTo("#application");

  const isOnApps = location.pathname === "/applications";
  const isOnArchive = location.pathname === "/applications/archive";
  const isOnStats = location.pathname === "/statistics";

  // меню сотрудников только если есть токен и мы на служебном роуте
  const isStaffPage = token && (isOnApps || isOnArchive || isOnStats);

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
      { key: "apps", label: "Активные заявки", to: "/applications" },
      { key: "archive", label: "Архив заявок", to: "/applications/archive" },
      { key: "statpage", label: "Статистика", to: "/statistics" },
    ];
  }

  const navRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [underlineReady, setUnderlineReady] = useState(false);

  const updateUnderline = useCallback((i) => {
    const navEl = navRef.current;
    if (!navEl) return;

    const links = navEl.querySelectorAll("li > a, li > .as-link");
    if (!links || !links[i]) return;

    const el = links[i];
    const rect = el.getBoundingClientRect();
    const parent = navEl.getBoundingClientRect();

    const x = rect.left - parent.left;
    const w = rect.width;

    navEl.style.setProperty("--ux", `${x}px`);
    navEl.style.setProperty("--uw", `${w}px`);
  }, []);

  const setActiveSafe = useCallback(
    (i) => {
      setActiveIdx(i);
      updateUnderline(i);
    },
    [updateUnderline]
  );

  const handleClick = (i, action) => {
    setActiveSafe(i);
    if (action) action();
  };

  // ============================
  // главный useLayoutEffect:
  // выставляет активный пункт и линию
  //   - staff-меню по маршруту
  //   - публичное меню: "/" к Главная, "/statistics" к Статистика
  // ============================
  useLayoutEffect(() => {
    let index = 0;

    if (isStaffPage) {
      if (isOnApps) index = 1;
      else if (isOnArchive) index = 2;
      else if (isOnStats) index = 3;
    } else {
      if (location.pathname === "/statistics") index = 2;
      else index = 0; // главная и любые другие публичные
    }

    // синхронизирует state с линией
    setActiveIdx(index);

    const run = () => {
      updateUnderline(index);
      setUnderlineReady(true);
    };

    // первый проход
    requestAnimationFrame(run);

    // подстраховка через timeout
    const t = setTimeout(run, 250);

    // и еще раз после загрузки шрифтов
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(() => {});
    }

    return () => clearTimeout(t);
  }, [
    isStaffPage,
    isOnApps,
    isOnArchive,
    isOnStats,
    location.pathname,
    updateUnderline,
  ]);

    
  
  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        updateUnderline(activeIdx);
      });
    };

    window.addEventListener("load", handler);

    return () => window.removeEventListener("load", handler);
  }, [activeIdx, updateUnderline]);


  // Скролл-подсветка ТОЛЬКО для главной страницы
  // (на /statistics не работает вообще)
  
  useEffect(() => {
    if (isStaffPage) return;
    if (location.pathname !== "/") return;

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
        setActiveIdx(closestIdx);
        updateUnderline(closestIdx);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isStaffPage, activeIdx, updateUnderline, location.pathname]);

  
  useEffect(() => {
    if (!isStaffPage) return;

    if (isOnApps) setActiveSafe(1);
    else if (isOnArchive) setActiveSafe(2);
    else if (isOnStats) setActiveSafe(3);
  }, [isStaffPage, isOnApps, isOnArchive, isOnStats, setActiveSafe]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((s) => !s);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => closeMobile(), [location.pathname]);

  return (
    <nav className={`navigation ${isStaffPage ? "navigation--staff" : ""}`}>
      <div className="container nav-container">
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            closeMobile();
            window.location.reload();
          }}
        >
          <img className="logo" src={logo} alt="logo" />
        </a>

        {/*десктопное меню */}
        <div className="header-nav desktop-only">
          <ul
            ref={navRef}
            className={underlineReady ? "nav-underline-ready" : ""}
          >
            {navItems.map((it, i) => (
              <li key={it.key}>
                {it.to ? (
                  <Link
                    to={it.to}
                    className={i === activeIdx ? "active as-link" : "as-link"}
                    onClick={() => handleClick(i)}
                  >
                    {it.label}
                  </Link>
                ) : (
                  <a
                    className={i === activeIdx ? "active" : ""}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(i, it.onClick);
                    }}
                  >
                    {it.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* десктопная авторизация */}
        <div className="nav-actions desktop-only">
          <AppBtn
            text="Регистрация"
            {...btnRegAttributes}
            onClick={() =>
              (window.location.href = "https://lsport.net/Person/Register")
            }
          />
          <AppBtn
            text="Вход"
            {...btnLoginAttributes}
            onClick={() =>
              (window.location.href =
                "https://lsport.net/Home/Login?blank=true")
            }
          />
        </div>

        {/* бургер */}
        <div className="burger-wrap mobile-only" onClick={toggleMobile}>
          <button className={`burger ${mobileOpen ? "is-open" : ""}`}>
            <span />
            <span />
            <span />
          </button>
          <span className="burger-label">Меню</span>
        </div>
      </div>

      {/* моб меню */}
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
              text="Регистрация"
              {...btnRegAttributes}
              onClick={() => {
                closeMobile();
                window.location.href = "https://lsport.net/Person/Register";
              }}
            />
            <AppBtn
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
