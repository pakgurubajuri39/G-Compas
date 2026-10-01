import React, { useState } from 'react';
import { Question } from '../types';
import { ArrowLeft, ArrowRight, Check, Sparkles, HelpCircle, Layers, Award } from 'lucide-react';

interface AssessmentQuizProps {
  questions: Question[];
  onComplete: (answers: { questionId: number; optionId: string }[]) => void;
  onCancel: () => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / total) * 100);

  const selectedOptionId = answers[currentQ.id];

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    if (currentIndex < total - 1) {
      setDirection('forward');
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all questions!
      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        optionId: answers[q.id],
      }));
      onComplete(formattedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('backward');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-between">
      {/* Top Bar: Progress, Question Counter & Module Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold">
              Pertanyaan {currentIndex + 1} dari {total}
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline font-medium text-slate-300">
              {currentQ.moduleTitle}
            </span>
          </div>
          <div className="font-bold text-amber-400">
            {progressPercent}% Selesai ({answeredCount}/{total})
          </div>
        </div>

        {/* Futuristic Glowing Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-400 transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Interactive Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative flex-1 flex flex-col justify-between my-auto">
        <div>
          {/* Module Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-4">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Modul {currentQ.module}</span>
          </div>

          {/* Scenario / Question Text */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading leading-snug mb-8">
            {currentQ.scenario}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              const letter = optionLetters[idx] || `${idx + 1}`;

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 border-amber-400/80 shadow-lg shadow-purple-500/20 translate-x-1'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-purple-500/40'
                  }`}
                >
                  {/* Letter badge */}
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1">
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        isSelected ? 'text-white font-medium' : 'text-slate-300'
                      }`}
                    >
                      {option.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-8 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={currentIndex === 0 ? onCancel : handlePrev}
            className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentIndex === 0 ? 'Kembali' : 'Sebelumnya'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              disabled={!selectedOptionId}
              className={`px-7 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2.5 ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span>{currentIndex === total - 1 ? 'Lihat Hasil Analisis' : 'Selanjutnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
