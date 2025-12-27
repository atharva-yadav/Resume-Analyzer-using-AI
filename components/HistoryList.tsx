
import React from 'react';
import { HistoryItem, AnalysisResult } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onView: (result: AnalysisResult) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onDelete, onView }) => {
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(ts);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-rose-500';
  };

  return (
    <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center gap-2 px-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Recent Analyses</h3>
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full">
          {items.length} SAVED
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <div 
            key={item.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onView(item.result)}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm ${getScoreColor(item.matchScore)} border-current bg-slate-50 dark:bg-slate-950`}>
                {item.matchScore}%
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.resumeName}</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{formatDate(item.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.summary}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button 
                className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div className="p-2 text-slate-300 dark:text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
