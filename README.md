# MCA Nexus AI: J.A.R.V.I.S. Edition 🤖⚡

Welcome to **MCA Nexus AI: J.A.R.V.I.S. Edition**, a state-of-the-art academic hub tailored for Post-Graduate Master of Computer Applications (MCA) students. This application features a witty, highly functional, and self-aware J.A.R.V.I.S. artificial intelligence assistant integrated into a comprehensive study dashboard.

---

## 🚀 Key Features

*   **J.A.R.V.I.S. Core Intelligence** (AI Chat): Clarify complex computer science theorems, algorithms, relational databases, and request comprehensive **16-Mark University Exam Blueprints**.
*   **J.A.R.V.I.S. Diagnostics**: An interactive cyber-dashboard showing real-time simulated sandbox parameters (CPU temp, memory allocation, and system self-awareness indicators).
*   **AI PDF Summarizer & Flashcard Factory**: Upload academic scripts and immediately generate visual summary cards.
*   **Placement & ATS Helper**: Craft clean resume bullets using high-impact professional metrics and request targeted job roadmap evaluations.
*   **Interactive Coding Playground**: Real-time program execution environment with contextual AI reviews.

---

## 🛠️ Full-Stack Technical Architecture

Unlike client-only websites, this platform uses a robust, secure **Full-Stack (Client + Server) Architecture**:

*   **Frontend**: React (Vite, Tailwind CSS v4, Lucide Icons, and Motion transitions).
*   **Backend**: Node.js & Express server running native TypeScript via `tsx` dev compilation.
*   **Secure API Model Calls**: All interaction with the **Google Gemini API** takes place strictly server-side (`server.ts`) via the `@google/genai` SDK to ensure your secret keys are hidden from the browser.
*   **Production Bundle**: Optimized using `esbuild` to compile the backend into a Single CommonJS bundle (`dist/server.cjs`) to guarantee lightning-fast startup and isolated route handling.

---

## 📦 How to Run Locally

Follow these direct steps to run the application on your computer:

### 1. Prerequisite
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation
Clone your GitHub repository and install the dependencies:
```bash
git clone <your-repository-url>
cd <your-repository-directory>
npm install
```

### 3. Setup Secret Keys (Environment Variables)
Create a `.env` file in the root directory of your project (you can copy the contents of `.env.example` as a template):
```bash
cp .env.example .env
```
Open `.env` and configure your Google Gemini API Key:
```env
GEMINI_API_KEY="AIzaSyYourActualKeyGoesHere"
APP_URL="http://localhost:3000"
```
*(You can generate a free Gemini API key on [Google AI Studio](https://aistudio.google.com/)).*

### 4. Running Development Mode
Start both the Frontend build watch and the Backend Express server in a single command:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### 5. Compile & Start Production Mode
To build the application for optimized deployment:
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Production Hosting

### ⚠️ **Why GitHub Pages will NOT work directly:**
GitHub Pages only supports hosting **static websites (HTML/JS/CSS)**. Because **MCA Nexus AI** has an Express backend to process secure API requests and fetch AI contents safely, **it cannot be deployed directly onto standard GitHub Pages**. 

### **Where to host instead:**
You can deploy this full-stack repository easily for free or low-cost to any container/full-stack platform:

#### 1. **Render** (Recommended)
1. Sign up on [Render.com](https://render.com/).
2. Create a new **Web Service** and connect your GitHub repository.
3. Configure the following parameters:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
4. In the **Environment** tab, add a new variable:
   * `GEMINI_API_KEY` = *`your-google-gemini-api-key`*
   * `NODE_ENV` = `production`

#### 2. **Railway**
1. Connect your repository to [Railway.app](https://railway.app/).
2. Railway will automatically detect the `package.json` configurations.
3. Under variables, add `GEMINI_API_KEY` and click **Deploy**.

---

*Systems Online. Good luck on your PG studies, sir!*
