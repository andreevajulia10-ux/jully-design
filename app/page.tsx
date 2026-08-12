"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioButton } from "./components/PortfolioButton";
import { usePortfolioTheme } from "./usePortfolioTheme";

gsap.registerPlugin(ScrollTrigger);

const HERO_CANVAS_SIZE = 2000;

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Портфолио UX/UI-дизайнера Юлии Черношей",
  url: "https://jully-design.ru/",
  dateModified: "2026-08-12",
  mainEntity: {
    "@type": "Person",
    "@id": "https://jully-design.ru/#julia-chernoshey",
    name: "Юлия Черношей",
    alternateName: "@Jully_Ch",
    url: "https://jully-design.ru/",
    image: "https://jully-design.ru/assets/hero-yulia-new.webp",
    jobTitle: "UX/UI-дизайнер",
    description:
      "UX/UI-дизайнер, создающий интерфейсы цифровых продуктов, адаптивные сайты и их фронтенд-реализацию.",
    sameAs: [
      "https://www.behance.net/5e2d01f1",
      "https://t.me/Jully_Ch",
    ],
  },
};

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest(".hero") as HTMLElement | null;
    const context = canvas?.getContext("2d");
    const titleImages = Array.from(
      hero?.querySelectorAll<HTMLImageElement>(".hero-title img") ?? [],
    );

    if (!canvas || !hero || !context || titleImages.length === 0) return;

    const width = HERO_CANVAS_SIZE;
    const height = HERO_CANVAS_SIZE;
    const fullCircle = Math.PI * 2;
    const boxSize = 123;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = {
      x: width / 2,
      y: height / 2,
      scale: 1.5,
      targetX: width / 2,
      targetY: height / 2,
    };

    canvas.width = width;
    canvas.height = height;

    const sourceCanvas = document.createElement("canvas");
    const sourceContext = sourceCanvas.getContext("2d");
    sourceCanvas.width = width;
    sourceCanvas.height = height;

    if (!sourceContext) return;

    let canvasRect = canvas.getBoundingClientRect();
    let scaleX = width / canvasRect.width;
    let scaleY = height / canvasRect.height;
    let running = false;
    let titlesReady = false;
    let heroVisible = true;

    const boxes: Array<{ x: number; y: number; distance: number; scale: number }> = [];
    for (let x = 0; x <= width; x += boxSize) {
      for (let y = 0; y <= height; y += boxSize) {
        boxes.push({ x, y, distance: 0, scale: 0 });
      }
    }

    context.fillStyle = "#fff";

    const moveX = gsap.quickTo(pointer, "x", {
      duration: 1,
      ease: "expo",
    });
    const moveY = gsap.quickTo(pointer, "y", {
      duration: 1,
      ease: "expo",
    });
    const changeScale = gsap.quickTo(pointer, "scale", {
      duration: 2,
      ease: "power2",
    });

    const drawTile = (box: (typeof boxes)[number]) => {
      box.distance = Math.hypot(box.x - pointer.x, box.y - pointer.y);
      box.scale =
        1 - gsap.utils.clamp(0, 1, box.distance / width / pointer.scale);

      if (box.scale < 0.001) return;

      const scaledBox = boxSize * box.scale;
      context.drawImage(
        sourceCanvas,
        box.x + scaledBox / 2,
        box.y + scaledBox / 2,
        boxSize - scaledBox,
        boxSize - scaledBox,
        box.x,
        box.y,
        boxSize,
        boxSize,
      );
    };

    const drawDot = (box: (typeof boxes)[number]) => {
      context.beginPath();
      context.arc(
        box.x,
        box.y,
        boxSize * 0.15 * box.scale,
        0,
        fullCircle,
      );
      context.fill();
    };

    const drawSource = () => {
      sourceContext.fillStyle = getComputedStyle(hero).backgroundColor;
      sourceContext.fillRect(0, 0, width, height);

      titleImages.forEach((titleImage) => {
        const titleRect = titleImage.getBoundingClientRect();
        sourceContext.drawImage(
          titleImage,
          (titleRect.left - canvasRect.left) * scaleX,
          (titleRect.top - canvasRect.top) * scaleY,
          titleRect.width * scaleX,
          titleRect.height * scaleY,
        );
      });
    };

    const render = () => {
      const distance = Math.hypot(
        pointer.x - pointer.targetX,
        pointer.y - pointer.targetY,
      );
      changeScale((distance / width) * 2);

      drawSource();
      context.clearRect(0, 0, width, height);
      context.drawImage(sourceCanvas, 0, 0, width, height);
      boxes.forEach(drawTile);
      boxes.forEach(drawDot);
    };

    const updateCanvasMetrics = () => {
      canvasRect = canvas.getBoundingClientRect();
      scaleX = width / canvasRect.width;
      scaleY = height / canvasRect.height;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX - canvasRect.left) * scaleX;
      pointer.targetY = (event.clientY - canvasRect.top) * scaleY;
      moveX(pointer.targetX);
      moveY(pointer.targetY);
    };

    const handlePointerLeave = () => {
      pointer.targetX = width / 2;
      pointer.targetY = height / 2;
      moveX(pointer.targetX);
      moveY(pointer.targetY);
    };

    const setAnimationRunning = (shouldRun: boolean) => {
      if (prefersReducedMotion || !titlesReady || shouldRun === running) return;

      running = shouldRun;
      if (shouldRun) {
        updateCanvasMetrics();
        gsap.ticker.add(render);
        hero.addEventListener("pointermove", handlePointerMove);
        hero.addEventListener("pointerleave", handlePointerLeave);
      } else {
        gsap.ticker.remove(render);
        hero.removeEventListener("pointermove", handlePointerMove);
        hero.removeEventListener("pointerleave", handlePointerLeave);
      }
    };

    const handleTitlesReady = () => {
      titlesReady = true;
      canvas.classList.add("is-ready");
      hero.classList.add("has-interactive-title");
      updateCanvasMetrics();
      render();
      setAnimationRunning(heroVisible);
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      setAnimationRunning(heroVisible);
    });

    window.addEventListener("resize", updateCanvasMetrics);
    intersectionObserver.observe(hero);

    Promise.all(
      titleImages.map((titleImage) =>
        titleImage.complete
          ? titleImage.decode().catch(() => undefined)
          : new Promise<void>((resolve) => {
              titleImage.addEventListener("load", () => resolve(), { once: true });
              titleImage.addEventListener("error", () => resolve(), { once: true });
            }),
      ),
    ).then(handleTitlesReady);

    return () => {
      window.removeEventListener("resize", updateCanvasMetrics);
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      hero.classList.remove("has-interactive-title");
      if (running) gsap.ticker.remove(render);
      gsap.killTweensOf(pointer);
    };
  }, []);

  return (
    <div className="hero-canvas-layer" aria-hidden="true">
      <canvas className="hero-canvas" ref={canvasRef} />
    </div>
  );
}

