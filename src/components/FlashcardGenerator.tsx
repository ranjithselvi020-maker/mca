import React, { useState } from 'react';
import { Layers, Sparkles, Loader2, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardGeneratorProps {
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function FlashcardGenerator({ onNotify }: FlashcardGeneratorProps) {
  const [topicInput, setTopicInput] = useState('Operating Systems Paging and Thrashing');
  const [cards, setCards] = useState<Flashcard[]>([
    { question: 'What is Thrashing in Memory management?', answer: 'Thrashing is a scenario where the CPU spends more time swapping pages in and out of virtual store than executing active processes, causing throughput to crash near zero.' },
    { question: 'Differentiate between page fault and page walk.', answer: 'Page Fault is a hardware trap when an active memory page is absent from RAM. Page Walk is the hardware/software routine searching page tables (CR3 register / TLB cache) to find the address map.' },
    { question: 'What is the purpose of Translation Lookaside Buffer (TLB)?', answer: 'TLB is a high-speed hardware cache storage holding the most recently accessed page table virtual-to-physical address mappings to avoid multiple RAM page walks.' },
    { question: 'Why does Beladys Anomaly occur in FIFO page replacement?', answer: 'Belady anomaly happens when allocating more physical page frames results in more page faults instead of fewer, which is mathematically impossible for stack-based algorithms like LRU.' }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!topicInput.trim()) {
      onNotify('Please enter a target topic.', true);
      return;
    }
    setIsLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    onNotify('Querying Gemini intelligence core to compile double-sided flashcards...');

    try {
      const prompt = `Formulate exactly 4 technical, exam-oriented flashcard items for Master of Computer Applications study on: "${topicInput}". Each item must have a concise active Question and a detailed conceptual Answer explanation. Please return them as a clear list like: 
CARD 1: Q: <question> A: <answer>
CARD 2: Q: <question> A: <answer>
CARD 3: Q: <question> A: <answer>
CARD 4: Q: <question> A: <answer>`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          subject: 'Syllabus Flashcards Module',
          marksMode: 'General'
        })
      });

      if (!response.ok) throw new Error('AI Flashcard compilation failed.');
      const data = await response.json();
      const rawText = data.text || '';

      // Parse questions and answers from text manually to ensure maximum stability
      const loaded: Flashcard[] = [];
      const regex = /CARD \d+:\s*Q:\s*(.*?)\s*A:\s*(.*?)(?=CARD \d+:|$)/gs;
      let match;
      while ((match = regex.exec(rawText)) !== null) {
        if (match[1] && match[2]) {
          loaded.push({
            question: match[1].trim(),
            answer: match[2].trim()
          });
        }
      }

      if (loaded.length >= 2) {
        setCards(loaded);
        onNotify('Syllabus flashcards loaded! Turn over panels with a click.');
      } else {
        // Fallback split if regex fails due to model formatting
        const lines = rawText.split('\n').filter((l: string) => l.includes('Q:') || l.includes('A:'));
        if (lines.length >= 4) {
          const parsedLines: Flashcard[] = [];
          for (let i = 0; i < lines.length - 1; i += 2) {
            parsedLines.push({
              question: lines[i].replace(/.*?Q:/i, '').trim(),
              answer: lines[i + 1]?.replace(/.*?A:/i, '').trim() || 'Refer to notes.'
            });
          }
          if (parsedLines.length > 0) {
            setCards(parsedLines);
            onNotify('Syllabus flashcards loaded successfully! 🚀');
            return;
          }
        }
        throw new Error('Failsafe regex parsing mismatch.');
      }
    } catch (err: any) {
      console.error(err);
      onNotify('Loaded default local flashcard decks.', true);
      // Keep existing local flashcards so user always has functional cards
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div id="flashcards-container" className="space-y-6 text-left text-white animate-fade-in font-sans">
      <header>
        <span className="text-[10px] font-mono tracking-widest text-cyan-401 uppercase font-bold">ACTIVE RETRIEVAL DRILLS // 2035</span>
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400 shrink-0" /> AI Flashcards Generator & Deck
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Acquire swift definitions and exam blueprints. Input any computer science concept to assemble digital flashcards with flipping capabilities.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-panel p-6 rounded-3xl border border-zinc-800">
            <h3 className="text-base font-display font-black text-white pb-3 border-b border-zinc-800/60 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Flashcard Config</span>
            </h3>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest">Syllabus Topic core</label>
                <input
                  type="text"
                  placeholder="E.g., DBMS Join queries or OS Semaphores..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-909 border border-zinc-805 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-semibold"
                />
              </div>

              <button
                onClick={handleGenerateFlashcards}
                disabled={isLoading || !topicInput.trim()}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-40 text-black rounded-xl text-xs font-display font-black tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Layers className="w-4 h-4 text-black" />}
                {isLoading ? 'Assembling Deck...' : 'ASSEMBLE DECK CONCEPTS'}
              </button>
            </div>

            {/* Quick Helper Tips */}
            <div className="mt-8 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-[11px] leading-relaxed text-zinc-455">
              <span className="font-bold text-zinc-300 block mb-1">Active Memory Tactics:</span>
              Read the question on the face of the flashcard, articulate your explanation out loud, click to turn over, and cross-reference with our expert definitions.
            </div>
          </div>
        </div>

        {/* Right Active Card Deck display */}
        <div className="lg:col-span-7 flex flex-col justify-between items-center space-y-6">
          {/* Main Flashcard Outer Wrapper with 3D Transforms */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-md h-[250px] [perspective:1000px] cursor-pointer group"
          >
            <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
              {/* FACE SIDE OF FLASHCARD (Questions) */}
              <div className="absolute w-full h-full [backface-visibility:hidden] cyber-panel p-6 rounded-3xl border border-zinc-805 flex flex-col justify-between items-center text-center bg-zinc-900/90 shadow-2xl">
                <div className="w-full flex justify-between items-center pb-2 border-b border-zinc-800/50 font-mono text-[9px] text-zinc-550">
                  <span>FACING TOPIC CARDS</span>
                  <span>CARD {currentIndex + 1} OF {cards.length}</span>
                </div>

                <div className="py-4 px-2">
                  <h4 className="text-sm md:text-base font-display font-black text-cyan-400 tracking-wide select-none leading-relaxed">
                    {cards[currentIndex]?.question}
                  </h4>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-805 select-none font-bold animate-pulse">
                  Click to turn over
                </div>
              </div>

              {/* BACK SIDE OF FLASHCARD (Answers) */}
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] cyber-panel p-6 rounded-3xl border border-purple-500/35 flex flex-col justify-between bg-zinc-911 shadow-2xl overflow-y-auto">
                <div className="w-full flex justify-between items-center pb-2 border-b border-zinc-800/50 font-mono text-[9px] text-purple-400">
                  <span>NEXUS EXAM DEFINITION</span>
                  <span>CROSS-COMPILING CONCEPT</span>
                </div>

                <div className="py-3 px-2 font-sans overflow-y-auto max-h-[140px]">
                  <p className="text-xs text-zinc-300 leading-relaxed text-left font-medium select-text whitespace-pre-line">
                    {cards[currentIndex]?.answer}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-purple-422 uppercase tracking-widest text-center select-none font-bold">
                  Click to face front
                </div>
              </div>
            </div>
          </div>

          {/* Steppers & Deck navigation elements */}
          <div className="flex items-center gap-5 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-804 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Previous card"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-zinc-501 font-bold">
              {currentIndex + 1} / {cards.length} Core Cards
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-804 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Next card"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-804 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
              title="Flip Card"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
