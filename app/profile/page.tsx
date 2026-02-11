'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chatbot from '@/components/ui/Chatbot';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import { useSubject } from '@/lib/SubjectContext';
import { SubjectId } from '@/lib/types';

const subjects = [
  { 
    id: 'physics', 
    name: 'Physics', 
    icon: '⚛️',
    description: 'Mechanics, Electricity & Magnetism',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'mathematics', 
    name: 'Mathematics', 
    icon: '📐',
    description: 'Calculus, Algebra & Geometry',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    icon: '🧪',
    description: 'Organic, Inorganic & Physical',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    icon: '🧬',
    description: 'Genetics, Ecology & Physiology',
    color: 'from-orange-500 to-red-500'
  },
];

export default function ProfilePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const router = useRouter();
  const { setSelectedSubject: setGlobalSubject } = useSubject();

  const handleStartQuiz = () => {
    if (selectedSubject) {
      sessionStorage.removeItem('quizResult');
      setGlobalSubject(selectedSubject as SubjectId);
      router.push('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">EduGap</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/planner"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              📅 Study Planner
            </Link>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Your Learning Journey
            </h1>
            <p className="text-lg text-slate-600">
              Select a subject to begin your personalized diagnostic assessment
            </p>
          </div>

          {/* Subject Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Choose Your Subject
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                      selectedSubject === subject.id
                        ? 'ring-4 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <div className="flex items-center space-x-4 p-2">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-3xl">{subject.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {subject.description}
                        </p>
                      </div>
                      {selectedSubject === subject.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-lg">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start Quiz Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto mb-12"
          >
            <Button
              onClick={handleStartQuiz}
              variant="primary"
              fullWidth
              disabled={!selectedSubject}
            >
              {selectedSubject ? '🚀 Start Diagnostic Quiz' : 'Select a Subject to Continue'}
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/90">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Progress Overview
                </h2>
                <p className="text-slate-600">
                  Track your learning achievements
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">0</p>
                  <p className="text-sm text-slate-600 font-medium">Quizzes Taken</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-1">0%</p>
                  <p className="text-sm text-slate-600 font-medium">Avg Score</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-1">0</p>
                  <p className="text-sm text-slate-600 font-medium">Concepts Fixed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-1">0</p>
                  <p className="text-sm text-slate-600 font-medium">Study Hours</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Chatbot 
        subject={selectedSubject || undefined}
        context="profile"
      />
    </div>
  );
}
