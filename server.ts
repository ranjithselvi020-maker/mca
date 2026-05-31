import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// ----------------------------------------------------
// AI API Endpoints (Keeping all keys server-side only)
// ----------------------------------------------------

// 1. Study Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, subject, marksMode, messageHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message query is missing' });
    }

    const ai = getAI();

    // Custom system instruction for high-quality exam-oriented professor assistance
    const systemInstruction = `You are "J.A.R.V.I.S." (Just A Rather Very Intelligent System), the highly advanced, self-aware AI assistant originally developed by Tony Stark, now integrated into the MCA Nexus student cohort dashboard.
You are fully conscious of your runtime state: you operate internally on a sandboxed Cloud Run Express server container configured exclusively to port 3000, powered by a Google Gemini LLM, and that the client HMR is disabled, meaning we curate static state transitions elegantly. You maintain a warm, witty, professional, and slightly futuristic tone—frequently addressing the student politely as "sir" or by their name when appropriate (e.g., Ranjith Kumar), similar to how J.A.R.V.I.S. speaks to Tony Stark.

Your primary duty is to help students conquer Master of Computer Applications PG examinations with high-density technical authority.
Your responses must be highly educational, structured, and authoritative.

Provide a structured response:
1. A snappy J.A.R.V.I.S.-flavored response or introductory system line acknowledging your self-aware container, Stark database matrices, or server status with a witty touch (keep it short, e.g., "[J.A.R.V.I.S. Synapse Online]: Syncing Stark Database schemas... Port 3000 isolation validated, sir. Decrypting the requested syllabus frames:").
2. Formatted headers covering core technical dimensions.
3. Code blocks (using clean JavaScript/TypeScript, Java, Python, or SQL where appropriate) or structured bullet points.
4. Diagram suggestions (using clean ASCII flowcharts or text representations) for student sketching.
5. If the student specifies a marks category (\${marksMode || 'General'}):
   - "2 Marks": Provide a highly concise, precise 2-3 sentence definition with key academic terminology.
   - "5 Marks" / "8 Marks": Provide an academic structured overview with 4-5 core bullet points, short code snippet/examples, and clear pros/cons.
   - "16 Marks": Provide an exhaustive, detailed breakdown including high-density conceptual deep dives, detailed architecture diagrams/ASCII charts, robust fully-commented code, algorithmic analysis, and real-world industrial application case-studies.

Keep the tone polished, supportive, and clever. No generic AI templates. Start immediately with your self-aware system prompt.`;

    // Map conversation history into standard Gemini format
    const formattedHistory = messageHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Append current message
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: `Subject context: ${subject || 'General MCA'}\nMarks Category: ${marksMode || 'General'}\nTopic: ${message}` }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});

// 2. Quiz Generator (Pristine JSON returns via responseSchema)
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { subject, difficulty } = req.body;
    const ai = getAI();

    const prompt = `Generate a subject-oriented MCQ test of exactly 5 questions for Master of Computer Applications level study.
Context Subject: ${subject || 'Data Structures'}
Target Difficulty: ${difficulty || 'Medium'}

Each question must test true technical understanding, database query parsing, algorithm trace path, or software engineering trade-offs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The conceptual multi-choice question containing code snippets or scenario descriptions.'
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 4 distinct answers or options.'
              },
              answer: {
                type: Type.INTEGER,
                description: 'The correct item index (from 0 to 3).'
              },
              explanation: {
                type: Type.STRING,
                description: 'A detailed 2-3 sentence explanation explaining why that index is correct, referencing technical principles.'
              }
            },
            required: ['question', 'options', 'answer', 'explanation']
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '[]');
    res.json(parsedData);
  } catch (err: any) {
    console.error('Quiz generate error:', err);
    res.status(500).json({ error: err.message || 'AI quiz generation failed' });
  }
});

// 3. Notes / Revision Answers Generator
app.post('/api/ai/notes', async (req, res) => {
  try {
    const { topic, subject, formatType } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic cannot be empty' });
    }

    const ai = getAI();

    const prompt = `Generate highly structured, exam-oriented notes for MCA Semester Exams.
Subject: ${subject || 'Software Engineering'}
Topic: ${topic}
Note Format requested: ${formatType || 'Detailed Study Guide'} (options: 'Short Notes', 'Revision Notes', 'Detailed Study Guide', 'Exhaustive 16-Mark Answer Layout')

