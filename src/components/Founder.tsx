import { motion } from 'motion/react';
import { Instagram } from 'react-feather';
import { useReveal } from '../lib/reveal';

export default function Founder() {
  const reveal = useReveal();

  return (
    <section id="founder" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <motion.div {...reveal()} className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="w-full h-full rounded-2xl bg-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Image element added */}
                <img src="/founder.jpg" alt="Катерина Танюк" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover z-0 object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              </div>
              
              <div className="absolute bottom-8 left-8 z-20">
                <p className="text-3xl font-bold mb-1">Катерина Танюк</p>
                <p className="text-gray-300">Засновниця та головний тренер</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...reveal(1)} className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              Натхнення <br/> та професіоналізм
            </h2>
            
            <div className="space-y-6 text-gray-300 text-lg mb-10">
              <p>
                Мене звати Катерина, і я створила цю студію для того, щоб кожна жінка могла відчути себе сильною, граційною та впевненою
              </p>
              <p>
                Pole Dance — це не просто спорт. Це мистецтво володіння власним тілом, подолання страхів та постійний розвиток
              </p>
              <p>
                Ми постійно ростемо, і зараз активно розвиваємо напрямок Pole Sport Kids, щоб прищеплювати любов до спорту з раннього віку
              </p>
            </div>

            <a 
              href="https://www.instagram.com/katerinataniuk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white hover:text-gray-400 transition-colors self-start pb-2 border-b border-white/20 hover:border-gray-400"
            >
              <Instagram className="w-5 h-5" />
              <span>@katerinataniuk</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
