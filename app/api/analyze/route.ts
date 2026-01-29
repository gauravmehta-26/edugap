import { NextRequest, NextResponse } from 'next/server';

interface QuizAnswer {
  questionId: number | string;
  selectedOption: number;
}

interface AnalyzeRequest {
  answers: QuizAnswer[];
}

// Mock correct answers for demo purposes (support both string and number IDs)
const CORRECT_ANSWERS: Record<string, number> = {
  '1': 2, 'q1': 1, // Calculus: derivative of x²
  '2': 1, 'q2': 1, // Electrostatics: F = kq₁q₂/r²
  '3': 3, 'q3': 1, // Trigonometry: sin²θ + cos²θ = 1
  '4': 0, 'q4': 0, // Quadratic formula
  '5': 2, 'q5': 1, // Electric potential unit: Volt
};

// Concept mapping for questions
const QUESTION_CONCEPTS: Record<string, string> = {
  '1': 'Differential Calculus', 'q1': 'Differential Calculus',
  '2': 'Electrostatics', 'q2': 'Electrostatics',
  '3': 'Trigonometry', 'q3': 'Trigonometry',
  '4': 'Quadratic Equations', 'q4': 'Quadratic Equations',
  '5': 'Electrostatics', 'q5': 'Electrostatics',
};

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'Invalid request: answers array required' },
        { status: 400 }
      );
    }

    // Analyze answers
    let wrongCount = 0;
    const weakConcepts: string[] = [];

    body.answers.forEach((answer) => {
      const qId = String(answer.questionId);
      const correctAnswer = CORRECT_ANSWERS[qId];
      if (correctAnswer !== undefined && answer.selectedOption !== correctAnswer) {
        wrongCount++;
        const concept = QUESTION_CONCEPTS[qId];
        if (concept && !weakConcepts.includes(concept)) {
          weakConcepts.push(concept);
        }
      }
    });

    // Calculate failure risk based on wrong answers
    const totalQuestions = body.answers.length;
    const wrongPercentage = (wrongCount / totalQuestions) * 100;
    
    // Risk calculation logic
    let failureRisk: number;
    let summary: string;

    if (wrongCount === 0) {
      failureRisk = 5;
      summary = 'Excellent performance! Very low risk.';
    } else if (wrongCount === 1) {
      failureRisk = 25;
      summary = 'Good performance with minor gaps.';
    } else if (wrongCount === 2) {
      failureRisk = 50;
      summary = 'Moderate risk. Focus on weak areas.';
    } else if (wrongCount === 3) {
      failureRisk = 75;
      summary = 'High risk due to multiple weak concepts.';
    } else {
      failureRisk = 90;
      summary = 'Critical risk. Immediate attention needed.';
    }

    const response = {
      failureRisk,
      weakConcepts,
      summary,
      correctAnswers: totalQuestions - wrongCount,
      totalQuestions,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze quiz results' },
      { status: 500 }
    );
  }
}
