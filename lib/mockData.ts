import { QuizQuestion, DashboardData, RemediationContent } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: 1
  },
  {
    id: 'q2',
    question: 'What is the formula for electric force between two charges?',
    options: ['F = ma', 'F = kq₁q₂/r²', 'F = GMm/r²', 'F = qE'],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: 'What is sin²θ + cos²θ equal to?',
    options: ['0', '1', 'tan²θ', 'sin(2θ)'],
    correctAnswer: 1
  },
  {
    id: 'q4',
    question: 'What is the quadratic formula?',
    options: [
      'x = -b ± √(b² - 4ac) / 2a',
      'x = b ± √(b² + 4ac) / 2a',
      'x = -b ± √(b² + 4ac) / a',
      'x = b ± √(b² - 4ac) / a'
    ],
    correctAnswer: 0
  },
  {
    id: 'q5',
    question: 'What is the unit of electric potential?',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correctAnswer: 1
  }
];

export const dashboardData: DashboardData = {
  examFailureRisk: 68,
  weakConcepts: [
    { id: 'electrostatics', name: 'Electrostatics', riskPercentage: 85 },
    { id: 'trigonometry', name: 'Trigonometry', riskPercentage: 72 },
    { id: 'calculus', name: 'Differential Calculus', riskPercentage: 65 },
    { id: 'quadratic', name: 'Quadratic Equations', riskPercentage: 58 }
  ],
  subjectPerformance: [
    { subject: 'Physics', score: 45 },
    { subject: 'Mathematics', score: 52 },
    { subject: 'Chemistry', score: 68 },
    { subject: 'Biology', score: 72 }
  ]
};

export const remediationContent: Record<string, RemediationContent> = {
  electrostatics: {
    conceptId: 'electrostatics',
    conceptName: 'Electrostatics',
    explanation: 'Electrostatics is the study of electric charges at rest. The fundamental principle is Coulomb\'s Law, which states that the force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them: F = kq₁q₂/r², where k is Coulomb\'s constant (8.99 × 10⁹ N⋅m²/C²).',
    example: 'Consider two charges: q₁ = +5μC and q₂ = -3μC separated by 2cm. The force between them is F = (8.99 × 10⁹)(5 × 10⁻⁶)(-3 × 10⁻⁶)/(0.02)² = -337.125 N. The negative sign indicates attraction.',
    commonMistake: 'Students often forget that like charges repel and unlike charges attract. Also, remember to convert all units to SI units (meters, coulombs) before calculating.'
  },
  trigonometry: {
    conceptId: 'trigonometry',
    conceptName: 'Trigonometry',
    explanation: 'Trigonometry deals with relationships between angles and sides of triangles. The fundamental identity sin²θ + cos²θ = 1 is derived from the Pythagorean theorem and is essential for solving many problems.',
    example: 'If sin(θ) = 3/5, find cos(θ). Using sin²θ + cos²θ = 1: (3/5)² + cos²θ = 1, so cos²θ = 1 - 9/25 = 16/25, therefore cos(θ) = ±4/5.',
    commonMistake: 'Don\'t forget that cosine can be positive or negative depending on the quadrant. Always check the angle range to determine the correct sign.'
  },
  calculus: {
    conceptId: 'calculus',
    conceptName: 'Differential Calculus',
    explanation: 'Differential calculus focuses on rates of change. The derivative of a function represents the instantaneous rate of change. For power functions, use the power rule: d/dx(xⁿ) = nxⁿ⁻¹.',
    example: 'Find the derivative of f(x) = x². Using the power rule: f\'(x) = 2x²⁻¹ = 2x. This means the slope of the tangent line at any point x is 2x.',
    commonMistake: 'Students often forget to reduce the exponent by 1 after bringing it down as a coefficient. Remember: the exponent decreases by exactly 1.'
  },
  quadratic: {
    conceptId: 'quadratic',
    conceptName: 'Quadratic Equations',
    explanation: 'Quadratic equations have the form ax² + bx + c = 0. The quadratic formula x = (-b ± √(b² - 4ac)) / 2a gives the solutions. The discriminant (b² - 4ac) determines the nature of roots: positive means two real roots, zero means one repeated root, negative means complex roots.',
    example: 'Solve 2x² + 5x - 3 = 0. Here a=2, b=5, c=-3. x = (-5 ± √(25 + 24)) / 4 = (-5 ± 7) / 4. So x = 1/2 or x = -3.',
    commonMistake: 'The most common error is forgetting the negative sign before b in the formula. It\'s -b, not b. Also, remember to divide by 2a, not just a.'
  }
};
