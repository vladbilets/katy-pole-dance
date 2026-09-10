import { motion } from 'motion/react';
import { MapPin, Send, ExternalLink, Star, Phone } from 'lucide-react';
import { Instagram } from 'react-feather';
import { useReveal } from '../lib/reveal';

export default function Contact() {
  const reveal = useReveal();

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="liquid-glass p-8 md:p-16 rounded-3xl overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <motion.div {...reveal()}>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
                Почни свій <br /> шлях сьогодні
              </h2>
              <p className="text-gray-400 text-lg mb-12 max-w-md">
                Запишись на перше тренування або задай будь-яке запитання. Ми завжди на зв'язку
              </p>

              <div className="space-y-4">
                <a 
                  href="https://www.instagram.com/katypoledance1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors border border-white/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">Написати в Instagram</p>
                    <p className="text-sm text-gray-400">@katypoledance1</p>
                  </div>
                </a>
                
                <a 
                  href="tel:+380660177082" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors border border-white/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">+38 (066) 017 70 82</p>
                    <p className="text-sm text-gray-400">Катерина, адміністратор</p>
                  </div>
                </a>

                <div className="pt-6">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Локація студії</p>
                  <a 
                    href="https://maps.app.goo.gl/qfawYu7pmVtUiWwU8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <p className="text-2xl font-bold group-hover:text-blue-400 transition-colors duration-300">пр. Василя Мойсея, 2</p>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">м. Луцьк, Україна</p>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal(1)} className="flex flex-col justify-between">
              <div className="h-full min-h-[400px] md:min-h-[450px] rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group block isolate [contain:paint]">
                <iframe 
                  src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=uk&amp;q=50.7529296,25.3317359&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
                  style={{ border: 0, filter: 'grayscale(100%) invert(100%) sepia(100%) hue-rotate(180deg) saturate(300%) brightness(70%) contrast(120%)' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                  className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] pointer-events-none"
                ></iframe>
                
                {/* Dark color overlay to make it look deeper blue/black */}
                <div className="absolute inset-0 bg-blue-950/55 md:bg-blue-950/40 md:mix-blend-multiply pointer-events-none z-0"></div>

                {/* Google Maps style info card top-left */}
                <div className="absolute top-4 left-4 z-10 bg-black/90 md:bg-black/80 md:backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-left shadow-2xl max-w-[calc(100%-2rem)] w-72 pointer-events-none">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-white text-lg leading-tight">Katy Pole Dance</h3>
                     <div className="flex gap-2">
                       <ExternalLink className="w-4 h-4 text-gray-400" />
                     </div>
                   </div>
                   <p className="text-gray-400 text-xs mb-3 leading-relaxed">пр. Василя Мойсея, 2, Луцьк, Волинська область, Україна, 43000</p>
                   <div className="flex items-center gap-1 text-sm text-gray-300">
                     <span>4.8</span>
                     <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                     <span className="text-gray-500 text-xs ml-1">(22)</span>
                   </div>
                </div>

                {/* Custom Glowing Pin perfectly centered over the native map center */}
                <div className="absolute top-1/2 left-1/2 pointer-events-none z-10">
                  {/* Pin container - bottom tip aligns exactly at 50% 50% */}
                  <div className="absolute -translate-x-1/2 -translate-y-full flex justify-center items-center">
                    {/* Dark blocker to hide the native Google Maps marker behind our glowing pin */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#040914] rounded-full z-0"></div>
                    
                    <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/30 rounded-full animate-ping z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/10 md:animate-pulse rounded-full z-0"></div>
                    <MapPin className="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,1)] fill-blue-500/20 relative z-10" />
                  </div>
                  
                  {/* Natural text positioned exactly below the pin */}
                  <span 
                    className="absolute left-1/2 -translate-x-1/2 top-1 text-gray-100 font-medium text-[16px] whitespace-nowrap tracking-wide" 
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)' }}
                  >
                    Katy Pole Dance
                  </span>
                </div>
                
                <a 
                  href="https://maps.app.goo.gl/qfawYu7pmVtUiWwU8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 cursor-pointer"
                  aria-label="Відкрити в Google Maps"
                ></a>
              </div>
            </motion.div>
          </div>

          {/* Decorative blur */}
          <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        </div>
      </div>
    </section>
  );
}
