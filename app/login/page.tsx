'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (isValidEmail(email)) {
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">E</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            EduGap
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Identify and close your learning gaps
          </p>
        </motion.div>

        <Card className="w-full backdrop-blur-sm bg-white/90">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Enter your email to continue your learning journey
              </p>
            </div>

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              id="email-input"
            />

            <Button
              onClick={handleLogin}
              variant="primary"
              fullWidth
              disabled={!isValidEmail(email)}
            >
              Continue to Dashboard
            </Button>

            <div className="text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-600 font-medium">Track Progress</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs text-gray-600 font-medium">Identify Gaps</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🚀</div>
            <p className="text-xs text-gray-600 font-medium">Improve Fast</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
