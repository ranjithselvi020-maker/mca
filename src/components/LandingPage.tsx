import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu, Zap, GraduationCap, Flame, ArrowRight, Terminal } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  const steps = [
    'Initializing quantum intelligence core...',
    'Synchronizing MCA university databases...',
    'Injecting syllabus modules for 11 core computer sciences...',
    'Securing cloud run telemetry sandbox...',
    'Establishing neural pathways for GPT feedback...',
    'MCA Nexus OS fully integrated. Ready to deploy.'
  ];

  useEffect(() => {
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < steps.length) {
        setBootLogs((prev) => [...prev, `[SYSTEM_LOG] ${steps[logIndex]}`]);
        setBootProgress((prev) => Math.min(100, prev + 17));
        logIndex++;
      } else {
        clearInterval(interval);
        setBootProgress(100);
        setTimeout(() => setIsBooted(true), 500);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] text-white flex flex-col justify-between overflow-hidden hologram-grid font-sans selection:bg-cyan-500 selection:text-black">
      {/* Visual background lights */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-cyan-550/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-purple-550/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Landing Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-455 uppercase">EST. 2035 // AI COGNITIVE AGENT</span>
            <h1 className="text-base md:text-lg font-display font-black tracking-wider text-white">MCA <span className="text-cyan-400">NEXUS</span> AI</h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 font-mono text-[9px] text-[#94a3b8]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>NEXUSCORE_G-12 STATUS: ACTIVE</span>
          <span className="border-l border-zinc-800 pl-3">PING: 04ms</span>
        </div>
      </header>

      {/* Main Hero & Simulation Panel */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center justify-center w-full">
        {/* Left Core Promo Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-full text-xs font-mono text-cyan-400"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Syllabus-Tuned Cognitive Intelligence Hub</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight"
          >
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              MCA Knowledge OS
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm md:text-base text-zinc-400 max-w-lg leading-relaxed font-sans"
          >
            Unlock pre-graduate cognitive power. Built for Master of Computer Applications students, featuring realcheck syllabus modules, smart interactive code compilation playgrounds, ATS resume engineers, and real-time Gemini exam preparation guidance.
          </motion.p>

          {/* Holographic Diagnostic Terminal Box before App Boots */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="cyber-panel p-5 rounded-2xl border border-zinc-800 max-w-lg w-full relative overflow-hidden"
          >
            {/* Holographic scanning overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#06b6d4]/[0.02] to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900/60 font-mono text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-500" /> core_nexus_boot.sys</span>
              <span>{bootProgress}% SYNCED</span>
            </div>

            <div className="mt-3.5 space-y-1.5 min-h-[96px] max-h-[140px] overflow-y-auto font-mono text-[9px] text-[#94a3b8]/95 select-text text-left">
              {bootLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-cyan-500 shrink-0">✓</span>
                  <span>{log}</span>
                </div>
              ))}
              {bootProgress < 100 && (
                <div className="flex items-center gap-1 text-cyan-400 select-none animate-pulse">
                  <span className="w-1.5 h-3 bg-cyan-400 inline-block"></span>
                  <span>analyzing packets...</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="w-full bg-zinc-905 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-350"
                  style={{ width: `${bootProgress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isBooted ? 1 : 0.2 }}
            transition={{ duration: 0.5 }}
            className="pt-2"
          >
            <button
              onClick={onEnterApp}
              disabled={!isBooted}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-[13px] font-display font-extrabold tracking-wider transition-all hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <span className="flex items-center gap-2">
                LAUNCH MCA NEXUS INTELLIGENCE
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right Pulsing Hologram AI Avatar Column */}
        <div className="lg:col-span-6 flex items-center justify-center w-full relative">
          <div className="absolute w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, type: 'spring' }}
            className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] flex items-center justify-center"
          >
            {/* Spinning Neon Rings */}
            <div className="absolute w-full h-full rounded-full border-2 border-dashed border-cyan-500/20 animate-[spin_50s_linear_infinite]"></div>
            <div className="absolute w-[90%] h-[90%] rounded-full border border-purple-500/20 animate-[spin_30s_linear_infinite_reverse]"></div>
            <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-cyan-400/10 animate-[spin_10s_linear_infinite]"></div>
            
            {/* Floating Particle Accents */}
            <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-cyan-422 rounded-full shadow-[0_0_12px_#06b6d4] animate-bounce"></div>
            <div className="absolute bottom-[15%] right-[10%] w-3 h-3 bg-purple-422 rounded-full shadow-[0_0_12px_#bc13fe] animate-pulse"></div>
            <div className="absolute bottom-[10%] left-[10%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6] animate-bounce"></div>

            {/* Pulsating Glass Core Avatar representing the quantum AI agent */}
            <div className="cyber-glass w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full flex flex-col items-center justify-center border border-white/10 shadow-[inner_0_0_40px_rgba(255,255,255,0.05),0_0_80px_rgba(139,92,246,0.15)] relative ai-pulse-glow">
              {/* Inner animated circuit lines */}
              <div className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
                <GraduationCap className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
              </div>

              {/* Scrolling Matrix elements */}
              <div className="absolute bottom-5 font-mono text-[8px] text-purple-400 uppercase tracking-widest font-black animate-pulse">
                NEX_SYS_v4.5
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Landing Statistics Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/70 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {[
            { metric: '100% COMPLETE', caption: 'Syllabus Coverage', icon: <GraduationCap className="text-cyan-400 w-4 h-4" /> },
            { metric: '9+ ACADEMICS', caption: 'Expert Subjects mapped', icon: <Cpu className="text-purple-400 w-4 h-4" /> },
            { metric: '840+ XP EARNED', caption: 'Personal Streak Rank', icon: <Flame className="text-amber-500 w-4 h-4" /> },
            { metric: 'SECURE CLOUD API', caption: 'Quantum SSL Architecture', icon: <Shield className="text-emerald-400 w-4 h-4" /> }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1.5 flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                {stat.icon}
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">{stat.caption}</span>
                <span className="text-sm font-display font-black text-white mt-1.5 block tracking-wide">{stat.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
