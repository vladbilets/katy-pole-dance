import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star } from 'lucide-react';
import { useReveal, useIsMobile } from '../lib/reveal';

const reviews = [
  {
    id: 1,
    name: 'Марія Коваленко',
    text: 'Це найкраща студія в Луцьку! Тренери неймовірні, атмосфера дуже дружня. За кілька місяців я досягла результатів, про які навіть не мріяла.',
    image: '/review-1.jpg',
  },
  {
    id: 2,
    name: 'Олена Петренко',
    text: 'Дуже довго шукала свою студію і нарешті знайшла! Katy Pole Dance — це любов з першого погляду. Особливо подобається напрямок Pole Exot.',
    image: '/review-2.jpg',
  },
  {
    id: 3,
    name: 'Ірина Шевчук',
    text: 'Прекрасне місце для розвитку своєї жіночності та сили. Зал дуже красивий і комфортний. Дякую Катерині за такий простір!',
    image: '/review-3.jpg',
  },
  {
    id: 4,
    name: 'Анастасія Бойко',
    text: 'Довго вагалась чи йти на пілон, але тут такий підхід до новачків, що всі страхи зникли на першому ж занятті. Рекомендую всім дівчатам!',
    image: '/review-4.jpg',
  },
];

/**
 * Швидкість автопрокрутки в пікселях за СЕКУНДУ.
 * Саме за секунду, а не за кадр: інакше на екранах 120 Гц стрічка
 * їхала б удвічі швидше, ніж на звичайних 60 Гц.
 */
const SPEED_DESKTOP = 26;
const SPEED_MOBILE = 46;

/** Скільки чекати після дотику, перш ніж відновити автопрокрутку */
const IDLE_MS = 2000;

export default function Testimonials() {
  const reveal = useReveal();
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);

  // Список дублюється, щоб петля замикалась безшовно
  const items = [...reviews, ...reviews];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Системне «зменшити рух» вимикає автопрокрутку, гортати руками можна далі
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canDrag = window.matchMedia('(pointer: fine)').matches;
    const speed = isMobile ? SPEED_MOBILE : SPEED_DESKTOP;

    let raf = 0;
    let pos = 0;
    let loop = 0;
    let visible = false;
    let hovered = false;
    let dragging = false;
    let startX = 0;
    let startPos = 0;
    let lastTouch = 0;
    let lastFrame = performance.now();

    // Довжина одного циклу — це відстань від першої картки до її дубля.
    // Не scrollWidth / 2: контейнер має бічні відступи, і половина ширини
    // не збігається з періодом повтору, через що з часом виникав би шов.
    // Читаємо offsetLeft лише при монтуванні та ресайзі, не щокадру.
    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const twin = track.children[reviews.length] as HTMLElement | undefined;
      loop = first && twin ? twin.offsetLeft - first.offsetLeft : 0;
    };

    measure();

    const step = (now: number) => {
      raf = requestAnimationFrame(step);

      // Обмежуємо крок: після повернення з фонової вкладки або довгої паузи
      // різниця може бути в секунди, і стрічка смикнулась би вперед
      const delta = Math.min(now - lastFrame, 50) / 1000;
      lastFrame = now;

      if (!visible || hovered || dragging || loop <= 0) return;
      if (document.visibilityState !== 'visible') return;

      // Поки палець на екрані і ще дві секунди після — не втручаємось.
      // Інакше запис у scrollLeft обірвав би інерційну прокрутку iOS.
      if (now - lastTouch < IDLE_MS) {
        pos = track.scrollLeft;
        return;
      }

      pos += speed * delta;
      if (pos >= loop) pos -= loop;
      track.scrollLeft = pos;
    };

    raf = requestAnimationFrame(step);

    // Рух тільки поки секція на екрані
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(track);

    // Ширина карток змінюється на брейкпоінті — період треба перерахувати
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    const onEnter = () => {
      hovered = true;
    };

    const onLeave = () => {
      hovered = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startPos = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      let next = startPos - (event.clientX - startX);
      if (loop > 0) {
        // Безшовна петля в обидва боки
        next = ((next % loop) + loop) % loop;
      }
      track.scrollLeft = next;
      pos = next;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      try {
        track.releasePointerCapture(event.pointerId);
      } catch {
        /* вказівник міг уже зникнути */
      }
      pos = track.scrollLeft;
    };

    // Будь-який дотик чи прокрутка колесом відкладають автопрокрутку
    const noteTouch = () => {
      lastTouch = performance.now();
    };

    track.addEventListener('touchstart', noteTouch, { passive: true });
    track.addEventListener('touchmove', noteTouch, { passive: true });
    track.addEventListener('wheel', noteTouch, { passive: true });

    if (canDrag) {
      track.addEventListener('mouseenter', onEnter);
      track.addEventListener('mouseleave', onLeave);
      track.addEventListener('pointerdown', onPointerDown);
      track.addEventListener('pointermove', onPointerMove);
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      track.removeEventListener('touchstart', noteTouch);
      track.removeEventListener('touchmove', noteTouch);
      track.removeEventListener('wheel', noteTouch);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', endDrag);
      track.removeEventListener('pointercancel', endDrag);
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

        <div ref={trackRef} className="reviews-track flex gap-8 px-8">
          {items.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="w-[320px] md:w-[450px] flex-shrink-0 liquid-glass p-8"
            >
              <div className="flex items-center gap-1 mb-6 text-blue-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 text-lg mb-8 italic leading-relaxed">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden relative shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50 z-0">Фото</div>
                  <img
                    src={review.image}
                    alt={review.name}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">{review.name}</p>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Учениця</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden flex items-center justify-center gap-2 mt-8 text-white/40">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-widest">Гортай ліворуч</span>
        </div>
      </div>
    </section>
  );
}
