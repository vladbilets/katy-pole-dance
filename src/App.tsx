import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Founder from './components/Founder';
import Team from './components/Team';
import Studio from './components/Studio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Founder />
        <Team />
        <Studio />
        <Testimonials />
        <Contact />
      </main>
      
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} Katy Pole Dance. All rights reserved.</p>
      </footer>
    </div>
  );
}
