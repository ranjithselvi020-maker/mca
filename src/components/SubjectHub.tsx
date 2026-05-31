import React, { useState } from 'react';
import { Subject } from '../types';
import { Sparkles, CheckCircle2, ChevronRight, Zap, Target, BookOpen, Layers } from 'lucide-react';

interface SubjectHubProps {
  subjects: Subject[];
  onToggleTopic: (subId: string, topicName: string) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function SubjectHub({ subjects, onToggleTopic, onNotify }: SubjectHubProps) {
  const [selectedSubId, setSelectedSubId] = useState<string>(subjects[0]?.id || 'ds');

  const selectedSub = subjects.find((s) => s.id === selectedSubId) || subjects[0];

  // AI Recommendation presets to avoid unnecessary API loading on every click, with toggleable dynamically
  const recommendationsMap: { [key: string]: string[] } = {
    ds: [
      'Focus intensely on Dijkstra single-source shortest path algorithm (frequently asked 16-marker).',
      'Understand B-Trees splitting rules for 8-mark transaction setups.',
      'Solve BST worst-case recursion limits for runtime optimization.'
    ],
    dbms: [
      'Trace exact database schema normalization patterns (1NF to BCNF, excellent 16-mark scoring).',
      'Revise Timestamp vs 2PL concurrency locks and ACID anomalies.',
      'Understand B+ Tree vs Hash database index footprints.'
    ],
    os: [
      'Dry-run page replacement allocations (LRU vs FIFO) on 8-value string traces.',
      'Memorize Banker’s Algorithm safety checks with detailed matrix dry runs.',
      'Differentiate process transitions and PCB structures for 2-mark definitions.'
    ],
    java: [
      'Practice Multithreading thread coordination rules using runnable blocks.',
      'Examine Collections framework: HashMap collision sorting mechanisms.',
      'Review JDBC connection pooling boundaries for transactional APIs.'
    ],
    python: [
      'Polish List comprehensions and vectorization layouts in NumPy.',
      'Review Pandas data-wrangling keys for ML loading pipelines.',
      'Study Scikit-Learn classification pipelines with evaluation metrics.'
    ],
    cn: [
      'Trace IPv4 Subnetting & CIDR network mask calculations (heavy scoring).',
      'Detail TCP 3-way handshake sequences and sliding window flow rules.',
      'Differentiate OSI layers functions for 2-mark university briefs.'
    ],
    se: [
      'Contrast SDLC Waterfall vs Agile Scrum mechanics.',
      'Study clean component-level software design patterns.',
      'Review continuous integration (CI) Docker container pipelines.'
    ],
    cloud: [
      'Memorize Serverless Cloud Run pricing models and triggers.',
      'Detail SaaS vs PaaS vs IaaS infrastructure paradigms.',
      'Solve EC2 microservices virtualization scalability.'
    ],
    ml: [
      'Review Stochastic Gradient Descent (SGD) minimizing cost operations.',
      'Trace Logistic Regression sigmoid boundaries mathematically.',
      'Contrast K-Means clustering optimizations for dimensionality.'
    ],
    ai: [
      'Practice A* and Minimax searches heuristics matrices.',
      'Study NLP tokenizers and transform layer models.',
      'Review Artificial Neural Network backpropagation pathways.'
    ]
  };

  const currentRecs = recommendationsMap[selectedSub.id] || [
    'Complete syllabus indices system-wide.',
    'Focus on actual post-graduate past examinations keys.',
    'Formulate active trace diagrams for 16-mark scenarios.'
  ];

  return (
    <div id="subject-hub-root" className="space-y-6 text-left text-white animate-fade-in font-sans">
      <header>
        <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">Curriculum Nexus // 2035</span>
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400 shrink-0" /> Academic Subject Hub & Path
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Navigate through 9+ core post-graduate computer science sciences, map active progress, and review visual learning roadmaps.</p>
      </header>

      {/* Horizontal horizontal list of subjects */}
      <div className="flex flex-wrap gap-2.5 pb-2 overflow-x-auto border-b border-zinc-800/50">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubId;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubId(sub.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {sub.title.split(' ')[0]} Hub
            </button>
          );
        })}
      </div>

      {/* Grid: Subject detail panel, checklist path visualization, and AI guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress details and checklists */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-805 flex flex-col justify-between min-h-[380px]">
            <div className="space-y-3.5">
              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 font-mono font-bold px-2 py-0.5 rounded uppercase">
                {selectedSub.code} • {selectedSub.category}
              </span>
              <h3 className="text-lg font-display font-black text-white leading-snug">{selectedSub.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{selectedSub.description}</p>
            </div>

            {/* Circular Progress Ring display with SVG elements */}
            <div className="mt-6 py-4 bg-zinc-900/35 rounded-2xl border border-zinc-800 flex items-center justify-around gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                {/* SVG circular track */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    className="text-zinc-800"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="34"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="text-cyan-500 transition-all duration-350"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - selectedSub.progress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="34"
                    cx="40"
                    cy="40"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-base font-display font-black text-white font-mono tracking-tighter">{selectedSub.progress}%</span>
                </div>
              </div>

              <div className="text-left font-sans">
                <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Chapter Score</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {selectedSub.topics.filter((t) => t.completed).length} / {selectedSub.topics.length} Done
                </span>
                <span className="text-[10px] text-zinc-400 block mt-1 leading-none">Complete nodes to level up XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Curriculum checklist Interactive Pathway Graph node visualizer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-850">
            <h3 className="text-base font-display font-black text-white pb-3 border-b border-zinc-800/60 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Interactive Learning Path</span>
            </h3>

            {/* Glowing vector line pathway layout mapping */}
            <div className="mt-5 space-y-3 relative">
              {/* Connected route line in background */}
              <div className="absolute left-[25px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500/20 z-0"></div>

              {selectedSub.topics.map((top, idx) => (
                <div 
                  key={top.name} 
                  onClick={() => onToggleTopic(selectedSub.id, top.name)}
                  className={`relative z-10 flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    top.completed
                      ? 'bg-cyan-950/20 border-cyan-550/30 text-zinc-100 hover:border-cyan-500/50'
                      : 'bg-zinc-913/50 hover:bg-zinc-901 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {/* Glowing Node pointer */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-[9px] font-bold border transition-all ${
                    top.completed
                      ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_10px_#06b6d4]'
                      : 'bg-zinc-950 border-zinc-700 text-zinc-500'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <span className={`text-[11px] font-bold leading-normal block ${top.completed ? 'line-through text-zinc-400 font-medium' : 'text-zinc-200'}`}>
                      {top.name}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <CheckCircle2 className={`w-4.5 h-4.5 transition-colors ${top.completed ? 'text-cyan-400' : 'text-zinc-700'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: AI recommendations */}
        <div className="lg:col-span-3 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-850 min-h-[380px] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-display font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-401 animate-pulse" />
                <span>AI Core Guidelines</span>
              </h3>
              
              <div className="space-y-3">
                {currentRecs.map((rec, index) => (
                  <div key={index} className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-zinc-300 font-medium leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 font-mono text-[9px] text-zinc-550 border-t border-zinc-805 flex items-center gap-2 uppercase">
              <Target className="w-3.5 h-3.5 text-cyan-400" /> Optimizing study vectors...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
