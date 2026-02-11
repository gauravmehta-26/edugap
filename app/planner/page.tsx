'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import Link from 'next/link';

export default function StudyPlannerPage() {
  const [syllabus, setSyllabus] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setPlan({
        duration: '8 weeks',
        topics: [
          { week: 1, title: 'Mechanics Fundamentals', hours: 10, topics: ['Newton\'s Laws', 'Kinematics', 'Dynamics'] },
          { week: 2, title: 'Energy & Work', hours: 8, topics: ['Work-Energy Theorem', 'Conservation of Energy', 'Power'] },
          { week: 3, title: 'Thermodynamics', hours: 12, topics: ['Laws of Thermodynamics', 'Heat Transfer', 'Entropy'] },
          { week: 4, title: 'Electrostatics', hours: 10, topics: ['Electric Fields', 'Gauss\'s Law', 'Capacitance'] },
          { week: 5, title: 'Current Electricity', hours: 9, topics: ['Ohm\'s Law', 'Circuits', 'Kirchhoff\'s Laws'] },
          { week: 6, title: 'Magnetism', hours: 11, topics: ['Magnetic Fields', 'Electromagnetic Induction', 'Faraday\'s Law'] },
          { week: 7, title: 'Optics', hours: 8, topics: ['Reflection', 'Refraction', 'Lenses & Mirrors'] },
          { week: 8, title: 'Modern Physics', hours: 10, topics: ['Quantum Mechanics', 'Atomic Structure', 'Nuclear Physics'] },
        ],
        totalHours: 78,
        dailyStudyTime: '1.5 hours',
      });
      setIsGenerating(false);
    }, 2000);
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
          <ProfileDropdown />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            AI Study Planner
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your syllabus or paste it below, and get a personalized study plan powered by AI
          </p>
        </motion.div>

        {!plan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto"
          >
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Upload Syllabus (PDF, DOC, TXT)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-slate-600 mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500">PDF, DOC, DOCX, or TXT (Max 10MB)</p>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-sm text-slate-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Paste Your Syllabus
                </label>
                <textarea
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Paste your syllabus content here..."
                  className="w-full h-48 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-900"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGeneratePlan}
                disabled={!syllabus && !file || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Your Plan...
                  </span>
                ) : (
                  '✨ Generate Study Plan'
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Plan Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Personalized Study Plan</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-2">Duration</div>
                  <div className="text-3xl font-bold text-blue-600">{plan.duration}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <div className="text-sm font-medium text-purple-700 mb-2">Total Hours</div>
                  <div className="text-3xl font-bold text-purple-600">{plan.totalHours}h</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="text-sm font-medium text-green-700 mb-2">Daily Study</div>
                  <div className="text-3xl font-bold text-green-600">{plan.dailyStudyTime}</div>
                </div>
              </div>

              {/* Weekly Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Weekly Breakdown</h3>
                {plan.topics.map((week: any, index: number) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">Week {week.week}</div>
                        <h4 className="text-lg font-bold text-slate-900">{week.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">Study Time</div>
                        <div className="text-lg font-bold text-slate-900">{week.hours}h</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {week.topics.map((topic: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setPlan(null)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Generate New Plan
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
