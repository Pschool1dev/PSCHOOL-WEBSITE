<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function show($coursId)
{

    $quiz = Quiz::with('questions.options')->where('cours_id', $coursId)->first();

    if (!$quiz) {
        return response()->json(null);
    }

    return response()->json($quiz);
}

    public function store(Request $request, $coursId)
    {
        return DB::transaction(function () use ($request, $coursId) {
            // Créer le quiz
            $quiz = Quiz::updateOrCreate(
                ['cours_id' => $coursId],
                ['titre' => $request->titre, 'score_min' => $request->score_min ?? 70]
            );

            // Supprimer les anciennes questions pour repartir à zéro (plus simple pour les mises à jour)
            $quiz->questions()->delete();

            // Enregistrer les nouvelles questions et options
            foreach ($request->questions as $qData) {
                $question = $quiz->questions()->create([
                    'texte_question' => $qData['texte_question'],
                    'explication' => $qData['explication'] ?? null
                ]);

                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'texte_option' => $oData['texte_option'],
                        'is_correct' => $oData['is_correct']
                    ]);
                }
            }

            return response()->json(['message' => 'Quiz enregistré avec succès !'], 201);
        });
    }

   
    public function verifier(Request $request, $quizId)
    {
        $reponsesEleve = $request->reponses; 
        $totalQuestions = Question::where('quiz_id', $quizId)->count();
        $bonnesReponses = 0;

        foreach ($reponsesEleve as $questionId => $optionId) {
            $estCorrect = Option::where('id', $optionId)
                ->where('question_id', $questionId)
                ->where('is_correct', true)
                ->exists();
            
            if ($estCorrect) $bonnesReponses++;
        }

        $score = ($totalQuestions > 0) ? ($bonnesReponses / $totalQuestions) * 100 : 0;
        $reussi = $score >= Quiz::find($quizId)->score_min;

        return response()->json([
            'score' => $score,
            'reussi' => $reussi,
            'message' => $reussi ? 'Félicitations !' : 'Score insuffisant, réessayez.'
        ]);
    }
}
