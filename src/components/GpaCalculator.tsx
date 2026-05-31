import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Award, AlertCircle, Sparkles } from 'lucide-react';

interface Semester {
  id: string;
  name: string;
  gpa: number;
}

interface GpaCalculatorProps {
  onNotify?: (msg: string, isError?: boolean) => void;
}

export default function GpaCalculator({ onNotify }: GpaCalculatorProps) {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', gpa: 8.5 },
    { id: '2', name: 'Semester 2', gpa: 8.8 },
  ]);
  const [newGpa, setNewGpa] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddSemester = () => {
    setErrorMsg(null);
    const val = parseFloat(newGpa);
    if (isNaN(val) || val < 0 || val > 10) {
      const msg = 'Please enter a valid Grade Point between 0.00 and 10.00';
      setErrorMsg(msg);
      if (onNotify) onNotify(msg, true);
      return;
    }
    const nextNum = semesters.length + 1;
    setSemesters([...semesters, { id: Date.now().toString(), name: `Semester ${nextNum}`, gpa: val }]);
    setNewGpa('');
    if (onNotify) onNotify(`Added Semester ${nextNum} GPA! 📊`);
  };

  const handleDelete = (id: string, name: string) => {
    setSemesters(semesters.filter((s) => s.id !== id));
    if (onNotify) onNotify(`Removed ${name} from GPA average calculations.`);
  };

  const cgpa = semesters.length
    ? (semesters.reduce((acc, curr) => acc + curr.gpa, 0) / semesters.length).toFixed(2)
    : '0.00';

  const classification = (() => {
    const score = parseFloat(cgpa);
    if (score >= 9.0) return { label: 'First Class with Distinction (Outstanding)', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', progressColor: 'bg-emerald-600' };
    if (score >= 7.5) return { label: 'First Class with Distinction', color: 'text-indigo-600 bg-indigo-50 border-indigo-150', progressColor: 'bg-indigo-600' };
    if (score >= 6.5) return { label: 'First Class', color: 'text-blue-600 bg-blue-50 border-blue-100', progressColor: 'bg-blue-500' };
    if (score >= 5.0) return { label: 'Second Class', color: 'text-amber-600 bg-amber-50 border-amber-100', progressColor: 'bg-amber-500' };
    return { label: 'Pass Grade', color: 'text-slate-600 bg-slate-50 border-slate-100', progressColor: 'bg-slate-400' };
  })();

  const cgpaProgressPercent = Math.min(100, Math.max(0, (parseFloat(cgpa) / 10.0) * 100));

  return (
    <div id="gpa-calculator-box" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-950">GPA / CGPA Planner</h3>
            <p className="text-[11px] text-slate-400">Evaluate and track dynamic post-graduate metrics</p>
          </div>
        </div>

        {/* Dynamic CGPA Ring / Gauge Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 items-center">
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-center relative overflow-hidden">
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-semibold">Calculated CGPA</span>
            <span className="text-4xl font-extrabold text-slate-900 block mt-1 tracking-tight">{cgpa}</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3 max-w-[120px] mx-auto">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${classification.progressColor}`} 
                style={{ width: `${cgpaProgressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block font-semibold">classification</span>
            <div className={`p-3 rounded-2xl border text-xs font-semibold leading-relaxed flex items-center gap-2 ${classification.color}`}>
              <Award className="w-4 h-4 shrink-0" />
              <span>{classification.label}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="space-y-2 mb-5 max-h-[160px] overflow-y-auto pr-1">
          {semesters.map((sem) => (
            <div
              key={sem.id}
              className="group flex items-center justify-between p-3.5 bg-slate-50/20 hover:bg-slate-50/70 rounded-2xl border border-slate-100/70 transition-all duration-200"
            >
              <span className="text-xs font-semibold text-slate-700">{sem.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-900 bg-white border border-slate-150 px-2.5 py-1 rounded-lg shadow-2xs font-mono">
                  {sem.gpa.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(sem.id, sem.name)}
                  className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all"
                  title="Remove Semester"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          max="10"
          min="0"
          placeholder="New GPA (e.g. 9.15)"
          value={newGpa}
          onChange={(e) => {
            setErrorMsg(null);
            setNewGpa(e.target.value);
          }}
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-150 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all font-mono shadow-inner"
        />
        <button
          onClick={handleAddSemester}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-md shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          Add Log
        </button>
      </div>
    </div>
  );
}
