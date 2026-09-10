import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const DESKTOP_SRC = '/hero-video.mp4';
const MOBILE_SRC = '/hero-video-mobile.mp4';
const POSTER = '/hero-poster.jpg';
const MOBILE_MQ = '(max-width: 820px)';
const VIDEO_CLASS = 'hero-video absolute inset-0 w-full h-full object-cover';

/**
 * Відео народжується прозорим і проявляється лише коли реально пішло відтворення.
 * Якщо браузер автоплей заблокував (режим енергозбереження на iPhone) — воно так
 * і лишається невидимим, а користувач бачить просто постер-фото. Жодних системних
 * кнопок Play поверх дизайну.
 */
const FADE_MS = 600;

/**
 * Драбинка повторних спроб (мс). WKWebView (iOS Chrome, Telegram, Instagram, будь-який
 * не-Safari браузер на iPhone) часто відхиляє перший play(), але приймає наступний,
 * коли декодер уже прогрітий. Одна спроба — недостатньо.
 */
const RETRY_DELAYS = [0, 120, 350, 700, 1200, 2000, 3200, 5000];

const GESTURES = ['touchstart', 'touchend', 'pointerup', 'click', 'keydown'] as const;

export default function Hero() {
  // React рендерить лише порожній контейнер. Сам <video> створюється вручну —
  // тільки так можна гарантувати, що атрибути muted/playsinline стоять на елементі
  // ДО того, як браузер побачить src і ухвалить рішення про автоплей.
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let video: HTMLVideoElement | null = null;
    let observer: IntersectionObserver | null = null;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let disposed = false;

    /** play() завжди синхронний — інакше iOS не зарахує жест користувача */
    const play = () => {
      if (!video || disposed) return;
      video.muted = true; // WKWebView інколи скидає прапорець після load()
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          /* заблоковано — спрацює наступна спроба або жест */
        });
      }
    };

    const detachGestures = () => {
      GESTURES.forEach((e) => document.removeEventListener(e, play, true));
    };

    const onPlaying = () => {
      timers.forEach(clearTimeout);
      timers = [];
      detachGestures(); // пішло — слухачі більше не потрібні
      if (video) video.style.opacity = '1'; // плавно проявляємо поверх постера
    };

    const build = () => {
      const src = window.matchMedia(MOBILE_MQ).matches ? MOBILE_SRC : DESKTOP_SRC;
      const el = document.createElement('video');

      // 1. Спочатку ВСІ прапорці — і як властивості, і як атрибути.
      //    React виставляє `muted` лише властивістю, без атрибута в DOM —
      //    Safari це влаштовує, а WKWebView трактує таке відео як «зі звуком» і блокує.
      el.muted = true;
      el.defaultMuted = true;
      el.volume = 0;
      el.autoplay = true;
      el.loop = true;
      el.controls = false;
      el.setAttribute('muted', '');
      el.setAttribute('autoplay', '');
      el.setAttribute('loop', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', ''); // iOS < 10 та старі WKWebView
      el.setAttribute('x5-playsinline', '');     // MIUI / Huawei / китайські Android
      el.setAttribute('preload', 'auto');
      el.setAttribute('poster', POSTER);
      el.setAttribute('disableremoteplayback', '');
      el.setAttribute('x-webkit-airplay', 'deny');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('tabindex', '-1');
      el.className = VIDEO_CLASS;
      // Стилі інлайном, щоб не залежати від того, чи потрапив клас у збірку CSS
      el.style.opacity = '0';
      el.style.transition = `opacity ${FADE_MS}ms ease-out`;

      // 2. І лише тепер — джерело. Порядок принциповий.
      el.src = src;

      // 3. І лише тепер — вставка в DOM. Елемент потрапляє на сторінку вже повністю
      //    налаштованим, рівно як статичний <video> у HTML.
      host.appendChild(el);
      video = el;

      el.addEventListener('playing', onPlaying);
      (['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'] as const).forEach(
        (e) => el.addEventListener(e, play),
      );

      // Мобільні браузери ігнорують preload="auto" — просимо завантаження явно
      el.load();

      timers = RETRY_DELAYS.map((delay) => setTimeout(play, delay));

      // Пауза поза екраном — економія батареї й менше шансів, що iOS вб'є декодер
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!video) return;
          if (entry.isIntersecting) {
            if (video.paused) play();
          } else if (!video.paused) {
            video.pause();
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
    };

    const destroy = () => {
      observer?.disconnect();
      observer = null;
      timers.forEach(clearTimeout);
      timers = [];
      if (video) {
        video.removeEventListener('playing', onPlaying);
        video.pause();
        video.removeAttribute('src');
        video.load(); // звільняє мережеве з'єднання та декодер
        video.remove();
        video = null;
      }
    };

    build();

    // Невидимий резерв: будь-який тап у будь-якому місці сторінки запускає відео.
    // capture: true — спрацьовує навіть якщо елемент згори зупиняє спливання.
    GESTURES.forEach((e) =>
      document.addEventListener(e, play, { capture: true, passive: true }),
    );

    const onVisible = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible); // повернення з bfcache на iOS

    // Зміна ширини / поворот екрана — перебудова з іншим файлом
    const mq = window.matchMedia(MOBILE_MQ);
    const onBreakpoint = () => {
      destroy();
      build();
    };
    mq.addEventListener('change', onBreakpoint);

    return () => {
      disposed = true;
      detachGestures();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onVisible);
      mq.removeEventListener('change', onBreakpoint);
      destroy();
    };
  }, []);

  return (
    <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
      {/* Фон */}
      <div
        className="absolute inset-0 z-0 bg-black bg-cover bg-center"
        style={{ backgroundImage: `url('${POSTER}')` }}
      >
        {/* Контейнер під <video>. React сюди нічого не рендерить — вміст керується вручну. */}
        <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />

        {/* Затемнення — градієнтом, а не суцільною плитою */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />
      </div>

      <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col items-center text-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tight uppercase leading-none mb-6 text-white"
        >
          Katy <br className="md:hidden" /> Pole Dance
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-lg md:text-2xl text-white/70 max-w-2xl mb-12"
        >
          Відкрий для себе силу, грацію та впевненість <br className="hidden md:block" />
          Твоя ідеальна студія танцю на пілоні у Луцьку
        </motion.p>

        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="liquid-glass inline-flex items-center gap-4 px-10 py-5 text-lg font-medium group text-white pointer-events-auto"
          style={{ willChange: 'transform, opacity' }}
        >
          <span>Записатися на урок</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs uppercase tracking-widest text-white/50">Вниз</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
