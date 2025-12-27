
export interface ResumeFile {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export interface AnalysisResult {
  matchScore: number;
  keyStrengths: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  atsTips: string[];
  summary: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  resumeName: string;
  matchScore: number;
  summary: string;
  result: AnalysisResult;
}

export interface AppState {
  resume: ResumeFile | null;
  jobDescription: string;
  isAnalyzing: boolean;
  error: string | null;
  result: AnalysisResult | null;
  history: HistoryItem[];
  isDarkMode: boolean;
}
