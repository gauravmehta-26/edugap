import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions, isGroqConfigured } from "@/lib/groq-ai";
import { quizQuestionsBySubject } from "@/lib/mockData";
import { SubjectId } from "@/lib/types";

interface GenerateQuizRequest {
  subject: SubjectId;
  numQuestions?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuizRequest = await request.json();

    if (!body.subject) {
      return NextResponse.json(
        { error: "Invalid request: subject required" },
        { status: 400 }
      );
    }

    const numQuestions = body.numQuestions || 5;

    // Try to generate AI questions if Groq is configured
    if (isGroqConfigured()) {
      try {
        console.log(`[GROQ AI] Generating ${numQuestions} quiz questions for ${body.subject}...`);
        const aiQuestions = await generateQuizQuestions(body.subject, numQuestions);
        
        // Add subject to each question
        const questionsWithSubject = aiQuestions.map(q => ({
          ...q,
          subject: body.subject,
        }));
        
        console.log(`[GROQ AI] Successfully generated ${questionsWithSubject.length} questions`);
        
        return NextResponse.json({
          questions: questionsWithSubject,
          source: "ai",
          subject: body.subject,
        });
      } catch (error) {
        console.error("[GROQ AI] Error generating AI questions:", error);
        console.error("[GROQ AI] Falling back to mock data");
        // Fall through to mock data
      }
    } else {
      console.log("[GROQ AI] Groq not configured, using mock data");
    }

    // Fallback to mock data
    const mockQuestions = quizQuestionsBySubject[body.subject] || [];
    
    return NextResponse.json({
      questions: mockQuestions.slice(0, numQuestions),
      source: "mock",
      subject: body.subject,
    });
  } catch (error) {
    console.error("Error in /api/generate-quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz questions" },
      { status: 500 }
    );
  }
}