type FlyingTextVariant = "heading" | "about-copy";

type FlyingTextProps = {
  as: "h2" | "p";
  children: string;
  className?: string;
  id?: string;
  variant: FlyingTextVariant;
};

type FlyingTextConfig = {
  reverse: boolean;
  windAngle: number;
  windStrength: number;
  scatter: number;
  maxRotation: number;
  stagger: number;
  depth: number;
  order: "random" | "ltr" | "rtl" | "outward";
  randomness: number;
  gustiness: number;
  gustFrequency: number;
  gustPhaseSpread: number;
  startY: number;
  animationDuration: number;
  easing?: string;
};

const flyingTextConfigs: Record<FlyingTextVariant, FlyingTextConfig> = {
  heading: {
    reverse: true,
    order: "ltr",
    windAngle: 150,
    windStrength: 500,
    scatter: 90,
    maxRotation: 450,
    gustiness: 120,
    stagger: 0.9,
    randomness: 0,
    gustFrequency: 1,
    gustPhaseSpread: 1,
    depth: 140,
    startY: 0.9,
    animationDuration: 0.7,
    easing: "elastic.out(1,0.7)",
  },
  "about-copy": {
    reverse: false,
    order: "outward",
    windAngle: 120,
    windStrength: 50,
    scatter: 50,
    maxRotation: 570,
    gustiness: 200,
    stagger: 1.5,
    randomness: 0.2,
    gustFrequency: 0.4,
    gustPhaseSpread: 0.4,
    depth: 290,
    startY: 0.5,
    animationDuration: 0.7,
  },
};

function seededRandom(seed: number) {
  let value = seed >>> 0;

  const splitmix32 = () => {
    value = (value + 0x9e3779b9) | 0;
    let mixed = value ^ (value >>> 16);
    mixed = Math.imul(mixed, 0x21f0aaad);
    mixed ^= mixed >>> 15;
    mixed = Math.imul(mixed, 0x735a2d97);
    return (mixed ^ (mixed >>> 15)) >>> 0;
  };

  let a = splitmix32();
  let b = splitmix32();
  let c = splitmix32();
  let d = splitmix32();

  const random = () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const result = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = ((c << 21) | (c >>> 11)) + result | 0;
    return (result >>> 0) / 4294967296;
  };

  for (let index = 0; index < 12; index += 1) random();
  return random;
}

