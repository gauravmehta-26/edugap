import { RemediationContent } from '@/lib/types';

interface ConceptContentProps {
  content: RemediationContent;
}

export default function ConceptContent({ content }: ConceptContentProps) {
  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Concept Name as Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {content.conceptName}
      </h1>

      {/* Explanation Section */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Explanation</h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {content.explanation}
        </p>
      </div>

      {/* Example Section with Highlighted Styling */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Example</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg shadow-sm">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
            {content.example}
          </p>
        </div>
      </div>

      {/* Common Mistake Section with Warning Styling */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Common Mistake</h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-lg shadow-sm">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
            {content.commonMistake}
          </p>
        </div>
      </div>
    </div>
  );
}
