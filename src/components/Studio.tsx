import ScrollExpand from './ScrollExpand';
import Stats from './Stats';

export default function Studio() {
  return (
    <section id="studio" className="relative py-24">
      <div className="container mx-auto px-6 md:px-12 mb-16 md:mb-24 text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-6">
          Студія
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto md:mx-0">
          У нашій школі є два сучасних зали: для комфортних групових тренувань та для персональних індивідуальних занять
        </p>
      </div>

      <Stats />

      {/* Scroll Expand Component */}
      <div className="w-full">
        <ScrollExpand 
          src="/studio.jpg" 
          title={
            <span className="max-w-[40vw] text-center leading-[1.1] flex flex-col justify-center items-center">
              <span>РОЗШИРЮЙ ГОРИЗОНТИ</span>
              <span>МОЖЛИВОСТЕЙ СВОГО ТІЛА</span>
            </span>
          }
          mediaZoom={1.35} 
          scrollHint="Гортай вниз"
          useWindowScroll={true}
        />
      </div>
    </section>
  );
}
