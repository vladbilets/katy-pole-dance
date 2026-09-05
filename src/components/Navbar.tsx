import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Напрямки', href: '#services' },
    { name: 'Засновниця', href: '#founder' },
    { name: 'Ціни', href: '#pricing' },
    { name: 'Студія', href: '#studio' },
    { name: 'Відгуки', href: '#reviews' },
    { name: 'Контакти', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed left-1/2 -translate-x-1/2 z-50 border-none outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'top-4 w-[95%] max-w-5xl py-3 px-6 liquid-nav' 
            : 'top-0 w-full max-w-none py-6 px-6 md:px-12 bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between w-full h-full">
          <a href="#" className="z-50 relative flex items-center">
            <img 
              src="/logo.png" 
              alt="Katy Pole Dance" 
              className="h-10 md:h-12 w-auto object-contain mix-blend-screen"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-xs md:text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-50 relative p-2 text-white hover:text-white/70 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/80 flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl font-medium uppercase tracking-widest text-white hover:text-white/70 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
