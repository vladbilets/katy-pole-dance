import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Founder from './components/Founder';
import Pricing from './components/Pricing';
import Studio from './components/Studio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import TermsModal from './components/TermsModal';

export default function App() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Founder />
        <Pricing />
        <Studio />
        <Testimonials />
        <Contact />
      </main>
      
      <footer className="py-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          
          {/* Action Links Row */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10 w-full mb-10">
            
            {/* Phone */}
            <a 
              href="tel:+380660177082" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="font-medium text-sm tracking-wide">+38 (066) 017 70 82</span>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/katypoledance1/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <span className="font-medium text-sm">@katypoledance1</span>
            </a>

            {/* Terms */}
            <button 
              onClick={() => setIsTermsOpen(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="font-medium text-sm">Умови оферти</span>
            </button>
          </div>

          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Katy Pole Dance. All rights reserved.</p>
        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}

