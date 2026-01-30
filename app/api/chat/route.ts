import { NextRequest, NextResponse } from "next/server";
import { callGroq, isGroqConfigured } from "@/lib/groq-ai";

interface ChatRequest {
  message: string;
  subject?: string;
  context?: string; // 'dashboard', 'profile', 'remediation'
  weakConcepts?: string[];
}

// Off-topic response
const OFF_TOPIC_RESPONSE = "I'm your study assistant focused on helping you with Physics, Chemistry, Mathematics, and Biology. I can answer questions about these subjects, explain concepts, provide study tips, and help you understand your quiz results. Please ask me something related to your studies! 📚";

// Check if question is study-related
function isStudyRelated(message: string): boolean {
  const studyKeywords = [
    // Subjects
    'physics', 'chemistry', 'math', 'mathematics', 'biology', 'science',
    // Study terms
    'study', 'learn', 'understand', 'explain', 'concept', 'topic', 'subject',
    'quiz', 'test', 'exam', 'question', 'answer', 'solve', 'calculate',
    'formula', 'equation', 'theory', 'law', 'principle', 'definition',
    // Performance terms
    'score', 'result', 'performance', 'weak', 'strong', 'improve', 'practice',
    'remediation', 'help', 'dashboard', 'progress', 'failure', 'risk',
    // Specific topics
    'calculus', 'algebra', 'trigonometry', 'geometry', 'mechanics', 'thermodynamics',
    'electrostatics', 'organic', 'inorganic', 'stoichiometry', 'genetics', 'ecology',
    'cell', 'molecule', 'atom', 'energy', 'force', 'motion', 'reaction',
    // Question words
    'what', 'how', 'why', 'when', 'where', 'explain', 'define', 'describe',
  ];

  const lowerMessage = message.toLowerCase();
  return studyKeywords.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const userMessage = body.message.trim();

    // Check if the question is study-related
    if (!isStudyRelated(userMessage)) {
      console.log('[CHATBOT] Off-topic question detected');
      return NextResponse.json({
        response: OFF_TOPIC_RESPONSE,
        source: "static",
      });
    }

    // Try to use AI if configured
    if (isGroqConfigured()) {
      try {
        console.log(`[CHATBOT] Processing study question with AI...`);
        
        // Build context-aware system prompt
        let systemPrompt = `You are an expert educational assistant specializing in Physics, Chemistry, Mathematics, and Biology. You help students understand concepts, solve problems, and improve their academic performance.

Guidelines:
- Provide clear, concise, and accurate explanations
- Use examples when helpful
- Break down complex topics into simple steps
- Be encouraging and supportive
- Focus on conceptual understanding
- Keep responses under 150 words unless explaining a complex topic`;

        // Add context-specific information
        if (body.context === 'dashboard' && body.weakConcepts && body.weakConcepts.length > 0) {
          systemPrompt += `\n\nContext: The student is on their dashboard. Their weak concepts are: ${body.weakConcepts.join(', ')}. Tailor your response to help with these areas if relevant.`;
        } else if (body.context === 'remediation' && body.subject) {
          systemPrompt += `\n\nContext: The student is studying ${body.subject} remediation content. Help them understand the concepts better.`;
        } else if (body.context === 'profile' && body.subject) {
          systemPrompt += `\n\nContext: The student is preparing to take a ${body.subject} quiz. Provide encouragement and study tips.`;
        }

        const aiResponse = await callGroq(userMessage, systemPrompt, {
          maxTokens: 500,
          temperature: 0.7,
        });

        console.log(`[CHATBOT] AI response generated successfully`);

        return NextResponse.json({
          response: aiResponse,
          source: "ai",
        });
      } catch (error) {
        console.error("[CHATBOT] Error using AI:", error);
        // Fall through to rule-based response
      }
    } else {
      console.log("[CHATBOT] Groq not configured, using rule-based responses");
    }

    // Fallback: Rule-based responses
    const response = getRuleBasedResponse(userMessage, body);

    return NextResponse.json({
      response,
      source: "rule-based",
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

// Rule-based fallback responses
function getRuleBasedResponse(message: string, context: ChatRequest): string {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm your study assistant. I can help you with Physics, Chemistry, Mathematics, and Biology. What would you like to learn about today? 📚";
  }

  // Help requests
  if (lowerMessage.includes('help')) {
    if (context.context === 'dashboard') {
      return "I can help you understand your quiz results, explain weak concepts, and provide study strategies. What specific topic would you like help with?";
    } else if (context.context === 'remediation') {
      return "I'm here to help you master this concept! Ask me to explain specific parts, provide examples, or clarify any confusion you have.";
    } else {
      return "I can help you with:\n• Understanding concepts in Physics, Chemistry, Math, and Biology\n• Explaining quiz results\n• Providing study tips\n• Clarifying difficult topics\n\nWhat would you like to know?";
    }
  }

  // Quiz/Test questions
  if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
    return "Take diagnostic quizzes to identify your weak areas! After completing a quiz, check your dashboard for personalized recommendations and detailed analysis of your performance.";
  }

  // Performance questions
  if (lowerMessage.includes('score') || lowerMessage.includes('performance') || lowerMessage.includes('result')) {
    if (context.weakConcepts && context.weakConcepts.length > 0) {
      return `Based on your quiz, you need to focus on: ${context.weakConcepts.join(', ')}. Click "Fix Me" on any concept to get detailed explanations and practice materials!`;
    }
    return "Your performance metrics are on the dashboard. You can track your progress, see weak concepts, and monitor improvement over time. Take a quiz to get personalized insights!";
  }

  // Concept/Topic questions
  if (lowerMessage.includes('concept') || lowerMessage.includes('topic') || lowerMessage.includes('explain')) {
    return "I can help explain concepts! After your quiz, visit the remediation page to get detailed explanations, worked examples, and study resources for topics you need to work on.";
  }

  // Subject-specific
  if (lowerMessage.includes('physics')) {
    return "Physics covers mechanics, electrostatics, thermodynamics, waves, and more. I can help you understand forces, energy, electricity, and motion. What specific physics topic interests you?";
  }
  if (lowerMessage.includes('chemistry')) {
    return "Chemistry includes organic chemistry, inorganic chemistry, acids & bases, and stoichiometry. I can help with chemical reactions, bonding, and calculations. What chemistry topic would you like to explore?";
  }
  if (lowerMessage.includes('math')) {
    return "Mathematics covers calculus, algebra, trigonometry, and geometry. I can help with derivatives, equations, functions, and problem-solving. What math topic do you need help with?";
  }
  if (lowerMessage.includes('biology')) {
    return "Biology includes genetics, cell biology, ecology, and evolution. I can help you understand life processes, organisms, and biological systems. What biology topic interests you?";
  }

  // Study tips
  if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
    return "Effective study tips:\n• Take regular quizzes to identify gaps\n• Focus on weak concepts first\n• Use the remediation materials\n• Practice with worked examples\n• Review regularly\n• Ask questions when confused\n\nWhat subject are you studying?";
  }

  // Improvement
  if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
    return "To improve your performance:\n1. Take diagnostic quizzes regularly\n2. Focus on your weak concepts\n3. Study the remediation materials thoroughly\n4. Practice with examples\n5. Track your progress on the dashboard\n\nConsistent practice is key! 💪";
  }

  // Default response
  return "I'm your study assistant for Physics, Chemistry, Mathematics, and Biology. I can help you understand concepts, explain topics, and improve your performance. What would you like to know? 📚";
}
