import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star } from 'lucide-react';
import { useReveal, useIsMobile } from '../lib/reveal';


// Справжні відгуки учениць: з Google Maps і ті, що надала студія.
// Фото не використовуємо — лише ініціали, щоб не публікувати чужі аватарки.
const reviews = [
  {
    id: 1,
    name: 'Олена К.',
    source: 'Учениця',
    text: 'Я завжди спостерігала збоку, як інші виконують елементи, і подумки думала: «От би й собі…» З кожним тренуванням я бачу, що це не фантазії — це реально працює. Підтримка тренера — щира, уважна, і саме така, яка потрібна, коли ти вчишся довіряти власним рукам і ногам на висоті.',
  },
  {
    id: 2,
    name: 'Оля І.',
    source: 'Відгук з Google',
    text: 'Чудове місце, де дійсно атмосфера «завжди з любовʼю». Красива та комфортна студія, уважні та професійні тренери, місце сили та натхнення не тільки для дорослих красунь, але і для маленьких дівчаток! Моя щира рекомендація)',
  },
  {
    id: 3,
    name: 'Таня',
    source: 'Учениця',
    text: 'Мене надихнуло те, чим ви займаєтесь, і я вирішила спробувати, чи взагалі в мене щось вийде. Я відчуваю себе впевненіше, сильніше, бачу зміни в своєму тілі. Стає легше на душі й тілу, а особливе задоволення отримую, коли щось виходить.',
  },
];

function initials(name: string) {
  return name.replace(/\./g, '').split(' ').map((w) => w[0]).join('').slice(0, 2);
}

/**
 * Швидкість автопрокрутки в пікселях за СЕКУНДУ (не за кадр —
 * інакше на екранах 120 Гц стрічка їхала б удвічі швидше).
 */
const SPEED_DESKTOP = 26;
const SPEED_MOBILE = 40;

/** Скільки чекати після дотику, перш ніж відновити автопрокрутку */
const IDLE_MS = 1500;

/** Згасання інерції після свайпу (частка швидкості, що лишається за секунду) */
const FRICTION = 0.04;

export default function Testimonials() {
  const reveal = useReveal();
  const isMobile = useIsMobile();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Список потроєно, щоб петля замикалась безшовно навіть на широких екранах
  const items = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    // Рух через transform, а не scrollLeft.
    // scrollLeft на iOS/Android округлюється до цілого пікселя: при ~0,7 px
    // за кадр стрічка то стоїть, то стрибає на піксель — звідси уривчастість.
    // translate3d приймає дробові значення і рендериться на GPU — рух рівний.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const speed = reduce ? 0 : isMobile ? SPEED_MOBILE : SPEED_DESKTOP;

    let raf = 0;
    let pos = 0; // поточний зсув, px
    let loop = 0; // довжина одного циклу
    let visible = false;
    let hovered = false;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let startPos = 0;
    let axis: 'x' | 'y' | null = null;
    let velocity = 0; // px/с, для інерції після свайпу
    let lastMoveX = 0;
    let lastMoveT = 0;
    let lastTouch = -Infinity;
    let lastFrame = performance.now();

    const wrap = (v: number) => (loop > 0 ? ((v % loop) + loop) % loop : v);
    const render = () => {
      track.style.transform = `translate3d(${-pos}px,0,0)`;
    };

    // Період — відстань від першої картки до її дубля
    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const twin = track.children[reviews.length] as HTMLElement | undefined;
      loop = first && twin ? twin.offsetLeft - first.offsetLeft : 0;
      pos = wrap(pos);
      render();
    };
    measure();

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(now - lastFrame, 50) / 1000;
      lastFrame = now;
      if (!visible || dragging || loop <= 0) return;
      if (document.visibilityState !== 'visible') return;

      // Інерція після свайпу
      if (Math.abs(velocity) > 5) {
        pos = wrap(pos + velocity * dt);
        velocity *= Math.pow(FRICTION, dt);
        render();
        return;
      }
      velocity = 0;

      if (hovered || now - lastTouch < IDLE_MS) return;
      if (!speed) return;

      pos = wrap(pos + speed * dt);
      render();
    };
    raf = requestAnimationFrame(step);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(viewport);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    // Свайп пальцем і перетягування мишею — через Pointer Events.
    // touch-action: pan-y лишає браузеру вертикальну прокрутку сторінки,
    // а горизонтальний рух віддає нам.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      axis = null;
      pointerId = e.pointerId;
      startX = lastMoveX = e.clientX;
      startY = e.clientY;
      startPos = pos;
      velocity = 0;
      lastMoveT = performance.now();
      lastTouch = lastMoveT;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'x') {
          viewport.setPointerCapture(e.pointerId);
          viewport.classList.add('is-dragging');
        }
      }
      if (axis !== 'x') return;
      const now = performance.now();
      const dtm = Math.max(now - lastMoveT, 1);
      // Згладжена швидкість для природної інерції
      velocity = 0.8 * (-(e.clientX - lastMoveX) / dtm) * 1000 + 0.2 * velocity;
      lastMoveX = e.clientX;
      lastMoveT = now;
      lastTouch = now;
      pos = wrap(startPos - dx);
      render();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {
        /* вказівник міг уже зникнути */
      }
      // Якщо палець зупинився перед відпусканням — інерції немає
      if (performance.now() - lastMoveT > 80 || axis !== 'x') velocity = 0;
      velocity = Math.max(-2500, Math.min(2500, velocity));
      lastTouch = performance.now();
    };

    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    if (canHover) {
      viewport.addEventListener('mouseenter', onEnter);
      viewport.addEventListener('mouseleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
      viewport.removeEventListener('mouseenter', onEnter);
      viewport.removeEventListener('mouseleave', onLeave);
    };
  }, [isMobile]);

  return (
    <section id="reviews" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-12">
        <motion.div {...reveal()} className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-6">Відгуки</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Що кажуть про нас наші учениці
          </p>
        </motion.div>
      </div>

      <div className="w-full relative">
        {/* Затемнення по краях */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        <div ref={viewportRef} className="reviews-viewport overflow-hidden">
        <div ref={trackRef} className="reviews-track flex gap-8 px-8">
          {items.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="w-[320px] md:w-[450px] flex-shrink-0 liquid-glass p-8"
            >
              <div className="flex items-center gap-1 mb-6 text-brand-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 text-lg mb-8 italic leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shrink-0" aria-hidden="true">
                  {initials(review.name)}
                </div>
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">{review.name}</p>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">{review.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        <div className="text-center mt-10 px-6">
          <a
            href="https://maps.app.goo.gl/qfawYu7pmVtUiWwU8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-1"
          >
            <Star className="w-4 h-4 fill-brand-400 text-brand-400" />
            <span>4,8 у Google · усі відгуки</span>
          </a>
        </div>

        <div className="md:hidden flex items-center justify-center gap-2 mt-8 text-white/40">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-widest">Гортай ліворуч</span>
        </div>
      </div>
    </section>
  );
}
