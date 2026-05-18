import { useParams } from 'react-router-dom';
import { HiOutlineCursorClick, HiOutlineAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import CoursDetails from './CoursDetails';

const GestionCours = () => {
  const { id } = useParams();

  return (
    <div className="h-full min-h-[80vh] bg-slate-50/50">
      {id ? (
        <CoursDetails />
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
          {/* Illustration Icone  */}
          <div className="relative mb-10">
            <div className="bg-blue-50 p-10 rounded-full border border-blue-100/50">
              <HiOutlineCursorClick className="w-14 h-14 text-blue-500 opacity-80" />
            </div>
            <div className="absolute -top-1 -right-1 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
              <HiOutlineAcademicCap className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Espace de Gestion
          </h2>
          
          <p className="text-slate-500 max-w-sm mb-10 text-sm leading-relaxed">
            Sélectionnez une formation dans votre catalogue pour commencer à organiser vos chapitres.
          </p>

        
          <Link 
            to="/formateur/mes-formations"
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95"
          >
            <HiOutlineAcademicCap className="w-5 h-5" />
            Accéder à mes formations
          </Link>

          {/* Guide Étapes  */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center">
              <span className="text-blue-600 text-xs font-black mb-2 px-2 py-1 bg-blue-50 rounded-md">01</span>
              <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider">Sélection</p>
            </div>
            
            <div className="p-5 bg-white/50 rounded-2xl border border-slate-200/40 flex flex-col items-center opacity-50">
              <span className="text-slate-400 text-xs font-black mb-2 px-2 py-1 bg-slate-100 rounded-md">02</span>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Structure</p>
            </div>
            
            <div className="p-5 bg-white/50 rounded-2xl border border-slate-200/40 flex flex-col items-center opacity-50">
              <span className="text-slate-400 text-xs font-black mb-2 px-2 py-1 bg-slate-100 rounded-md">03</span>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Contenu</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCours;