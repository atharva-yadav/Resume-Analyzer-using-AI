
import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 50) return 'text-orange-500 dark:text-orange-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Summary Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className={`${getScoreColor(result.matchScore)} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeDasharray={263.89}
              strokeDashoffset={263.89 - (263.89 * result.matchScore) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(result.matchScore)}`}>{result.matchScore}%</span>
            <span className="text-[10px] uppercase tracking-tighter text-slate-400 dark:text-slate-500 font-bold">Match</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analysis Summary</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm italic">"{result.summary}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Key Strengths
          </h4>
          <ul className="space-y-3">
            {result.keyStrengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-3">
                <span className="text-emerald-500 font-bold">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-900/30 transition-colors">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            Missing Skills
          </h4>
          <ul className="space-y-3">
            {result.missingSkills.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-3">
                <span className="text-rose-500 font-bold">!</span> {s}
              </li>
            ))}
            {result.missingSkills.length === 0 && (
              <li className="text-sm text-slate-400 italic">No critical missing skills found. Great job!</li>
            )}
          </ul>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-orange-100 dark:hover:border-orange-900/30 transition-colors">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            Actionable Improvements
          </h4>
          <ul className="space-y-3">
            {result.improvementSuggestions.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-3">
                <span className="text-orange-500 font-bold">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* ATS Optimization Tips */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-amber-100 dark:hover:border-amber-900/30 transition-colors">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            ATS Optimization
          </h4>
          <ul className="space-y-3">
            {result.atsTips.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-3">
                <span className="text-amber-500 font-bold">💡</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-8 py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-full text-sm font-bold hover:bg-slate-700 dark:hover:bg-white transition-all shadow-lg hover:shadow-orange-500/10 transform active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
