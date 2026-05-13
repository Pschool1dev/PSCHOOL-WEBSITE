import { useState, useEffect } from 'react';
import { HiArrowRight, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const QuizView = ({ coursId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/formations/cours/${coursId}/quiz`);
        if (res) setQuiz(res);
      } catch (err) {
        toast.error("Erreur lors du chargement du quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [coursId]);

  if (loading) return <div className="p-10 text-center text-gray-500">Chargement du quiz...</div>;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 border border-gray-200 rounded-lg">
        Aucune question n'a été configurée pour ce quiz.
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  const handleValidation = () => {
    if (!selectedOption) return toast.error("Choisis une réponse !");
    if (selectedOption.is_correct) setScore(prev => prev + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      const finalScorePercent = Math.round((score / quiz.questions.length) * 100);
      onComplete(finalScorePercent >= quiz.score_min);
    }
  };

  if (isFinished) {
    const finalScorePercent = Math.round((score / quiz.questions.length) * 100);
    const success = finalScorePercent >= quiz.score_min;

    return (
      <div className="text-center p-8 space-y-5 border border-gray-200 rounded-lg bg-white">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
          success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {success ? <HiCheckCircle /> : <HiXCircle />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{success ? "Félicitations !" : "Pas assez pour valider"}</h2>
          <p className="text-gray-600 mt-2">
            Tu as obtenu un score de <span className="font-bold text-blue-600">{finalScorePercent}%</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Score minimum requis : {quiz.score_min}%</p>
        </div>
        {!success && (
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            <HiRefresh /> RÉESSAYER
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Barre de Progression */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">
          Question {currentIndex + 1}/{quiz.questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.texte_question}</h2>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              disabled={showFeedback}
              onClick={() => setSelectedOption(option)}
              className={`w-full p-4 text-left border rounded-md transition-all ${
                selectedOption?.id === option.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${
                showFeedback && option.is_correct ? 'border-green-500 bg-green-50' : ''
              } ${
                showFeedback && selectedOption?.id === option.id && !option.is_correct ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              <span className={`text-sm ${
                selectedOption?.id === option.id ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {option.texte_option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-4 border-t border-gray-200 space-y-4">
        {showFeedback && currentQuestion.explication && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            <span className="font-semibold block mb-1 text-xs uppercase">Note pédagogique :</span>
            {currentQuestion.explication}
          </div>
        )}

        {!showFeedback ? (
          <button 
            onClick={handleValidation}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Vérifier la réponse
          </button>
        ) : (
          <button 
            onClick={nextQuestion}
            className="w-full bg-gray-800 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            {currentIndex < quiz.questions.length - 1 ? "Question suivante" : "Voir mon résultat"}
            <HiArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;