"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./archives.module.css";
import { usePortfolioTheme } from "../usePortfolioTheme";

const WORLD_WIDTH = 3800;
const WORLD_HEIGHT = 3300;

const archiveCards = [
  { title: "Yandex Pet Day", tag: "Event", image: "/assets/archive-gallery/archive-13.webp", alt: "Главная страница конференции Yandex Pet Day", x: 1305, y: 1060, rotate: -1.5, focus: "center top" },
  { title: "Система ухода за кожей", tag: "Beauty", image: "/assets/archive-gallery/archive-01.webp", alt: "Дизайн страницы системы ухода за кожей", x: 350, y: 210, rotate: 2.5, landscape: true, imageRatio: "1400 / 788" },
  { title: "5FIVE — сияние кожи", tag: "Branding", image: "/assets/archive-gallery/archive-02.webp", alt: "Промостраница косметической сыворотки 5FIVE", x: 970, y: 55, rotate: -2, landscape: true, imageRatio: "1400 / 788" },
  { title: "Профессии будущего", tag: "Education", image: "/assets/archive-gallery/archive-03.webp", alt: "Образовательная страница о профессиях будущего", x: 1780, y: 150, rotate: 1.5, focus: "center top" },
  { title: "JONY MOTORS", tag: "E-commerce", image: "/assets/archive-gallery/archive-04.webp", alt: "Интернет-магазин мотоциклов JONY MOTORS", x: 2350, y: 520, rotate: -2.5, focus: "center top" },
  { title: "За кадром", tag: "Editorial", image: "/assets/archive-gallery/archive-05.webp", alt: "Редакционный beauty-проект За кадром", x: 2220, y: 1120, rotate: 2, focus: "center top" },
  { title: "ДентПро", tag: "HealthTech", image: "/assets/archive-gallery/archive-06.webp", alt: "Лендинг стоматологической клиники ДентПро", x: 2380, y: 1820, rotate: -1, landscape: true, imageRatio: "1380 / 800" },
  { title: "Питчинг-сессии", tag: "Event", image: "/assets/archive-gallery/archive-07.webp", alt: "Анонс серии питчинг-сессий", x: 1610, y: 1930, rotate: 2.2 },
  { title: "Yamaha R6", tag: "Automotive", image: "/assets/archive-gallery/archive-08.webp", alt: "Промостраница мотоцикла Yamaha R6", x: 850, y: 1880, rotate: -2.7 },
  { title: "Вкусная удача", tag: "Promo", image: "/assets/archive-gallery/archive-09.webp", alt: "Промостраница акции Вкусная удача", x: 175, y: 1590, rotate: 1.2 },
  { title: "Напольные покрытия", tag: "E-commerce", image: "/assets/archive-gallery/archive-10.webp", alt: "Каталог напольных покрытий", x: 95, y: 830, rotate: -1.8, focus: "center top" },
  { title: "INSA Turbo", tag: "Automotive", image: "/assets/archive-gallery/archive-12.webp", alt: "Лендинг сервиса по чип-тюнингу INSA Turbo", x: 650, y: 920, rotate: 2.8 },
  { title: "Yandex Pet Day — программа", tag: "Event", image: "/assets/archive-gallery/archive-14.webp", alt: "Программа конференции Yandex Pet Day", x: 1170, y: 2210, rotate: -1.4, focus: "center top" },
  { title: "THE ACT — продуктовая аналитика", tag: "Beauty", image: "/assets/archive-gallery/archive-15.webp", alt: "Интерфейс продуктовой аналитики для косметической линейки THE ACT", x: 3050, y: 180, rotate: 1.7, landscape: true, imageRatio: "1400 / 788" },
  { title: "THE ACT — результаты ухода", tag: "Beauty", image: "/assets/archive-gallery/archive-16.webp", alt: "Промоэкран с результатами регулярного ухода THE ACT", x: 2960, y: 760, rotate: -1.3, landscape: true, imageRatio: "1400 / 788" },
  { title: "JONY MOTORS — подбор мотоцикла", tag: "E-commerce", image: "/assets/archive-gallery/archive-17.webp", alt: "Интерфейс подбора мотоцикла JONY MOTORS", x: 3050, y: 1370, rotate: 2.1, landscape: true, imageRatio: "1400 / 1092" },
  { title: "Чистота ДВ — реферальная акция", tag: "Promo", image: "/assets/archive-gallery/archive-18.webp", alt: "Промоматериал реферальной акции клининговой компании Чистота ДВ", x: 3290, y: 2190, rotate: -2.2, portrait: true, imageRatio: "904 / 1280" },
  { title: "OPEN M.VIDEO — лендинг ПВЗ", tag: "Product", image: "/assets/archive-gallery/archive-19.webp", alt: "Лендинг для открытия пунктов выдачи М.Видео", x: 2240, y: 2700, rotate: 1.4, focus: "center top" },
];

type Point = { x: number; y: number };

