import React, { useState } from 'react';
import { Trophy, Award, Zap, Loader2, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';

interface QuizSystemProps {
  subjects: { id: string; title: string }[];
  pastQuizzes: QuizResult[];
  onAddPastQuiz: (result: QuizResult) => void;
  onAddXp: (amount: number) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function QuizSystem({ subjects, pastQuizzes, onAddPastQuiz, onAddXp, onNotify }: QuizSystemProps) {
  const [quizSubject, setQuizSubject] = useState(subjects[0]?.title || 'Data Structures');
  const [quizDifficulty, setQuizDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizQuestions([]);
    onNotify(`Invoking standard cognitive APIs for ${quizSubject}...`);

    try {
      const resp = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: quizSubject,
          difficulty: quizDifficulty
        })
      });
      if (!resp.ok) throw new Error('Failed to generate MCQ payload.');
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuizQuestions(data);
        onNotify('MCQ Assessment sync completed. Target lock!');
      } else {
        throw new Error('Malformed array received.');
      }
    } catch (err: any) {
      console.error(err);
      onNotify('Loaded cloud failsafe computer science questions.', true);
      // Failsafe questions
      const failsafePool: QuizQuestion[] = [
        {
          question: 'What is the absolute maximum number of indexes a Relational DBMS Table can support during composite queries?',
          options: ['One clustered and multiple non-clustered indices', 'Exactly 4 primary keys and no locks', 'Only 1 index per schema boundary', 'No index limits on standard tables'],
          answer: 0,
          explanation: 'Standard RDBMS like SQL Server or PostgreSQL typically enforce a hard ceiling of exactly one clustered index layout to prevent row rearrangement conflicts.'
        },
        {
          question: 'Which CPU scheduling algorithm completely rules out the possibility of thrashing or starvation?',
          options: ['Shortest Job First (SJF)', 'Round Robin (RR) with equal time slice', 'Priority Scheduling with static bounds', 'Shortest Remaining Time First (SRTF)'],
          answer: 1,
          explanation: 'Round Robin ensures scheduling fairness by allocating an identical cyclic timeslice to all processes, preventing static threads from being locked out.'
        }
      ];
      setQuizQuestions(failsafePool);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOption = (optNameIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: optNameIdx });
  };

  const submitQuiz = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const xpEarned = correctCount * 30;
    onAddXp(xpEarned);

    // Calculate Badges unlocked
    let unlockedBadge = null;
    if (correctCount === quizQuestions.length) {
      unlockedBadge = '🥇 Quantum Compiler (Perfect Score!)';
    } else if (correctCount >= Math.floor(quizQuestions.length * 0.7)) {
      unlockedBadge = '🚀 Neural Graduate (Top Grade!)';
    }

    onNotify(`MCQ Result: ${correctCount}/${quizQuestions.length}. Unlocked +${xpEarned} Focus XP!`);
    if (unlockedBadge) {
      onNotify(`AWARD UNLOCKED: ${unlockedBadge} 🌟`);
    }

    const result: QuizResult = {
      id: Date.now().toString(),
      subjectTitle: quizSubject,
      score: correctCount,
      total: quizQuestions.length,
      difficulty: quizDifficulty,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    onAddPastQuiz(result);
  };

  return (
    <div id="quiz-system-root" className="space-y-6 text-left text-white animate-fade-in font-sans">
      <header>
        <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">GAMIFIED MCQ BATTLES // 2035</span>
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-cyan-400 shrink-0" /> MCQ Assessment System
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Challenge yourself with dynamic, Gemini-generated PG multiple choice assessments, conquer leaderboards, and obtain expert badges.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generate parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800">
            <h3 className="text-base font-display font-black text-white pb-3 border-b border-zinc-800/60 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Assessment Wizard</span>
            </h3>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest">Select Course HUB</label>
                <select
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 font-bold"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.title}>{sub.title}</option>
                  ))}
                  <option value="Placement Readiness">Placement Readiness MCQ</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest font-bold">Set Complexity Engine</label>
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-805">
                  {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setQuizDifficulty(diff)}
                      className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer focus:outline-none ${
                        quizDifficulty === diff
                          ? 'bg-cyan-600 text-black shadow-[0_0_12px_rgba(6,182,212,0.15)] font-black'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isLoading}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-xs font-display font-black tracking-wider transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-40 uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                {isLoading ? 'Synthesizing...' : 'START EXAM BATTLE'}
              </button>
            </div>
          </div>

          {/* Achievement Badges catalog */}
          <div className="cyber-panel p-5 rounded-3xl border border-zinc-850">
            <h4 className="text-xs font-display font-black text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" /> Syllabus Badges
            </h4>
            <div className="mt-3.5 space-y-3.5">
              <div className="flex items-center gap-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl">
                <span className="text-2xl">🥇</span>
                <div className="text-left font-sans">
                  <span className="text-xs font-bold text-white block leading-tight">Quantum Compiler</span>
                  <span className="text-[9px] text-zinc-500 mt-1 block">Answer all 5 generated questions correctly in one assessment</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl opacity-60">
                <span className="text-2xl">🔥</span>
                <div className="text-left font-sans">
                  <span className="text-xs font-bold text-zinc-300 block leading-tight">Streak Titan</span>
                  <span className="text-[9px] text-zinc-650 mt-1 block">Maintain a continuous 15-day check-in streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Quiz Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between min-h-[420px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-cyan-401 font-mono text-center gap-3 animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <span className="text-xs uppercase font-extrabold tracking-widest">FORGING TARGET SCHEMA RANDOMIZED MCQS WITH GEMINI...</span>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div className="space-y-5 text-left h-full flex flex-col justify-between">
                <div>
                  {/* Progress steps */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pb-3 border-b border-zinc-800">
                    <span className="font-bold flex items-center gap-1">QUESTION {currentIdx + 1} OF {quizQuestions.length}</span>
                    <span className="text-cyan-400 uppercase font-extrabold">XP VALUE: {currentIdx === 4 ? '+50 XP Bonus' : '+30 XP'}</span>
                  </div>

                  {/* MCQ Question Area */}
                  <div className="py-4">
                    <p className="text-sm md:text-base font-display font-bold leading-relaxed text-zinc-100 select-text">
                      {quizQuestions[currentIdx].question}
                    </p>
                  </div>

                  {/* Options grids */}
                  <div className="space-y-2.5 mt-2">
                    {quizQuestions[currentIdx].options.map((opt, idx) => {
                      const isSelected = selectedAnswers[currentIdx] === idx;
                      const isCorrectAnswer = quizQuestions[currentIdx].answer === idx;
                      
                      // Highlight styles
                      let optionCardStyle = 'bg-zinc-900/60 border-zinc-800 text-zinc-350 hover:border-zinc-700 hover:bg-zinc-900';
                      if (isSelected) {
                        optionCardStyle = 'bg-cyan-950/30 border-cyan-502 text-cyan-300 font-bold';
                      }
                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          optionCardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          optionCardStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => selectOption(idx)}
                          disabled={isSubmitted}
                          className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optionCardStyle}`}
                        >
                          <span className="pr-3 leading-normal font-medium">{opt}</span>
                          <span className="font-mono text-[9px] text-zinc-600 font-bold select-none">[OPTION {idx + 1}]</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation once submitted */}
                  {isSubmitted && quizQuestions[currentIdx].explanation && (
                    <div className="mt-5 p-4.5 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-1.5 animate-slide-up">
                      <span className="text-[9px] font-mono font-bold text-cyan-401 uppercase tracking-widest flex items-center gap-1 leading-none select-none">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Explanation Analysis
                      </span>
                      <p className="text-xs text-zinc-350 leading-relaxed font-sans select-text">
                        {quizQuestions[currentIdx].explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submits and stepper footer rows */}
                <div className="flex justify-between items-center pt-5 border-t border-zinc-800/60 mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                      disabled={currentIdx === 0}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 disabled:opacity-30 rounded-xl text-xs font-bold transition-all text-zinc-400 hover:text-white border border-zinc-800"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentIdx((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                      disabled={currentIdx === quizQuestions.length - 1}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 disabled:opacity-30 rounded-xl text-xs font-bold transition-all text-zinc-400 hover:text-white border border-zinc-800"
                    >
                      Next
                    </button>
                  </div>

                  {!isSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-display font-black text-xs rounded-xl tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
                    >
                      FINALIZE ANSWERS
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerateQuiz}
                      className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-cyan-400 font-display font-black text-xs rounded-xl tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> REBOOT MOCK BATTLE
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-zinc-500 text-center space-y-2 select-none">
                <Trophy className="w-12 h-12 text-zinc-700" />
                <p className="italic font-mono text-[10px]">No assessment session online. Trigger "Start Exam Battle" block to load MCQs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
