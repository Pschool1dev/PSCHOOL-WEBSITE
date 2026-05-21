import { FaChalkboardTeacher, FaRocket, FaGlobe, FaUsers, FaLightbulb, FaCode, FaRobot, FaMicrochip } from 'react-icons/fa';
import { HiOutlineAcademicCap, HiOutlineChip, HiOutlineLightningBolt } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const AProposSection = () => {
  const domaines = [
    { name: "Éducation", icon: <HiOutlineAcademicCap className="w-3 h-3" /> },
    { name: "Santé", icon: <FaLightbulb className="w-3 h-3" /> },
    { name: "Énergie", icon: <HiOutlineLightningBolt className="w-3 h-3" /> },
    { name: "Informatique", icon: <FaCode className="w-3 h-3" /> },
    { name: "Robotique", icon: <FaRobot className="w-3 h-3" /> },
    { name: "IA", icon: <HiOutlineChip className="w-3 h-3" /> }
  ];

  const cartes = [
    {
      id: 1,
      icon: <FaRocket />,
      title: "Formation complète et innovante",
      text: "PSCHOOL propose un parcours d'apprentissage unique qui couvre le coding, la robotique, l'électronique, la mécanique et l'intelligence artificielle — tout sous un même toit. Nos programmes sont conçus pour les jeunes de 5 à 19 ans et plus."
    },
    {
      id: 2,
      icon: <FaGlobe />,
      title: "École reconnue à l'international",
      text: "Avec plus de 2 000 apprenants formés depuis 2021 et une médaille de bronze internationale, nous formons les futurs leaders du numérique. Depuis sa création, P.school a proposé des solutions dans les domaines suivants :",
      domaines: true
    },
    {
      id: 3,
      icon: <FaChalkboardTeacher />,
      title: "Apprentissage en présentiel",
      text: "Pour une immersion totale et un encadrement personnalisé, toutes nos formations peuvent être suivies en présentiel dans nos centres. Nos experts accompagnent chaque élève physiquement pour garantir une maîtrise parfaite des outils technologiques et du matériel robotique.",
      villes: true
    }
  ];

  return (
    <section id="apropos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* TITRE ET TEXTE À GAUCHE */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Partie gauche - Titre et texte */}
          <div className="sticky top-20">
            <span className="text-green-500 font-semibold text-sm uppercase tracking-wide">
              À propos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Pourquoi choisir <br />
              Programming School ?
            </h2>
            <div className="w-16 h-0.5 bg-green-500 mt-4 mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Des formations innovantes pour adultes et enfants au Burkina Faso. Nous formons 
              des experts en Informatique et poste télécomunication, Sécretariat , Marketing digital ,Collecte numérique de données, robotique , Mécanique etc .
            </p>
                 <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Nos valeurs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaUsers className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Encadrement</p>
              <p className="text-xs text-gray-500">Personnalisé</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaCode className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Programme</p>
              <p className="text-xs text-gray-500">Pratique</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaRobot className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Équipement</p>
              <p className="text-xs text-gray-500">Moderne</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaMicrochip className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Innovation</p>
              <p className="text-xs text-gray-500">Continue</p>
            </div>
          </div>
        </div>
          </div>
          

          {/* Partie droite - Slider des cartes */}
          <div>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={60}
              slidesPerView={1}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="pb-12"
            >
              {/* Carte 1 - Formation complète */}
              <SwiperSlide>
                <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 min-h-[450px] flex flex-col">
                  <div className="text-green-500 text-4xl mb-4">
                    <FaRocket />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3">
                    Formation complète et innovante
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    PSCHOOL propose un parcours d'apprentissage unique qui couvre le coding, 
                    la robotique, l'électronique, la mécanique et l'intelligence artificielle 
                    — tout sous un même toit. Nos programmes sont conçus pour les jeunes 
                    de 5 à 19 ans et plus.
                  </p>
                </div>
                
              </SwiperSlide>

              {/* Carte 2 - École reconnue */}
              <SwiperSlide>
                <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 min-h-[450px] flex flex-col">
                  <div className="text-green-500 text-4xl mb-4">
                    <FaGlobe />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3">
                    École reconnue à l'international
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Avec plus de 2 000 apprenants formés depuis 2021
                    et une médaille de bronze internationale, nous formons les futurs leaders du numérique.
                    Depuis sa création, P.school a proposé des solutions dans les domaines suivants :
                  </p>
                  
                  {/* Domaines d'innovation */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {domaines.map((domaine, index) => (
                      <span key={index} className="inline-flex items-center gap-1 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
                        {domaine.icon}
                        {domaine.name}
                      </span>
                    ))}
                  </div>
                </div>
              </SwiperSlide>

              {/* Carte 3 - Formation en présentiel */}
              <SwiperSlide>
                <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 min-h-[450px] flex flex-col">
                  <div className="text-green-500 text-4xl mb-4">
                    <FaChalkboardTeacher />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3">
                    Apprentissage en présentiel
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pour une immersion totale et un encadrement personnalisé, toutes nos formations 
                    peuvent être suivies en <span className="text-green-500">présentiel</span> dans nos centres. 
                    Nos experts accompagnent chaque élève physiquement pour garantir 
                    une maîtrise parfaite des outils technologiques et du matériel robotique.
                  </p>
                  <div className=" pt-4 border-t border-gray-800 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500"> Ouagadougou</span>
                      <span className="text-gray-500"> Bobo-Dioulasso</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          
        </div>
        
        {/* Statistiques supplémentaires */}
        {/*  <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-green-500 transition-colors">
            <div className="text-2xl font-bold text-green-500">2000+</div>
            <div className="text-xs text-gray-600 mt-1">Apprenants formés</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-green-500 transition-colors">
            <div className="text-2xl font-bold text-green-500">2021</div>
            <div className="text-xs text-gray-600 mt-1">Année de création</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-green-500 transition-colors">
            <div className="text-2xl font-bold text-green-500">2</div>
            <div className="text-xs text-gray-600 mt-1">Centres physiques</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-green-500 transition-colors">
            <div className="text-2xl font-bold text-green-500">5-19 ans+</div>
            <div className="text-xs text-gray-600 mt-1">Tranche d'âge</div>
          </div>
        </div>*/}

        {/* Nos valeurs */}
          {/*<div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Nos valeurs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaUsers className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Encadrement</p>
              <p className="text-xs text-gray-500">Personnalisé</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaCode className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Programme</p>
              <p className="text-xs text-gray-500">Pratique</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaRobot className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Équipement</p>
              <p className="text-xs text-gray-500">Moderne</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                <FaMicrochip className="text-green-500 text-sm group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-800">Innovation</p>
              <p className="text-xs text-gray-500">Continue</p>
            </div>
          </div>
        </div>*/}
        
      </div>
    </section>
  );
};

export default AProposSection;