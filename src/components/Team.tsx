import { motion } from 'motion/react';
import { Instagram } from 'react-feather';

const team = [
  {
    id: 1,
    name: 'Ім\'я Тренера',
    role: 'Тренер Pole Dance',
    image: '/trainer-1.jpg',
    instagram: '#'
  },
  {
    id: 2,
    name: 'Ім\'я Тренера',
    role: 'Тренер Stretching / Exot',
    image: '/trainer-2.jpg',
    instagram: '#'
  },
  {
    id: 3,
    name: 'Ім\'я Тренера',
    role: 'Тренер Pole Sport Kids',
    image: '/trainer-3.jpg',
    instagram: '#'
  }
];

export default function Team() {
  return (
    <section id="team" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-6">Наша Команда</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Професіонали своєї справи, які допоможуть тобі розкрити свій потенціал.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass p-4 group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-white/5 border border-white/5">
                {/* Fallback placeholder text behind the image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
                  <span className="text-xs uppercase tracking-widest">[Фото]</span>
                </div>
                
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="absolute inset-0 w-full h-full object-cover object-center z-10 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-20 pointer-events-none"></div>
                
                <a 
                  href={member.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/20 z-30 border border-white/20"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              
              <div className="px-2 pb-2">
                <h3 className="text-2xl font-bold mb-1 uppercase tracking-wider">{member.name}</h3>
                <p className="text-blue-400/80 text-sm font-medium uppercase tracking-widest">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