function FlyingText({ as, children, className = "", id, variant }: FlyingTextProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!element || reducedMotion) return;

    const config = flyingTextConfigs[variant];
    const rawText = children.replace(/\s+/g, " ").trim();
    const seed = 42 + rawText.length + (variant === "heading" ? 100 : 200);
    let timeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    if (getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }

    element.textContent = "";

    const accessibleText = document.createElement("span");
    accessibleText.className = "visually-hidden";
    accessibleText.textContent = rawText;

    const placeholder = document.createElement("span");
    placeholder.className = "fly-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = rawText;

    const overlay = document.createElement("span");
    overlay.className = "fly-overlay";
    overlay.setAttribute("aria-hidden", "true");

    element.append(accessibleText, placeholder, overlay);

    const setup = () => {
      scrollTrigger?.kill();
      timeline?.kill();
      overlay.replaceChildren();

      const containerRect = element.getBoundingClientRect();
      const textNode = placeholder.firstChild;
      if (!textNode) return;

      // Range rectangles are reported after CSS transforms. Convert them back
      // into the element's local coordinate space so a condensed heading (the
      // testimonials title uses scaleX) is not positioned and scaled twice.
      const layoutWidth = element.offsetWidth || containerRect.width;
      const layoutHeight = element.offsetHeight || containerRect.height;
      const scaleX = containerRect.width / layoutWidth || 1;
      const scaleY = containerRect.height / layoutHeight || 1;

      const characters: Array<{
        node: HTMLSpanElement;
        normalisedX: number;
        x: number;
      }> = [];

      for (let index = 0; index < rawText.length; index += 1) {
        if (rawText[index] === " ") continue;

        const range = document.createRange();
        range.setStart(textNode, index);
        range.setEnd(textNode, index + 1);
        const bounds = range.getBoundingClientRect();
        const character = document.createElement("span");
        const x = (bounds.left - containerRect.left) / scaleX;
        const y = (bounds.top - containerRect.top) / scaleY;

        character.className = "fly-char";
        character.textContent = rawText[index];
        character.style.left = `${x}px`;
        character.style.top = `${y}px`;
        character.style.width = `${bounds.width / scaleX}px`;
        character.style.height = `${bounds.height / scaleY}px`;
        overlay.appendChild(character);
        characters.push({ node: character, normalisedX: 0, x });
      }

      if (!characters.length) return;

      const xValues = characters.map((character) => character.x);
      const xMin = Math.min(...xValues);
      const xRange = Math.max(...xValues) - xMin || 1;
      characters.forEach((character) => {
        character.normalisedX = (character.x - xMin) / xRange;
      });

      const random = seededRandom(seed);
      const rand = (min: number, max: number) => min + random() * (max - min);
      const lerp = (from: number, to: number, amount: number) =>
        from + (to - from) * amount;
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const radians = (config.windAngle * Math.PI) / 180;
      const windX = Math.cos(radians);
      const windY = -Math.sin(radians);
      const perpendicularX = Math.sin(radians);
      const perpendicularY = Math.cos(radians);
      const sharedGust =
        config.gustiness > 0
          ? rand(0.1, 1) * config.gustiness * (random() > 0.5 ? 1 : -1)
          : 0;

      timeline = gsap.timeline({ paused: true });
      gsap.set(
        characters.map((character) => character.node),
        { transformPerspective: 500 },
      );

      characters.forEach((character, index) => {
        const x = character.normalisedX;
        let orderedStart = 0;

        switch (config.order) {
          case "ltr":
            orderedStart = x * config.stagger;
            break;
          case "rtl":
            orderedStart = (1 - x) * config.stagger;
            break;
          case "outward":
            orderedStart =
              (1 - Math.abs(x - 0.5) * 2) * config.stagger;
            break;
          default:
            orderedStart = rand(0, config.stagger);
        }

        const startTime =
          orderedStart * (1 - config.randomness) +
          rand(0, config.stagger) * config.randomness;
        const duration = rand(
          1 - config.randomness * 0.5,
          1 + config.randomness * 0.5,
        );
        const scatterAngle = rand(0, Math.PI * 2);
        const scatterDistance = rand(0, config.scatter);
        const finalX =
          windX * config.windStrength +
          Math.cos(scatterAngle) * scatterDistance;
        const finalY =
          windY * config.windStrength +
          Math.sin(scatterAngle) * scatterDistance;
        const finalZ = rand(-config.depth, config.depth);
        const rotationX = rand(-config.maxRotation, config.maxRotation);
        const rotationY = rand(
          -config.maxRotation * 0.7,
          config.maxRotation * 0.7,
        );
        const rotationZ = rand(
          -config.maxRotation * 0.3,
          config.maxRotation * 0.3,
        );
        const syncedPhase = Math.PI * config.gustFrequency * startTime;
        const indexedPhase =
          (index / Math.max(1, characters.length - 1)) * Math.PI * 2;
        const phase = lerp(
          syncedPhase,
          indexedPhase,
          config.gustPhaseSpread,
        );
        const individualGust =
          rand(0.1, 1) * config.gustiness * (random() > 0.5 ? 1 : -1);
        const gust = lerp(
          sharedGust,
          individualGust,
          config.gustPhaseSpread,
        );
        const sineStart = Math.sin(phase);
        const sineEnd = Math.sin(Math.PI * config.gustFrequency + phase);
        const proxy = { progress: 0 };

        const stateAt = (progress: number) => {
          const scatterProgress = config.reverse ? 1 - progress : progress;
          const sine =
            gust *
            (Math.sin(
              Math.PI * config.gustFrequency * progress + phase,
            ) -
              sineStart -
              progress * (sineEnd - sineStart));

          return {
            x: scatterProgress * finalX + perpendicularX * sine,
            y: scatterProgress * finalY + perpendicularY * sine,
            z: scatterProgress * finalZ,
            rotationX: rotationX * scatterProgress,
            rotationY: rotationY * scatterProgress,
            rotationZ: rotationZ * scatterProgress,
            opacity: clamp((1 - scatterProgress) / 0.6),
          };
        };

        gsap.set(character.node, stateAt(0));
        timeline?.to(
          proxy,
          {
            progress: 1,
            duration,
            ease:
              config.easing ??
              (config.reverse ? "power3.out" : "power3.in"),
            immediateRender: true,
            onUpdate: () => {
              gsap.set(character.node, stateAt(proxy.progress));
            },
          },
          startTime,
        );
      });

      if (config.animationDuration > 0 && config.animationDuration < 1) {
        timeline.call(
          () => undefined,
          [],
          timeline.duration() / config.animationDuration,
        );
      }

      scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: `top ${Math.round(config.startY * 100)}%`,
        end: config.reverse ? "top 20%" : "bottom top",
        scrub: 1,
        animation: timeline,
        invalidateOnRefresh: true,
      });
    };

    document.fonts.ready.then(() => {
      // Wait for the font and the final responsive layout to settle before
      // measuring individual glyphs. Measuring one frame too early leaves the
      // overlay on coordinates from the fallback font or the previous width.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (disposed) return;
        setup();

        let lastWidth = element.clientWidth;
        let lastHeight = element.clientHeight;
        resizeObserver = new ResizeObserver(() => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          if (width === lastWidth && height === lastHeight) return;
          lastWidth = width;
          lastHeight = height;
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            setup();
            ScrollTrigger.refresh();
          }, 200);
        });
        resizeObserver.observe(element);
        ScrollTrigger.refresh();
      }));
    });

    return () => {
      disposed = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      scrollTrigger?.kill();
      timeline?.kill();
      element.textContent = rawText;
    };
  }, [children, variant]);

  const flyClassName = `fly-text ${className}`.trim();

  if (as === "p") {
    return (
      <p className={flyClassName} id={id} ref={elementRef as React.RefObject<HTMLParagraphElement>}>
        {children}
      </p>
    );
  }

  return (
    <h2 className={flyClassName} id={id} ref={elementRef as React.RefObject<HTMLHeadingElement>}>
      {children}
    </h2>
  );
}

