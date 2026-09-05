import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useReveal } from '../lib/reveal';

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

export default function Testimonials() {
  // We duplicate the reviews array to create a seamless infinite scrolling effect
  const duplicatedReviews = [...reviews, ...reviews];
  const reveal = useReveal();
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Стрічка шириною близько 3000px їхала нескінченно навіть тоді, коли секції
  // немає на екрані — WebKit усе одно тримав і рухав цю текстуру, і від цього
  // потерпали сусідні блоки. Тепер вона працює лише поки видима.
  useEffect(() => {
    const strip = marqueeRef.current;
    if (!strip) return;

    strip.style.animationPlayState = 'paused';
    let visible = false;

    const apply = () => {
      strip.style.animationPlayState =
        visible && document.visibilityState === 'visible' ? 'running' : 'paused';
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    observer.observe(strip);

    // У фоновій вкладці анімація теж не потрібна
    document.addEventListener('visibilitychange', apply);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

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

      {/* Marquee Container */}
      <div className="w-full relative overflow-hidden">
        {/* Left and right gradient masks for smooth fade effect */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        <div ref={marqueeRef} className="flex gap-8 animate-scroll pl-8">
          {duplicatedReviews.map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              className="w-[350px] md:w-[450px] flex-shrink-0 liquid-glass p-8 md:cursor-grab md:active:cursor-grabbing"
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
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50 z-0">Фото</div>
                  <img 
                    src={review.image} 
                    alt={review.name}
                    loading="lazy"
                    decoding="async"
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
      </div>
    </section>
  );
}
