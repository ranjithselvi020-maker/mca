import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2, ChevronRight, Sparkles, Loader2, Award, Zap } from 'lucide-react';

interface PlannerTask {
  id: string;
  title: string;
  subject: string;
  day: string;
  duration: string;
  completed: boolean;
}

interface StudyPlannerProps {
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function StudyPlanner({ onNotify }: StudyPlannerProps) {
  const [tasks, setTasks] = useState<PlannerTask[]>(() => {
    const saved = localStorage.getItem('nexus_planner_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Revise ACID transactions & transaction states', subject: 'DBMS', day: 'Monday', duration: '60 mins', completed: true },
      { id: '2', title: 'Solve Bankers Algorithm scheduling matrices', subject: 'Operating Systems', day: 'Wednesday', duration: '45 mins', completed: false },
      { id: '3', title: 'Implement Binary Search Trees class recursion', subject: 'Data Structures', day: 'Friday', duration: '90 mins', completed: false },
      { id: '4', title: 'Practice TCP Congestion Control subnets', subject: 'Computer Networks', day: 'Saturday', duration: '50 mins', completed: false }
    ];
  });

  const [promptInput, setPromptInput] = useState('Create a hardcore 2-week exam schedule for DBMS and Operating Systems targeting 16-mark scenario questions.');
  const [aiSchedule, setAiSchedule] = useState<string | null>(() => {
    return localStorage.getItem('nexus_ai_schedule_text') || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // New task form fields
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newDay, setNewDay] = useState('Monday');
  const [newDuration, setNewDuration] = useState('60 mins');

  useEffect(() => {
    localStorage.setItem('nexus_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTitle.trim()) {
      onNotify('Please enter a task description.', true);
      return;
    }
    const task: PlannerTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject,
      day: newDay,
      duration: newDuration,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTitle('');
    onNotify('Syllabus task added to cyber planner!');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => {
      if (t.id === id) {
        const nextVal = !t.completed;
        if (nextVal) {
          onNotify('Task completed! +15 Focus XP points acquired.');
        }
        return { ...t, completed: nextVal };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    onNotify('Task dismissed from queue.');
  };

  const handleGenerateAiSchedule = async () => {
    if (!promptInput.trim()) {
      onNotify('Please enter preferences for your custom syllabus schedule.', true);
      return;
    }
    setIsLoading(true);
    setAiSchedule(null);
    onNotify('Consulting Gemini backend solver for exam schedule...');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Draft an exam schedule: ${promptInput}. Make it extremely structured with daily steps, topics, duration times, and expert study tricks. Format in markdown.`,
          subject: 'Syllabus and Study Schedules',
          marksMode: 'General'
        })
      });

      if (!response.ok) throw new Error('AI scheduler query failed.');
      const data = await response.json();
      setAiSchedule(data.text);
      localStorage.setItem('nexus_ai_schedule_text', data.text);
      onNotify('AI Exam Study Schedule Generated successfully! 🌟');
    } catch (err: any) {
      console.error(err);
      onNotify('AI service error. Loading locally balanced fallback schedule template.', true);
      const fallback = `### 📅 FALLBACK 2-WEEK HIGH-SPEED CORE EXAM PLAN

**WEEK 1: HIGH-INTENSITY CONCEPTS & TRICKS**
- **Monday (60m DBMS):** Normalization theory walkthrough (1NF to 3NF, BCNF parsing scenarios).
- **Wednesday (45m OS):** Banker's Algorithm safety & resource request dry-run algorithms.
- **Friday (90m DSA):** Binary Search Tree insertion and deletion node-pointer tracing structures.

**WEEK 2: MULTI-LEVEL DRILLS & PROBLEM SETS**
- **Tuesday (50m Networks):** Subnetting calculations & CIDR network-mask formulas.
- **Thursday (60m JAVA):** Collections HashMap hash collisions and Multithreading locks.
- **Saturday (120m Exams):** Dry-run 5 actual past university examination papers.`;
      setAiSchedule(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Day list helper
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Completion calculation
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div id="planner-container" className="space-y-8 text-left text-white animate-fade-in font-sans">
      <header>
        <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">Quantum Time Modules // 2035</span>
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-cyan-400 shrink-0" /> Study Planner & Schedule Engine
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Isolate weekly target cycles, visualize schedules on a cyber calendar grid, and build automated timetables with Gemini.</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Add/Manage Tasks list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800">
            <h3 className="text-base font-display font-black text-white pb-3 border-b border-zinc-800/60 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Timetable Queue</span>
            </h3>

            {/* Quick Progress Indicator */}
            <div className="mt-4 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Current Focus Yield</span>
                <span className="text-2xl font-display font-black text-white mt-1 block">{pct}% COMPLETED</span>
              </div>
              <div className="text-right font-mono text-zinc-500 text-xs">
                <span>{done} done / {total} total</span>
              </div>
            </div>

            {/* Form Input fields */}
            <div className="mt-5 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-wide">Target task description</label>
                <input
                  type="text"
                  placeholder="E.g., Revise ACID concurrency traps..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-909 border border-zinc-800/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-wide">Subject Category</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DBMS">Relational DBMS</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Computer Networks">Networks (CN)</option>
                    <option value="Python">Python for ML</option>
                    <option value="Advanced Java">Advanced Java</option>
                    <option value="Placement Hub">Placement Prep</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-wide">Target Weekday</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  >
                    {weekdays.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-1.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-wide">Target Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="30 mins">30 mins (Slick)</option>
                    <option value="45 mins">45 mins (Optimal)</option>
                    <option value="60 mins">60 mins (Exhaustive)</option>
                    <option value="90 mins">90 mins (Hardcore)</option>
                    <option value="120 mins">120 mins (Insane)</option>
                  </select>
                </div>
                
                <button
                  onClick={handleAddTask}
                  className="w-full mt-5 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl text-xs font-display font-black tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <Plus className="w-4 h-4 text-black" /> Add Task
                </button>
              </div>
            </div>

            {/* Active task list */}
            <div className="mt-6 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    t.completed
                      ? 'bg-zinc-900/30 border-cyan-500/20 text-zinc-500'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex gap-3 items-center text-left max-w-[80%]">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        t.completed
                          ? 'bg-cyan-500 border-cyan-500 text-black'
                          : 'bg-transparent border-zinc-650'
                      }`}
                    >
                      {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <span className={`text-xs font-bold leading-snug block ${t.completed ? 'line-through text-zinc-550' : 'text-zinc-100'}`}>
                        {t.title}
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-cyan-400 mt-1 block uppercase">
                        {t.subject} • {t.day} • {t.duration}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-1 text-zinc-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: AI Timetable architect output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-800/60">
                <h3 className="text-base font-display font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span>AI Schedule Generator</span>
                </h3>
                <span className="text-[9px] font-mono tracking-widest font-black px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-855 rounded-lg uppercase">
                  GPT Solver
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest">PROMPT INSTRUCTIONS FOR AI ENGINE</label>
                <textarea
                  placeholder="State your goal, targeted weak subjects, exam timeline etc..."
                  rows={2}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-909 border border-zinc-800 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none font-semibold shadow-inner"
                />
              </div>

              {/* AI Markdown render screen */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 min-h-[180px] max-h-[350px] overflow-y-auto font-sans leading-relaxed text-xs">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-cyan-400 font-mono text-center gap-3 animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                    <span>SYNCHRONIZING SYLLABUS INTELLIGENCE ENGINE...</span>
                  </div>
                ) : aiSchedule ? (
                  <div className="prose text-zinc-300 text-left max-w-none space-y-2 font-sans">
                    <div className="flex items-center gap-2 text-cyan-401 font-mono font-bold text-[10px] uppercase pb-2 border-b border-zinc-900 mb-3">
                      <Zap className="w-4 h-4 text-cyan-400" /> GEMINI AUTOMATION TIMETABLE INTEL
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-300 font-medium">
                      {aiSchedule}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-550 text-center space-y-2">
                    <Calendar className="w-10 h-10 text-zinc-700" />
                    <p className="italic font-mono text-[10px]">Ready to build customized university revision timetables. Hit "Draft Timetable" below.</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateAiSchedule}
              disabled={isLoading || !promptInput.trim()}
              className="w-full mt-6 py-3.5 bg-purple-650 hover:bg-purple-600 active:scale-98 disabled:opacity-40 text-white rounded-2xl text-xs font-display font-black tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.25)]"
            >
              <Sparkles className="w-4 h-4 text-white" />
              DRAFT TIMETABLE MATRIX WITH GEMINI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
