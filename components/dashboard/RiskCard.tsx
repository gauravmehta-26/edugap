import Card from '../ui/Card';

interface RiskCardProps {
  riskPercentage: number;
}

export default function RiskCard({ riskPercentage }: RiskCardProps) {
  return (
    <Card className="text-center shadow-xl">
      <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-4 sm:mb-6">
        Exam Failure Risk
      </h2>
      <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-red-600 mb-3 sm:mb-4">
        {riskPercentage}%
      </div>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        Based on your diagnostic assessment
      </p>
    </Card>
  );
}
