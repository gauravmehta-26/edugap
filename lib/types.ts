// Core type definitions for EduGap application

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
}

export interface WeakConcept {
  id: string | number;
  name: string;
  riskPercentage?: number;
  severity?: 'high' | 'medium' | 'low';
}

export interface DashboardData {
  examFailureRisk: number;
  weakConcepts: WeakConcept[];
  subjectPerformance: {
    subject: string;
    score: number;
  }[];
}

export interface RemediationContent {
  conceptId: string;
  conceptName: string;
  explanation: string;
  example: string;
  commonMistake: string;
}
