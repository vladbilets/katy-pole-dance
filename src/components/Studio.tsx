import ScrollExpand from './ScrollExpand';

export default function Studio() {
  return (
    <section id="studio" className="bg-[#02050A] relative pb-24">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
          Студія
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
          У нашій школі є два сучасних зали: для комфортних групових тренувань та для персональних індивідуальних занять.
        </p>
      </div>
      
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
