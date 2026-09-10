import { motion } from 'motion/react';
import { CreditCard, Sparkles, User, Users } from 'lucide-react';
import { useReveal } from '../lib/reveal';

const plans = [
  {
    title: 'Абонемент на місяць',
    description: '8 занять за графіком групи',
    price: '2200',
    currency: 'грн',
    features: ['POLE DANCE', 'POLE EXOT', 'POLE KIDS/TEENS'],
    popular: true,
    icon: <Sparkles className="w-8 h-8 text-blue-400" />
  },
  {
    title: 'Абонемент Стретчинг',
    description: '4 заняття за графіком групи',
    price: '940',
    currency: 'грн',
    features: ['Ефективна розтяжка', 'Гнучкість спини', 'Тонус м\'язів'],
    popular: false,
    icon: <CreditCard className="w-8 h-8 text-gray-400" />
  },
  {
    title: 'Індивідуальне',
    description: '1 година персонального тренування',
    price: '680',
    currency: 'грн',
    features: ['Гнучкий графік', 'Персональна увага', 'Швидкий прогрес'],
    popular: false,
    icon: <User className="w-8 h-8 text-gray-400" />
  },
  {
    title: 'Індивідуальне (2-3 особи)',
    description: '1 година, ціна з кожного',
    price: '580',
    currency: 'грн',
    features: ['Тренування з подругами', 'Вигідна ціна', 'Більше мотивації'],
    popular: false,
    icon: <Users className="w-8 h-8 text-gray-400" />
  }
];

export default function Pricing() {
  const reveal = useReveal();

  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          {...reveal()}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">Ціни</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Обирай зручний для себе формат тренувань. Ми пропонуємо групові абонементи та індивідуальні заняття
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              {...reveal(index)}
              className={`relative overflow-hidden rounded-3xl p-8 flex flex-col h-full ${
                plan.popular 
                  ? 'bg-blue-900/20 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]' 
                  : 'liquid-glass'
              }`}
            >
              {plan.popular && (
                <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              )}
              
              <div className="mb-8">
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2 tracking-tight min-h-[4rem]">{plan.title}</h3>
              <p className="text-sm text-gray-400 mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400">{plan.currency}</span>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.popular ? 'bg-blue-400' : 'bg-white/30'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
