import { FaChalkboardTeacher } from 'react-icons/fa'; // Optionnel : icône pour le présentiel

const AProposSection = () => {
  return (
    <section id="apropos" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full font-bold text-green-700 text-xl  mb-4">
            À propos de Nous
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Pourquoi choisir Programming School ?
          </h2>
        </div>

        {/* Grille de trois cartes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Carte 1 - Formation complète */}
          <div className="bg-green-600 rounded-2xl p-8 shadow-xl hover:shadow-green-200 transition flex flex-col h-full">
            <h3 className="text-white text-2xl mb-4">
              Une formation complète et innovante
            </h3>
            <p className="text-green-50 leading-relaxed">
              PSCHOOL propose un parcours d'apprentissage unique qui couvre le coding, 
              la robotique, l'électronique, la mécanique et l'intelligence artificielle 
              — tout sous un même toit. Nos programmes sont conçus pour les jeunes 
              de 5 à 19 ans et plus, avec une approche STEAM.
            </p>
          </div>
          
          {/* Carte 2 - École reconnue */}
          <div className="bg-green-600 rounded-2xl p-8 shadow-xl hover:shadow-green-200 transition flex flex-col h-full">
            <h3 className="text-white text-2xl mb-4">
              Une école reconnue à l'international
            </h3>
            <p className="text-green-50 leading-relaxed">
              Avec plus de 2 000 apprenants formés depuis 2021
              et une médaille de bronze internationale, nous formons les futurs leaders du numérique.
              Dépuis sa création , P.school a proposé des solutions dans les domaines suivants : 
            </p>
            
            {/* Domaines d'innovation */}
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {["Éducation", "Santé", "Énergie", "Informatique", "IA"].map((domaine, index) => (
                <span key={index} className="text-[10px] bg-white text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                  {domaine}
                </span>
              ))}
            </div>
          </div>

          {/* Carte 3 - Formation en présentiel (La nouveauté) */}
          <div className="bg-green-600 rounded-2xl p-8 shadow-xl hover:shadow-green-200 transition flex flex-col h-full">
            <div className="text-white text-4xl mb-4">
               <FaChalkboardTeacher />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Apprentissage en Présentiel
            </h3>
            <p className="text-green-50 leading-relaxed">
              Pour une immersion totale et un encadrement personnalisé, toutes nos formations 
              peuvent être suivies en <strong>présentiel</strong> dans nos centres. 
              Nos experts accompagnent chaque élève physiquement pour garantir 
              une maîtrise parfaite des outils technologiques et du matériel robotique.
            </p>
          </div>
          
        </div>
        
        {/* Statistiques supplémentaires */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div >
            <div className="text-2xl font-bold text-green-600">2000+</div>
            <div className="text-xs text-gray-500">Apprenants formés</div>
          </div>
          <div >
            <div className="text-2xl font-bold text-green-600">2021</div>
            <div className="text-xs text-gray-500">Année de création</div>
          </div>
          <div >
            <div className="text-2xl font-bold text-green-600">Ouaga / Bobo</div>
            <div className="text-xs text-gray-500">Centres physiques</div>
          </div>
          <div >
            <div className="text-2xl font-bold text-green-600">7-19 ans+</div>
            <div className="text-xs text-gray-500">Tranche d'âge</div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default AProposSection;