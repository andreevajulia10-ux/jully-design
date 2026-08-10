"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PortfolioButton } from "../components/PortfolioButton";
import { usePortfolioTheme } from "../usePortfolioTheme";
import styles from "./wms-tsd.module.css";

const tags = ["TSD", "ANDROID", "WMS", "PRODUCT DESIGN"];

const previewCards = [
  {
    number: "01",
    title: "Маркировка",
    cover: "/assets/wms-tsd/card-01-cover.webp",
    coverPosition: "56% center",
    videos: [{ src: "/assets/wms-tsd/card-01.mp4", playbackRate: 1 }],
  },
  {
    number: "02",
    title: "Сканирование",
    cover: "/assets/wms-tsd/card-02-cover.webp",
    coverPosition: "center",
    videos: [{ src: "/assets/wms-tsd/card-02.mp4", playbackRate: 1 }],
  },
  {
    number: "03",
    title: "Брак",
    cover: "/assets/wms-tsd/card-03-cover.webp",
    coverPosition: "center",
    videos: [
      { src: "/assets/wms-tsd/card-03-damage.mp4", playbackRate: 1 },
      { src: "/assets/wms-tsd/card-03-confirm.mp4", playbackRate: 1 },
    ],
  },
  {
    number: "04",
    title: "Приёмка",
    cover: "/assets/wms-tsd/card-04-cover.webp",
    coverPosition: "center",
    videos: [{ src: "/assets/wms-tsd/card-04.mp4", playbackRate: 1 }],
  },
  {
    number: "05",
    title: "Динамика продаж",
    cover: "/assets/wms-tsd/card-05-cover.webp",
    coverPosition: "55% center",
    videos: [{ src: "/assets/wms-tsd/card-05.mp4", playbackRate: 1 }],
  },
] as const;

const tasks = [
  "Быстрые сценарии — минимум действий между сканированием и следующим шагом",
  "Ясные статусы — сотрудник всегда понимает, что уже сделано и что делать дальше",
  "Защита от ошибок — заметная обратная связь при неверном товаре или штрихкоде",
];

const completed = [
  "UX-исследование складских процессов и рабочих условий",
  "Карта пользовательских сценариев и логика переходов",
  "Сценарии сортировки, комплектации и контроля товара",
  "Сканирование штрихкодов и подтверждение операций",
  "Состояния ошибок, подсказки и следующий шаг",
  "UI-kit и компоненты для небольших экранов TSD",
  "Подготовка макетов к разработке и сопровождение реализации",
];

function PreviewMedia({ card, active }: { card: (typeof previewCards)[number]; active: boolean }) {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [activeVideo, setActiveVideo] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    });

  }, [active]);

  useEffect(() => {
    if (!active) return;

    const video = videoRefs.current[activeVideo];
    if (!video) return;

    video.currentTime = 0;
    video.playbackRate = card.videos[activeVideo].playbackRate;
    void video.play().catch(() => undefined);

    return () => video.pause();
  }, [active, activeVideo, card.videos]);

  const togglePlayback = () => {
    if (!active) return;

    const video = videoRefs.current[activeVideo];
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => setPausedByUser(false)).catch(() => undefined);
      return;
    }

    video.pause();
    setPausedByUser(true);
  };

  return (
    <button
      className={styles.previewMedia}
      type="button"
      onClick={togglePlayback}
      aria-label={pausedByUser ? "Продолжить видео" : "Поставить видео на паузу"}
      aria-pressed={pausedByUser}
    >
      <img
        className={styles.previewCover}
        src={card.cover}
        alt=""
        style={{ objectPosition: card.coverPosition }}
        loading="lazy"
        decoding="async"
      />
      {card.videos.map((video, index) => (
        <video
          className={`${styles.previewVideo} ${active && activeVideo === index ? styles.playing : ""}`}
          key={video.src}
          ref={(node) => { videoRefs.current[index] = node; }}
          src={video.src}
          poster={card.cover}
          muted
          playsInline
          preload="none"
          loop={card.videos.length === 1}
          onEnded={() => {
            if (card.videos.length > 1) {
              setActiveVideo((current) => (current + 1) % card.videos.length);
            }
          }}
        />
      ))}
      <span className={`${styles.playbackIndicator} ${pausedByUser ? styles.paused : ""}`} aria-hidden="true">
        {pausedByUser ? "▶" : "Ⅱ"}
      </span>
    </button>
  );
}

