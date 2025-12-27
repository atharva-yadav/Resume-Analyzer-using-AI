
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResult from './components/AnalysisResult';
import HistoryList from './components/HistoryList';
import { AppState, ResumeFile, AnalysisResult as AnalysisResultType, HistoryItem } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const savedHistory = localStorage.getItem('resume_history');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return {
      resume: null,
      jobDescription: '',
      isAnalyzing: false,
      error: null,
      result: null,
      history: savedHistory ? JSON.parse(savedHistory) : [],
      isDarkMode: savedTheme === 'dark' || (!savedTheme && prefersDark),
    };
  });

  useEffect(() => {
    localStorage.setItem('resume_history', JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [state.isDarkMode]);

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const handleResumeSelect = (file: ResumeFile | null) => {
    setState(prev => ({ ...prev, resume: file, error: null }));
  };

  const handleJobDescriptionChange = (val: string) => {
    setState(prev => ({ ...prev, jobDescription: val, error: null }));
  };

  const handleAnalyze = async () => {
    if (!state.resume || !state.jobDescription.trim()) {
      setState(prev => ({ ...prev, error: "Please upload a resume and provide a job description." }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));

    try {
      const result = await analyzeResume(state.resume, state.jobDescription);
      
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        resumeName: state.resume.name,
        matchScore: result.matchScore,
        summary: result.summary,
        result: result,
      };

      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        result,
        history: [newHistoryItem, ...prev.history].slice(0, 10) // Keep last 10
      }));

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err.message || "An unexpected error occurred during analysis." 
      }));
    }
  };

  const deleteHistoryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== id)
    }));
  };

  const viewHistoryResult = (result: AnalysisResultType) => {
    setState(prev => ({ ...prev, result }));
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const canAnalyze = !!state.resume && state.jobDescription.length > 50;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header isDarkMode={state.isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        <section className="text-center space-y-4 mb-12 animate-in fade-in duration-1000">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Optimize your resume for <span className="text-orange-500 italic">success</span>.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
            AI-powered analysis to boost your hiring potential. Get instant feedback and ATS optimization tips.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumeUpload 
            onFileSelect={handleResumeSelect} 
            selectedFile={state.resume} 
          />
          <JobDescriptionInput 
            value={state.jobDescription} 
            onChange={handleJobDescriptionChange} 
          />
        </div>

        {state.error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3 animate-bounce">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {state.error}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || state.isAnalyzing}
            className={`
              relative overflow-hidden group px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform active:scale-95
              ${canAnalyze && !state.isAnalyzing 
                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
            `}
          >
            {state.isAnalyzing ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              "Run Analysis"
            )}
          </button>
        </div>

        <section id="results-section" className="scroll-mt-8">
          {state.result && <AnalysisResult result={state.result} />}
        </section>

        {state.history.length > 0 && (
          <HistoryList 
            items={state.history} 
            onDelete={deleteHistoryItem} 
            onView={viewHistoryResult}
          />
        )}
      </main>

      <footer className="mt-20 text-center text-slate-400 dark:text-slate-600 text-xs">
        <p>&copy; 2024 ResumeAI. Built with Gemini 3 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
