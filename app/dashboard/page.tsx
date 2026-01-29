'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardData } from '@/lib/mockData';
import RiskCard from '@/components/dashboard/RiskCard';
import WeakConceptsList from '@/components/dashboard/WeakConceptsList';
import PerformanceCharts from '@/components/dashboard/PerformanceCharts';
import Chatbot from '@/components/ui/Chatbot';
import { AnalyzeResponse } from '@/lib/api';

export default function DashboardPage() {
  const [quizResult, setQuizResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get quiz result from sessionStorage
    const storedResult = sessionStorage.getItem('quizResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setQuizResult(result);
      } catch (error) {
        console.error('Failed to parse quiz result:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Use API result if available, otherwise fall back to mock data
  const riskPercentage = quizResult?.failureRisk ?? dashboardData.examFailureRisk;
  const weakConcepts = quizResult?.weakConcepts.map((concept, index) => ({
    id: index + 1,
    name: concept,
    severity: 'high' as const,
  })) ?? dashboardData.weakConcepts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Heading */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Your Learning Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress and identify areas for improvement
          </p>
        </motion.div>

        {/* Grid layout for risk card and weak concepts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <div className="lg:col-span-1">
            <RiskCard riskPercentage={riskPercentage} />
          </div>
          <div className="lg:col-span-2">
            <WeakConceptsList concepts={weakConcepts} />
          </div>
        </motion.div>

        {/* Charts section */}
        <motion.div variants={itemVariants}>
          <PerformanceCharts subjectPerformance={dashboardData.subjectPerformance} />
        </motion.div>
      </motion.div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
