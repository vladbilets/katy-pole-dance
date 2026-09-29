import { motion } from 'motion/react';
import { Dumbbell, Activity, Heart, Baby, Info } from 'lucide-react';
import { useReveal } from '../lib/reveal';

const services = [
  {
    title: 'Pole Dance / Sport',
    description: 'Розвиток сили, витривалості та гнучкості. Вивчення трюків на пілоні різної складності',
    icon: <Dumbbell className="w-8 h-8" />,
    delay: 0.1,
  },
  {
    title: 'Pole Exot',
    description: 'Танцювальний напрямок, що розкриває жіночність, грацію та пластику тіла',
    icon: <Heart className="w-8 h-8" />,
    delay: 0.2,
  },
  {
    title: 'Stretching',
    description: 'Ефективна розтяжка для шпагатів, гнучкості спини та загального тонусу м\'язів',
    icon: <Activity className="w-8 h-8" />,
    delay: 0.3,
  },
  {
    title: 'Pole Sport Kids/Teens',
    description: 'Спеціальна програма для дітей. Розвиток фізичних даних, дисципліни та впевненості',
    icon: <Baby className="w-8 h-8" />,
    delay: 0.4,
    badge: 'Новий набір',
  }
];

export default function Services() {
  const reveal = useReveal();

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          {...reveal()}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">Напрямки</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto md:mx-0">
            Обирай свій стиль або комбінуй тренування для досягнення найкращих результатів. 
            Ми підтримаємо тебе на кожному кроці
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              {...reveal(index)}
              className="liquid-glass accent-hover p-8 group relative overflow-hidden"
            >
              {service.badge && (
                <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold uppercase px-3 py-1 rounded-full">
                  {service.badge}
                </div>
              )}
              
              <div className="accent-icon w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-[transform,background-color,color] duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
