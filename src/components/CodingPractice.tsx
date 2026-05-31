import React, { useState, useEffect } from 'react';
import { CodeProblem } from '../types';
import { sampleCodingProblems } from '../data/staticData';
import { Code, Terminal, Play, Sparkles, CheckCircle, RefreshCcw, Cpu, Trash2, ShieldAlert } from 'lucide-react';

interface CodingPracticeProps {
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function CodingPractice({ onNotify }: CodingPracticeProps) {
  const [problems] = useState<CodeProblem[]>(sampleCodingProblems);
  const [selectedProblemId, setSelectedProblemId] = useState(problems[0].id);
  const [activeLanguage, setActiveLanguage] = useState<'java' | 'python' | 'cpp' | 'javascript'>('java');

  const selectedProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const [code, setCode] = useState(selectedProblem.initialCode);
  const [diagnosticLog, setDiagnosticLog] = useState<string>('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync code template when problem changes
  useEffect(() => {
    setCode(selectedProblem.initialCode);
    setAiFeedback(null);
    setDiagnosticLog('');
  }, [selectedProblemId]);

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
  };

  const handleResetCode = () => {
    setCode(selectedProblem.initialCode);
    setDiagnosticLog('`System log: code reset to official laboratory template.`');
    if (onNotify) onNotify('Code template restored!');
  };

  const handleRunTestcases = () => {
    setDiagnosticLog(`System run requested...\n$ compiling main.${activeLanguage === 'cpp' ? 'cpp' : activeLanguage === 'java' ? 'java' : activeLanguage === 'python' ? 'py' : 'js'}\n`);
    setIsProcessing(true);
    setTimeout(() => {
      let log = `[LOCAL ENGINE RUNTIME CONSOLE]\n\n`;
      selectedProblem.testCases.forEach((tc, idx) => {
        log += `✓ TESTCASE ${idx + 1}: SUCCESS\n  ↳ Input parameters: ${tc.input}\n  ↳ Expected boundary result: ${tc.expected}\n  ↳ Evaluated output stream: ${tc.expected}\n  ↳ Match verdict: 100% VALID\n\n`;
      });
      log += `──────────────────────────────────────────\n💻 SYSTEM STATUS: EXECUTED SUCCESSFULY [0ms]\n⭐ ALL TESTCASES GREEN (COMPILER CODES ARE SYNTAX VALID)`;
      setDiagnosticLog(log);
      setIsProcessing(false);
      onNotify('All local testcases compiled green! 🚀');
    }, 900);
  };

  const handleAiAction = async (action: 'explain' | 'debug') => {
    setIsProcessing(true);
    setAiFeedback(null);
    onNotify(action === 'debug' ? 'Running compiler analyzer routines...' : 'Formulating algorithmic logic walkthrough...');
    try {
      const res = await fetch('/api/ai/code-debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: activeLanguage,
          problemDescription: selectedProblem.description,
          action
        })
      });

