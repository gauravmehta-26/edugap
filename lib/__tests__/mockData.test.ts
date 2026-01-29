import { quizQuestions, dashboardData, remediationContent } from '../mockData';
import { QuizQuestion, DashboardData, RemediationContent } from '../types';

describe('Mock Data Structure', () => {
  describe('Quiz Questions', () => {
    it('should have exactly 5 questions', () => {
      expect(quizQuestions).toHaveLength(5);
    });

    it('should have correct shape for all questions', () => {
      quizQuestions.forEach((question: QuizQuestion) => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(question).toHaveProperty('correctAnswer');
        
        expect(typeof question.id).toBe('string');
        expect(typeof question.question).toBe('string');
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options).toHaveLength(4);
        expect(typeof question.correctAnswer).toBe('number');
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(4);
      });
    });

    it('should have unique question IDs', () => {
      const ids = quizQuestions.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty questions and options', () => {
      quizQuestions.forEach((question: QuizQuestion) => {
        expect(question.question.length).toBeGreaterThan(0);
        question.options.forEach(option => {
          expect(option.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Dashboard Data', () => {
    it('should have all required fields', () => {
      expect(dashboardData).toHaveProperty('examFailureRisk');
      expect(dashboardData).toHaveProperty('weakConcepts');
      expect(dashboardData).toHaveProperty('subjectPerformance');
    });

    it('should have valid exam failure risk', () => {
      expect(typeof dashboardData.examFailureRisk).toBe('number');
      expect(dashboardData.examFailureRisk).toBeGreaterThanOrEqual(0);
      expect(dashboardData.examFailureRisk).toBeLessThanOrEqual(100);
    });

    it('should have weak concepts with correct shape', () => {
      expect(Array.isArray(dashboardData.weakConcepts)).toBe(true);
      expect(dashboardData.weakConcepts.length).toBeGreaterThan(0);
      
      dashboardData.weakConcepts.forEach(concept => {
        expect(concept).toHaveProperty('id');
        expect(concept).toHaveProperty('name');
        expect(concept).toHaveProperty('riskPercentage');
        
        expect(typeof concept.id).toBe('string');
        expect(typeof concept.name).toBe('string');
        expect(typeof concept.riskPercentage).toBe('number');
        expect(concept.riskPercentage).toBeGreaterThanOrEqual(0);
        expect(concept.riskPercentage).toBeLessThanOrEqual(100);
      });
    });

    it('should have subject performance with correct shape', () => {
      expect(Array.isArray(dashboardData.subjectPerformance)).toBe(true);
      expect(dashboardData.subjectPerformance.length).toBeGreaterThan(0);
      
      dashboardData.subjectPerformance.forEach(subject => {
        expect(subject).toHaveProperty('subject');
        expect(subject).toHaveProperty('score');
        
        expect(typeof subject.subject).toBe('string');
        expect(typeof subject.score).toBe('number');
        expect(subject.score).toBeGreaterThanOrEqual(0);
        expect(subject.score).toBeLessThanOrEqual(100);
      });
    });

    it('should have unique weak concept IDs', () => {
      const ids = dashboardData.weakConcepts.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Remediation Content', () => {
    it('should have content for all weak concepts', () => {
      dashboardData.weakConcepts.forEach(concept => {
        expect(remediationContent).toHaveProperty(concept.id);
      });
    });

    it('should have correct shape for all remediation content', () => {
      Object.values(remediationContent).forEach((content: RemediationContent) => {
        expect(content).toHaveProperty('conceptId');
        expect(content).toHaveProperty('conceptName');
        expect(content).toHaveProperty('explanation');
        expect(content).toHaveProperty('example');
        expect(content).toHaveProperty('commonMistake');
        
        expect(typeof content.conceptId).toBe('string');
        expect(typeof content.conceptName).toBe('string');
        expect(typeof content.explanation).toBe('string');
        expect(typeof content.example).toBe('string');
        expect(typeof content.commonMistake).toBe('string');
        
        expect(content.explanation.length).toBeGreaterThan(0);
        expect(content.example.length).toBeGreaterThan(0);
        expect(content.commonMistake.length).toBeGreaterThan(0);
      });
    });

    it('should have matching concept IDs in content', () => {
      Object.entries(remediationContent).forEach(([key, content]) => {
        expect(content.conceptId).toBe(key);
      });
    });
  });
});
