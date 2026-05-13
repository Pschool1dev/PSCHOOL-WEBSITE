const HeroSection = () => {
  return (
    <section id="hero" className="relative h-[80vh] flex items-center justify-start text-left pt-20">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
          }}
        ></div>
      </div>

      <div className="relative z-10 px-8 md:px-16 max-w-2xl">
        
        {/* Titre */}
        <h2 className="text-3xl md:text-4xl font-black text-green-500 uppercase leading-tight animate-fade-up">
          " Devenir Programmeur En un clin d'œil "
        </h2>
        
        {/* Paragraphes avec police Inter */}
        <div className="mt-4 space-y-1">
          <p className="text-white text-base md:text-lg font-normal">
            Maîtriser l'avenir du numérique au Burkina Faso
          </p>
          <p className="text-white text-base md:text-lg font-normal">
            Apprenez le Code, la Robotique et le Numérique avec Programming School.
          </p>
        </div>
        
        {/* Boutons (plus petits) */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={() => {
              const section = document.getElementById('formations');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Découvrir nos offres de formations
          </button>
          
          <button 
            onClick={() => {
              const section = document.getElementById('services');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2 border-2 border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-green-600 transition"
          >
            Nos Prestations de services
          </button>
        </div>
        
        {/* Statistiques (plus petites) */}
        <div className="flex gap-6 mt-8">
          <div>
            <div className="text-2xl font-bold text-orange-500">2000+</div>
            <div className="text-xs text-gray-300">Apprenants formés depuis 2021</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">50+</div>
            <div className="text-xs text-gray-300">Formations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">90%+</div>
            <div className="text-xs text-gray-300">Satisfaction</div>
          </div>
        </div>
        
      </div>
      
    </section>
  );
};

export default HeroSection;