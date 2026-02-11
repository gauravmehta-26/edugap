import { NextRequest, NextResponse } from "next/server";
import { generateRemediationContent, isGroqConfigured } from "@/lib/groq-ai";

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

// Comprehensive remediation content library
const REMEDIATION_CONTENT: Record<string, RemediationContent> = {
  Electrostatics: {
    concept: "Electrostatics",
    explanation:
      "Electrostatics deals with stationary electric charges and the forces between them. Key principles include Coulomb's Law (F = kq₁q₂/r²), electric fields, and electric potential. The fundamental constant k = 8.99 × 10⁹ N⋅m²/C². Electric field lines always point from positive to negative charges, and the electric potential is measured in Volts (V).",
    example:
      "Example: Two charges +2μC and -3μC are 0.5m apart. Calculate the force: F = k|q₁q₂|/r² = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/(0.5)² = 0.216 N. Since charges are opposite, the force is attractive.",
    commonMistake:
      "Students often forget that like charges repel and unlike charges attract. Also, remember to convert all units to SI units (meters, coulombs) before calculating. Don't forget the absolute value when calculating magnitude.",
    tip: "Quick tip: Always draw field lines from positive to negative charges. The electric field direction is defined by the force on a positive test charge. Remember: Volt = Joule/Coulomb.",
  },
  "Differential Calculus": {
    concept: "Differential Calculus",
    explanation:
      "Differential calculus focuses on rates of change and slopes of curves. The derivative represents the instantaneous rate of change of a function. For power functions, use the power rule: d/dx(xⁿ) = nxⁿ⁻¹. The derivative of x² is 2x, not x. Common derivatives: d/dx(sin x) = cos x, d/dx(eˣ) = eˣ, d/dx(ln x) = 1/x.",
    example:
      "Example: Find the derivative of f(x) = x². Using the power rule: bring down the exponent (2) and reduce the power by 1. So f'(x) = 2x²⁻¹ = 2x. At x=3, the slope is f'(3) = 2(3) = 6.",
    commonMistake:
      "Students often forget to reduce the exponent by 1 after bringing it down as a coefficient. Another common error is thinking d/dx(x²) = x instead of 2x. Remember: the power comes down AND the exponent decreases by 1.",
    tip: "Practice the power rule with various exponents including negative and fractional powers. Remember that the derivative of a constant is 0, and d/dx(x) = 1.",
  },
  Trigonometry: {
    concept: "Trigonometry",
    explanation:
      "Trigonometry deals with relationships between angles and sides of triangles. The fundamental Pythagorean identity sin²θ + cos²θ = 1 is essential for solving many problems. Remember SOHCAHTOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. This identity holds for all angles.",
    example:
      "Example: If sin(θ) = 3/5, find cos(θ). Using sin²θ + cos²θ = 1: (3/5)² + cos²θ = 1, so 9/25 + cos²θ = 1, therefore cos²θ = 16/25, and cos(θ) = ±4/5. The sign depends on which quadrant θ is in.",
    commonMistake:
      "Forgetting that cosine (and sine) can be positive or negative depending on the quadrant. Also, students sometimes confuse sin²θ + cos²θ = 1 with sin θ + cos θ = 1 (which is incorrect). Always square the functions first.",
    tip: "Remember SOHCAHTOA for right triangles. For the unit circle: sin is y-coordinate, cos is x-coordinate. Use the Pythagorean identity to find one trig function when you know another.",
  },
  "Quadratic Equations": {
    concept: "Quadratic Equations",
    explanation:
      "Quadratic equations have the form ax² + bx + c = 0. The quadratic formula x = (-b ± √(b²-4ac))/(2a) gives the solutions. The discriminant (b²-4ac) determines the nature of roots: positive = 2 real roots, zero = 1 real root, negative = 2 complex roots.",
    example:
      "Example: Solve 2x² + 5x - 3 = 0. Here a=2, b=5, c=-3. Using the formula: x = (-5 ± √(25-4(2)(-3)))/(2·2) = (-5 ± √49)/4 = (-5 ± 7)/4. So x = 1/2 or x = -3.",
    commonMistake:
      "Forgetting the negative sign before b in the formula, or dividing by a instead of 2a. Also, students sometimes forget to check both the + and - solutions from the ± symbol.",
    tip: "Always identify a, b, and c first. Check the discriminant to understand the nature of roots before solving. Verify your answers by substituting back into the original equation.",
  },
  Kinematics: {
    concept: "Kinematics",
    explanation:
      "Kinematics describes motion without considering forces. Key equations: v = u + at (velocity), s = ut + ½at² (displacement), v² = u² + 2as (velocity-displacement). Here u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement.",
    example:
      "Example: A car accelerates from rest (u=0) at 2 m/s² for 5 seconds. Find final velocity and distance. Using v = u + at: v = 0 + 2(5) = 10 m/s. Using s = ut + ½at²: s = 0 + ½(2)(5²) = 25 m.",
    commonMistake:
      "Mixing up velocity (vector) and speed (scalar), or using incorrect signs for acceleration. Remember: acceleration is negative when slowing down. Also, don't confuse displacement (s) with distance traveled.",
    tip: "Always list known variables (u, v, a, t, s) and draw a motion diagram. Choose the equation that contains the three known variables and the one unknown you're solving for.",
  },
  Algebra: {
    concept: "Algebra",
    explanation:
      "Algebra involves manipulating equations and expressions using variables. Key skills include solving linear equations, factoring, expanding brackets, and working with inequalities. Always perform the same operation on both sides of an equation to maintain equality.",
    example:
      "Example: Solve 3x + 7 = 22. Subtract 7 from both sides: 3x = 15. Divide both sides by 3: x = 5. Check: 3(5) + 7 = 22 ✓",
    commonMistake:
      "Forgetting to apply operations to both sides of the equation, or making sign errors when moving terms across the equals sign. Remember: when you move a term, its sign changes.",
    tip: "Always check your answer by substituting it back into the original equation. Work systematically: isolate the variable term first, then solve for the variable.",
  },
  Geometry: {
    concept: "Geometry",
    explanation:
      "Geometry deals with shapes, sizes, and properties of space. Key concepts include area, perimeter, volume, angles, and theorems about triangles and circles. Remember: sum of angles in a triangle = 180°, in a quadrilateral = 360°.",
    example:
      "Example: Find the area of a triangle with base 8 cm and height 5 cm. Area = ½ × base × height = ½ × 8 × 5 = 20 cm².",
    commonMistake:
      "Confusing area and perimeter formulas, or forgetting to use the correct units (squared for area, cubed for volume). Also, students sometimes forget the ½ in the triangle area formula.",
    tip: "Draw diagrams for every problem. Label all known measurements. Remember: area is always in square units, volume in cubic units.",
  },
};

