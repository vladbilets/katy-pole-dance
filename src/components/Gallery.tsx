import { motion } from 'motion/react';
import { useReveal } from '../lib/reveal';

/**
 * Блок «Атмосфера» — лише професійні фото зі студії.
 * Десктоп: сітка з 4 карток зі зсувом парних колонок (журнальний ритм).
 * Мобільні: горизонтальний свайп зі snap, без сторонніх бібліотек.
 */
const photos = [
  { src: '/gallery/gallery-a.jpg', alt: 'Учениця Katy Pole Dance виконує елемент на пілоні в студії у Луцьку' },
  { src: '/gallery/gallery-c.jpg', alt: 'Силовий елемент на пілоні у студії танцю Katy Pole Dance, Луцьк' },
  { src: '/gallery/gallery-b.jpg', alt: 'Трюк на пілоні — заняття Pole Sport у студії Katy Pole Dance' },
  { src: '/gallery/gallery-f.jpg', alt: 'Елемент на пілоні в теплому світлі — студія танцю на пілоні Katy Pole Dance' },
];

export default function Gallery() {
  const reveal = useReveal();

  return (
    <section id="gallery" className="py-24 relative z-10" aria-label="Фото зі студії">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div {...reveal()} className="mb-12 md:mb-20 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">Атмосфера</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto md:mx-0">
            Сила, пластика і світло — так виглядають тренування в нашій студії
          </p>
        </motion.div>

        {/* Десктоп */}
        <div className="hidden md:grid grid-cols-4 gap-6 pb-0">
          {photos.map((p, i) => (
            <motion.figure
              key={p.src}
              {...reveal(i)}
              className={`relative aspect-[3/4] rounded-3xl overflow-hidden liquid-glass p-2 ${i % 2 === 1 ? 'mt-12' : ''}`}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Мобільні: свайп */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((p) => (
            <figure
              key={p.src}
              className="snap-center shrink-0 w-[75vw] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5"
            >
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </figure>
          ))}
        </div>
        <p className="text-center text-xs uppercase tracking-widest text-white/40 mt-4">Гортай вбік</p>
      </div>
    </section>
  );
}
