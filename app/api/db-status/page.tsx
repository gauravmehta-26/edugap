'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime?: number;
  environment?: string;
  database: {
    status: string;
    connected: boolean;
    type: string;
    readyState?: number;
    readyStateText?: string;
    host?: string;
    name?: string;
  };
  api?: {
    analyze: string;
    remediate: string;
    saveResult: string;
  };
  error?: string;
}

export default function DBStatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      setHealth({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to connect to API',
        database: {
          status: 'unknown',
          connected: false,
          type: 'Unknown',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'connected' || status === 'healthy' || status === 'operational') {
      return 'text-green-600 bg-green-50';
    } else if (status === 'degraded' || status.includes('mock')) {
      return 'text-yellow-600 bg-yellow-50';
    } else {
      return 'text-red-600 bg-red-50';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'connected' || status === 'healthy' || status === 'operational') {
      return '✅';
    } else if (status === 'degraded' || status.includes('mock')) {
      return '⚠️';
    } else {
      return '❌';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Database Status
          </h1>
          <p className="text-gray-600">Monitor your MongoDB connection and API health</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {lastChecked && (
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            )}
          </div>
          <Button onClick={checkHealth} disabled={loading}>
            {loading ? 'Checking...' : 'Refresh Status'}
          </Button>
        </div>

        {health && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overall Status</h2>
                  <p className="text-gray-600">System health: {health.environment}</p>
                </div>
                <div className={`px-6 py-3 rounded-lg font-bold text-lg ${getStatusColor(health.status)}`}>
                  {getStatusIcon(health.status)} {health.status.toUpperCase()}
                </div>
              </div>
              {health.uptime && (
                <div className="mt-4 text-sm text-gray-600">
                  Uptime: {Math.floor(health.uptime / 60)} minutes
                </div>
              )}
            </Card>

            {/* Database Status */}
            <Card>
              <h2 className="text-2xl font-bold mb-4">Database Connection</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(health.database.status)}`}>
                    {getStatusIcon(health.database.status)} {health.database.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Type:</span>
                  <span className="text-gray-700">{health.database.type}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Connected:</span>
                  <span className="text-gray-700">{health.database.connected ? 'Yes' : 'No'}</span>
                </div>
                {health.database.readyStateText && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Ready State:</span>
                    <span className="text-gray-700">{health.database.readyStateText}</span>
                  </div>
                )}
                {health.database.host && health.database.host !== 'N/A' && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Host:</span>
                    <span className="text-gray-700">{health.database.host}</span>
                  </div>
                )}
                {health.database.name && health.database.name !== 'N/A' && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Database Name:</span>
                    <span className="text-gray-700">{health.database.name}</span>
                  </div>
                )}
              </div>

              {!health.database.connected && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-semibold mb-2">⚠️ Database Not Connected</p>
                  <p className="text-yellow-700 text-sm">
                    The application is running with mock data. To enable database features:
                  </p>
                  <ol className="list-decimal list-inside text-yellow-700 text-sm mt-2 space-y-1">
                    <li>Set MONGODB_URI in your .env.local file</li>
                    <li>Restart the development server</li>
                    <li>See MONGODB_SETUP.md for detailed instructions</li>
                  </ol>
                </div>
              )}
            </Card>

            {/* API Endpoints Status */}
            {health.api && (
              <Card>
                <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">/api/analyze:</span>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(health.api.analyze)}`}>
                      {getStatusIcon(health.api.analyze)} {health.api.analyze.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">/api/remediate:</span>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(health.api.remediate)}`}>
                      {getStatusIcon(health.api.remediate)} {health.api.remediate.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">/api/saveResult:</span>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(health.api.saveResult)}`}>
                      {getStatusIcon(health.api.saveResult)} {health.api.saveResult.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Error Display */}
            {health.error && (
              <Card>
                <h2 className="text-2xl font-bold mb-4 text-red-600">Error Details</h2>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-mono text-sm">{health.error}</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-600">
            <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
            {' | '}
            <a href="/api-test" className="text-blue-600 hover:underline">API Test Page</a>
          </p>
          <p className="text-sm text-gray-500">
            Need help? Check <code className="bg-gray-100 px-2 py-1 rounded">MONGODB_SETUP.md</code> or <code className="bg-gray-100 px-2 py-1 rounded">QUICK_MONGODB_SETUP.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