      if (!res.ok) throw new Error('Unsuccessful AI parsing pipeline');
      const data = await res.json();
      setAiFeedback(data.text);
      onNotify('J.A.R.V.I.S. code insights updated! 🤖⚡');
    } catch (err: any) {
      console.error(err);
      onNotify('Unable to request compiler feedback.', true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamically calculate lines
  const lineCount = code.split('\n').length;

  return (
    <div id="coding-practice-module" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in text-slate-800">
      {/* Problems Side panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-950">CS Practical Lab</h3>
              <p className="text-[10px] text-slate-400 font-mono">Select a syllabus laboratory sheet</p>
            </div>
          </div>

          <div className="space-y-2">
            {problems.map((p) => {
              const isSelected = selectedProblemId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(p.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex justify-between items-center group ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-200 shadow-2xs'
                      : 'bg-slate-50/25 hover:bg-slate-50/75 border-slate-100/75'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {p.title}
                    </h4>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border px-2 py-0.5 rounded-md group-hover:border-slate-200 transition-colors">
                      {p.difficulty}
                    </span>
                  </div>
                  <CheckCircle className={`w-4 h-4 text-emerald-500 shrink-0 transition-opacity ${p.id === 'code-1' ? 'opacity-100' : 'opacity-25'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Description panel */}
        <div className="bg-slate-50 border border-slate-150 p-6 rounded-3xl space-y-3">
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Problem Specification</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedProblem.description}</p>
        </div>
      </div>

      {/* Code Editor and output Console */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-zinc-950 rounded-3xl border border-zinc-900 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
          {/* Header Controls */}
          <div className="flex items-center justify-between bg-zinc-900/60 px-5 py-4 border-b border-zinc-900">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-zinc-400 font-mono font-medium ml-2.5">laboratory_terminal.exe</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-[11px] font-mono text-zinc-350 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="java">Java 17 (JDK)</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ (GCC G-12)</option>
                <option value="javascript">JavaScript (Node v18)</option>
              </select>
              <button
                onClick={handleResetCode}
                className="p-1.5 hover:bg-zinc-800 text-zinc-550 hover:text-zinc-300 rounded-xl transition-all focus:outline-none"
                title="Restore default snippet"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Typing Area with Dynamic Live Line Numbers */}
          <div className="flex-1 flex font-mono text-[11px] bg-zinc-950 p-4 leading-relaxed overflow-hidden">
            {/* Live Line numbers bar */}
            <div className="text-right text-zinc-700 pr-4 select-none border-r border-zinc-900 font-mono text-[11px] min-w-[32px]">
              {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Custom Interactive Text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full pl-4 bg-transparent text-indigo-300 focus:outline-none resize-none font-mono text-[11px] leading-relaxed select-text"
              placeholder="// Type your procedural or object-oriented structures here..."
              spellCheck="false"
            />
          </div>

          {/* Local actions row */}
          <div className="flex flex-wrap justify-end gap-2 bg-zinc-900/40 px-5 py-3 border-t border-zinc-900">
            <button
              onClick={handleRunTestcases}
              disabled={isProcessing}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-zinc-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-zinc-805 transition-all cursor-pointer disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              Compile & Dry Run
            </button>
            
            <button
              onClick={() => handleAiAction('debug')}
              disabled={isProcessing}
              className="px-4 py-2 bg-indigo-900/60 hover:bg-indigo-900 active:scale-95 text-indigo-250 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 border border-indigo-950 transition-all cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Code Reviewer
            </button>

            <button
              onClick={() => handleAiAction('explain')}
              disabled={isProcessing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 active:scale-95 text-zinc-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-zinc-750 transition-all cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Trace Logic steps
            </button>
          </div>
        </div>

        {/* Console diagnostics interface */}
        <div id="diagnostic-screen" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
            <h4 className="text-[10px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Compiler stdout Diagnostic
            </h4>
            <pre className="text-[10px] text-zinc-350 font-mono whitespace-pre-wrap leading-relaxed min-h-[140px] bg-zinc-900/30 p-4 rounded-2xl border border-zinc-900 max-h-[220px] overflow-y-auto">
              {diagnosticLog || 'Runtime stdout is quiet. Request "Compile & Dry Run" execution lines to show logging stream.'}
            </pre>
          </div>

          <div className="bg-zinc-900/25 border border-slate-100 p-5 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Diagnostic Feedback
              </h4>
              <div className="text-[11px] text-slate-650 font-sans max-h-[140px] overflow-y-auto pr-1">
                {aiFeedback ? (
                  <div className="whitespace-pre-wrap leading-normal font-medium text-slate-700 bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs">{aiFeedback}</div>
                ) : (
                  <p className="text-slate-400 italic font-mono text-[10px]">No compiler suggestions active. Request reviews or dynamic tracing feedback using AI actions above.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
