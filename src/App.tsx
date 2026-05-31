import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import {
  initialSubjects,
  pyqBank,
  aptitudeQuestions,
  hrInterviewQuestions,
  careerGuidelines
} from './data/staticData';
import { Subject, QuizQuestion, QuizResult } from './types';

// Importing helper sub-modules
import LandingPage from './components/LandingPage';
import SubjectHub from './components/SubjectHub';
import QuizSystem from './components/QuizSystem';
import StudyPlanner from './components/StudyPlanner';
import PdfSummarizer from './components/PdfSummarizer';
import FlashcardGenerator from './components/FlashcardGenerator';
import GpaCalculator from './components/GpaCalculator';
import MockLeaderboard from './components/MockLeaderboard';
import ResumeBuilder from './components/ResumeBuilder';
import CodingPractice from './components/CodingPractice';
import JarvisDiagnostics from './components/JarvisDiagnostics';

import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Code,
  Trophy,
  Target,
  Sparkles,
  Search,
  Calendar,
  Layers,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
  ChevronRight,
  User,
  GraduationCap,
  Cpu,
  Zap,
  Shield,
  HelpCircle,
  Clock,
  Printer,
  Mic
} from 'lucide-react';

export default function App() {
  // 1. Core boot state representing system-bootup 2035
  const [isBooted, setIsBooted] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_cyber_booted');
    return saved === 'true';
  });

  // Subjects states
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('nexus_cyber_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ds');

  // Gamified student profiles
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('nexus_student_meta');
    return saved ? JSON.parse(saved) : {
      name: 'Ranjith Kumar',
      semester: 4,
      streak: 12,
      points: 840,
      badgeCount: 2
    };
  });

  // Action count alerts
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem('nexus_cyber_booted', isBooted ? 'true' : 'false');
  }, [isBooted]);

  useEffect(() => {
    localStorage.setItem('nexus_cyber_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('nexus_student_meta', JSON.stringify(student));
  }, [student]);

  // Handle checked syllabus topic node
  const handleToggleTopic = (subId: string, topicName: string) => {
    const updated = subjects.map((sub) => {
      if (sub.id === subId) {
        const updatedTopics = sub.topics.map((top) => {
          if (top.name === topicName) {
            const nextVal = !top.completed;
            if (nextVal) {
              setStudent((prev) => ({ ...prev, points: prev.points + 20 }));
              showNotification('Topic Node Integrated! +20 Focus XP Points Earned 🌟');
            } else {
              setStudent((prev) => ({ ...prev, points: Math.max(0, prev.points - 20) }));
            }
            return { ...top, completed: nextVal };
          }
          return top;
        });

        const completedCount = updatedTopics.filter((t) => t.completed).length;
        const progress = Math.round((completedCount / updatedTopics.length) * 100);

        return { ...sub, topics: updatedTopics, progress };
      }
      return sub;
    });
    setSubjects(updated);
  };

  // Streaks increment
  const handleCheckIn = () => {
    setStudent((prev) => ({ ...prev, streak: prev.streak + 1, points: prev.points + 50 }));
    showNotification('Neural Connection Signed! +50 Points & Streak Amplified 🔥');
  };

  // Add past quizzes results
  const [pastQuizzes, setPastQuizzes] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('nexus_past_quizzes');
    return saved ? JSON.parse(saved) : [
      { id: '1', subjectTitle: 'Database Management Systems', score: 4, total: 5, difficulty: 'Medium', date: 'May 28, 2026' },
      { id: '2', subjectTitle: 'Data Structures & Algorithms', score: 3, total: 5, difficulty: 'Hard', date: 'May 30, 2026' }
    ];
  });

  const handleAddPastQuiz = (res: QuizResult) => {
    const nextList = [res, ...pastQuizzes];
    setPastQuizzes(nextList);
    localStorage.setItem('nexus_past_quizzes', JSON.stringify(nextList));
  };

  const handleAddXp = (amount: number) => {
    setStudent((prev) => ({ ...prev, points: prev.points + amount }));
  };

  // --- AI STUDY CHAT STATES ---
  const [chatInput, setChatInput] = useState('');
  const [chatSubject, setChatSubject] = useState<string>('Operating Systems');
  const [marksMode, setMarksMode] = useState<'General' | '2 Marks' | '5 Marks' | '16 Marks'>('General');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content: 'Hello, I am **J.A.R.V.I.S. (Just A Rather Very Intelligent System)**. I am fully synchronized with the MCA Nexus database and Stark Industries mainframe metrics. I have completed my internal boot sequence. Ask me any PG computer science syllabus questions, request algorithm visualizations, or choose direct **16-Mark Evaluation blueprints**. Let’s optimize your performance curves.'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Send message
  const sendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;
    const msgCopy = queryText.trim();
    setChatInput('');

    const newHistory = [...chatHistory, { role: 'user' as const, content: msgCopy }];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgCopy,
          subject: chatSubject,
          marksMode,
          messageHistory: newHistory.slice(-6)
        })
      });

      if (!response.ok) throw new Error('Unsuccessful chatting loop.');
      const data = await response.json();
      setChatHistory([...newHistory, { role: 'model', content: data.text }]);
    } catch (err: any) {
      console.error(err);
      showNotification('Gemini service connection interrupted. Check configuration.', true);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleVoiceInputMock = () => {
    if (isRecording) {
      setIsRecording(false);
      setChatInput('Explain Virtual Page translation frames in Operating Systems.');
      showNotification('Voice speech query compiled successfully!');
    } else {
      setIsRecording(true);
      showNotification('Active Neural Transceiver online, Speak your query now...');
      setTimeout(() => {
        setIsRecording(false);
        setChatInput('Explain Virtual Page translation frames in Operating Systems.');
        showNotification('Voice speech query compiled successfully!');
      }, 2500);
    }
  };

  // --- REVISION NOTES HUB STATES ---
  const [notesQuery, setNotesQuery] = useState('');
  const [notesSubject, setNotesSubject] = useState('Operating Systems');
  const [notesFormat, setNotesFormat] = useState<'Short Notes' | 'Revision Notes' | 'Detailed Study Guide' | 'Exhaustive 16-Mark Answer Layout'>('Detailed Study Guide');
  const [notesResult, setNotesResult] = useState<string | null>(null);
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  const handleGenerateNotes = async () => {
    if (!notesQuery.trim()) {
      showNotification('Please key in a topic to generate study summaries.', true);
      return;
    }
    setIsNotesLoading(true);
    setNotesResult(null);
    showNotification('Assembling curriculum references & cheatsheets...');

    try {
      const res = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: notesQuery.trim(),
          subject: notesSubject,
          formatType: notesFormat
        })
      });
      if (!res.ok) throw new Error('Failure compiling notes.');
      const data = await res.json();
      setNotesResult(data.text);
      setStudent((prev) => ({ ...prev, points: prev.points + 40 }));
      showNotification('Study revision log curated successfully! +40 Focus XP!');
    } catch (err: any) {
      console.error(err);
      showNotification('Unable to compile notes. Displaying fallback...', true);
      setNotesResult(`### 📝 REVISION SLIDE SHEET: ${notesQuery}\n\n**CORE SYLLABUS DIRECTIVES**\n- Master high-speed transactional logic or algorithmic structures.\n- Differentiate memory caches vs. disk index structures.\n- Understand computational bounds and time complexity metrics.`);
    } finally {
      setIsNotesLoading(false);
    }
  };

  // --- PLACEMENT CAREER GUIDANCE STATES ---
  const [prefsInput, setPrefsInput] = useState('High latency microservice databases, Express API routes, caching grids, and cloud servers.');
  const [skillsInput, setSkillsInput] = useState('Basic Java collections, Python arrays, and custom SQL relations.');
  const [careerResult, setCareerResult] = useState<string | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState(false);

  const handleGenerateJobMap = async () => {
    if (!prefsInput.trim() || !skillsInput.trim()) {
      showNotification('Please input your preferred specs and proficiency vectors.', true);
      return;
    }
    setIsGuidanceLoading(true);
    setCareerResult(null);
    showNotification('AI Recruiter plotting optimal career vector...');

    try {
      const res = await fetch('/api/ai/recommend-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: prefsInput.trim(),
          coreSkills: skillsInput.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to fetch guidance content.');
      const data = await res.json();
      setCareerResult(data.text);
      setStudent((prev) => ({ ...prev, points: prev.points + 30 }));
      showNotification('Personal Career Vector compiled!');
    } catch (err: any) {
      console.error(err);
      showNotification('Failsafe overview fetched.', true);
      setCareerResult(`### 🚀 RECRUITMENT ROADMAP: CLOUD API ARCHITECT\n- **Milestone 1 (Months 1-3):** Solidify concurrent SQL indexes and transaction pipelines in Java.\n- **Milestone 2 (Months 4-6):** Deploy dockerized Node.js containers onto Cloud Run. Practice O(N log N) assessment puzzles.`);
    } finally {
      setIsGuidanceLoading(false);
    }
  };

  // Past pyq review lists filtering states
  const [pyqSearch, setPyqSearch] = useState('');
  const [pyqFilterSub, setPyqFilterSub] = useState('all');

  const filteredPyqs = pyqBank.filter((item) => {
    const matchesSub = pyqFilterSub === 'all' || item.subjectId === pyqFilterSub;
    const matchesText = item.question.toLowerCase().includes(pyqSearch.toLowerCase()) || 
                        item.answerHint.toLowerCase().includes(pyqSearch.toLowerCase());
    return matchesSub && matchesText;
  });

  // Aptitude interactive diagnostics states
  const [activeAptitudeIdx, setActiveAptitudeIdx] = useState(0);
  const [selectedAptOptionIdx, setSelectedAptOptionIdx] = useState<number | null>(null);
  const [isAptSubmitted, setIsAptSubmitted] = useState(false);

  const currentApt = aptitudeQuestions[activeAptitudeIdx] || aptitudeQuestions[0];

  const handleEnterApp = () => {
    setIsBooted(true);
    showNotification('Access Granted. Core nexus synced.');
  };

  const handleDeAuthorize = () => {
    setIsBooted(false);
    showNotification('Disconnected from Core Nexus.');
  };

  // If not booted, render futuristic 2035 welcome gateway
  if (!isBooted) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans antialiased hologram-grid selection:bg-cyan-500 selection:text-black">
      {/* Top Floating Glow Effects */}
      <div className="absolute top-0 right-[15%] w-[40%] h-[30%] bg-purple-550/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Glass Header */}
      <nav className="relative z-10 bg-[#070b13]/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-cyan-950 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="w-5.5 h-5.5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-455">CORE ACADEMIC OS // 2035</span>
            <h1 className="text-sm font-display font-black text-white tracking-wide">MCA NEXUS AI</h1>
          </div>
        </div>

        {/* Dynamic Countdown & Streaks top controls bar */}
        <div className="hidden md:flex items-center gap-4.5">
          {/* Active streaking counters */}
          <button
            onClick={handleCheckIn}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-purple-950/40 hover:bg-purple-950 border border-purple-500/25 rounded-xl cursor-pointer hover:shadow-[0_0_12px_rgba(139,92,246,0.21)] transition-all"
            title="Scribble daily login"
          >
            <Flame className="w-4 h-4 text-purple-400 fill-purple-900 animate-pulse" />
            <div className="text-left leading-none font-mono">
              <span className="text-[8px] text-purple-400 block font-bold">STREAK VALUE</span>
              <span className="text-xs text-purple-100 font-extrabold">{student.streak} Days Live</span>
            </div>
          </button>

          {/* Gamified point XP counters */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/25 rounded-xl">
            <Trophy className="w-4 h-4 text-cyan-401" />
            <div className="text-left leading-none font-mono">
              <span className="text-[8px] text-cyan-400 block font-bold">SOCIETY RANK</span>
              <span className="text-xs text-cyan-100 font-extrabold">{student.points} XP</span>
            </div>
          </div>
        </div>

        {/* User identification parameters */}
        <div className="flex items-center gap-3.5">
          <div className="text-right hidden sm:block leading-none">
            <h3 className="text-xs font-bold text-slate-100">{student.name}</h3>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 block uppercase">Active Semester {student.semester}</span>
          </div>

          <button
            onClick={handleDeAuthorize}
            className="w-9 h-9 rounded-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono transition-all cursor-pointer"
            title="Log out of system"
          >
            NEX
          </button>
        </div>
      </nav>

      {/* Floating Status Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-[999] px-5 py-4 rounded-2xl flex items-center gap-3 shadow-2xl max-w-sm border transition-all duration-300 animate-fade-in ${
            notification.isError
              ? 'bg-rose-950 border-rose-500/30 text-rose-300'
              : 'bg-cyan-950 border-cyan-500/35 text-cyan-300'
          }`}
        >
          {notification.isError ? <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 shrink-0 text-cyan-400" />}
          <span className="text-xs font-bold leading-normal">{notification.message}</span>
        </div>
      )}

      {/* Main Frame Layout with Sidebar Navigation and Central Panel */}
      <div className="flex-1 flex flex-col lg:flex-row pb-16">
        {/* Left Floating Steel Side rail */}
        <aside className="w-full lg:w-64 bg-[#070b13]/55 border-b lg:border-b-0 lg:border-r border-zinc-900 p-5.5 flex flex-col justify-between shrink-0 select-none">
          <div className="space-y-6">
            {/* Core curriculum segment */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-502 font-bold ml-1.5 block">
                MAIN COGNITIONS
              </span>
              <nav className="space-y-1.5">
                {[
                  { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dynamic Dashboard' },
                  { id: 'subject', icon: <BookOpen className="w-4 h-4" />, label: 'Curriculum Hub (9+)' },
                  { id: 'planner', icon: <Calendar className="w-4 h-4" />, label: 'Study Planner & Timetable' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                      activeTab === item.id
                        ? 'bg-cyan-600 text-black font-black shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* AI Assistant features segment */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold ml-1.5 block">
                AI COMPILERS
              </span>
              <nav className="space-y-1.5">
                {[
                  { id: 'chat', icon: <MessageSquare className="w-4 h-4 text-cyan-400" />, label: 'J.A.R.V.I.S. Intelligence' },
                  { id: 'jarvis', icon: <Cpu className="w-4 h-4 text-amber-500 animate-pulse" />, label: 'J.A.R.V.I.S. Diagnostics' },
                  { id: 'notes', icon: <FileText className="w-4 h-4" />, label: 'AI Notes & Mock Exam' },
                  { id: 'summarizer', icon: <Layers className="w-4 h-4" />, label: 'AI PDF Summarizer' },
                  { id: 'flashcard', icon: <Layers className="w-4 h-4 text-cyan-400" />, label: 'AI Flashcards Factory' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                      activeTab === item.id
                        ? 'bg-purple-600 text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Labs and placements segment */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold ml-1.5 block">
                PRACTICAL & CAREER
              </span>
              <nav className="space-y-1.5">
                {[
                  { id: 'code', icon: <Code className="w-4 h-4" />, label: 'Compiler Playground' },
                  { id: 'quiz', icon: <Trophy className="w-4 h-4" />, label: 'Exam MCQ Quiz System' },
                  { id: 'advisor', icon: <Target className="w-4 h-4" />, label: 'Job Guidance Specs' },
                  { id: 'resume', icon: <Award className="w-4 h-4" />, label: 'CV ATS Optimizer' },
                  { id: 'pyq', icon: <Layers className="w-4 h-4" />, label: 'Past Syllabus PYQs' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                      activeTab === item.id
                        ? 'bg-pink-600 text-white font-black shadow-[0_0_15px_rgba(219,39,119,0.25)]'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Quick countdown warning inside Side Rail */}
          <div className="mt-8 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-left leading-snug">
            <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase block tracking-wider">Internal Assessments</span>
            <span className="text-xs text-white block mt-1 font-bold">Phase II begins Monday</span>
            <div className="mt-2.5 bg-zinc-900 h-1 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[45%]"></div>
            </div>
          </div>
        </aside>

        {/* Central Display Pane coordinating dynamic tab components */}
        <main className="flex-1 p-6 lg:p-9 overflow-y-auto z-10">
          <AnimatePresence mode="wait">
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-8 text-left"
              >
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-5">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">NEXUS CONTROL ROOM // 2035</span>
                    <h2 className="text-xl md:text-3xl font-display font-black text-white">Dynamic Student Command Center</h2>
                    <p className="text-xs text-zinc-400 mt-1">Check off finished master syllabus nodes, analyze performance benchmarks, and consult Gemini optimization triggers.</p>
                  </div>
                  
                  <button 
                    onClick={handleCheckIn}
                    className="px-5 py-3 relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-black font-display font-black text-xs rounded-xl tracking-wide transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-1.5 cursor-pointer uppercase"
                  >
                    <Flame className="w-4 h-4 text-black animate-bounce shrink-0" />
                    Sign Daily Check-In (+50 XP)
                  </button>
                </header>

                {/* Grid layout: score statistics, countdown clocks, and custom gpa calculators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Total Focus Points Accumulator Card */}
                  <div className="cyber-panel p-6 rounded-3xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-[-15px] top-[-10px] opacity-[0.02] group-hover:scale-105 transition-transform">
                      <Award className="w-36 h-36 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest">COGNITIVE LEVEL ACCUMULATOR</span>
                      <h3 className="text-4xl font-display font-black text-cyan-400 mt-2 font-mono tracking-tight">{student.points} <span className="text-xs text-zinc-400 font-normal uppercase font-sans tracking-wide">XP Points</span></h3>
                      <p className="text-xs text-zinc-400 mt-3 leading-relaxed">Score updates instantly upon resolving curriculum checklist challenges, compiler dry-runs, and mock exam assessments.</p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-zinc-900 flex justify-between font-mono text-[9px] text-[#94a3b8] font-bold">
                      <span>COHORT RANK: TOP 5%</span>
                      <span>142 USERS LIVE</span>
                    </div>
                  </div>

                  {/* Syllabus target clocks */}
                  <div className="cyber-panel p-6 rounded-3xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] opacity-[0.02]">
                      <Clock className="w-36 h-36 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest">UNIVERSITY COUNTDOWN DEADLINES</span>
                      <h3 className="text-4xl font-display font-black text-purple-400 mt-2 font-mono tracking-tight">25 Days <span className="text-xs text-zinc-400 font-normal uppercase font-sans tracking-wide">Remaining</span></h3>
                      <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-sans">PG Exam Assessment timelines have been established. Integrate syllabus matrices beforehand to avoid cognitive bottlenecks.</p>
                    </div>

                    <div className="mt-5">
                      <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                        <div className="bg-purple-500 h-full rounded-full w-[45%] transition-all"></div>
                      </div>
                    </div>
                  </div>

                  {/* GPA Calculator widgets */}
                  <GpaCalculator onNotify={(msg, isErr) => showNotification(msg, isErr)} />
                </div>

                {/* Sub row: Quick syllabus tracker shortcut and dynamic metrics overview */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 border-t border-zinc-900">
                    <div>
                      <h3 className="font-display font-black text-lg text-white">Dynamic Syllabus Check</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">Toggle course categories below to examine chapters</p>
                    </div>

                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-cyan-500 font-bold cursor-pointer"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.title} ({sub.code})</option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Subject overview box */}
                  {(() => {
                    const activeSub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
                    return (
                      <div className="cyber-panel p-6 rounded-3xl border border-zinc-850 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-5 space-y-4 text-left">
                          <span className="text-[9px] bg-cyan-950 text-cyan-401 border border-cyan-500/25 font-mono font-bold px-2 py-0.5 rounded uppercase">
                            {activeSub.code} • {activeSub.category}
                          </span>
                          <h4 className="text-lg font-display font-black text-white">{activeSub.title}</h4>
                          <p className="text-xs text-zinc-400 leading-normal">{activeSub.description}</p>

                          <div className="bg-zinc-950/60 p-4 border border-zinc-900 rounded-2xl space-y-1.5">
                            <div className="flex justify-between font-mono text-[9px] text-[#94a3b8] font-bold">
                              <span>Syllabus covered</span>
                              <span>{activeSub.progress}% Complete</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-1.5">
                              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full" style={{ width: `${activeSub.progress}%` }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-2">
                          <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest block pl-1 text-left mb-1">CHAPTER INDEX (CLICK TO RESOLVE)</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {activeSub.topics.map((top) => (
                              <button
                                key={top.name}
                                onClick={() => handleToggleTopic(activeSub.id, top.name)}
                                className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                  top.completed
                                    ? 'bg-cyan-950/20 border-cyan-502 text-cyan-200'
                                    : 'bg-zinc-900/40 hover:bg-zinc-850/70 border-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                              >
                                <span className={`truncate text-[11px] font-semibold ${top.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{top.name}</span>
                                <CheckCircle2 className={`w-4 h-4 shrink-0 ${top.completed ? 'text-cyan-400' : 'text-zinc-700'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Sub bento items: rosters and cognitive advices */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  <div className="lg:col-span-6">
                    <MockLeaderboard />
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-between cyber-panel p-6 rounded-3xl border border-zinc-850">
                    <div className="space-y-4">
                      <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                        <span>Core Examination Directives</span>
                      </h3>
                      <div className="space-y-3.5 text-xs text-zinc-400 leading-relaxed font-sans">
                        <div className="p-4 bg-purple-950/40 border border-purple-500/20 rounded-2xl">
                          <strong className="text-purple-300 block mb-1">2-Mark Evaluation rules:</strong> Keep references strictly precise. Ensure key academic definitions like <code className="font-mono text-cyan-400 font-bold">"Isolation State"</code> or <code className="font-mono text-cyan-400 font-bold">"ACID property"</code> are articulated early.
                        </div>
                        <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl">
                          <strong className="text-cyan-300 block mb-1">16-Mark Answer layouts:</strong> Introduce complex state diagrams directly using clean, trace-ready ASCII designs or functional database maps.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('subject')}
                      className="w-full mt-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 text-xs font-display font-black uppercase tracking-wide rounded-xl transition-colors border border-zinc-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      EXPLORE FULL PATHWAYS <ChevronRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SUBJECT HUB */}
            {activeTab === 'subject' && (
              <motion.div
                key="subject"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <SubjectHub
                  subjects={subjects}
                  onToggleTopic={handleToggleTopic}
                  onNotify={(msg, isErr) => showNotification(msg, isErr)}
                />
              </motion.div>
            )}

            {/* TAB: STUDY PLANNER */}
            {activeTab === 'planner' && (
              <motion.div
                key="planner"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <StudyPlanner onNotify={(msg, isErr) => showNotification(msg, isErr)} />
              </motion.div>
            )}

            {/* TAB: J.A.R.V.I.S. DIAGNOSTICS */}
            {activeTab === 'jarvis' && (
              <motion.div
                key="jarvis"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="max-w-5xl mx-auto text-left"
              >
                <JarvisDiagnostics 
                  student={student} 
                  setStudent={setStudent} 
                  subjects={subjects} 
                  setSubjects={setSubjects} 
                  showNotification={showNotification} 
                />
              </motion.div>
            )}

            {/* TAB: AI CHATBOT */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="max-w-4xl mx-auto h-[78vh] flex flex-col justify-between text-left space-y-6"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">J.A.R.V.I.S. QUANTUM SYNAPSE CONNECTOR</span>
                  <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" /> J.A.R.V.I.S. Core Intelligence
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Stark Industries cognitive node. Clarify postgraduate MCA heuristics, configure exam-ready test parameters, or map optimal query execution structures.</p>
                </div>

                {/* Configuration Row */}
                <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Subject context:</span>
                    <select
                      value={chatSubject}
                      onChange={(e) => setChatSubject(e.target.value)}
                      className="bg-zinc-900 border border-zinc-801 text-xs text-zinc-300 rounded-lg px-3 py-1.5 focus:border-cyan-500 font-bold cursor-pointer"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Placement Heuristics">Placement readiness</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Marks Blueprint:</span>
                    <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                      {(['General', '2 Marks', '5 Marks', '16 Marks'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMarksMode(m)}
                          className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-md transition-all cursor-pointer focus:outline-none ${
                            marksMode === m ? 'bg-cyan-600 text-black shadow-2xs font-bold' : 'text-zinc-500 hover:text-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Chat Interface */}
                <div className="flex-1 bg-[#0a0f18]/60 border border-zinc-900 rounded-3xl overflow-hidden flex flex-col justify-between min-h-[300px]">
                  {/* Chat scrolls messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 md:p-5 rounded-2xl max-w-[85%] border leading-relaxed text-xs md:text-sm text-left ${
                          msg.role === 'user'
                            ? 'bg-purple-950/30 border-purple-502 text-purple-100 rounded-tr-none'
                            : 'bg-zinc-904/70 border-zinc-900 text-zinc-200 rounded-tl-none'
                        }`}>
                          {msg.role === 'model' ? (
                            <div className="markdown-body prose text-xs md:text-sm leading-relaxed max-w-none prose-invert select-text">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <span className="font-semibold select-text">{msg.content}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs animate-pulse font-bold pl-2 pb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>J.A.R.V.I.S. is parsing Stark databases and formulating structured schemas...</span>
                      </div>
                    )}
                  </div>

                  {/* Audio microphone Waveform if recording */}
                  {isRecording && (
                    <div className="px-5 py-3.5 bg-cyan-950/30 border-t border-cyan-805 flex items-center justify-between text-xs text-cyan-301 animate-pulse font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block animate-ping"></span>
                        <span>[TRANSCEIVER_ACTIVE] Listening: formulate page walks...</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-1 h-3.5 bg-cyan-400 inline-block animate-[bounce_0.8s_infinite]"></span>
                        <span className="w-1 h-5 bg-cyan-400 inline-block animate-[bounce_1.2s_infinite]"></span>
                        <span className="w-1 h-2 bg-cyan-400 inline-block animate-[bounce_0.5s_infinite]"></span>
                      </div>
                    </div>
                  )}

                  {/* Quick Prompts */}
                  <div className="px-5 py-3 border-t bg-zinc-950/50 flex flex-wrap gap-2 items-center select-none">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block grow-0 shrink-0">Triggers:</span>
                    {[
                      'Define Semaphores deadlock.',
                      'Differentiate ER diagram vs relational schema.',
                      'Formulate Dijkstra logic.',
                      'Explain Beladys Anomaly.'
                    ].map((trig) => (
                      <button
                        key={trig}
                        onClick={() => sendMessage(trig)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-cyan-950 border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer focus:outline-none font-bold"
                      >
                        {trig}
                      </button>
                    ))}
                  </div>

                  {/* Input form panel */}
                  <div className="p-4.5 border-t border-zinc-900 bg-zinc-950/60 flex gap-2.5 items-center">
                    <input
                      type="text"
                      placeholder="Ask J.A.R.V.I.S. your academic query (e.g., How does indexing speed up dynamic DBMS query constraints?)..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
                      className="flex-1 px-4 py-3 bg-zinc-909 border border-zinc-805 rounded-xl text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-amber-500 shadow-inner font-semibold"
                    />

                    <button
                      onClick={handleVoiceInputMock}
                      className={`p-3 border rounded-xl transition-all cursor-pointer focus:outline-none ${
                        isRecording 
                          ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                          : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                      title="Simulate Voice Input"
                    >
                      <Mic className="w-4.5 h-4.5 shrink-0" />
                    </button>

                    <button
                      onClick={() => sendMessage(chatInput)}
                      disabled={isChatLoading || !chatInput.trim()}
                      className="px-5 py-3 bg-amber-600 hover:bg-amber-550 disabled:opacity-30 text-black font-display font-black text-xs tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 uppercase cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                    >
                      <Send className="w-3.5 h-3.5" /> Consult JARVIS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: ACADEMIC NOTES & UNIVERSITY PAPERS */}
            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="max-w-4xl mx-auto text-left space-y-6"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#94a3b8] uppercase font-bold">COURSE NOTES SYNTHESIS</span>
                  <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-cyan-401 shrink-0" /> AI Notes & Lecture Summarizer
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Compile comprehensive examination study packs, structured diagram manuals, and formulas lists with Gemini.</p>
                </div>

                <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest block pl-0.5">Pick Course Category</label>
                      <select
                        value={notesSubject}
                        onChange={(e) => setNotesSubject(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-350 rounded-xl px-4 py-3 outline-none focus:border-cyan-502 font-extrabold cursor-pointer h-[46px]"
                      >
                        {subjects.map((s) => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest block pl-0.5">Notes format output specs</label>
                      <select
                        value={notesFormat}
                        onChange={(e) => setNotesFormat(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-801 text-xs text-zinc-350 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-502 font-extrabold cursor-pointer h-[46px]"
                      >
                        <option value="Detailed Study Guide">Comprehensive academic slide guide</option>
                        <option value="Short Notes">Brief Concept Summaries (2M references)</option>
                        <option value="Revision Notes">Revision cheatsheets and formulas</option>
                        <option value="Exhaustive 16-Mark Answer Layout">PG level Exhaustive 16-Mark layouts</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2.5 items-center">
                    <div className="col-span-12 md:col-span-8 flex flex-col space-y-1">
                      <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest block pl-0.5">Specific Topic Title</label>
                      <input
                        type="text"
                        placeholder="E.g., Virtual memory page faults, Deadlock Bankers algorithm..."
                        value={notesQuery}
                        onChange={(e) => setNotesQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-909 border border-zinc-805 rounded-xl text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-cyan-500 shadow-inner font-semibold"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4 mt-5">
                      <button
                        onClick={handleGenerateNotes}
                        disabled={isNotesLoading || !notesQuery.trim()}
                        className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-555 disabled:opacity-30 text-black font-display font-black text-xs tracking-wider rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer h-[46px]"
                      >
                        <Sparkles className="w-4 h-4 text-black" />
                        Compile Lecture slide
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes Output view block */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-6.5 min-h-[250px] relative">
                  {isNotesLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-cyan-401 font-mono text-center gap-3 animate-pulse select-none">
                      <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                      <span>STRUCTURING SYLLABUS DIRECTIVES WITH PROFESSOR AGENT...</span>
                    </div>
                  ) : notesResult ? (
                    <div className="prose text-zinc-300 text-left max-w-none space-y-3 font-sans select-text">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-900 select-none">
                        <span className="flex items-center gap-1.5 text-cyan-401 font-mono font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> SYLLABUS LECTURE CHEATSHEET
                        </span>
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#94a3b8] hover:text-white rounded text-[10px] font-mono cursor-pointer"
                        >
                          Print notes
                        </button>
                      </div>
                      <div className="text-xs md:text-sm select-text text-left max-w-none prose prose-invert">
                        <ReactMarkdown>{notesResult}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-600 text-center space-y-2 select-none">
                      <FileText className="w-12 h-12 text-zinc-750" />
                      <p className="italic font-mono text-[10px]">No active notes parsed. Fill specific topics above to compile slide guides.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: PDF SUMMARIZER */}
            {activeTab === 'summarizer' && (
              <motion.div
                key="summarizer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <PdfSummarizer onNotify={(msg, isErr) => showNotification(msg, isErr)} />
              </motion.div>
            )}

            {/* TAB: FLASHCARD GENERATOR */}
            {activeTab === 'flashcard' && (
              <motion.div
                key="flashcard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <FlashcardGenerator onNotify={(msg, isErr) => showNotification(msg, isErr)} />
              </motion.div>
            )}

            {/* TAB: COMPILER PLAYGROUND */}
            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <CodingPractice onNotify={(msg, isErr) => showNotification(msg, isErr)} />
              </motion.div>
            )}

            {/* TAB: EXAM QUIZ SYSTEM */}
            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <QuizSystem
                  subjects={subjects}
                  pastQuizzes={pastQuizzes}
                  onAddPastQuiz={handleAddPastQuiz}
                  onAddXp={handleAddXp}
                  onNotify={(msg, isErr) => showNotification(msg, isErr)}
                />
              </motion.div>
            )}

            {/* TAB: PLACEMENT CAREER ADVISOR */}
            {activeTab === 'advisor' && (
              <motion.div
                key="advisor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="max-w-4xl mx-auto text-left space-y-6"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#94a3b8] uppercase font-bold">CAREER DYNAMICS ROADMAP</span>
                  <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-cyan-401 shrink-0" /> AI Career Advisor & Placements Hub
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">Plot customized milestones matching popular recruitment trends, analyze aptitude evaluations, or study the HR Interviewing catalog below.</p>
                </div>

                {/* Preference setup block */}
                <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest block pl-0.5">Core Specifications Interest</label>
                      <textarea
                        rows={2}
                        value={prefsInput}
                        onChange={(e) => setPrefsInput(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-909 border border-zinc-805 rounded-xl text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-cyan-502 font-medium resize-none shadow-inner"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest block pl-0.5">Active technical expertise list</label>
                      <textarea
                        rows={2}
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-909 border border-zinc-805 rounded-xl text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-cyan-502 font-medium resize-none shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateJobMap}
                    disabled={isGuidanceLoading || !prefsInput.trim() || !skillsInput.trim()}
                    className="w-full py-4.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-30 rounded-2xl text-xs font-display font-black tracking-wide uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    CREATE TAILORED PLACEMENT VECTOR ROADMAP
                  </button>
                </div>

                {/* Advisor Response screen */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-6.5 min-h-[220px]">
                  {isGuidanceLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-cyan-401 font-mono text-center gap-3 animate-pulse select-none">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      <span>COMPLETING RECRUITMENT ANALYSIS MATRIX WITH GEMINI...</span>
                    </div>
                  ) : careerResult ? (
                    <div className="prose text-zinc-300 text-left max-w-none space-y-3 font-sans select-text">
                      <div className="flex items-center gap-1.5 text-cyan-401 font-mono font-bold text-[10px] uppercase pb-2 border-b border-zinc-900 select-none">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> TAILORED INDUSTRY RECRUITMENT ROADMAP
                      </div>
                      <div className="text-xs md:text-sm select-text text-left max-w-none prose prose-invert">
                        <ReactMarkdown>{careerResult}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {careerGuidelines.map((car, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/40 border border-zinc-850/70 rounded-2xl flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="text-[8px] bg-cyan-950 text-cyan-401 border border-cyan-500/25 font-mono px-2 py-0.5 rounded uppercase font-bold inline-block">DEMAND: {car.demand}</span>
                            <h4 className="text-sm font-display font-black text-white">{car.title}</h4>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{car.description}</p>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-zinc-800 text-[10.5px] font-mono text-cyan-401 font-bold">
                            Avg Salary: {car.avgSalary}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub: HR Interview Preparation Catalog */}
                <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-display font-black text-[15px] text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span>Postgraduate HR Interviewing Catalog</span>
                  </h3>
                  <div className="space-y-4">
                    {hrInterviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2 text-left">
                        <h4 className="text-xs font-bold text-zinc-200">Q: {q.question}</h4>
                        <div className="p-3 bg-zinc-900/50 border border-zinc-801 rounded text-[11px] font-medium leading-relaxed text-zinc-400">
                          <strong className="text-purple-300 block mb-0.5 font-sans">• Recommended Strategy:</strong> {q.bestApproach}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Aptitude evaluation challenge */}
                <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-display font-black text-[15px] text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span>Interactive Aptitude Diagnostic Unit</span>
                  </h3>

                  <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl text-left space-y-4.5">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-550 border-b border-zinc-900/40 pb-2">
                      <span className="font-bold flex items-center gap-1">CATEGORY: {currentApt.category}</span>
                      <span>TOPIC: {currentApt.topic}</span>
                    </div>

                    <p className="text-xs font-bold text-zinc-200">{currentApt.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentApt.options.map((opt, i) => {
                        const isSelected = selectedAptOptionIdx === i;
                        const isAnswerCorrect = currentApt.answerIndex === i;

                        let optBtnStyle = 'bg-zinc-909 border-zinc-801 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900';
                        if (isSelected) {
                          optBtnStyle = 'bg-cyan-950/30 border-cyan-502 text-cyan-300 font-bold';
                        }
                        if (isAptSubmitted) {
                          if (isAnswerCorrect) {
                            optBtnStyle = 'bg-emerald-950 border-emerald-505 text-emerald-300 font-bold';
                          } else if (isSelected) {
                            optBtnStyle = 'bg-rose-955 border-rose-505 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (!isAptSubmitted) setSelectedAptOptionIdx(i);
                            }}
                            disabled={isAptSubmitted}
                            className={`p-3 rounded-lg border text-xs text-left transition-all ${optBtnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAptSubmitted && (
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-[11px] leading-relaxed text-zinc-400 font-medium">
                        <strong className="text-cyan-422 block mb-0.5">• Expert solution breakdown:</strong> {currentApt.explanation}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 mt-4 border-t border-zinc-900/40">
                      <button
                        onClick={() => {
                          setSelectedAptOptionIdx(null);
                          setIsAptSubmitted(false);
                          setActiveAptitudeIdx((prev) => (prev + 1) % aptitudeQuestions.length);
                        }}
                        className="px-4.5 py-2 hover:bg-zinc-900 border border-zinc-801 text-zinc-400 hover:text-white rounded text-[10px] font-mono cursor-pointer uppercase transition-colors"
                      >
                        Next Diagnostic
                      </button>

                      {!isAptSubmitted ? (
                        <button
                          onClick={() => {
                            if (selectedAptOptionIdx === null) {
                              showNotification('Please pick an answer option first.', true);
                              return;
                            }
                            setIsAptSubmitted(true);
                            if (selectedAptOptionIdx === currentApt.answerIndex) {
                              showNotification('Correct! +30 focus points added.');
                              handleAddXp(30);
                            } else {
                              showNotification('Incorrect option. Study the breakdown.', true);
                            }
                          }}
                          className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-display font-black text-[10px] rounded tracking-wide uppercase transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
                        >
                          Verify Answer
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-550 font-bold select-none">[DIAGNOSTIC_SUBMITTED]</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: ATS CV BUILDER */}
            {activeTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <ResumeBuilder onNotify={(msg, isErr) => showNotification(msg, isErr)} />
              </motion.div>
            )}

            {/* TAB: EXAM PYQS */}
            {activeTab === 'pyq' && (
              <motion.div
                key="pyq"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="max-w-4xl mx-auto text-left space-y-6 animate-fade-in"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#94a3b8] uppercase font-bold">REPEATED QUESTIONS ARCHIVE</span>
                  <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-cyan-400 shrink-0" /> University Past Years repeated Questions (PYQs)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Review top repeated questions filtered by marks classifications from postgraduate tests.</p>
                </div>

                <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search boxes */}
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search questions or keyword..."
                        value={pyqSearch}
                        onChange={(e) => setPyqSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-801 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-cyan-502 rounded-xl"
                      />
                    </div>

                    {/* Cat filters */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block shrink-0">Filter:</span>
                      <select
                        value={pyqFilterSub}
                        onChange={(e) => setPyqFilterSub(e.target.value)}
                        className="bg-zinc-950 border border-zinc-801 text-xs text-zinc-300 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-502 font-bold cursor-pointer w-full sm:w-56"
                      >
                        <option value="all">Display All Subjects PYQs</option>
                        <option value="ds">Data Structures</option>
                        <option value="dbms">Relational DBMS</option>
                        <option value="os">Operating Systems</option>
                      </select>
                    </div>
                  </div>

                  {/* List of pyqs */}
                  <div className="space-y-4 pt-3">
                    {filteredPyqs.length > 0 ? (
                      filteredPyqs.map((item, idx) => (
                        <div key={idx} className="p-5 bg-zinc-900/40 border border-zinc-850 rounded-2xl text-left space-y-3 hover:border-zinc-700 transition-all">
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-cyan-950 text-cyan-401 border border-cyan-500/25 font-mono px-2 py-0.5 rounded font-bold uppercase">{item.subjectId === 'ds' ? 'Data Structures' : item.subjectId === 'dbms' ? 'Database Mgmt' : 'Operating Systems'}</span>
                              <span className="text-[9px] bg-purple-950 text-purple-400 border border-purple-855 font-mono px-2 py-0.5 rounded font-bold uppercase">{item.marks} Marks Category</span>
                            </div>

                            <span className="text-[9px] font-mono text-rose-453 font-bold uppercase tracking-widest animate-pulse border border-rose-900 bg-rose-950/20 px-2.5 py-0.5 rounded-full">★ Repeated {item.repeatedTimes} Times</span>
                          </div>

                          <h4 className="text-sm font-display font-bold leading-relaxed text-zinc-100 select-text">{item.question}</h4>

                          <div className="p-4 bg-zinc-950 border border-zinc-901 rounded-xl text-xs text-zinc-350 select-text leading-relaxed font-sans">
                            <strong className="text-cyan-401 pl-0.5 inline-block mb-1 font-mono uppercase text-[9px] tracking-widest block select-none">• Expert Answer Hint Outline:</strong>
                            <p className="select-text">{item.answerHint}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-550 italic font-mono select-none">No repeated examination questions found matching search schemas.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating status footers */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/40 backdrop-blur-md py-6 text-center text-[10px] text-zinc-550 select-none">
        <p className="font-mono tracking-widest uppercase font-bold text-[#94a3b8]/90">MCA Nexus AI Core OS • System active under standard PG-G12 Guidelines</p>
      </footer>
    </div>
  );
}
