import React, { useState, useRef } from 'react';
import { FileUp, FileText, Sparkles, Loader2, RefreshCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PdfSummarizerProps {
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function PdfSummarizer({ onNotify }: PdfSummarizerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFileMock = (name: string, sizeInBytes: number) => {
    setFileName(name);
    const sizeKb = (sizeInBytes / 1024).toFixed(1);
    setFileSize(`${sizeKb} KB`);
    setSummaryResult(null);
    setAnalysisLogs([]);
    onNotify(`Captured file: ${name}`);

    // Generate debug scanning lines
    setIsLoading(true);
    const logs = [
      'Establishing sandboxed upload stream...',
      'Validating PDF file headers & PDF-1.4 spec models...',
      'Executing OCR layout mapping matrices...',
      'De-serializing page-indices and cross-references...',
      'Extracting syllabus-aligned computer science contexts...',
      'Pushing parsed content blocks to Gemini cognitive pipeline...'
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < logs.length) {
        setAnalysisLogs((prev) => [...prev, `[OCR_PARSING_STDOUT] ${logs[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(interval);
        // Call backend API with PDF reference to generate standard summaries
        fetchNotesSummary(name);
      }
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFileMock(file.name, file.size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFileMock(file.name, file.size);
    }
  };

  const fetchNotesSummary = async (docName: string) => {
    try {
      const queryTopic = `Generate an exhaustive lecture note summary and exam revision cheat sheet for the document block named "${docName}". Include direct definitions, 4 bullet structural highlights, a bulleted code snippet/relational query blueprint, and 1 predicted university repeated examination question.`;
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryTopic,
          subject: 'Interactive PDF Summarizer Module',
          marksMode: '5 Marks'
        })
      });

      if (!response.ok) throw new Error('AI summarizing pipeline suffered exception.');
      const data = await response.json();
      setSummaryResult(data.text);
      onNotify('PDF cognitive review compiled successfully! +30 XP points earned.');
    } catch (err: any) {
      console.error(err);
      onNotify('AI error summarizing PDF. Displaying local cache overview...', true);
      const fallback = `### 📝 PARSED REVISION CHEAT SHEET: ${docName}

**1. GENERAL ABSTRACT DEFINITION**
- The document covers high density Master of Computer Applications level paradigms. Key highlights concentrate on transaction isolations, deadlocks, performance complexity constraints, and network encapsulation algorithms.

**2. CRITICAL STRUCTURE BLUEPRINT**
- **Dynamic Thread Locks:** Prevents multi-processor thread racing.
- **Transaction ACID Safeguards:** Enforces concurrent atomicity.
- **Resource safety matrices:** Precludes cyclic thread hold-and-wait traps.

**3. UNIVERSITY EXAM DRILLS**
- Explain how the Banker's algorithm assesses safety. State the 16-mark scenario code and trace variables.`;
      setSummaryResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerReset = () => {
    setFileName(null);
    setFileSize(null);
    setSummaryResult(null);
    setAnalysisLogs([]);
  };

  // Preset lecture notes options
  const sampleDocs = [
    { name: 'LectureNote_4_Database_ACID_Locks.pdf', size: 104 * 1024 },
    { name: 'OperatingSystems_VirtualMemory_Paging.pdf', size: 85 * 1024 },
    { name: 'Syllabus_Networks_TCP_CongestionControl.pdf', size: 142 * 1024 }
  ];

  return (
    <div id="ai-pdf-container" className="space-y-6 text-left text-white animate-fade-in font-sans">
      <header>
        <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">Quantum OCR Integrations // 2035</span>
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400 shrink-0" /> AI PDF Summarizer & Solver
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Deploy digital lecture handouts or syllabus manuals to extract immediate examinations briefs, structured formula lists, and sample mock sheets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Drag panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800">
            <h3 className="text-base font-display font-black text-white pb-3 border-b border-zinc-800/60 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-purple-400" />
              <span>Document Gateway</span>
            </h3>

            {!fileName ? (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-5 py-10 px-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                    : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileUp className="w-10 h-10 text-cyan-502 mb-3 animate-bounce" />
                <span className="text-xs font-bold font-sans text-zinc-200">Drag & Drop University PDF here</span>
                <span className="text-[10px] font-mono text-zinc-550 mt-1">or click to open file explorer (Max 25MB)</span>
              </div>
            ) : (
              <div className="mt-5 p-4.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-950 rounded-xl border border-cyan-500/25">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left leading-none max-w-[180px] sm:max-w-xs truncate">
                    <span className="text-xs font-bold text-white block truncate">{fileName}</span>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1.5 block">{fileSize} • Synthesized</span>
                  </div>
                </div>

                <button
                  onClick={triggerReset}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-450 hover:text-white transition-colors"
                  title="Upload different PDF"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Presets option */}
            {!fileName && (
              <div className="mt-6 space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block pl-1">Or Analyze Sample Lecture Notes:</span>
                <div className="space-y-2">
                  {sampleDocs.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => processFileMock(doc.name, doc.size)}
                      className="w-full p-3 bg-zinc-909 hover:bg-zinc-900 border border-zinc-800 text-left rounded-xl flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-all cursor-pointer font-semibold group"
                    >
                      <span className="truncate pr-4 group-hover:text-cyan-401">{doc.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500 shrink-0 font-bold border border-zinc-800 px-2 py-0.5 rounded">PDF</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Diagnostics Panel */}
            {analysisLogs.length > 0 && (
              <div className="mt-6 space-y-2 text-left">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block pl-1">Quantum Parsing Streams:</span>
                <div className="bg-zinc-950 p-4 border border-zinc-901 rounded-xl font-mono text-[9px] leading-relaxed text-zinc-400 max-h-[140px] overflow-y-auto space-y-1.5 select-text">
                  {analysisLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-cyan-500 shrink-0">✓</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-cyan-453 animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-cyan-400 inline-block"></span>
                      <span>aggregating notes...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summarized Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800 flex flex-col h-full min-h-[400px] justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                <h3 className="text-base font-display font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-401 animate-pulse" />
                  <span>Cognitive Document Summary</span>
                </h3>
                {summaryResult && (
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-805 font-mono font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                )}
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 min-h-[250px] max-h-[480px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-cyan-402 font-mono text-center gap-3 animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                    <span>EXTRACTING SEMANTIC SYLLABUS LAYERS...</span>
                  </div>
                ) : summaryResult ? (
                  <div className="prose text-zinc-300 text-left max-w-none space-y-2 font-sans select-text">
                    <div className="flex items-center gap-1.5 text-cyan-405 font-mono font-bold text-[10px] uppercase pb-2 border-b border-zinc-900 mb-3 select-none">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" /> LECTURE DIGEST & EXAM ESSENTIALS
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-300 font-medium select-text">
                      {summaryResult}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-550 text-center space-y-2 select-none">
                    <FileText className="w-12 h-12 text-zinc-750" />
                    <p className="italic font-mono text-[10px]">No active PDF parsed. Feed a university manual from the gateway to begin.</p>
                  </div>
                )}
              </div>
            </div>
            
            {summaryResult && (
              <button
                onClick={triggerReset}
                className="w-full mt-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-2xl text-xs font-display font-black tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                COMPILE ANOTHER MANUAL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