export default function ArchivesPage() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<Point>({ x: 0, y: 30 });
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const lastPointerRef = useRef<Point>({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const { dark, toggleTheme } = usePortfolioTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const clampOffset = useCallback((point: Point): Point => {
    const viewport = viewportRef.current;
    if (!viewport) return point;

    const worldWidth = worldRef.current?.offsetWidth ?? WORLD_WIDTH;
    const worldHeight = worldRef.current?.offsetHeight ?? WORLD_HEIGHT;
    const horizontalLimit = Math.max(0, (worldWidth - viewport.clientWidth) / 2 + 120);
    const verticalLimit = Math.max(0, (worldHeight - viewport.clientHeight) / 2 + 120);

    return {
      x: Math.max(-horizontalLimit, Math.min(horizontalLimit, point.x)),
      y: Math.max(-verticalLimit, Math.min(verticalLimit, point.y)),
    };
  }, []);

  const renderWorld = useCallback(() => {
    if (!worldRef.current) return;
    const { x, y } = offsetRef.current;
    worldRef.current.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`;
  }, []);

  const stopInertia = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const startInertia = useCallback(() => {
    stopInertia();

    const tick = () => {
      velocityRef.current.x *= .91;
      velocityRef.current.y *= .91;

      if (Math.abs(velocityRef.current.x) < .08 && Math.abs(velocityRef.current.y) < .08) {
        animationRef.current = null;
        return;
      }

      offsetRef.current = clampOffset({
        x: offsetRef.current.x + velocityRef.current.x,
        y: offsetRef.current.y + velocityRef.current.y,
      });
      renderWorld();
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [clampOffset, renderWorld, stopInertia]);

  useEffect(() => {
    renderWorld();
    const handleResize = () => {
      offsetRef.current = clampOffset(offsetRef.current);
      renderWorld();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      stopInertia();
    };
  }, [clampOffset, renderWorld, stopInertia]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (menuOpen) return;
    stopInertia();
    draggingRef.current = true;
    setDragging(true);
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    velocityRef.current = { x: 0, y: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const dx = event.clientX - lastPointerRef.current.x;
    const dy = event.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    velocityRef.current = { x: dx * 1.25, y: dy * 1.25 };
    offsetRef.current = clampOffset({
      x: offsetRef.current.x + dx,
      y: offsetRef.current.y + dy,
    });
    renderWorld();
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    startInertia();
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    stopInertia();
    offsetRef.current = clampOffset({
      x: offsetRef.current.x - event.deltaX,
      y: offsetRef.current.y - event.deltaY,
    });
    renderWorld();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const directions: Record<string, Point> = {
      ArrowLeft: { x: 70, y: 0 },
      ArrowRight: { x: -70, y: 0 },
      ArrowUp: { x: 0, y: 70 },
      ArrowDown: { x: 0, y: -70 },
    };
    const movement = directions[event.key];
    if (!movement) return;
    event.preventDefault();
    stopInertia();
    offsetRef.current = clampOffset({
      x: offsetRef.current.x + movement.x,
      y: offsetRef.current.y + movement.y,
    });
    renderWorld();
  };

  const pageClassName = [
    styles.archivePage,
    dark ? styles.isDark : "",
    dragging ? styles.isDragging : "",
  ].filter(Boolean).join(" ");

  return (
    <main className={pageClassName}>
      <div className={styles.intro} aria-hidden="true">
        <p className={styles.introTitle}>Архив</p>
      </div>

      <header className={styles.header}>
        <a className={styles.brand} href="/">@Jully_Ch™</a>
        <div className={styles.headerActions}>
          <button
            className={styles.modeButton}
            type="button"
            onClick={toggleTheme}
            aria-pressed={dark}
            aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            {dark ? "light mode" : "dark mode"}
          </button>
          <button
            className={styles.menuButton}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-label="Интерактивный архив. Перетаскивайте поле мышкой или пальцем, либо используйте стрелки на клавиатуре."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.world} ref={worldRef}>
          {archiveCards.map((card, index) => (
            <article
              className={`${styles.card} ${card.landscape ? styles.landscapeCard : ""} ${card.portrait ? styles.portraitCard : ""}`}
              key={card.title}
              style={{
                left: card.x,
                top: card.y,
                transform: `rotate(${card.rotate}deg)`,
              }}
            >
              <div
                className={styles.imageFrame}
                style={{ aspectRatio: card.imageRatio ?? "1" }}
              >
                <img
                  className={styles.cardImage}
                  src={card.image}
                  alt={card.alt}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: card.focus ?? "center" }}
                />
                <span className={styles.imageNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.cardMeta}>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <span className={styles.cardTag}>{card.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.hint} aria-hidden="true">
        <span className={styles.hintDot} />
        <span className={styles.desktopHint}>Зажми и перетаскивай, чтобы исследовать</span>
        <span className={styles.touchHint}>Води пальцем в любую сторону</span>
      </div>
      <div className={styles.counter} aria-hidden="true">01—{archiveCards.length}</div>

      <div className={`${styles.menuOverlay} ${menuOpen ? styles.isOpen : ""}`} aria-hidden={!menuOpen}>
        <div className={styles.menuOrbit} aria-hidden="true"><span /><span /></div>
        <button className={styles.closeButton} type="button" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">×</button>
        <nav className={styles.menuNav} aria-label="Меню разделов">
          <a href="/"><span>01</span>Главная</a>
          <a href="/#projects"><span>02</span>Проекты</a>
          <a href="/archives" onClick={() => setMenuOpen(false)}><span>03</span>Архив</a>
          <a href="/#contact" onClick={() => setMenuOpen(false)}><span>04</span>Контакты</a>
        </nav>
        <button className={styles.menuThemeButton} type="button" onClick={toggleTheme}>
          <span>Цветовая тема</span>
          <strong>{dark ? "Светлая" : "Тёмная"} ↗</strong>
        </button>
      </div>
    </main>
  );
}
