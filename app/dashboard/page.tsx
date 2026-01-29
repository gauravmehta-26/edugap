'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { dashboardData, weakConceptsBySubject, subjectPerformanceBySubject } from '@/lib/mockData';
import RiskCard from '@/components/dashboard/RiskCard';
import WeakConceptsList from '@/components/dashboard/WeakConceptsList';
import PerformanceCharts from '@/components/dashboard/PerformanceCharts';
import Chatbot from '@/components/ui/Chatbot';
import SubjectHeader from '@/components/ui/SubjectHeader';
import { AnalyzeResponse } from '@/lib/api';
import { useSubject } from '@/lib/SubjectContext';
import { SubjectId } from '@/lib/types';

export default function DashboardPage() {
  const { selectedSubject, getSubjectInfo } = useSubject();
  const router = useRouter();
  const [quizResult, setQuizResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  useEffect(() => {
    // Try to get quiz result from sessionStorage
    const storedResult = sessionStorage.getItem('quizResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        console.log('Loaded quiz result from sessionStorage:', result);
        setQuizResult(result);
        
        // Clear the stored result so it doesn't interfere with future quizzes
        // Comment this out if you want results to persist across page refreshes
        sessionStorage.removeItem('quizResult');
      } catch (error) {
        console.error('Failed to parse quiz result:', error);
      }
    } else {
      console.log('No quiz result in sessionStorage, using mock data');
    }
    setIsLoading(false);
  }, []);

  // Use API result if available, otherwise fall back to subject-specific mock data
  const subjectWeakConcepts = selectedSubject ? weakConceptsBySubject[selectedSubject] : [];
  const subjectPerformance = selectedSubject ? subjectPerformanceBySubject[selectedSubject] : dashboardData.subjectPerformance;
  
  // Calculate subject-specific risk percentage (average of weak concept risks)
  const subjectRiskPercentage = subjectWeakConcepts.length > 0
    ? Math.round(subjectWeakConcepts.reduce((sum, concept) => sum + (concept.riskPercentage || 0), 0) / subjectWeakConcepts.length)
    : dashboardData.examFailureRisk;
  
  // TODO: API needs to be updated to handle subject-specific questions
  // For now, always use subject-specific mock data since API doesn't know about subjects
  // Use API result if available and has data, otherwise use subject-specific mock data
  // const riskPercentage = (quizResult?.failureRisk !== undefined && quizResult?.failureRisk !== null) 
  //   ? quizResult.failureRisk 
  //   : subjectRiskPercentage;
  const riskPercentage = subjectRiskPercentage; // Always use subject-specific data
    
  // const weakConcepts = (quizResult?.weakConcepts && quizResult.weakConcepts.length > 0)
  //   ? quizResult.weakConcepts.map((concept, index) => ({
  //       id: `concept-${index}`,
  //       name: concept,
  //       riskPercentage: 75, // Default risk for API-provided concepts
  //       subject: selectedSubject!,
  //     }))
  //   : subjectWeakConcepts;
  const weakConcepts = subjectWeakConcepts; // Always use subject-specific data

  // Debug logging
  console.log('Dashboard data:', {
    selectedSubject,
    hasQuizResult: !!quizResult,
    quizResultFailureRisk: quizResult?.failureRisk,
    subjectRiskPercentage,
    finalRiskPercentage: riskPercentage,
    weakConceptsCount: weakConcepts.length,
    weakConceptsData: weakConcepts,
    performanceDataPoints: subjectPerformance.length
  });

  // Get subject info for display
  const subjectInfo = selectedSubject ? getSubjectInfo(selectedSubject) : null;

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

  if (isLoading || isRedirecting) {
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
          {subjectInfo && (
            <SubjectHeader subject={subjectInfo} className="mb-4" />
          )}
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
          <PerformanceCharts subjectPerformance={subjectPerformance} />
        </motion.div>
      </motion.div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