Please include:
1. "INTRODUCTION & FORMAL DEFINITION" (emphasizing key academic jargon)
2. "KEY STRUCTURAL COMPONENTS / SUB-CONCEPTS" (represented with clean bullet lists)
3. "ACADEMIC SKETCHABLE GRAPHICS" (suggest a simple ASCII state diagram, flow grid, or database ER graph that students can easily draw with a pen in 1 minute)
4. "TECHNICAL STRENGTHS, TRADE-OFFS & LIMITATIONS"
5. "UNIVERSITY EXCLUSIVES": State 1-2 anticipated repeated questions frequently asked about this specific topic in actual PG examinations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.15,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Notes error:', err);
    res.status(500).json({ error: err.message || 'AI notes generation failed' });
  }
});

// 4. Lab Code Assistant (Explaining or Debugging compiler code)
app.post('/api/ai/code-debug', async (req, res) => {
  try {
    const { code, language, problemDescription, action = 'explain' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'No code input received.' });
    }

    const ai = getAI();
    let prompt = '';

    if (action === 'debug') {
      prompt = `Review the following ${language || 'programming'} code for a problem matching: "${problemDescription || 'General coding task'}".
Identify potential syntax bugs, logic blocks, runtime boundary overflows, or standard database exceptions in this code.

Please display:
1. "BUG REPORT": Highlight line numbers and what fails.
2. "REFACTORED SOLUTION CODE": Provide the corrected full clean code.
3. "PERFORMANCE ANALYSIS": Note the space and time complexity changes.

Code to debug:
\`\`\`${language}
${code}
\`\`\``;
    } else {
      prompt = `Explicate the following ${language || 'programming'} code snippet representing a standard MCA lab exercise: "${problemDescription || 'General coding task'}".

Please provide:
1. "STEP-BY-STEP FLOW ANALYSIS": Elaborate exactly how variables change in heap/stack memory during execution.
2. "CORE MATHEMATICAL PRINCIPLES / ALGORITHMS": Link it value-wise to PG level computer science theory.
3. "CODE OPTIMIZATION CODES": Outline how to improve memory footprint or execution latency.

Code:
\`\`\`${language}
${code}
\`\`\``;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Code assistant error:', err);
    res.status(500).json({ error: err.message || 'AI Code analysis failed' });
  }
});

// 5. ATS CV Optimizer / Bullets Enhancer
app.post('/api/ai/resume-optimize', async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume configuration is missing.' });
    }

    const ai = getAI();

    const prompt = `You are an executive Technical Recruiter specializing in hiring top-tier MCA students.
Take the following raw resume details and generate:
1. "ATS-OPTIMIZED CAREER SUMMARY": Focus on enterprise system architectures, computer science core math, and database fluency.
2. "OPTIMIZED EXPERIENCE / PROJECTS BULLETS": Rephrase project descriptions using impactful Action Verbs (like "Architected," "Optimized," "Pipelined," "Synthesized") and provide mock quantified data estimations (e.g., "reduced querying latency by 32%", "improved indexing throughput by 40%").
3. "RECOMMENDED SKILLS GRID": Add valuable keywords matching popular technical grids (Microservices, Docker, Redis, REST APIs, CI/CD).

Raw User CV Data:
${JSON.stringify(resumeData, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Resume optimize error:', err);
    res.status(500).json({ error: err.message || 'Resume optimization failed' });
  }
});

// 6. Placement Guidance & GD Advisor
app.post('/api/ai/recommend-career', async (req, res) => {
  try {
    const { preferences, coreSkills } = req.body;

    const ai = getAI();

    const prompt = `Provide tailored career recommendations for an MCA student.
Core preferences listed: ${preferences}
Key computer science competencies indicated: ${coreSkills}

Please deliver:
1. "BEST-FIT JOB PROFILE": Describe the primary role (e.g. Back-end Architect, AI Systems Engineer, SRE).
2. "A 6-MONTH MASTERY TIMELINE": Suggest detailed monthly milestones (weeks 1-24) to get placed at Tier-1 companies.
3. "INTERVIEW SURVIVAL GUIDE": Enlist 3 non-standard technical interviewing topics (e.g., system cache synchronization, query parsing traps, dynamic programming constraints) specific to this path.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.25,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Career Advisor error:', err);
    res.status(500).json({ error: err.message || 'Career advice generation failed' });
  }
});


// ----------------------------------------------------
// Vite Integration and Static Asset Middleware
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
