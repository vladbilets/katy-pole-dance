import { useCallback, useEffect, useRef, useState, type Key } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useReveal } from '../lib/reveal';

/**
 * ПРОТОТИП блоку «Напрямки» з фото.
 * Десктоп: 4 вертикальні панелі, активна розгортається (наведення / клік / Tab).
 * Телефон: акордеон — панелі одна під одною, торкання розгортає.
 * Кнопка «Фото» відкриває перегляд зі свайпом.
 * Фото тимчасові — після фотосесії замінити файли в public/directions.
 */
type Direction = {
  key: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  price: string;
  priceNote: string;
  badge?: string;
  photos: string[];
};

const directions: Direction[] = [
  {
    key: 'sport',
    title: 'Pole Sport',
    short: 'Сила і трюки',
    description: 'Розвиток сили, витривалості та гнучкості. Вивчення трюків на пілоні різної складності',
    features: ['Сила', 'Трюки', 'Витривалість'],
    price: '2200',
    priceNote: 'грн · 8 занять',
    photos: ['/directions/sport-1.jpg', '/directions/sport-2.jpg', '/directions/sport-3.jpg', '/directions/sport-4.jpg'],
  },
  {
    key: 'exot',
    title: 'Pole Exot',
    short: 'Жіночність і пластика',
    description: 'Танцювальний напрямок, що розкриває жіночність, грацію та пластику тіла',
    features: ['Пластика', 'Танець', 'Впевненість'],
    price: '2200',
    priceNote: 'грн · 8 занять',
    photos: ['/directions/exot-1.jpg', '/directions/exot-2.jpg', '/directions/exot-3.jpg'],
  },
  {
    key: 'stretching',
    title: 'Stretching',
    short: 'Гнучкість і тонус',
    description: "Ефективна розтяжка для шпагатів, гнучкості спини та загального тонусу м'язів",
    features: ['Шпагати', 'Гнучкість спини', 'Тонус'],
    price: '940',
    priceNote: 'грн · 4 заняття',
    photos: ['/directions/stretch-1.jpg', '/directions/stretch-2.jpg'],
  },
  {
    key: 'kids',
    title: 'Kids / Teens',
    short: 'Для дітей і підлітків',
    description: 'Спеціальна програма для дітей. Розвиток фізичних даних, дисципліни та впевненості',
    features: ['Координація', 'Дисципліна', 'Впевненість'],
    price: '2200',
    priceNote: 'грн · 8 занять',
    badge: 'Новий набір',
    photos: ['/directions/kids-1.jpg', '/directions/kids-2.jpg', '/directions/kids-3.jpg'],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Directions() {
  const reveal = useReveal();
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<{ dir: number; index: number } | null>(null);

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div {...reveal()} className="mb-12 md:mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">Напрямки</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto md:mx-0">
            Обирай свій стиль або комбінуй тренування. Наведи або торкнись, щоб дізнатись більше
          </p>
        </motion.div>

        {/* Десктоп: горизонтальні панелі */}
        <motion.div {...reveal(1)} className="hidden md:flex gap-3 h-[600px]" role="tablist" aria-label="Напрямки тренувань">
          {directions.map((d, i) => (
            <Panel
              key={d.key}
              d={d}
              index={i}
              isActive={active === i}
              onActivate={() => setActive(i)}
              onOpenPhotos={() => setViewer({ dir: i, index: 0 })}
              layout="row"
            />
          ))}
        </motion.div>

        {/* Телефон: акордеон */}
        <div className="md:hidden flex flex-col gap-3">
          {directions.map((d, i) => (
            <Panel
              key={d.key}
              d={d}
              index={i}
              isActive={active === i}
              onActivate={() => setActive(i)}
              onOpenPhotos={() => setViewer({ dir: i, index: 0 })}
              layout="column"
            />
          ))}
        </div>
      </div>

      {/* Портал у body: секція має свій z-index, і без порталу перегляд опинявся б під меню */}
      {createPortal(
        <AnimatePresence>
          {viewer && (
            <PhotoViewer
              direction={directions[viewer.dir]}
              start={viewer.index}
              onClose={() => setViewer(null)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

function Panel({
  d,
  index,
  isActive,
  onActivate,
  onOpenPhotos,
  layout,
}: {
  key?: Key;
  d: Direction;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onOpenPhotos: () => void;
  layout: 'row' | 'column';
}) {
  const row = layout === 'row';
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      role="tab"
      tabIndex={0}
      aria-selected={isActive}
      aria-label={d.title}
      onMouseEnter={row ? onActivate : undefined}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      className={`dir-panel group relative overflow-hidden rounded-3xl border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
        isActive ? 'border-brand-400/50 shadow-[0_20px_60px_-25px_rgba(200,16,46,0.7)]' : 'border-white/10'
      }`}
      style={
        row
          ? { flexGrow: isActive ? 4.2 : 1, flexBasis: 0, transition: 'flex-grow 700ms cubic-bezier(0.16,1,0.3,1), border-color 500ms, box-shadow 500ms' }
          : { height: isActive ? 480 : 96, transition: 'height 600ms cubic-bezier(0.16,1,0.3,1), border-color 500ms' }
      }
    >
      {/* Фото */}
      <img
        src={d.photos[0]}
        alt={`${d.title} — заняття в студії Katy Pole Dance, Луцьк`}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'scale-100' : 'scale-110'
        }`}
      />

      {/* Затемнення */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'} bg-black/60`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {d.badge && (
        <span className="absolute top-4 right-4 z-10 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {d.badge}
        </span>
      )}

      {/* Згорнутий стан */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-300 ${
          isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'
        }`}
      >
        {row ? (
          <div className="h-full flex flex-col justify-between p-6">
            <span className="text-brand-400 font-bold tracking-widest text-sm">{num}</span>
            <span
              className="text-2xl font-bold uppercase tracking-tight whitespace-nowrap self-start"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {d.title}
            </span>
          </div>
        ) : (
          <div className="h-full flex items-center gap-4 px-6">
            <span className="text-brand-400 font-bold tracking-widest text-sm">{num}</span>
            <div>
              <p className="text-xl font-bold uppercase tracking-tight">{d.title}</p>
              <p className="text-xs uppercase tracking-widest text-white/60">{d.short}</p>
            </div>
          </div>
        )}
      </div>

      {/* Розгорнутий стан */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.2 } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
            className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10"
          >
            <span className="text-brand-400 font-bold tracking-widest text-sm">{num}</span>
            <h3 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mt-1 mb-3">{d.title}</h3>
            <p className="text-gray-300 text-sm md:text-base max-w-md mb-4">{d.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {d.features.map((f) => (
                <span key={f} className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/15 bg-white/5 text-white/80">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="leading-none">
                <span className="text-4xl md:text-5xl font-extrabold text-brand-400">{d.price}</span>{' '}
                <span className="text-sm text-gray-400">{d.priceNote}</span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPhotos();
                  }}
                  className="liquid-glass !rounded-2xl inline-flex items-center gap-2 px-4 py-3 text-sm font-medium"
                >
                  <Images className="w-4 h-4" />
                  Фото ({d.photos.length})
                </button>
                <a
                  href="#contact"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-brand-400 hover:text-white transition-colors"
                >
                  Записатися
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoViewer({ direction, start, onClose }: { direction: Direction; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [dir, setDir] = useState(1);
  const total = direction.photos.length;
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setIndex((i) => (i + step + total) % total);
    },
    [total],
  );

  // Клавіатура + блокування прокрутки сторінки
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Фото: ${direction.title}`}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-5" onClick={(e) => e.stopPropagation()}>
        <p className="uppercase tracking-widest text-sm">
          <span className="font-bold">{direction.title}</span>
          <span className="text-white/50"> · {index + 1} / {total}</span>
        </p>
        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label="Закрити">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden touch-pan-y"
        onClick={(e) => {
          e.stopPropagation();
          // Клік по темному полю навколо фото закриває перегляд
          if (e.target === e.currentTarget) onClose();
        }}
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={direction.photos[index]}
            src={direction.photos[index]}
            alt={`${direction.title} — фото ${index + 1}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -80 }}
            transition={{ duration: 0.45, ease: EASE }}
            draggable={false}
            className="max-h-[78vh] max-w-[92vw] object-contain rounded-2xl select-none"
          />
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="hidden md:flex absolute left-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 border border-white/15 hover:bg-brand-500/40 transition-colors"
              aria-label="Попереднє фото"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="hidden md:flex absolute right-6 w-12 h-12 items-center justify-center rounded-full bg-white/10 border border-white/15 hover:bg-brand-500/40 transition-colors"
              aria-label="Наступне фото"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Мініатюри */}
      <div className="flex justify-center gap-2 px-6 py-5" onClick={(e) => e.stopPropagation()}>
        {direction.photos.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setDir(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              i === index ? 'border-brand-400' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
            aria-label={`Фото ${i + 1}`}
          >
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
