'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import Card from '../ui/Card';

interface PerformanceChartsProps {
  subjectPerformance: {
    subject: string;
    score: number;
  }[];
}

export default function PerformanceCharts({ subjectPerformance }: PerformanceChartsProps) {
  // Transform data for radar chart (knowledge gaps = 100 - score)
  const radarData = subjectPerformance.map(item => ({
    subject: item.subject,
    gap: 100 - item.score,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Bar Chart - Subject Performance */}
      <Card>
        <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-4 sm:mb-6">
          Subject Performance
        </h2>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#4b5563' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4b5563' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
            <Bar dataKey="score" fill="#3b82f6" name="Score %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Radar Chart - Knowledge Gap Analysis */}
      <Card>
        <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-4 sm:mb-6">
          Knowledge Gap Analysis
        </h2>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#4b5563' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4b5563' }} />
            <Radar
              name="Knowledge Gap %"
              dataKey="gap"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