const services = [
  {
    title: "ПОГРУЖАЮСЬ В ПРОДУКТ",
    icon: "/assets/service-01-paperclip.svg",
    text: "Изучаю продукт, аудиторию и\u00A0рынок. Собираю требования, нахожу ограничения и\u00A0определяю главную задачу интерфейса.",
    tags: ["Исследование", "Конкуренты", "Требования"],
  },
  {
    title: "ПРОЕКТИРУЮ ЛОГИКУ",
    icon: "/assets/service-03.svg",
    text: "Выстраиваю структуру и\u00A0пользовательские сценарии. Создаю вайрфреймы и\u00A0прототипы, чтобы проверить логику до\u00A0дизайна.",
    tags: ["Сценарии", "Вайрфреймы", "Прототипы"],
  },
  {
    title: "СОЗДАЮ ИНТЕРФЕЙС",
    icon: "/assets/service-02.svg",
    text: "Нахожу визуальный язык продукта. Работаю с\u00A0сеткой, типографикой и\u00A0цветом, продумываю состояния и\u00A0собираю дизайн-систему.",
    tags: ["Дизайн", "Компоненты", "Дизайн-система"],
  },
  {
    title: "РЕАЛИЗУЮ В КОДЕ",
    icon: "/assets/service-01.svg",
    text: "Переношу макеты из\u00A0Figma в\u00A0браузер. Собираю адаптивные страницы и\u00A0компоненты, добавляю логику, анимации и\u00A0взаимодействия.",
    tags: ["Вайбкодинг", "Фронтенд", "Адаптив"],
  },
];