export default function WmsTsdPage() {
  const { dark, toggleTheme } = usePortfolioTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<{ index: number; offsetX: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(0);
  const previewGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const syncMobilePreview = () => {
    if (!isMobile || !previewGridRef.current) return;

    const grid = previewGridRef.current;
    const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
    const cards = Array.from(grid.children) as HTMLElement[];
    const closestIndex = cards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const closestCard = cards[closest];
      const closestCenter = closestCard.offsetLeft + closestCard.clientWidth / 2;
      return Math.abs(cardCenter - gridCenter) < Math.abs(closestCenter - gridCenter)
        ? index
        : closest;
    }, 0);

    setMobilePreview(closestIndex);
  };

  const goToPreview = (index: number) => {
    const nextIndex = Math.max(0, Math.min(previewCards.length - 1, index));
    const grid = previewGridRef.current;
    const card = grid?.children[nextIndex] as HTMLElement | undefined;

    setMobilePreview(nextIndex);
    if (!grid || !card) return;

    grid.scrollTo({
      left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  const activatePreview = (index: number, wrap: HTMLElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActivePreview({ index, offsetX: 0 });
      return;
    }

    const card = wrap.querySelector<HTMLElement>("[data-preview-card]");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const scale = 2;
    const desiredOffset = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const maxOffset = rect.width * (scale - 1) / 2;
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, desiredOffset));

    setActivePreview({ index, offsetX });
  };

  useEffect(() => {
    if (!detailsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [detailsOpen]);

  return (
    <main className={`${styles.page} ${dark ? styles.dark : ""}`}>
      <header className={styles.header}>
        <div className={styles.announcement}>WMS/TSD · UX/UI CASE · 2025</div>
        <nav className={styles.nav} aria-label="Навигация по кейсу">
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
            <PortfolioButton href="/">Назад в портфолио</PortfolioButton>
          </div>
        </nav>
      </header>

      <section className={`${styles.hero} ${styles.shell}`} aria-labelledby="wms-tsd-title">
        <p className={styles.breadcrumb}>ПОРТФОЛИО / ПРОЕКТЫ / WMS/TSD</p>
        <h1 id="wms-tsd-title">WMS/TSD</h1>
        <p className={styles.heroMeta}>Интерфейсы для складских процессов</p>
        <div className={styles.tags}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <PortfolioButton className={styles.detailsButton} onClick={() => setDetailsOpen(true)}>
          Детали проекта
        </PortfolioButton>
      </section>

      <div className={`${styles.previewBackdrop} ${activePreview !== null ? styles.visible : ""}`} aria-hidden="true" />
      <section className={`${styles.previews} ${styles.shell}`} aria-label="Экраны проекта WMS/TSD" onMouseLeave={() => setActivePreview(null)}>
        <div className={styles.previewGrid} ref={previewGridRef} onScroll={syncMobilePreview}>
          {previewCards.map((card, index) => {
            const isActive = isMobile ? mobilePreview === index : activePreview?.index === index;

            return (
            <article
              className={`${styles.previewWrap} ${isActive ? styles.active : ""} ${!isMobile && activePreview !== null && activePreview.index !== index ? styles.dimmed : ""}`}
              key={card.number}
              tabIndex={0}
              onMouseEnter={(event) => {
                if (!isMobile) activatePreview(index, event.currentTarget);
              }}
              onFocus={(event) => {
                if (!isMobile) activatePreview(index, event.currentTarget);
              }}
              onBlur={(event) => {
                if (!isMobile && !event.currentTarget.contains(event.relatedTarget)) setActivePreview(null);
              }}
            >
              <div
                className={styles.previewCard}
                data-preview-card
                style={!isMobile && activePreview?.index === index ? {
                  "--preview-offset-x": `${activePreview.offsetX}px`,
                } as CSSProperties : undefined}
              >
                <PreviewMedia key={`${card.number}-${isActive}`} card={card} active={isActive} />
              </div>
              <div className={styles.previewLabel}><span>{card.number}</span><span>{card.title}</span></div>
            </article>
            );
          })}
        </div>
        <div className={styles.previewControls} aria-label="Навигация по видео проекта">
          <button type="button" onClick={() => goToPreview(mobilePreview - 1)} disabled={mobilePreview === 0} aria-label="Предыдущее видео">←</button>
          <span><strong>{String(mobilePreview + 1).padStart(2, "0")}</strong> / {String(previewCards.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => goToPreview(mobilePreview + 1)} disabled={mobilePreview === previewCards.length - 1} aria-label="Следующее видео">→</button>
        </div>
        <p className={styles.swipeHint}>Листайте видео свайпом</p>
      </section>

      <footer className={styles.footer}>
        <a href="/linka">LINKA →</a>
        <PortfolioButton href="/">Назад в портфолио</PortfolioButton>
      </footer>

      {detailsOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="details-title" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailsOpen(false);
        }}>
          <button className={styles.modalClose} type="button" onClick={() => setDetailsOpen(false)} aria-label="Закрыть окно">×</button>
          <div className={styles.modalCard}>
            <p className={styles.modalLabel}>WMS/TSD · СКЛАДСКИЕ ОПЕРАЦИИ</p>
            <h2 id="details-title">О ПРОЕКТЕ</h2>
            <p className={styles.modalLead}>Интерфейс терминала сбора данных для сотрудников склада: сканирование, сортировка, комплектация и контроль товара в одном последовательном рабочем сценарии.</p>

            <section className={`${styles.projectNote} ${styles.modalProjectNote}`} aria-label="Ключевые сведения о проекте">
              <div>
                <span>МОЯ РОЛЬ</span>
                <p>UX/UI-дизайн · продуктовая логика · состояния ошибок</p>
              </div>
              <div>
                <span>ПЛАТФОРМА</span>
                <p>TSD · Android · WMS</p>
              </div>
              <div>
                <span>АУДИТОРИЯ</span>
                <p>Сотрудники склада · супервайзеры</p>
              </div>
            </section>

            <div className={styles.modalSection}>
              <h3>О проекте</h3>
              <p>WMS/TSD — рабочий интерфейс для складских операций на небольшом экране терминала. Сотрудник использует его на ходу: сканирует товар, проверяет данные, подтверждает операцию и сразу переходит к следующему шагу.</p>
              <p>Я спроектировала пользовательские сценарии с учётом скорости работы, физических ограничений устройства и высокой цены ошибки. В интерфейсе сокращено количество действий, усилена обратная связь и сделаны понятными успешные, промежуточные и ошибочные состояния.</p>
            </div>

            <div className={styles.modalSection}>
              <h3>Основные задачи</h3>
              <div className={styles.taskGrid}>{tasks.map((task, index) => <article key={task}><span>0{index + 1}</span><p>{task}</p></article>)}</div>
            </div>

            <div className={styles.modalSection}>
              <h3>Что сделано</h3>
              <ul>{completed.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
