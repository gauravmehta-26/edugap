'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { remediationContent } from '@/lib/mockData';
import ConceptContent from '@/components/remediation/ConceptContent';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getRemediation, RemediationResponse } from '@/lib/api';

function RemediationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conceptId = searchParams.get('concept');
  const [isFixed, setIsFixed] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      if (!conceptId) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        // Try to fetch from API first
        const apiContent = await getRemediation(conceptId);
        setContent({
          title: apiContent.concept,
          explanation: apiContent.explanation,
          example: apiContent.example,
          commonMistake: apiContent.commonMistake,
          tip: apiContent.tip,
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch from API, using mock data:', err);
        // Fall back to mock data
        if (remediationContent[conceptId]) {
          setContent(remediationContent[conceptId]);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
        }
      }
    }

    fetchContent();
  }, [conceptId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading remediation content...</p>
        </div>
      </div>
    );
  }

  // Handle missing concept ID or error
  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="text-center backdrop-blur-sm bg-white/90">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Concept Not Found
            </h1>
            <p className="text-base text-gray-600 mb-6">
              The concept you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/dashboard')} fullWidth>
              ← Return to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleMarkAsFixed = () => {
    setIsFixed(true);
    setTimeout(() => {
      setIsFixed(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Learn & Improve
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Master this concept to close your learning gap
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="backdrop-blur-sm bg-white/90">
            <ConceptContent content={content} />

            {/* Mark as Fixed button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                onClick={handleMarkAsFixed}
                fullWidth
                variant={isFixed ? 'secondary' : 'primary'}
              >
                {isFixed ? '✓ Marked as Fixed!' : '✓ Mark as Fixed'}
              </Button>
            </motion.div>

            {/* Success feedback */}
            {isFixed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center"
              >
                <span className="text-2xl mb-2 block">🎉</span>
                <p className="text-green-700 font-semibold">
                  Great! Keep practicing this concept.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-base text-gray-700 hover:text-blue-600 font-semibold transition-colors group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function RemediationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RemediationContent />
    </Suspense>
  );
}
