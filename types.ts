export enum AnalysisTone {
  FORMAL = 'Formal',
  TECHNICAL = 'Técnico',
  EXECUTIVE = 'Ejecutivo',
  SIMPLE = 'Simple'
}

export interface AnalysisResult {
  summary: string;
  rootCause: string;
  actions: string[];
  professionalComment: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  snippet: string;
  result: AnalysisResult;
}