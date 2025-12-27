
import React, { useCallback, useState } from 'react';
import { ResumeFile } from '../types';

interface ResumeUploadProps {
  onFileSelect: (file: ResumeFile | null) => void;
  selectedFile: ResumeFile | null;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect, selectedFile }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or TXT file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => {
      setIsUploading(true);
      setUploadProgress(0);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onFileSelect({
        name: file.name,
        size: file.size,
        type: file.type,
        base64: base64,
      });
    };

    reader.onloadend = () => {
      // Small delay for UX so the user sees 100% before it switches
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    };

    reader.onerror = () => {
      alert("Error reading file.");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const removeFile = () => {
    onFileSelect(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md hover:border-orange-100 dark:hover:border-orange-900/30 min-h-[240px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resume Upload
        </h2>
        {selectedFile && !isUploading && (
          <button 
            onClick={removeFile}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {isUploading ? (
          <div className="flex-1 border-2 border-orange-100 dark:border-orange-900/20 rounded-xl p-8 flex flex-col items-center justify-center bg-orange-50/10 dark:bg-orange-900/5 animate-in fade-in duration-300">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Reading resume data...</p>
            <div className="w-full max-w-xs h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full max-w-xs mt-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing</span>
              <span className="text-[10px] font-black text-orange-500 tracking-widest">{uploadProgress}%</span>
            </div>
          </div>
        ) : !selectedFile ? (
          <div className="relative group flex-1">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-orange-300 dark:group-hover:border-orange-500/50 group-hover:bg-orange-50/30 dark:group-hover:bg-orange-900/5">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF or TXT up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4 shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatSize(selectedFile.size)}</p>
            </div>
            <div className="ml-4">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
