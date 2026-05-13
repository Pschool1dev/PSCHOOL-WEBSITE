const temoignages = [
  { name: "Aminata Ouédraogo", role: "Développeuse Web", text: "La formation m'a permis de trouver un emploi en 3 mois. Les formateurs sont excellents !", avatar: "AO" },
  { name: "Zakaria Nikiema", role: "Étudiant", text: "Programming School offre une formation de qualité à un prix accessible à tous.", avatar: "NZ" },
  { name: "Fatoumata Sawadogo", role: "Entrepreneuse", text: "Grâce à la formation, je gère mon entreprise avec beaucoup plus d'efficacité.", avatar: "FS" },
];

const TemoignagesSections = () => {
  return (
    <section id="temoignages" className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-green-100">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-700 uppercase leading-tight">
            Ce que disent nos <span className="text-green-700">apprenants</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grille des témoignages */}
        <div className="grid md:grid-cols-3 gap-8">
          {temoignages.map((t) => (
            <div 
              key={t.name} 
              className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative"
            >
              {/* Icône de citation décorative */}
              <div className="absolute top-6 right-8 text-slate-100 group-hover:text-green-100 transition-colors text-6xl font-serif">
                "
              </div>

              <div className="relative z-10">
                <div className="text-orange-400 text-lg mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p className="text-slate-600 text-base leading-relaxed italic mb-8">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-green-200">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm uppercase tracking-tight">
                      {t.name}
                    </div>
                    <div className="text-green-600 text-[10px] font-black uppercase tracking-widest">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemoignagesSections;