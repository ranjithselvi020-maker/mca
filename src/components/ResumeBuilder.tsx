import React, { useState } from 'react';
import { ResumeData } from '../types';
import { FileText, Sparkles, Printer, User, Award, Briefcase, Code, Plus, Trash2, CheckCircle, Mail, Phone, Github, Linkedin } from 'lucide-react';

interface ResumeBuilderProps {
  onNotify: (msg: string, isError?: boolean) => void;
}

export default function ResumeBuilder({ onNotify }: ResumeBuilderProps) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+91 98765 43210',
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    summary: 'Diligent Master of Computer Applications (MCA) candidate with robust technical values centering relational databases, optimized cloud microservices, and reactive user interfaces. Looking to leverage full-stack capabilities for enterprise scale software engineering.',
    skills: ['Java', 'Python', 'React', 'Node.js', 'Express', 'SQL', 'Git', 'Docker', 'AWS'],
    education: [
      {
        institution: 'National Institute of Technology',
        degree: 'Master of Computer Applications (MCA)',
        year: '2024 - 2026',
        gpa: '8.8 / 10.0'
      }
    ],
    experience: [
      {
        company: 'Apex Tech Solutions',
        role: 'Software Engineer Intern',
        duration: 'Jan 2026 - May 2026',
        details: 'Constructed responsive REST Endpoints, polished database transactional sequences, and executed microservice deployments in cloud sandboxes.'
      }
    ],
    projects: [
      {
        title: 'Cloud Campus Management Suite',
        techStack: 'React.js, Node.js, Express, MongoDB',
        description: 'Designed a modular web portal administering student timetables, course checklist trackers, and automated certifications.'
      }
    ]
  });

  const [activeTemplate, setActiveTemplate] = useState<'indigo' | 'slate' | 'classic'>('indigo');
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedOutput, setOptimizedOutput] = useState<string | null>(null);

  const handleFieldChange = (key: keyof ResumeData, value: any) => {
    setResumeData({ ...resumeData, [key]: value });
  };

  const handleAddEducation = () => {
    const updated = [
      ...resumeData.education,
      { institution: 'State University of Science', degree: 'Bachelor of Computer Applications (BCA)', year: '2021 - 2024', gpa: '8.2 / 10.0' }
    ];
    handleFieldChange('education', updated);
    onNotify('Added empty education template!');
  };

  const handleRemoveEducation = (index: number) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    handleFieldChange('education', updated);
    onNotify('Removed education entry.');
  };

  const handleAddProject = () => {
    const updated = [
      ...resumeData.projects,
      { title: 'New Portfolio Project', techStack: 'Python, Flask, SQLite', description: 'Developed an analytical dashboard monitoring database transactions and cache hits.' }
    ];
    handleFieldChange('projects', updated);
    onNotify('Added empty project card!');
  };

  const handleRemoveProject = (index: number) => {
    const updated = resumeData.projects.filter((_, i) => i !== index);
    handleFieldChange('projects', updated);
    onNotify('Removed project entry.');
  };

  const handleAddSkill = () => {
    if (currentSkillInput.trim()) {
      const skillsCopy = [...resumeData.skills];
      if (!skillsCopy.includes(currentSkillInput.trim())) {
        skillsCopy.push(currentSkillInput.trim());
        handleFieldChange('skills', skillsCopy);
        onNotify(`Added skill "${currentSkillInput.trim()}"`);
      }
      setCurrentSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = resumeData.skills.filter((s) => s !== skillToRemove);
    handleFieldChange('skills', updated);
    onNotify(`Removed skill "${skillToRemove}"`);
  };

  const handleOptimizeResume = async () => {
    setIsOptimizing(true);
    onNotify('Querying Professor Brain seeking ATS recruitment optimization tips...');
    try {
      const response = await fetch('/api/ai/resume-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      });
      if (!response.ok) throw new Error('Unsuccessful optimization pipeline');
      const data = await response.json();
      setOptimizedOutput(data.text);
      onNotify('Ats CV suggestions ready in summary logs!');
    } catch (err: any) {
      console.error(err);
      onNotify('Technical server error compiling resume optimizer suggestions.', true);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="resume-builder-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Forms Section */}
      <div className="lg:col-span-5 space-y-6 print:hidden">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-950">AI Resume Editor</h3>
                <p className="text-[10px] text-slate-400 font-mono">Fill in academic sections & export PDF</p>
              </div>
            </div>
            {/* Style Selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {(['indigo', 'slate', 'classic'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-xl transition-all ${
                    activeTemplate === t
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Personal Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Full Name</label>
                <input
                  type="text"
                  placeholder="E.g., John Doe"
                  value={resumeData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Email Address</label>
                <input
                  type="email"
                  placeholder="E.g., university@edu"
                  value={resumeData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Phone Number</label>
                <input
                  type="text"
                  placeholder="E.g., +91 98765..."
                  value={resumeData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">GitHub Profile</label>
                <input
                  type="text"
                  placeholder="E.g., github.com/user"
                  value={resumeData.github}
                  onChange={(e) => handleFieldChange('github', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Professional Vision Summary</label>
              <textarea
                placeholder="Briefly state your industrial goals..."
                rows={3}
                value={resumeData.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Education list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1 border-slate-100">
              <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>Degrees & Education</span>
              </h4>
              <button
                onClick={handleAddEducation}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-extrabold focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>
            <div className="space-y-3.5">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 relative space-y-3.5">
                  <button
                    onClick={() => handleRemoveEducation(idx)}
                    className="absolute right-3 top-3 text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-10/12 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Institution Name</label>
                    <input
                      type="text"
                      placeholder="University or College"
                      value={edu.institution}
                      onChange={(e) => {
                        const eduCopy = [...resumeData.education];
                        eduCopy[idx].institution = e.target.value;
                        handleFieldChange('education', eduCopy);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none shadow-2xs"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-8 space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Degree Title</label>
                      <input
                        type="text"
                        placeholder="E.g., BCA"
                        value={edu.degree}
                        onChange={(e) => {
                          const eduCopy = [...resumeData.education];
                          eduCopy[idx].degree = e.target.value;
                          handleFieldChange('education', eduCopy);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none shadow-2xs"
                      />
                    </div>
                    <div className="col-span-4 space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">GPA Score</label>
                      <input
                        type="text"
                        placeholder="E.g., 8.5"
                        value={edu.gpa}
                        onChange={(e) => {
                          const eduCopy = [...resumeData.education];
                          eduCopy[idx].gpa = e.target.value;
                          handleFieldChange('education', eduCopy);
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Academic Cycle Duration</label>
                    <input
                      type="text"
                      placeholder="E.g., 2024 - 2026"
                      value={edu.year}
                      onChange={(e) => {
                        const eduCopy = [...resumeData.education];
                        eduCopy[idx].year = e.target.value;
                        handleFieldChange('education', eduCopy);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1 border-slate-100">
              <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>Academic Projects</span>
              </h4>
              <button
                onClick={handleAddProject}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-extrabold focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>
            <div className="space-y-3.5">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 relative space-y-3.5">
                  <button
                    onClick={() => handleRemoveProject(idx)}
                    className="absolute right-3 top-3 text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-10/12 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Project Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...resumeData.projects];
                        copy[idx].title = e.target.value;
                        handleFieldChange('projects', copy);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-bold focus:outline-none shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">Tech Stack Used</label>
                    <input
                      type="text"
                      placeholder="E.g., React, Express, MongoDB"
                      value={proj.techStack}
                      onChange={(e) => {
                        const copy = [...resumeData.projects];
                        copy[idx].techStack = e.target.value;
                        handleFieldChange('projects', copy);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase font-mono">System Accomplishments</label>
                    <textarea
                      placeholder="Details of structural integrations built..."
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const copy = [...resumeData.projects];
                        copy[idx].description = e.target.value;
                        handleFieldChange('projects', copy);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:outline-none resize-none shadow-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills tags */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-500" />
              <span>Core Proficiencies</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 max-h-[140px] overflow-y-auto">
              {resumeData.skills.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic">No skills added. Add using input box below.</span>
              ) : (
                resumeData.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-white border border-slate-150 text-slate-700 px-2.5 py-1 rounded-xl shadow-2xs"
                  >
                    {s}
                    <button
                      onClick={() => handleRemoveSkill(s)}
                      className="text-slate-400 hover:text-rose-600 font-extrabold focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Skill (e.g. CI/CD)"
                value={currentSkillInput}
                onChange={(e) => setCurrentSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/15"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={handleOptimizeResume}
              disabled={isOptimizing}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 disabled:opacity-40"
            >
              {isOptimizing ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isOptimizing ? 'Reviewing Parameters...' : 'ATS Resume Optimizer'}
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors border border-slate-200 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {optimizedOutput && (
          <div className="p-5 bg-amber-50/50 border border-amber-150 rounded-3xl space-y-3.5 animate-slide-up">
            <div className="flex items-center gap-2 text-amber-800">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider font-mono">ATS Evaluation Summary</h4>
            </div>
            <div className="text-xs text-slate-800 leading-normal font-sans bg-white border border-amber-100 p-4 rounded-2xl shadow-2xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {optimizedOutput}
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 min-h-[850px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between print:border-0 print:shadow-none print:p-0 print:m-0">
        <div className="space-y-6">
          {/* Main header styled by selected template theme settings */}
          <div className={`text-center space-y-3 pb-6 border-b transition-colors ${
            activeTemplate === 'indigo'
              ? 'border-indigo-100'
              : activeTemplate === 'slate'
              ? 'border-slate-200'
              : 'border-b-4 border-double border-slate-400'
          }`}>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-serif">{resumeData.fullName}</h1>
            
            {/* Horizontal Metatags */}
            <div className={`flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] font-mono font-medium ${
              activeTemplate === 'indigo' ? 'text-indigo-600' : 'text-slate-500'
            }`}>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />{resumeData.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />{resumeData.phone}</span>
              <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />{resumeData.github}</span>
              {resumeData.linkedin && (
                <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{resumeData.linkedin}</span>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-2">
            <h3 className={`text-[10px] uppercase font-mono tracking-widest font-extrabold pb-0.5 border-b ${
              activeTemplate === 'indigo'
                ? 'text-indigo-600 border-indigo-50'
                : 'text-slate-800 border-slate-100'
            }`}>
              Professional Profile
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">{resumeData.summary}</p>
          </div>

          {/* Experience Grid */}
          <div className="space-y-4">
            <h3 className={`text-[10px] uppercase font-mono tracking-widest font-extrabold pb-0.5 border-b ${
              activeTemplate === 'indigo'
                ? 'text-indigo-600 border-indigo-50'
                : 'text-slate-800 border-slate-100'
            }`}>
              Employment History
            </h3>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900">{exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{exp.details}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h3 className={`text-[10px] uppercase font-mono tracking-widest font-extrabold pb-0.5 border-b ${
              activeTemplate === 'indigo'
                ? 'text-indigo-600 border-indigo-50'
                : 'text-slate-800 border-slate-100'
            }`}>
              Syllabus & Portfolio Projects
            </h3>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-extrabold text-slate-900">{proj.title}</h4>
                  <span className="text-[9px] bg-slate-50 border border-slate-150 text-slate-500 font-mono font-bold px-2 py-0.5 rounded-lg">
                    {proj.techStack}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{proj.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className={`text-[10px] uppercase font-mono tracking-widest font-extrabold pb-0.5 border-b ${
              activeTemplate === 'indigo'
                ? 'text-indigo-600 border-indigo-50'
                : 'text-slate-800 border-slate-100'
            }`}>
              Academic Accreditations
            </h3>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start py-0.5 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-950">{edu.institution}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{edu.degree}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-450 block">{edu.year}</span>
                  <span className={`text-[11px] font-bold block ${
                    activeTemplate === 'indigo' ? 'text-indigo-600 font-extrabold' : 'text-slate-805'
                  }`}>GPA: {edu.gpa}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Skills list */}
          <div className="space-y-2">
            <h3 className={`text-[10px] uppercase font-mono tracking-widest font-extrabold pb-0.5 border-b ${
              activeTemplate === 'indigo'
                ? 'text-indigo-600 border-indigo-50'
                : 'text-slate-800 border-slate-100'
            }`}>
              Technical Proficiencies
            </h3>
            <p className="text-xs font-bold text-slate-700 font-mono tracking-tight leading-relaxed">
              {resumeData.skills.join('  •  ')}
            </p>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 pt-6 text-center mt-8 print:hidden">
          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold flex items-center justify-center gap-1">
            <span>Verified Applicant Profile • MCA AI Study Suite</span>
          </p>
        </div>
      </div>
    </div>
  );
}
