import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  Sparkles,
  ExternalLink,
  Download,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { ESSLCEQuestion, ESSLCE_QUESTIONS } from '../data/schoolData';
import { evaluateESSLCEResult } from '../utils/gradeCalculations';

interface ESSLCEHubProps {
  lang: 'en' | 'am';
}

export const ESSLCEHub: React.FC<ESSLCEHubProps> = ({ lang }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Admission cutoff calculator
  const [calculatorScore, setCalculatorScore] = useState<number>(375);
  const cutoffResult = evaluateESSLCEResult(calculatorScore, 600);

  const filteredQuestions = selectedSubject === 'All'
    ? ESSLCE_QUESTIONS
    : ESSLCE_QUESTIONS.filter(q => q.subject === selectedSubject);

  const activeQuestion = filteredQuestions[currentQuizIndex] || filteredQuestions[0];

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuizIndex]: optionIdx
    });
  };

  const calculateQuizScore = () => {
    let score = 0;
    filteredQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuizIndex(0);
  };

  const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'];

  const syllabusDownloads = [
    { name: 'Grade 12 Natural Science Physics Syllabus & Model Answers', size: '4.2 MB', code: 'PHYS-12-MOE' },
    { name: 'Grade 12 Advanced Mathematics Problem Bank (Calculus & Vectors)', size: '5.8 MB', code: 'MATH-12-MOE' },
    { name: 'Grade 12 Chemistry Organic & Electrochemistry Practical Manual', size: '3.6 MB', code: 'CHEM-12-MOE' },
    { name: 'Grade 11 & 12 English Grammar, Reading Comprehension & SAT Model', size: '2.9 MB', code: 'ENG-12-MOE' },
    { name: 'Grade 11 & 12 Ethiopian History & Social Science National Review', size: '4.1 MB', code: 'HIST-12-MOE' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 border border-emerald-800/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-black text-xs">
                ESSLCE 2017
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Ministry of Education • EAES Standard
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {lang === 'am'
                ? 'የኢትዮጵያ ዩኒቨርሲቲ መግቢያ እና የ12ኛ ክፍል ፈተና ማዕከል'
                : 'National ESSLCE University Entrance Preparation Hub'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Official past examination question series, model problem solutions, and admission cutoff analysis designed specifically for Hailemariam Mamo Secondary & Preparatory School candidates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://study.moe.gov.et"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <span>MoE Study Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://eaes.et"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              <span>EAES Exam Results</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Practice & Cutoff Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive ESSLCE Model Exam Quiz (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-lg text-slate-900">
                  {lang === 'am' ? 'የሞዴል ፈተና ጥያቄዎች ልምምድ' : 'Interactive ESSLCE Model Exam Test'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Authentic multiple choice items with step-by-step curriculum explanations
              </p>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setCurrentQuizIndex(0);
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Content */}
          {!showResults ? (
            <div className="pt-6 space-y-6">
              {/* Question metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Question {currentQuizIndex + 1} of {filteredQuestions.length} • {activeQuestion.subject} ({activeQuestion.year})
                </span>
                <span className="text-slate-400">Stream: {activeQuestion.stream}</span>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm md:text-base font-medium text-slate-900 leading-relaxed">
                {activeQuestion.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuizIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  disabled={currentQuizIndex === 0}
                  onClick={() => setCurrentQuizIndex((p) => p - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {currentQuizIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuizIndex((p) => p + 1)}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit & Check Score</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="pt-6 space-y-6">
              <div className="text-center p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <Award className="w-12 h-12 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-xl font-bold text-emerald-950">
                  Quiz Completed!
                </h4>
                <div className="text-3xl font-black text-emerald-800 font-mono mt-1">
                  {calculateQuizScore()} / {filteredQuestions.length} Correct
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Accuracy: {Math.round((calculateQuizScore() / filteredQuestions.length) * 100)}%
                </p>
                <button
                  onClick={handleResetQuiz}
                  className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>

              {/* Explanations List */}
              <div className="space-y-4">
                <h5 className="font-bold text-sm text-slate-900">Curriculum Solutions & Explanations:</h5>
                {filteredQuestions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs md:text-sm ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-rose-50/60 border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-slate-900">Question {idx + 1}: {q.subject}</span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                        </span>
                      </div>
                      <p className="text-slate-800 mb-2">{q.question}</p>
                      <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200 text-slate-700 text-xs">
                        <strong className="text-slate-900">Correct Option: </strong>
                        {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                        <p className="mt-1 text-slate-600 italic">
                          <strong>Solution:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: University Cutoff Calculator & Syllabi (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ESSLCE Score to University Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {lang === 'am' ? 'የዩኒቨርሲቲ መቁረጫ ነጥብ አስሊ' : 'University Cutoff Calculator'}
                </h4>
                <p className="text-xs text-slate-500">Ministry of Education Benchmark</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Simulated Total Score (out of 600):</span>
                  <span className="font-mono text-emerald-800 font-bold text-sm">{calculatorScore}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="580"
                  step="5"
                  value={calculatorScore}
                  onChange={(e) => setCalculatorScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>150</span>
                  <span>300 (50%)</span>
                  <span>450 (75%)</span>
                  <span>600</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Admission Status:</span>
                  <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800">
                    {cutoffResult.status}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {cutoffResult.message}
                </p>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Target Institutions: Debre Berhan University (DBU), Addis Ababa University (AAU), Bahir Dar University (BDU).
                </div>
              </div>
            </div>
          </div>

          {/* Downloadable Syllabi & Revision Guides */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h4 className="font-bold text-slate-900 text-base mb-1">
              Curriculum Revision Guides
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Free PDF guides for Hailemariam Mamo students
            </p>

            <div className="space-y-2.5">
              {syllabusDownloads.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="truncate">
                    <p className="font-semibold text-slate-900 truncate">{doc.name}</p>
                    <span className="text-[10px] text-slate-500">{doc.code} • {doc.size}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Downloading revision module: ${doc.name}`);
                    }}
                    className="p-1.5 bg-white border border-slate-300 text-emerald-700 hover:bg-emerald-50 rounded-lg flex-shrink-0 cursor-pointer"
                    title="Download Guide"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
