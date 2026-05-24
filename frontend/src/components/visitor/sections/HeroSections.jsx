import { useEffect, useRef } from 'react';
import { HiOutlineArrowNarrowRight, HiOutlinePlay } from 'react-icons/hi';

const HeroSection = () => {
  const statsRef = useRef([]);
  const floatingImageRef = useRef(null);

  useEffect(() => {
    // Animation des compteurs
    const animateValue = (element, start, end, duration) => {
      const step = (end - start) / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += step;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        if (element) element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const value = entry.target.dataset.value;
          const suffix = entry.target.dataset.suffix;
          animateValue(entry.target, 0, parseInt(value), 1500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsRef.current.forEach(stat => {
      if (stat) observer.observe(stat);
    });

    // Animation de l'image qui monte et descend
    if (floatingImageRef.current) {
      let direction = 1;
      let position = 0;
      const interval = setInterval(() => {
        position += direction * 0.5;
        if (position >= 20) direction = -1;
        if (position <= -20) direction = 1;
        if (floatingImageRef.current) {
          floatingImageRef.current.style.transform = `translateY(${position}px)`;
        }
      }, 50);
      return () => clearInterval(interval);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-start overflow-hidden">
      {/* Fond - Option 2 : Dégradé Bleu → Bleu foncé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950" />
      
      {/* Overlay pour adoucir */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Effet de particules */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Image à droite */}
      <div 
        ref={floatingImageRef}
        className="absolute right-8 top-1/4 -translate-y-1/2 w-2/5 hidden lg:block transition-all duration-100 ease-in-out"
        style={{ transition: 'transform 0.1s linear' }}
      >
      <img 
        src="/assets/super-bg.png" 
        alt="Hero illustration"
        className="w-full h-auto object-contain scale-150"
      />
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="relative z-10 px-6 md:px-20 max-w-4xl">
        
        {/* Titre */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
          <span className="text-orange-600">"Devenir Programmeur</span>
          <br />
          <span className="text-white">En un clin d'œil"</span>
        </h2>
        
        {/* Description */}
        <div className="mt-6 space-y-2">
          <p className="text-base md:text-xl lg:text-2xl text-gray-200 font-light">
            Maîtriser l'avenir du numérique au Burkina Faso
          </p>
          <p className="text-sm md:text-lg text-gray-300">
            Apprenez le Code, la Robotique, le Numérique avec <span className='text-orange-400'>P.school</span>
          </p>
        </div>
        
        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button 
            onClick={() => window.location.href = '/formationSessions'}
            className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            <span className="flex items-center gap-2">
              Découvrir nos offres de formations intensives
              <HiOutlineArrowNarrowRight className="w-5 h-5" />
            </span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/services'}
            className="group px-6 py-2 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <HiOutlinePlay className="w-5 h-5" />
              Nos Prestations de services
            </span>
          </button>
        </div>
        
        {/* STATISTIQUES */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-3 gap-4 md:gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
            {[
              { value: "2000", suffix: "+", label: "Apprenants formés", sub: "depuis 2021" },
              { value: "50", suffix: "+", label: "Formations", sub: "disponibles" },
              { value: "90", suffix: "%+", label: "Taux de satisfaction", sub: "recommandé" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="relative">
                  <div 
                    ref={el => statsRef.current[idx] = el}
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                  >
                    0{stat.suffix}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-blue-400 group-hover:w-1/2 transition-all duration-500 -translate-x-1/2" />
                </div>
                <div className="text-[10px] md:text-xs font-semibold text-blue-200 mt-2">{stat.label}</div>
                <div className="text-[8px] text-blue-300/70">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-2.5 bg-orange-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;