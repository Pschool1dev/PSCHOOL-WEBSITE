const temoignages = [
  { name: "Aminata Ouédraogo", role: "Développeuse Web", text: "La formation m'a permis de trouver un emploi en 3 mois. Les formateurs sont excellents !", avatar: "AO" },
  { name: "Zakaria Nikiema", role: "Étudiant", text: "Programming School offre une formation de qualité à un prix accessible à tous.", avatar: "NZ" },
  { name: "Fatoumata Sawadogo", role: "Entrepreneuse", text: "Grâce à la formation, je gère mon entreprise avec beaucoup plus d'efficacité.", avatar: "FS" },
];

const TemoignagesSections = () => {
  return (
    <section id="temoignages" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
            Témoignages
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Ce que disent nos apprenants
          </h2>
          <div className="w-16 h-0.5 bg-green-600 mx-auto mt-4"></div>
        </div>

        {/* Grille des témoignages */}
        <div className="grid md:grid-cols-3 gap-6">
          {temoignages.map((t, index) => (
            <div 
              key={t.name} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Étoiles de notation */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-500 text-sm">★</span>
                ))}
              </div>

              {/* Texte du témoignage */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>

              {/* Informations de l'auteur */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {t.name}
                  </div>
                  <div className="text-green-600 text-xs">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section statistiques de satisfaction */}
         {/*<div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-xs text-gray-500 mt-1">de satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-xs text-gray-500 mt-1">apprenants formés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-xs text-gray-500 mt-1">d'insertion pro</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">4.8/5</div>
              <div className="text-xs text-gray-500 mt-1">note moyenne</div>
            </div>
          </div>
        </div>*/}
      </div>
    </section>
  );
};

export default TemoignagesSections;