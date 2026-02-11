'use client';

import { useState } from 'react';
import { analyzeQuiz, getRemediation, saveResult } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function APITestPage() {
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [remediationResult, setRemediationResult] = useState<any>(null);
  const [saveResultResponse, setSaveResultResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeQuiz([
        { questionId: 'q1', selectedOption: 0 },
        { questionId: 'q2', selectedOption: 0 },
        { questionId: 'q3', selectedOption: 3 },
      ]);
      setAnalyzeResult(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze quiz');
    } finally {
      setLoading(false);
    }
  };

  const testRemediate = async () => {
    setLoading(true);
    try {
      const result = await getRemediation('Electrostatics');
      setRemediationResult(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get remediation');
    } finally {
      setLoading(false);
    }
  };

  const testSaveResult = async () => {
    setLoading(true);
    try {
      const result = await saveResult('test@example.com', 75, ['Electrostatics', 'Kinematics']);
      setSaveResultResponse(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          API Test Page
        </h1>

        <div className="space-y-6">
          {/* Test Analyze API */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Test /api/analyze</h2>
            <Button onClick={testAnalyze} disabled={loading}>
              Test Analyze Quiz
            </Button>
            {analyzeResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(analyzeResult, null, 2)}
                </pre>
              </div>
            )}
          </Card>

          {/* Test Remediate API */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Test /api/remediate</h2>
            <Button onClick={testRemediate} disabled={loading}>
              Test Get Remediation
            </Button>
            {remediationResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(remediationResult, null, 2)}
                </pre>
              </div>
            )}
          </Card>

          {/* Test Save Result API */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Test /api/saveResult</h2>
            <Button onClick={testSaveResult} disabled={loading}>
              Test Save Result
            </Button>
            {saveResultResponse && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(saveResultResponse, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Visit <a href="/api/health" className="text-blue-600 hover:underline">/api/health</a> to check API status</p>
        </div>
      </div>
    </div>
  );
}
