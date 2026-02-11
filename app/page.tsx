'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">EduGap</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
            <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-blue-700">Smart Learning Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Close Your Learning Gaps
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Before They Widen
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Identify knowledge gaps instantly with AI-powered diagnostics. Get personalized remediation that adapts to your learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all">
                Start Free Diagnostic
              </Link>
              <a href="#how-it-works" className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
                See How It Works
              </a>
            </div>
            <p className="text-sm text-slate-500 mt-6">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-4">
                The Problem
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Students fail exams not because they don't study
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                They fail because they don't know what they don't know. Traditional learning doesn't identify gaps until it's too late.
              </p>
              <ul className="space-y-4">
                {['Unclear weak areas', 'Generic study materials', 'No personalized guidance', 'Late failure detection'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs">✕</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
                Our Solution
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                AI that finds and fixes gaps before exams
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                EduGap uses advanced AI to diagnose your knowledge gaps and create personalized learning paths that actually work.
              </p>
              <ul className="space-y-4">
                {['Pinpoint weak concepts', 'Personalized remediation', 'Personalized study plans', 'Real-time progress tracking'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI to deliver personalized learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Smart Diagnostics',
                description: 'AI-powered quizzes that identify your exact knowledge gaps across subjects',
                link: '/login'
              },
              {
                icon: '🧠',
                title: 'Personalized Remediation',
                description: 'Custom learning materials generated specifically for your weak areas',
                link: '/login'
              },
              {
                icon: '📊',
                title: 'Real-Time Analytics',
                description: 'Track your progress and see your failure risk decrease as you learn',
                link: '/login'
              },
              {
                icon: '📅',
                title: 'AI Study Planner',
                description: 'Upload your syllabus and get a personalized study plan powered by AI',
                link: '/planner'
              },
              {
                icon: '🎓',
                title: 'Multi-Subject Support',
                description: 'Physics, Chemistry, Mathematics, Biology - all in one platform',
                link: '/login'
              },
              {
                icon: '💬',
                title: 'AI Study Assistant',
                description: 'Chat with AI to get instant explanations and clarifications',
                link: '/login'
              }
            ].map((feature, idx) => (
              <a
                key={idx}
                href={feature.link}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:scale-105 transition-all block"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How EduGap Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From diagnosis to mastery in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Take Diagnostic Quiz', description: 'Answer adaptive questions tailored to your subject' },
              { step: '02', title: 'Get Instant Analysis', description: 'See your weak concepts and failure risk percentage' },
              { step: '03', title: 'Learn & Practice', description: 'Access personalized remediation content and resources' },
              { step: '04', title: 'Track Progress', description: 'Watch your understanding improve in real-time' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-blue-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by students everywhere
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See how EduGap is transforming learning outcomes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Class 12 Student', quote: 'EduGap helped me identify my weak areas in Physics. My test scores improved by 40% in just 3 weeks!' },
              { name: 'Rahul Verma', role: 'Engineering Aspirant', quote: 'The adaptive questions are spot-on. It\'s like having a personal tutor who knows exactly what I need to work on.' },
              { name: 'Ananya Patel', role: 'Medical Student', quote: 'I was struggling with Chemistry until I found EduGap. The personalized remediation made complex topics so much clearer.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <p className="text-white text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to close your learning gaps?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of students who are learning smarter, not harder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 w-full sm:w-96 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900"
            />
            <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all whitespace-nowrap">
              Get Started Free
            </Link>
          </div>
          <p className="text-sm text-slate-500">Start your free diagnostic quiz today • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-semibold">EduGap</span>
              </div>
              <p className="text-slate-400 text-sm">
                Smart learning platform helping students identify and close knowledge gaps.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Subjects</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Physics</li>
                <li>Chemistry</li>
                <li>Mathematics</li>
                <li>Biology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>support@edugap.com</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2026 EduGap. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
