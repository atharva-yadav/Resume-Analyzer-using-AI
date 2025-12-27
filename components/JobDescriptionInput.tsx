
import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  const MAX_CHARS = 5000;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md hover:border-orange-100 dark:hover:border-orange-900/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Job Description
        </h2>
        <span className={`text-xs font-medium ${value.length > MAX_CHARS ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {value.length} / {MAX_CHARS}
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the target job description here..."
        className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
      />
      
      <div className="mt-3 flex gap-2">
        <button 
          onClick={() => onChange("Software Engineer with 3+ years experience in React, TypeScript, and Node.js. Experience with cloud services like AWS or GCP is preferred. Must have strong problem-solving skills and the ability to work in an agile team environment.")}
          className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          Use Sample Text
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
