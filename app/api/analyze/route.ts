import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/src/lib/bedrock";

interface QuizAnswer {
  questionId: number | string;
  selectedOption: number;
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

    // Analyze answers using mock data
    let wrongCount = 0;
    const weakConcepts: string[] = [];
    const incorrectQuestions: Array<{
      questionId: string;
      concept: string;
      selectedOption: number;
      correctOption: number;
    }> = [];

    body.answers.forEach((answer) => {
      const qId = String(answer.questionId);
      const correctAnswer = CORRECT_ANSWERS[qId];

      if (
        correctAnswer !== undefined &&
        answer.selectedOption !== correctAnswer
      ) {
        wrongCount++;
        const concept = QUESTION_CONCEPTS[qId];
        if (concept && !weakConcepts.includes(concept)) {
          weakConcepts.push(concept);
        }
        incorrectQuestions.push({
          questionId: qId,
          concept,
          selectedOption: answer.selectedOption,
          correctOption: correctAnswer,
        });
      }
    });

    const totalQuestions = body.answers.length;
    const correctAnswers = totalQuestions - wrongCount;

    // Use AI to generate intelligent analysis
    try {
      const systemPrompt = `You are an educational assessment expert. Analyze student quiz performance and provide insights about their learning gaps and failure risk.`;

      const prompt = `
A student completed a ${body.subject || "general"} quiz with the following results:
- Total Questions: ${totalQuestions}
- Correct Answers: ${correctAnswers}
- Incorrect Answers: ${wrongCount}
- Weak Concepts Identified: ${weakConcepts.join(", ") || "None"}

Incorrect Questions:
${incorrectQuestions.map((q) => `- Question ${q.questionId} (${q.concept}): Selected option ${q.selectedOption}, Correct option ${q.correctOption}`).join("\n")}

Please provide:
1. A failure risk percentage (0-100) based on the performance
2. A brief summary (2-3 sentences) explaining the student's performance and areas of concern

Respond in JSON format:
{
  "failureRisk": <number 0-100>,
  "summary": "<string>"
}`;

      const aiResponse = await invokeClaude(prompt, systemPrompt);

      // Parse AI response
      const aiAnalysis = JSON.parse(aiResponse);

      // Stable ordering of weak concepts
      weakConcepts.sort();

      const response = {
        failureRisk: Math.min(Math.max(aiAnalysis.failureRisk, 0), 100),
        weakConcepts,
        summary: aiAnalysis.summary,
        correctAnswers,
        totalQuestions,
      };

      return NextResponse.json(response, { status: 200 });
    } catch (aiError) {
      console.error("AI analysis failed, using fallback logic:", aiError);

      // Fallback to rule-based analysis if AI fails
      let failureRisk: number;
      let summary: string;

      if (wrongCount === 0) {
        failureRisk = 5;
        summary = "Excellent performance! Very low risk.";
      } else if (wrongCount === 1) {
        failureRisk = 25;
        summary = "Good performance with minor gaps.";
      } else if (wrongCount === 2) {
        failureRisk = 50;
        summary = "Moderate risk. Focus on weak areas.";
      } else if (wrongCount === 3) {
        failureRisk = 75;
        summary = "High risk due to multiple weak concepts.";
      } else {
        failureRisk = 90;
        summary = "Critical risk. Immediate attention needed.";
      }

      weakConcepts.sort();

      const response = {
        failureRisk: Math.min(failureRisk, 100),
        weakConcepts,
        summary,
        correctAnswers,
        totalQuestions,
      };

      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Failed to analyze quiz results" },
      { status: 500 },
    );
  }
}
