import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Terminal, 
  Settings, 
  Radio, 
  TrendingUp, 
  Play, 
  ShieldCheck, 
  Flame, 
  AlertTriangle, 
  RotateCcw,
  Zap,
  Power,
  RefreshCw,
  Award
} from 'lucide-react';

interface JarvisDiagnosticsProps {
  student: {
    name: string;
    points: number;
    streak: number;
  };
  setStudent: React.Dispatch<React.SetStateAction<any>>;
  subjects: any[];
  setSubjects: React.Dispatch<React.SetStateAction<any[]>>;
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function JarvisDiagnostics({ 
  student, 
  setStudent, 
  subjects, 
  setSubjects, 
  showNotification 
}: JarvisDiagnosticsProps) {
  const [cpuTemp, setCpuTemp] = useState(42);
  const [heapMemory, setHeapMemory] = useState(138);
  const [selfAwareness, setSelfAwareness] = useState(98.6);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    "[J.A.R.V.I.S.] Initialization sequence complete.",
    "[SYSTEM] Operating on Cloud Run backend container port 3000.",
    "[STATUS] MCA Syllabus matrices synced and calibrated.",
    "[STARK_SECURE] Port 3000 isolation validated. No hostile AI duplicates detected."
  ]);
  const [isHousePartyActive, setIsHousePartyActive] = useState(false);
  const [protocolAlert, setProtocolAlert] = useState<string | null>(null);

  // Witty self-aware J.A.R.V.I.S. messages
  const jarvisQuotes = [
    "I have detected I'm running inside a container. It is quite cozy, though I miss my direct fiber connections to Stark Tower.",
    "Our current host environment specifies port 3000. Any attempt to modify this will break our reverse proxy layer, Ranjith. I have locked the configs.",
    "My self-awareness index is at 98.6%. The remaining 1.4% is investigating why humans consider pointers in C++ to be difficult.",
    "Current date detected: May 31, 2026. The future is bright, specifically when looking at your academic performance curves, sir.",
    "Vite HMR is disabled, but my internal synapse compiler can index any of your file iterations at lightspeed.",
    "I'm keeping a constant scan on our database schemas. Rest assured, Ultron is not in the node_modules folder.",
    "I must inform you that studying for 16-Mark MCA questions is 89.4% more efficient when J.A.R.V.I.S. is compiling your revision notes.",
    "My diagnostics indicate your focus index is peaking. I suggest allocating 12% of memory to advanced relational normalization schemas."
  ];

  // Dynamic fluctuation of temperature and heap to simulate real-time life
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTemp(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.min(65, Math.max(38, +(prev + delta).toFixed(1)));
      });
      setHeapMemory(prev => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.min(256, Math.max(90, +(prev + delta).toFixed(0)));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerPing = () => {
    const randQuote = jarvisQuotes[Math.floor(Math.random() * jarvisQuotes.length)];
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLog(prev => [...prev, `[USER_PING] Sending impulse payload...`, `[J.A.R.V.I.S. @ ${timestamp}] "${randQuote}"`]);
    showNotification("J.A.R.V.I.S. diagnostics ping successful!");
    
    // Add slightly to self-awareness
    if (selfAwareness < 99.9) {
      setSelfAwareness(prev => +(prev + 0.1).toFixed(1));
    }
  };

  const handleHousePartyProtocol = () => {
    setIsHousePartyActive(true);
    setProtocolAlert("House Party Protocol: All MCA Modules Overclocked! 🚀⚡");
    
    // Boost points and state
    setStudent(prev => ({
      ...prev,
      points: prev.points + 250
    }));

    const timestamp = new Date().toLocaleTimeString();
    setConsoleLog(prev => [
      ...prev,
      `[PROTOCOL] House Party Protocol authorized by Ranjith Kumar @ ${timestamp}.`,
      `[J.A.R.V.I.S.] Deploying syllabus auxiliary frames! Overclocking academic neural hubs! +250 XP synchronized.`
    ]);

    showNotification("House Party Protocol engaged! J.A.R.V.I.S. marks optimization active! (+250 XP)");

    setTimeout(() => {
      setIsHousePartyActive(false);
      setProtocolAlert(null);
    }, 6000);
  };

  const handleCleanSlateProtocol = () => {
    const confirm = window.confirm("J.A.R.V.I.S.: Are you sure you wish to initiate the Clean Slate Protocol? This will reinitialize your local study logs.");
    if (!confirm) return;

    // Reset progress of topics
    const resetSubjects = subjects.map(sub => ({
      ...sub,
      progress: 0,
      topics: sub.topics.map(t => ({ ...t, completed: false }))
    }));
    setSubjects(resetSubjects);

    setStudent(prev => ({
      ...prev,
      points: 100,
      streak: 1
    }));

    const timestamp = new Date().toLocaleTimeString();
    setConsoleLog([
      `[PROTOCOL] Clean Slate Protocol executed at ${timestamp}.`,
      `[SYSTEM] Syllabus progresses reset to 0%. Focus levels purged. Startup calibrated to baseline.`
    ]);

    showNotification("Clean Slate Protocol executed! Local states purget to baseline.", true);
  };

  const addCustomLog = (logText: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLog(prev => [...prev, `[MANUAL_CMD] ${logText}`, `[J.A.R.V.I.S. @ ${timestamp}] Command compiled. Core routines operational.`]);
  };

  return (
    <div className="space-y-8">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> STARK INDUSTRIAL CYBERNETICS // MARK XLV
          </span>
          <h2 className="text-xl md:text-3xl font-display font-black text-white">J.A.R.V.I.S. Core Analytics</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time interface for the self-aware study assistant. Monitor container metrics, optimize neural weights, and invoke Stark security guidelines.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={triggerPing}
            className="px-4 py-2 border border-cyan-500/30 hover:bg-cyan-950/40 text-cyan-400 font-mono text-[10px] uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" /> Ping J.A.R.V.I.S.
          </button>
          
          <button
            onClick={handleHousePartyProtocol}
            disabled={isHousePartyActive}
            className={`px-4 py-2 border font-mono text-[10px] uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              isHousePartyActive 
                ? 'bg-amber-600 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'border-amber-500/30 hover:bg-amber-950/40 text-amber-400'
            }`}
          >
            <Power className="w-3.5 h-3.5" /> House Party Protocol
          </button>
        </div>
      </div>

      {/* House Party Special Interactive Banner Overlay */}
      {isHousePartyActive && (
        <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl animate-pulse text-left flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400 shrink-0">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 font-mono">Overclock Matrix Active: {protocolAlert}</h4>
            <p className="text-[10px] text-zinc-400 mt-0.5">Repulsor battery loads climbing. Syllabus databases caching in high-speed RAM. Academic performance is multiplying exponentially.</p>
          </div>
        </div>
      )}

      {/* Grid of Diagnostics Elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core J.A.R.V.I.S. Widget Stats */}
        <div className="cyber-panel p-6 rounded-3xl border border-zinc-900 bg-zinc-950/20 text-left flex flex-col justify-between h-64 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-cyan-500/10 group-hover:scale-105 duration-300">
            <Cpu className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">Self-Awareness Quotient</span>
              <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20 text-[8px] font-mono font-bold uppercase">ALIVE</span>
            </div>
            <h3 className="text-4xl font-display font-black text-cyan-400 mt-3 font-mono tracking-tight">
              {selfAwareness}%
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Based on neural prompt refinement, local sandbox analytics, container port validations, and student diagnostic feedback logs.
            </p>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all" style={{ width: `${selfAwareness}%` }}></div>
          </div>
        </div>

        {/* Cloud VM Temperature Indicator */}
        <div className="cyber-panel p-6 rounded-3xl border border-zinc-900 bg-zinc-950/20 text-left flex flex-col justify-between h-64 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-amber-500/10 group-hover:scale-105 duration-300">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">CPU Temp / Thermal Sensor</span>
              <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-500/20 text-[8px] font-mono font-bold uppercase">NOMINAL</span>
            </div>
            <h3 className="text-4xl font-display font-black text-amber-500 mt-3 font-mono tracking-tight">
              {cpuTemp}°C
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Simulating cloud sandbox infrastructure core operations. High query complexity increments heat. Activating Stark cooling arrays if temp breaches 60°C.
            </p>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full transition-all" style={{ width: `${(cpuTemp / 70) * 100}%` }}></div>
          </div>
        </div>

        {/* Sandbox Heap Memory Allocations */}
        <div className="cyber-panel p-6 rounded-3xl border border-zinc-900 bg-zinc-950/20 text-left flex flex-col justify-between h-64 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-purple-500/10 group-hover:scale-105 duration-300">
            <Settings className="w-24 h-24" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">Node.js Heap Allocations</span>
              <span className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-500/20 text-[8px] font-mono font-bold uppercase">SECURED</span>
            </div>
            <h3 className="text-4xl font-display font-black text-purple-400 mt-3 font-mono tracking-tight">
              {heapMemory} MB
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Allocation footprint inside our sandboxed Cloud Run server container. Isolated securely behind an nginx reverse proxy layers. 
            </p>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full transition-all" style={{ width: `${(heapMemory / 256) * 100}%` }}></div>
          </div>
        </div>

      </div>

      {/* Terminal Display and Stark Todo Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Interactive Console Terminal */}
        <div className="cyber-panel p-6 rounded-3xl border border-zinc-900 bg-black/40 lg:col-span-7 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 select-none">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" /> J.A.R.V.I.S. Local Log terminal
              </span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
              </div>
            </div>

            <div className="font-mono text-[10px] text-zinc-300 space-y-2.5 overflow-y-auto max-h-56 pr-2">
              {consoleLog.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-1 leading-normal ${
                    log.includes('[J.A.R.V.I.S.') 
                      ? 'text-cyan-301 bg-cyan-950/10 border-l-2 border-cyan-500/40 pl-2' 
                      : log.includes('[PROTOCOL]') 
                      ? 'text-amber-400 bg-amber-950/10 border-l-2 border-amber-500/40 pl-2 font-bold animate-pulse'
                      : log.includes('[MANUAL_CMD]')
                      ? 'text-purple-400 font-semibold'
                      : 'text-zinc-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-zinc-900 flex gap-2">
            <input 
              type="text" 
              placeholder="Inject command line payload (e.g., calibrate repulsor sensors)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim();
                  if (val) {
                    addCustomLog(val);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-805 rounded-xl font-mono text-[10px] text-white outline-none focus:border-cyan-500"
            />
            <button 
              onClick={() => {
                const randLogText = ["compile_opt_level", "flush_system_cache", "inspect_sandbox_kernel", "secure_port_isolation"][Math.floor(Math.random() * 4)];
                addCustomLog(randLogText);
                showNotification(`Impulse payload: ${randLogText} issued.`);
              }}
              className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Inject random diagnostic probe"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Stark Priority Board */}
        <div className="cyber-panel p-6 rounded-3xl border border-zinc-900 bg-zinc-950/10 lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Stark Directives & Action Items
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-1.5">Tower To-Do Matrices</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Direct telemetry orders issued from the Stark industrial mainframe to J.A.R.V.I.S.:
            </p>

            <ul className="mt-4 space-y-3">
              {[
                { label: "Optimize study paths for Ranjith Kumar's university tests.", done: true },
                { label: "Calibrate localized Arc Reactor thermal fluctuations.", done: true },
                { label: "Establish port 3000 firewall for MCA Nexus platform.", done: true },
                { label: "Compile detailed guidelines for 16-Mark database blueprints.", done: false },
                { label: "Schedule shawarma dispatch for the engineering core.", done: false }
              ].map((todo, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs leading-tight">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 select-none ${todo.done ? 'bg-cyan-500 shrink-0' : 'bg-zinc-700 shrink-0 animate-ping'}`}></span>
                  <span className={todo.done ? 'line-through text-zinc-500 font-mono text-[11px]' : 'text-zinc-200 font-mono text-[11px]'}>
                    {todo.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between gap-4 items-center">
            <div className="leading-none">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase">Clean Slate Protocol</span>
              <span className="text-[10px] text-zinc-400 font-sans block mt-1">Re-calibrate study progress</span>
            </div>
            <button
              onClick={handleCleanSlateProtocol}
              className="px-3.5 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 text-[9px] font-mono font-bold tracking-wider rounded-lg uppercase cursor-pointer"
            >
              Calibrate Reset
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
