'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';
import { Quiz } from '@/lib/academia/types';
import { Button } from '@/components/ui/Button';

interface QuizSectionProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizSection({ quiz, onComplete, onBack }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSelectAnswer = (answerId: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answerId);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (showResult) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;
    const correctCount = Object.entries(answers).filter(
      ([qId, answer]) => quiz.questions.find(q => q.id === qId)?.correctAnswer === answer
    ).length;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
          passed ? 'bg-green-100' : 'bg-amber-100'
        }`}>
          <span className="text-5xl">{passed ? '🎉' : '💪'}</span>
        </div>
        <h2 className="font-heading text-3xl font-bold mb-2">
          {passed ? 'Parabéns!' : 'Quase lá!'}
        </h2>
        <p className="text-lg text-neutral-600 mb-2">
          Você acertou <span className="font-bold text-2xl">{score}%</span>
        </p>
        <p className="text-neutral-500 mb-8">
          {correctCount} de {quiz.questions.length} {quiz.questions.length === 1 ? 'questão correta' : 'questões corretas'}
        </p>
        
        <div className="flex justify-center gap-4">
          {!passed && (
            <Button variant="secondary" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4 mr-2" /> Tentar novamente
            </Button>
          )}
          <Button 
            variant={passed ? 'premium' : 'primary'} 
            onClick={() => onComplete(score)}
            size="lg"
          >
            {passed ? '✨ Receber XP' : 'Continuar'} <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao conteúdo
        </Button>
        <span className="text-sm text-neutral-500 font-medium">
          Questão {currentIndex + 1} de {quiz.questions.length}
        </span>
      </div>
      
      {/* Barra de progresso */}
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
          animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Questão */}
      <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 shadow-sm">
        <h3 className="font-heading text-xl font-bold mb-6 text-neutral-900">
          {currentQuestion.question}
        </h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectAnswer = option.id === currentQuestion.correctAnswer;
            
            let baseStyle = 'border-2 transition-all';
            let hoverStyle = '';
            let bgStyle = 'bg-white';
            let textStyle = 'text-neutral-800';
            
            if (showExplanation) {
              if (isCorrectAnswer) {
                baseStyle += ' border-green-500';
                bgStyle = 'bg-green-50';
                textStyle = 'text-green-900';
              } else if (isSelected) {
                baseStyle += ' border-red-500';
                bgStyle = 'bg-red-50';
                textStyle = 'text-red-900';
              } else {
                baseStyle += ' border-neutral-200 opacity-50';
              }
            } else {
              if (isSelected) {
                baseStyle += ' border-green-600';
                bgStyle = 'bg-green-50';
              } else {
                baseStyle += ' border-neutral-200';
                hoverStyle = 'hover:border-green-300 hover:bg-green-50/50';
              }
            }
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left ${baseStyle} ${bgStyle} ${hoverStyle} ${
                  showExplanation ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${textStyle}`}>{option.text}</span>
                  {showExplanation && isCorrectAnswer && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {showExplanation && isSelected && !isCorrectAnswer && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-4 rounded-xl ${
                isCorrect 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-amber-50 border-2 border-amber-200'
              }`}>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <span className="text-green-700">✅ Correto!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-amber-700">💡 Explicação:</span>
                    </>
                  )}
                </p>
                <p className={isCorrect ? 'text-green-800' : 'text-amber-800'}>
                  {currentQuestion.explanation}
                </p>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleNext} 
                className="w-full mt-4"
              >
                {isLastQuestion ? 'Ver Resultado Final' : 'Próxima Questão'} 
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
