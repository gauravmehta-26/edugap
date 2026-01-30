'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SubjectHeader from '@/components/ui/SubjectHeader';
import { quizQuestionsBySubject } from '@/lib/mockData';
import { QuizAnswer, SubjectId, QuizQuestion } from '@/lib/types';
import { analyzeQuiz, generateQuiz } from '@/lib/api';
import { useSubject } from '@/lib/SubjectContext';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [quizSource, setQuizSource] = useState<string>('mock');
  const router = useRouter();
  const { selectedSubject, getSubjectInfo } = useSubject();

  // Redirect to profile if no subject is selected
  useEffect(() => {
    if (!selectedSubject) {
      setIsRedirecting(true);
      router.push('/profile');
      return;
    }

    // Validate subject ID - if invalid, clear state and redirect
    const validSubjects: SubjectId[] = ['physics', 'mathematics', 'chemistry', 'biology'];
    if (!validSubjects.includes(selectedSubject)) {
      console.error('Invalid subject ID detected, redirecting to profile');
      setIsRedirecting(true);
      router.push('/profile');
    }
  }, [selectedSubject, router]);

  // Fetch AI-generated quiz questions
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        console.log(`Fetching AI quiz questions for ${selectedSubject}...`);
        const result = await generateQuiz(selectedSubject, 5);
        setQuizQuestions(result.questions);
        setQuizSource(result.source);
        console.log(`Quiz loaded from ${result.source}`);
      } catch (error) {
        console.error('Failed to fetch AI questions, using mock data:', error);
        // Fallback to mock data
        setQuizQuestions(quizQuestionsBySubject[selectedSubject] || []);
        setQuizSource('mock-fallback');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [selectedSubject]);

  const subjectInfo = selectedSubject ? getSubjectInfo(selectedSubject) : null;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  // Don't render if no subject or loading
  if (!selectedSubject || isLoadingQuestions || quizQuestions.length === 0 || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            {isLoadingQuestions ? 'Generating quiz questions...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = async () => {
    if (selectedOption !== null) {
      // Store the answer with correct answer and topic for AI analysis
      const newAnswer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedOption: selectedOption,
        correctAnswer: currentQuestion.correctAnswer,
        topic: currentQuestion.topic || currentQuestion.subject,
      };
      
      const updatedAnswers = [...answers];
      const existingAnswerIndex = updatedAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }
      
      setAnswers(updatedAnswers);

      if (isLastQuestion) {
        // Submit quiz to backend and navigate to dashboard
        setIsSubmitting(true);
        try {
          const result = await analyzeQuiz(updatedAnswers, selectedSubject);
          
          // Store result in sessionStorage for dashboard to access
          sessionStorage.setItem('quizResult', JSON.stringify(result));
          
          // Navigate to dashboard
          router.push('/dashboard');
        } catch (error) {
          console.error('Failed to analyze quiz:', error);
          // Still navigate to dashboard with mock data as fallback
          router.push('/dashboard');
        }
      } else {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {subjectInfo && (
            <SubjectHeader subject={subjectInfo} className="mb-2" />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Diagnostic Assessment
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Answer all questions to identify your learning gaps
          </p>
          {quizSource === 'ai' && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-xs font-medium text-blue-800">
              <span className="mr-1">✨</span> AI-Generated Questions
            </div>
          )}
        </motion.div>

        <Card className="backdrop-blur-sm bg-white/90">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  of {quizQuestions.length} questions
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
                </div>
                <p className="text-xs text-gray-600">Complete</p>
              </div>
            </div>
            
            {/* Enhanced Progress bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedOption === index
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-blue-400 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedOption === index
                            ? 'border-blue-600 bg-blue-600 shadow-md'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedOption === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-gray-800 font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                variant="primary"
                fullWidth
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? 'Analyzing...' : isLastQuestion ? '✓ Submit Quiz' : 'Next Question →'}
              </Button>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
