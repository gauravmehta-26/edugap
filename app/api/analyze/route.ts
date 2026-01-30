import { NextRequest, NextResponse } from "next/server";
import { analyzeQuizResults, isGroqConfigured } from "@/lib/groq-ai";

interface QuizAnswer {
  questionId: number | string;
  selectedOption: number;
  correctAnswer?: number;
  topic?: string;
  questionText?: string;
  options?: string[];
}

interface AnalyzeRequest {
  answers: QuizAnswer[];
  subject?: string;
}

// Mock correct answers for demo purposes (support both string and number IDs)
const CORRECT_ANSWERS: Record<string, number> = {
  "1": 2,
  q1: 1, // Calculus: derivative of x²
  "2": 1,
  q2: 1, // Electrostatics: F = kq₁q₂/r²
  "3": 3,
  q3: 1, // Trigonometry: sin²θ + cos²θ = 1
  "4": 0,
  q4: 0, // Quadratic formula
  "5": 2,
  q5: 1, // Electric potential unit: Volt
};

// Concept mapping for questions
const QUESTION_CONCEPTS: Record<string, string> = {
  "1": "Differential Calculus",
  q1: "Differential Calculus",
  "2": "Electrostatics",
  q2: "Electrostatics",
  "3": "Trigonometry",
  q3: "Trigonometry",
  "4": "Quadratic Equations",
  q4: "Quadratic Equations",
  "5": "Electrostatics",
  q5: "Electrostatics",
};

// Generate intelligent summary based on performance
function generateSummary(
  wrongCount: number,
  totalQuestions: number,
  weakConcepts: string[],
  subject?: string,
): string {
  const percentage = ((totalQuestions - wrongCount) / totalQuestions) * 100;

  if (wrongCount === 0) {
    return `Outstanding performance in ${subject || "this quiz"}! You've demonstrated mastery of all concepts with 100% accuracy. Keep up the excellent work!`;
  } else if (wrongCount === 1) {
    return `Strong performance with ${percentage.toFixed(0)}% accuracy. You have a solid grasp of ${subject || "the material"}, with only minor gaps in ${weakConcepts.join(", ")}. A quick review should solidify your understanding.`;
  } else if (wrongCount === 2) {
    return `Moderate performance with ${percentage.toFixed(0)}% accuracy. You understand the basics but need focused practice in ${weakConcepts.join(" and ")}. These concepts are crucial for ${subject || "your success"}.`;
  } else if (wrongCount === 3) {
    return `Your performance shows significant gaps in ${weakConcepts.join(", ")}. With ${percentage.toFixed(0)}% accuracy, immediate attention to these weak areas is recommended to prevent falling behind in ${subject || "this subject"}.`;
  } else {
    return `Critical learning gaps detected with only ${percentage.toFixed(0)}% accuracy. Multiple concepts (${weakConcepts.join(", ")}) require immediate remediation. Consider seeking additional help and dedicating focused study time to ${subject || "these topics"}.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Invalid request: answers array required" },
        { status: 400 },
      );
    }

    // Handle empty answers safely
    if (body.answers.length === 0) {
      return NextResponse.json({
        failureRisk: 0,
        weakConcepts: [],
        summary: "No answers submitted.",
        correctAnswers: 0,
        totalQuestions: 0,
      });
    }

    // Analyze answers - use correctAnswer from the answer object if available
    let wrongCount = 0;
    const weakConcepts: string[] = [];

    body.answers.forEach((answer) => {
      const qId = String(answer.questionId);
      
      // Use correctAnswer from the answer object (for AI-generated questions)
      // or fall back to CORRECT_ANSWERS map (for mock questions)
      const correctAnswer = answer.correctAnswer !== undefined 
        ? answer.correctAnswer 
        : CORRECT_ANSWERS[qId];

      if (correctAnswer !== undefined && answer.selectedOption !== correctAnswer) {
        wrongCount++;
        
        // Use topic from answer object (for AI-generated questions)
        // or fall back to QUESTION_CONCEPTS map (for mock questions)
        const concept = answer.topic || QUESTION_CONCEPTS[qId];
        if (concept && !weakConcepts.includes(concept)) {
          weakConcepts.push(concept);
        }
      }
    });

    const totalQuestions = body.answers.length;
    const correctAnswers = totalQuestions - wrongCount;

    // Try to use AI analysis if Groq is configured
    if (isGroqConfigured() && body.subject) {
      try {
        console.log(`[GROQ AI] Analyzing ${body.subject} quiz: ${correctAnswers}/${totalQuestions} correct`);
        console.log(`[GROQ AI] Weak concepts identified: ${weakConcepts.join(', ') || 'None'}`);
        
        const aiAnalysis = await analyzeQuizResults(
          body.subject,
          correctAnswers,
          totalQuestions,
          weakConcepts
        );

        console.log(`[GROQ AI] AI analysis complete - Failure risk: ${aiAnalysis.failureRisk}%`);

        // Stable ordering of weak concepts
        weakConcepts.sort();

        const response = {
          failureRisk: Math.min(Math.round(aiAnalysis.failureRisk), 100),
          weakConcepts,
          summary: aiAnalysis.summary,
          correctAnswers,
          totalQuestions,
          recommendations: aiAnalysis.recommendations,
          source: "ai",
        };

        return NextResponse.json(response, { status: 200 });
      } catch (error) {
        console.error("[GROQ AI] Error using AI analysis:", error);
        console.error("[GROQ AI] Falling back to rule-based analysis");
        // Fall through to rule-based analysis
      }
    } else {
      if (!isGroqConfigured()) {
        console.log("[GROQ AI] Groq not configured, using rule-based analysis");
      }
      if (!body.subject) {
        console.log("[GROQ AI] No subject provided, using rule-based analysis");
      }
    }

    // Fallback: Calculate failure risk based on performance (rule-based)
    let failureRisk: number;
    if (wrongCount === 0) {
      failureRisk = 5;
    } else if (wrongCount === 1) {
      failureRisk = 25;
    } else if (wrongCount === 2) {
      failureRisk = 50;
    } else if (wrongCount === 3) {
      failureRisk = 75;
    } else {
      failureRisk = 90;
    }

    // Generate intelligent summary
    const summary = generateSummary(
      wrongCount,
      totalQuestions,
      weakConcepts,
      body.subject,
    );

    // Stable ordering of weak concepts
    weakConcepts.sort();

    const response = {
      failureRisk: Math.min(failureRisk, 100),
      weakConcepts,
      summary,
      correctAnswers,
      totalQuestions,
      source: "rule-based",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Failed to analyze quiz results" },
      { status: 500 },
    );
  }
}
