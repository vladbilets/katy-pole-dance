import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/**
 * Цифри про студію. Лише перевірені факти — нічого не вигадуємо.
 * Щоб змінити — правити масив нижче.
 */
const stats = [
  { value: 4.8, decimals: 1, suffix: '', label: 'рейтинг у Google' },
  { value: 22, decimals: 0, suffix: '+', label: 'відгуки учениць' },
  { value: 4, decimals: 0, suffix: '', label: 'напрямки тренувань' },
  { value: 2, decimals: 0, suffix: '', label: 'сучасні зали' },
];

function Counter({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const fmt = (n: number) => n.toFixed(decimals).replace('.', ',') + suffix;
  const [text, setText] = useState(fmt(reduce ? value : 0));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(fmt(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

export default function Stats() {
  return (
    <div className="container mx-auto px-6 md:px-12 mb-16 md:mb-24">
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="liquid-glass accent-hover p-6 md:p-8 text-center md:text-left"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <p className="text-4xl md:text-6xl font-extrabold text-brand-400 leading-none mb-3">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="text-xs md:text-sm uppercase tracking-widest text-gray-400">{s.label}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