const testimonials = [
  {
    name: "Элла Якшич",
    role: "Product Manager · OPEN M.VIDEO",
    icon: "/assets/testimonial-01.svg",
    text: "Мне понравилось, что не пришлось долго объяснять специфику продукта — в задачу погрузились очень быстро. Сайт получился понятным и живым: именно так мы хотели рассказать о проекте будущим партнёрам.",
    tags: ["Product Design", "UX/UI", "Landing"],
    project: {
      title: "OPEN M.VIDEO",
      href: "https://open.mvideo.ru/",
      cover: "/assets/project-open-mvideo-cover.webp",
      external: true,
    },
  },
  {
    name: "Станислав Кюн",
    role: "Project Lead · LINKA",
    icon: "/assets/testimonial-02.svg",
    text: "С LINKA было непросто: идей много, а цельного образа сначала не было. В итоге всё собралось в понятную систему, и даже после множества правок проект не потерял характер.",
    tags: ["EdTech", "UX/UI", "Design System"],
    project: {
      title: "LINKA",
      href: "/linka",
      cover: "/assets/project-linka-cover.webp",
      external: false,
    },
  },
  {
    name: "Анна Кузнецова",
    role: "Бизнес-аналитик",
    icon: "/assets/testimonial-03.svg",
    text: "Очень комфортно работать с человеком, который сначала задаёт вопросы, а потом рисует. Мы заранее разобрали спорные места, поэтому на согласованиях почти не возвращались к уже решённому.",
    tags: ["UX", "Сценарии", "Прототипы"],
    project: null,
  },
  {
    name: "Елена Васильева",
    role: "Руководитель продукта",
    icon: "/assets/testimonial-04.svg",
    text: "Не приходилось следить за каждым шагом и подробно расписывать, как именно всё сделать. Можно было обозначить задачу и получить продуманный результат — аккуратный, логичный и готовый к работе.",
    tags: ["UI", "Адаптив", "Компоненты"],
    project: null,
  },
];

const testimonialArrow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAO5JREFUeAG1kE+OAUEUxt97usLsej2ZGWOll30D7SbsCIITcAMWOpbiBm6grmDXsekQsbYTdNejJZ20ipJY+Hb1vd9X7w9unSnDEyFE1d+gI3XfigGquikAZk9/SQKloCl1c+dMwSSCN/X5gLUp+11x5sV32N68AlOOEMG95EnuS5OiEXb8we3QQyUsm/6CVh2BpSl0hxl7OSbvZ91YYVrYOv7t9uiJk/JUPicZoroCqmThh6XjwrlPTIdLgRYK0WYWXQQaAqpeCifCbPvQHdnW8WvJyG7yZohrxaA9zzKoz5yGFEZjHTYq/J/ZptoVcFlfS1fzSM4AAAAASUVORK5CYII=";

const galleryColumns = [
  [1, 7, 4, 10, 2, 8, 5, 11, 3, 9, 6, 12],
  [6, 12, 3, 9, 5, 11, 2, 8, 4, 10, 1, 7],
  [11, 3, 8, 1, 10, 5, 12, 4, 7, 2, 9, 6],
  [2, 9, 6, 12, 3, 10, 5, 7, 1, 8, 4, 11],
  [8, 4, 11, 2, 9, 6, 12, 3, 10, 5, 7, 1],
].map((column) =>
  column.map(
    (imageNumber) =>
      `/assets/archive-gallery/archive-${String(imageNumber).padStart(2, "0")}.webp`,
  ),
);


