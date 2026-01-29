import { NextRequest, NextResponse } from "next/server";
import { invokeClaude } from "@/src/lib/bedrock";

interface RemediateRequest {
  concept: string;
  subject?: string;
}

interface RemediationContent {
  concept: string;
  explanation: string;
  example: string;
  commonMistake: string;
  tip: string;
}

// Predefined remediation content for demo reliability (fallback)
const REMEDIATION_CONTENT: Record<string, RemediationContent> = {
  Electrostatics: {
    concept: "Electrostatics",
    explanation:
      "Electrostatics deals with stationary electric charges. Key principles include Coulomb's Law (force between charges), electric fields, and electric potential. The fundamental formula is F = kq₁q₂/r², where k is Coulomb's constant (8.99 × 10⁹ N⋅m²/C²).",
    example:
      "Example: Two charges +2μC and -3μC are 0.5m apart. The force between them is F = k|q₁q₂|/r² = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/(0.5)² = 0.216 N (attractive force).",
    commonMistake:
      "Students often forget that like charges repel and unlike charges attract. Also, remember to convert all units to SI units (meters, coulombs) before calculating.",
    tip: "Quick tip: Always draw field lines from positive to negative charges. The electric field direction is defined by the force on a positive test charge.",
  },
  "Differential Calculus": {
    concept: "Differential Calculus",
    explanation:
      "Differential calculus focuses on rates of change. The derivative of a function represents the instantaneous rate of change. For power functions, use the power rule: d/dx(xⁿ) = nxⁿ⁻¹.",
    example:
      "Example: Find the derivative of f(x) = x². Using the power rule: f'(x) = 2x²⁻¹ = 2x.",
    commonMistake:
      "Students often forget to reduce the exponent by 1 after bringing it down as a coefficient.",
    tip: "Practice the power rule with various exponents. Remember that the derivative of a constant is 0.",
  },
  Trigonometry: {
    concept: "Trigonometry",
    explanation:
      "Trigonometry deals with relationships between angles and sides of triangles. The fundamental identity sin²θ + cos²θ = 1 is essential for solving many problems.",
    example:
      "Example: If sin(θ) = 3/5, find cos(θ). Using sin²θ + cos²θ = 1, cos(θ) = ±4/5.",
    commonMistake:
      "Forgetting that cosine can be positive or negative depending on the quadrant.",
    tip: "Remember SOHCAHTOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse.",
  },
  "Quadratic Equations": {
    concept: "Quadratic Equations",
    explanation:
      "Quadratic equations have the form ax² + bx + c = 0. The quadratic formula gives the solutions.",
    example: "Example: Solve 2x² + 5x - 3 = 0 using the quadratic formula.",
    commonMistake:
      "Forgetting the negative sign before b or dividing by a instead of 2a.",
    tip: "Always check the discriminant to understand the nature of roots.",
  },
  Kinematics: {
    concept: "Kinematics",
    explanation:
      "Kinematics describes motion without considering forces. Key equations include v = u + at and s = ut + ½at².",
    example:
      "Example: A car accelerates from rest at 2 m/s² for 5 seconds. Final velocity is 10 m/s.",
    commonMistake: "Mixing up velocity and speed or using incorrect signs.",
    tip: "Always list known variables and draw a motion diagram.",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: RemediateRequest = await request.json();

    if (!body.concept) {
      return NextResponse.json(
        { error: "Invalid request: concept required" },
        { status: 400 },
      );
    }

    // Normalize concept input
    const conceptKey = body.concept.trim();

    // Try AI-powered remediation first
    try {
      const systemPrompt = `You are an expert educator specializing in ${body.subject || "STEM subjects"}. Create clear, helpful remediation content for students struggling with specific concepts.`;

      const prompt = `
Create comprehensive remediation content for the concept: "${conceptKey}"

Please provide:
1. A clear explanation of the concept (2-3 sentences)
2. A concrete example with step-by-step solution
3. A common mistake students make with this concept
4. A practical tip for mastering this concept

Respond in JSON format:
{
  "concept": "${conceptKey}",
  "explanation": "<string>",
  "example": "<string>",
  "commonMistake": "<string>",
  "tip": "<string>"
}`;

      const aiResponse = await invokeClaude(prompt, systemPrompt);

      // Parse AI response
      const content = JSON.parse(aiResponse);

      return NextResponse.json(
        {
          concept: content.concept,
          explanation: content.explanation,
          example: content.example,
          commonMistake: content.commonMistake,
          tip: content.tip,
        },
        { status: 200 },
      );
    } catch (aiError) {
      console.error("AI remediation failed, using fallback content:", aiError);

      // Fallback to predefined content
      const content = REMEDIATION_CONTENT[conceptKey];

      if (!content) {
        return NextResponse.json(
          {
            concept: conceptKey,
            explanation: `${conceptKey} is an important topic. Focus on understanding the fundamental principles and practice problems step by step.`,
            example:
              "Work through standard examples and verify your understanding with practice questions.",
            commonMistake:
              "Rushing through problems without understanding the underlying concept.",
            tip: "Break problems into smaller steps and always check units and formulas.",
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          concept: content.concept,
          explanation: content.explanation,
          example: content.example,
          commonMistake: content.commonMistake,
          tip: content.tip,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error in /api/remediate:", error);
    return NextResponse.json(
      { error: "Failed to get remediation content" },
      { status: 500 },
    );
  }
}
