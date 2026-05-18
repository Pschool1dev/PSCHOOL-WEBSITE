import { useState, useEffect } from 'react';
import { HiPlus, HiTrash, HiCheck, HiSave, HiX } from 'react-icons/hi';
import api from '../../../services/api';
import toast from 'react-hot-toast';


const QuizEditor = ({ coursId }) => {
  const [quizTitre, setQuizTitre] = useState("Quiz de validation");
  const [questions, setQuestions] = useState([
    { 
      texte_question: '', 
      explication: '', 
      options: [
        { texte_option: '', is_correct: true },
        { texte_option: '', is_correct: false }
      ] 
    }
  ]);

 
useEffect(() => {
  const chargerQuizExistant = async () => {
    try {
      const res = await api.get(`/formations/cours/${coursId}/quiz`);
      
   
      if (res) {
        setQuizTitre(res.titre);
        if (res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement du quiz");
    }
  };
  
  if (coursId) chargerQuizExistant();
}, [coursId]);

  // LOGIQUE QUESTIONS 
  const ajouterQuestion = () => {
    setQuestions([...questions, { 
      texte_question: '', 
      explication: '', 
      options: [
        { texte_option: '', is_correct: true }, 
        { texte_option: '', is_correct: false }
      ] 
    }]);
  };

  const supprimerQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error("Il faut au moins une question");
    }
  };

  // LOGIQUE OPTIONS 
  const ajouterOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length < 5) {
      newQuestions[qIndex].options.push({ texte_option: '', is_correct: false });
      setQuestions(newQuestions);
    } else {
      toast.error("Maximum 5 options par question");
    }
  };

  const supprimerOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
      const wasCorrect = newQuestions[qIndex].options[oIndex].is_correct;
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      
      // Si on a supprimé la bonne réponse, on met la première par défaut
      if (wasCorrect) newQuestions[qIndex].options[0].is_correct = true;
      
      setQuestions(newQuestions);
    } else {
      toast.error("Minimum 2 options requises");
    }
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    if (field === 'is_correct') {
      newQuestions[qIndex].options.forEach((opt, i) => opt.is_correct = i === oIndex);
    } else {
      newQuestions[qIndex].options[oIndex][field] = value;
    }
    setQuestions(newQuestions);
  };

  // --- SAUVEGARDE ---
  const sauvegarderQuiz = async () => {
   
    const estValide = questions.every(q => q.texte_question.trim() !== '' && q.options.every(o => o.texte_option.trim() !== ''));
    if (!estValide) return toast.error("Veuillez remplir tous les champs");

    try {
      await api.post(`/formations/cours/${coursId}/quiz`, {
        titre: quizTitre,
        questions: questions
      });
      toast.success("Quiz enregistré avec succès !");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-8 bg-white p-2">
      {/* Header de l'éditeur */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Titre du Quiz</label>
          <input 
            type="text"
            className="w-full bg-transparent border-none text-xl font-bold text-slate-800 focus:ring-0 p-0"
            value={quizTitre}
            onChange={(e) => setQuizTitre(e.target.value)}
          />
        </div>
        <button 
          onClick={sauvegarderQuiz}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 w-full md:w-auto justify-center"
        >
          <HiSave className="text-lg" /> SAUVEGARDER
        </button>
      </div>

      {/* Liste des Questions */}
      <div className="space-y-10">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="relative p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Bouton Supprimer Question */}
            <button 
              onClick={() => supprimerQuestion(qIndex)}
              className="absolute -top-3 -right-3 bg-white text-slate-300 hover:text-red-500 border border-slate-100 p-2 rounded-full shadow-sm transition-all"
            >
              <HiTrash />
            </button>

            <div className="space-y-6">
              {/* Texte de la Question */}
              <div>
                <label className="text-[10px] font-bold uppercase text-blue-500 tracking-widest mb-2 block">Question {qIndex + 1}</label>
                <input 
                  type="text"
                  placeholder="Ex: Qu'est-ce qu'un composant React ?"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-semibold focus:ring-2 focus:ring-blue-500 shadow-inner"
                  value={q.texte_question}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[qIndex].texte_question = e.target.value;
                    setQuestions(newQ);
                  }}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group/opt">
                    <button 
                      onClick={() => handleOptionChange(qIndex, oIndex, 'is_correct', true)}
                      className={`p-2 rounded-xl transition-all ${opt.is_correct ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
                    >
                      <HiCheck className="text-sm" />
                    </button>
                    <input 
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 border-none bg-transparent text-sm font-medium focus:ring-0"
                      value={opt.texte_option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, 'texte_option', e.target.value)}
                    />
                    {q.options.length > 2 && (
                      <button 
                        onClick={() => supprimerOption(qIndex, oIndex)}
                        className="opacity-0 group-hover/opt:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all"
                      >
                        <HiX className="text-xs" />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Ajouter Option */}
                {q.options.length < 5 && (
                  <button 
                    onClick={() => ajouterOption(qIndex)}
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-100 rounded-2xl p-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-[10px] font-bold uppercase tracking-widest"
                  >
                    <HiPlus /> Ajouter un choix
                  </button>
                )}
              </div>

              {/* Explication (Feedback) */}
              <div className="pt-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 block">Explication (optionnel)</label>
                <textarea 
                  rows="2"
                  placeholder="Expliquez pourquoi c'est la bonne réponse..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500"
                  value={q.explication}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[qIndex].explication = e.target.value;
                    setQuestions(newQ);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ajouter Question */}
      <button 
        onClick={ajouterQuestion}
        className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 group"
      >
        <div className="bg-slate-100 group-hover:bg-blue-100 p-2 rounded-xl transition-colors">
          <HiPlus className="text-xl" />
        </div>
        AJOUTER UNE QUESTION À CE QUIZ
      </button>
    </div>
  );
};

export default QuizEditor;