// Generate static remediation content for any concept (fallback)
function generateStaticRemediationContent(
  concept: string,
  subject?: string,
): RemediationContent {
  // Check if we have predefined content
  const predefined = REMEDIATION_CONTENT[concept];
  if (predefined) {
    return predefined;
  }

  // Generate generic but helpful content for unknown concepts
  return {
    concept,
    explanation: `${concept} is an important topic in ${subject || "this subject"}. It involves understanding fundamental principles and applying them to solve problems. Focus on mastering the basic definitions, formulas, and problem-solving techniques. Practice regularly with varied examples to build confidence and proficiency.`,
    example: `To master ${concept}, start with simple examples and gradually increase complexity. Work through textbook problems step-by-step, ensuring you understand each step before moving forward. Verify your answers and learn from mistakes.`,
    commonMistake: `A common mistake when learning ${concept} is rushing through problems without fully understanding the underlying principles. Take time to understand why formulas work, not just memorizing them. Also, pay attention to units and signs in calculations.`,
    tip: `Quick tip for ${concept}: Break complex problems into smaller, manageable steps. Always write down what you know and what you need to find. Draw diagrams when possible, and double-check your work before finalizing answers.`,
  };
}

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

    // Try to use AI-generated content if Groq is configured
    if (isGroqConfigured() && body.subject) {
      try {
        console.log(`[GROQ AI] Generating remediation for "${conceptKey}" in ${body.subject}...`);
        const aiContent = await generateRemediationContent(body.subject, conceptKey);

        console.log(`[GROQ AI] Successfully generated remediation content`);

        return NextResponse.json(
          {
            concept: conceptKey,
            explanation: aiContent.explanation,
            keyPoints: aiContent.keyPoints,
            examples: aiContent.examples,
            studyResources: aiContent.studyResources,
            youtubeSearchQuery: aiContent.youtubeSearchQuery,
            source: "ai",
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("[GROQ AI] Error generating AI content:", error);
        console.error("[GROQ AI] Falling back to static content");
        // Fall through to static content
      }
    } else {
      if (!isGroqConfigured()) {
        console.log("[GROQ AI] Groq not configured, using static content");
      }
      if (!body.subject) {
        console.log("[GROQ AI] No subject provided, using static content");
      }
    }

    // Fallback: Generate static remediation content
    const content = generateStaticRemediationContent(conceptKey, body.subject);

    return NextResponse.json(
      {
        concept: content.concept,
        explanation: content.explanation,
        example: content.example,
        commonMistake: content.commonMistake,
        tip: content.tip,
        source: "static",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/remediate:", error);
    return NextResponse.json(
      { error: "Failed to get remediation content" },
      { status: 500 },
    );
  }
}
