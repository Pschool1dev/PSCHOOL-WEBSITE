import { FaCode, FaRobot, FaGamepad, FaLaptopCode, FaChartLine, FaShieldAlt } from 'react-icons/fa';

export const formations = [
  // Enfants
  {
    id: 1,
    title: "Programmation informatique (Enfants)",
    category: "Programmation",
    level: "Débutant",
    duration: "2 mois",
    price: "60 000 FCFA",
    desc: "Découverte du code, algorithmes ludiques, Scratch, Python débutant",
    icon: <FaCode className="text-3xl" />,
    color: "blue"
  },
  {
    id: 2,
    title: "Robotique (Enfants)",
    category: "Robotique",
    level: "Débutant",
    duration: "2 mois",
    price: "80 000 FCFA",
    desc: "Initiation à la robotique, Arduino, capteurs, programmation embarquée",
    icon: <FaRobot className="text-3xl" />,
    color: "purple"
  },
  {
    id: 3,
    title: "Conception de jeux vidéo (Enfants)",
    category: "Programmation",
    level: "Débutant",
    duration: "2 mois",
    price: "70 000 FCFA",
    desc: "Crée ton premier jeu vidéo, personnages, niveaux, histoires",
    icon: <FaGamepad className="text-3xl" />,
    color: "red"
  },
  // Adultes
  {
    id: 4,
    title: "Développement Web (Adultes)",
    category: "Programmation",
    level: "Débutant",
    duration: "3 mois",
    price: "150 000 FCFA",
    desc: "HTML, CSS, JavaScript, React, Laravel - Créez des sites web modernes",
    icon: <FaLaptopCode className="text-3xl" />,
    color: "green"
  },
  {
    id: 5,
    title: "Data Science (Adultes)",
    category: "Programmation",
    level: "Intermédiaire",
    duration: "3 mois",
    price: "180 000 FCFA",
    desc: "Python, Pandas, Machine Learning, IA, SQL, Statistiques",
    icon: <FaChartLine className="text-3xl" />,
    color: "orange"
  },
  {
    id: 6,
    title: "Cybersécurité (Adultes)",
    category: "Programmation",
    level: "Avancé",
    duration: "3 mois",
    price: "200 000 FCFA",
    desc: "Sécurité réseau, Ethical Hacking, Protection des données",
    icon: <FaShieldAlt className="text-3xl" />,
    color: "indigo"
  }
];

export const categories = ["Tous", "Programmation", "Robotique"];

export const levelColors = {
  "Débutant": "bg-green-100 text-green-700",
  "Intermédiaire": "bg-orange-100 text-orange-700",
  "Avancé": "bg-red-100 text-red-700"
};