function GalleryStage() {
  const stageRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const overlay = overlayRef.current;

    if (!stage || !overlay) return;

    const context = gsap.context(() => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      reveal
        .fromTo(
          overlay,
          { autoAlpha: 0 },
          { autoAlpha: 0, duration: 0.55 },
        )
        .to(overlay, {
          autoAlpha: 1,
          duration: 0.45,
          ease: "power1.out",
        });
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <section ref={stageRef} className="gallery-stage" aria-label="Галерея работ">
      <div className="gallery-column-wrapper">
        <div className="gallery-columns" aria-hidden="true">
          {galleryColumns.map((column, columnIndex) => (
            <div
              className={`gallery-column ${columnIndex % 2 === 0 ? "gallery-column-up" : "gallery-column-down"}`}
              key={columnIndex}
            >
              {[...column, ...column].map((image, imageIndex) => (
                <img
                  className="gallery-image"
                  key={`${image}-${imageIndex}`}
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  data-image-index={imageIndex % column.length}
                />
              ))}
            </div>
          ))}
        </div>
        <div ref={overlayRef} className="gallery-final-overlay" id="gallery-archive">
          <h2 className="gallery-final-title">
            <a className="gallery-final-link" href="/archives">
              Перейти в галерею
            </a>
          </h2>
        </div>
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}

export default function Home() {
  const { dark, toggleTheme } = usePortfolioTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openTestimonial, setOpenTestimonial] = useState<number | null>(null);

  const handleMenuLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuOpen(false);

    if (!href.startsWith("#")) return;

    event.preventDefault();
    window.requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <main className={dark ? "portfolio is-dark" : "portfolio"} id="top">
      <section className="hero" aria-labelledby="hero-title">
        <HeroCanvas />
        <header className="site-header">
          <div className="announcement">UX/UI designer · open to product teams · 2026</div>
          <nav className="nav" aria-label="Основная навигация">
            <a className="brand" href="#top">@Jully_Ch™</a>
            <div className="nav-actions">
              <button className="mode-button" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}>{dark ? "light mode" : "dark mode"}</button>
              <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><span /><span /><span /></button>
            </div>
          </nav>
        </header>

        <h1 className="hero-title" id="hero-title" aria-label="UX/UI DESIGNER · VIBE CODER">
          <span className="sr-only">UX/UI DESIGNER · VIBE CODER</span>
          <img className="hero-title-uxui" src="/assets/hero-title-uxui.png" alt="" aria-hidden="true" fetchPriority="high" />
          <img className="hero-title-vibe" src="/assets/hero-title-vibe.png" alt="" aria-hidden="true" fetchPriority="high" />
        </h1>

        <div className="hero-grid shell">
          <article className="intro-card">
            <p>Привет! Я Юля — UX/UI-дизайнер. Создаю интерфейсы для сложных продуктов, внутренних систем и мобильных сервисов, где важны логика, скорость и понятный пользовательский путь.</p>
            <img className="intro-scribble" src="/assets/intro-scribble.svg" alt="" aria-hidden="true" />
            <PortfolioButton href="#about">Немного обо мне</PortfolioButton>
          </article>
          <figure className="portrait-card">
            <img className="portrait-photo" src="/assets/hero-yulia-new.webp" alt="Юлия Черношей за работой" decoding="async" />
            <img className="portrait-doodles" src="/assets/portrait-frame-new.svg" alt="" aria-hidden="true" />
          </figure>
        </div>
      </section>

      <section className="section shell split-section" id="about">
        <div className="section-label"><FlyingText as="h2" variant="heading">Обо мне</FlyingText></div>
        <FlyingText as="p" className="section-copy" variant="about-copy">Со мной можно пройти весь путь от идеи до живого интерфейса. Я погружаюсь в задачу, помогаю разобраться в логике продукта, проектирую пользовательские сценарии и создаю дизайн, который передаёт его суть и не выглядит как очередное шаблонное решение. А дальше могу сама перенести дизайн из Figma во фронтенд — собрать адаптивный интерфейс, добавить анимации и взаимодействия.</FlyingText>
      </section>

      <section className="section shell services-section">
        <FlyingText as="h2" className="section-label" variant="heading">Что я делаю</FlyingText>
        <div className="services-content">
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div>
                  <img className="service-icon" src={service.icon} alt="" loading="lazy" decoding="async" />
                  <h3>
                    {service.title === "ПОГРУЖАЮСЬ В ПРОДУКТ" ? (
                      <>ПОГРУЖАЮСЬ<br />В ПРОДУКТ</>
                    ) : service.title}
                  </h3>
                </div>
                <div>
                  <p>{service.text}</p>
                  <div className="tag-row">{service.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                </div>
              </article>
            ))}
          </div>
          <PortfolioButton href="#projects">Смотреть проекты</PortfolioButton>
        </div>
      </section>

      <section className="projects-section shell" id="projects">
        <article className="project-card project-card-first">
          <div className="project-copy">
            <div><h2>WMS/TSD</h2><div className="tag-row"><Tag>М.Видео-Эльдорадо</Tag><Tag>UX/UI</Tag></div></div>
            <div><p>Интерфейсы терминалов сбора данных для складских процессов: сортировка, комплектация и контроль товара.</p><PortfolioButton href="/wms-tsd">Смотреть кейс</PortfolioButton></div>
          </div>
          <a className="project-media project-media-wms" href="/wms-tsd" aria-label="Открыть кейс WMS/TSD">
            <img
              className="project-cover-image"
              src="/assets/wms-tsd/project-main-cover.webp"
              alt="Два терминала сбора данных с интерфейсами WMS"
              loading="lazy"
              decoding="async"
            />
          </a>
        </article>
        <article className="project-card project-card-second">
          <div className="project-copy">
            <div><h2>Linka</h2><div className="tag-row"><Tag>Desktop</Tag><Tag>Product design</Tag><Tag>UX logic</Tag></div></div>
            <div><p>Рабочее пространство для логопедов: занятия, материалы и прогресс ребёнка собраны в одном понятном сервисе.</p><PortfolioButton href="/linka">Смотреть кейс</PortfolioButton></div>
          </div>
          <a className="project-media project-media-linka" href="/linka" aria-label="Открыть кейс Linka">
            <img
              className="project-cover-image project-cover-linka"
              src="/assets/project-linka-cover.webp"
              alt="Интерфейс LINKA на планшете в кабинете логопеда"
              loading="lazy"
              decoding="async"
            />
          </a>
        </article>
        <a
          className="project-card project-card-third project-card-external"
          href="https://open.mvideo.ru/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть сайт проекта OPEN M.VIDEO в новой вкладке"
        >
          <div className="project-copy">
            <div><h2>OPEN M.VIDEO</h2><div className="tag-row"><Tag>Landing</Tag><Tag>UX/UI</Tag><Tag>М.Видео</Tag></div></div>
            <div>
              <p>Лендинг для будущих владельцев ПВЗ М.Видео: преимущества формата, условия запуска и выбор доступной локации.</p>
              <span className="pill-button project-card-cta" aria-hidden="true">
                <span className="pill-label">Открыть сайт</span>
                <span className="pill-icon">
                  <img className="pill-arrow pill-arrow-default" src="/assets/button-arrow.png" alt="" />
                  <img className="pill-arrow pill-arrow-hover" src="/assets/button-arrow-hover.png" alt="" />
                </span>
              </span>
            </div>
          </div>
          <div className="project-media project-media-open">
            <img
              className="project-cover-image project-cover-open"
              src="/assets/project-open-mvideo-cover.webp"
              alt="Сотрудница пункта выдачи М.Видео передаёт заказ клиенту"
              loading="lazy"
              decoding="async"
            />
          </div>
        </a>
      </section>

      <a className="archive-marquee" href="/archives" aria-label="Перейти в архив работ">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" key={group}>
              {[0, 1].map((item) => (
                <div className="marquee-item" key={item}>
                  <img src="/assets/archive-icon-glas.svg" alt="" />
                  <span className="marquee-copy"><span>ЗАГЛЯНУТЬ В АРХИВ</span></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </a>

      <GalleryStage />

      <section className="testimonials-section" id="testimonials" aria-labelledby="testimonials-title">
        <div className="testimonials-inner shell">
          <div className="testimonials-rule" />
          <div className="testimonials-intro">
            <FlyingText as="h2" className="section-label" id="testimonials-title" variant="heading">Отзывы</FlyingText>
            <FlyingText as="p" className="section-copy testimonials-copy" variant="about-copy">За каждым проектом остаются не только экраны, но и люди, идеи и совместный путь. Здесь — несколько тёплых слов от тех, с кем мы создавали что-то вместе.</FlyingText>
          </div>
          <div className="testimonial-list">
            {testimonials.map((person, index) => {
              const isOpen = openTestimonial === index;
              const panelId = `testimonial-${index}`;

              return (
                <article className={isOpen ? "testimonial-item is-open" : "testimonial-item"} key={person.name}>
                  <div className="testimonial-item-rule" />
                  <div className="testimonial-row-grid">
                    <header className="testimonial-person">
                      <h3>{person.name}</h3>
                      <p>{person.role}</p>
                    </header>
                    <div className="testimonial-right">
                      <div className="testimonial-collapsed-card" aria-hidden={isOpen}>
                        <span className="testimonial-icon-plate"><img src={person.icon} alt="" /></span>
                      </div>
                      <div className={person.project ? "testimonial-detail-card" : "testimonial-detail-card no-project"} id={panelId} aria-hidden={!isOpen}>
                        <div className="testimonial-detail-top">
                          <span className="testimonial-icon-plate"><img src={person.icon} alt="" /></span>
                          <div className="testimonial-detail-copy">
                            <p>{person.text}</p>
                            <div className="tag-row">{person.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                          </div>
                        </div>
                        {person.project && (
                          <a
                            className="testimonial-project-link"
                            href={person.project.href}
                            target={person.project.external ? "_blank" : undefined}
                            rel={person.project.external ? "noopener noreferrer" : undefined}
                            aria-label={`Посмотреть проект ${person.project.title}`}
                          >
                            <span>Посмотреть проект ↗</span>
                            <span className="testimonial-project-cover">
                              <img
                                src={person.project.cover}
                                alt={`Обложка проекта ${person.project.title}`}
                                loading="lazy"
                                decoding="async"
                              />
                            </span>
                          </a>
                        )}
                      </div>
                      <button
                        className="testimonial-toggle"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={isOpen ? `Свернуть отзыв ${person.name}` : `Открыть отзыв ${person.name}`}
                        onClick={() => setOpenTestimonial(isOpen ? null : index)}
                      >
                        <img src={testimonialArrow} alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-top"><p>UX/UI-дизайнер<br />Портфолио 2024–2026</p><a href="#top">@Jully_Ch™</a><p>Открыта к новым проектам<br />и сотрудничеству</p></div>
        <div className="footer-main"><h2 className="project-invite-title"><span>ЕСТЬ ПРОЕКТ?</span><span>ДАВАЙТЕ СОЗДАДИМ</span><span>ЕГО ВМЕСТЕ</span></h2><p>Расскажите мне о своей задаче:</p><a href="mailto:ChernosheyJulia@yandex.ru">ChernosheyJulia@yandex.ru</a></div>
        <div className="footer-bottom">
          <p>Дизайн и разработка:<br />Юлия Черношей</p>
          <div className="socials" aria-label="Социальные сети и мессенджеры">
            <a
              href="https://www.behance.net/5e2d01f1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть профиль Юлии на Behance в новой вкладке"
            >
              Behance
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOIC_CM-a1471ultSaFVEyzdNKzNv02fDF-c1DWrEv9wa8cAvyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать Юлии в MAX — откроется в новой вкладке"
            >
              MAX
            </a>
            <a
              href="https://t.me/Jully_Ch"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать Юлии в Telegram — откроется в новой вкладке"
            >
              Telegram
            </a>
          </div>
          <div><a className="back-top" href="#top">Вернуться наверх <img src="/assets/up-arrow.png" alt="" /></a><p>©2026 – Все права защищены</p></div>
        </div>
      </footer>

      <div className={menuOpen ? "menu-overlay is-open" : "menu-overlay"} aria-hidden={!menuOpen}>
        <div className="menu-orbit" aria-hidden="true"><span /><span /></div>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">×</button>
        <nav aria-label="Меню разделов">
          {[['01', 'Главная', '#top'], ['02', 'Проекты', '#projects'], ['03', 'Подход', '#about'], ['04', 'Контакты', '#contact']].map(([number, label, href]) => (
            <a href={href} key={number} onClick={(event) => handleMenuLinkClick(event, href)}><span>{number}</span>{label}</a>
          ))}
        </nav>
        <button className="menu-theme-toggle" type="button" onClick={toggleTheme}>
          <span>Цветовая тема</span>
          <strong>{dark ? "Светлая" : "Тёмная"} ↗</strong>
        </button>
      </div>
      </main>
    </>
  );
}
