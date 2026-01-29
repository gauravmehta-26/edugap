import { NextRequest, NextResponse } from 'next/server';

interface RemediateRequest {
  concept: string;
}

// Predefined remediation content for demo reliability
const REMEDIATION_CONTENT: Record<string, any> = {
  'Electrostatics': {
    concept: 'Electrostatics',
    explanation: 'Electrostatics deals with stationary electric charges. Key principles include Coulomb\'s Law (force between charges), electric fields, and electric potential. The fundamental formula is F = kq₁q₂/r², where k is Coulomb\'s constant (8.99 × 10⁹ N⋅m²/C²).',
    example: 'Example: Two charges +2μC and -3μC are 0.5m apart. The force between them is F = k|q₁q₂|/r² = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/(0.5)² = 0.216 N (attractive force).',
    commonMistake: 'Students often forget that like charges repel and unlike charges attract. Also, remember to convert all units to SI units (meters, coulombs) before calculating.',
    tip: 'Quick tip: Always draw field lines from positive to negative charges. The electric field direction is defined by the force on a positive test charge.',
  },
  'Differential Calculus': {
    concept: 'Differential Calculus',
    explanation: 'Differential calculus focuses on rates of change. The derivative of a function represents the instantaneous rate of change. For power functions, use the power rule: d/dx(xⁿ) = nxⁿ⁻¹.',
    example: 'Example: Find the derivative of f(x) = x². Using the power rule: f\'(x) = 2x²⁻¹ = 2x. This means the slope of the tangent line at any point x is 2x.',
    commonMistake: 'Students often forget to reduce the exponent by 1 after bringing it down as a coefficient. Remember: the exponent decreases by exactly 1.',
    tip: 'Practice the power rule with various exponents. Remember that the derivative of a constant is 0, and d/dx(x) = 1.',
  },
  'Trigonometry': {
    concept: 'Trigonometry',
    explanation: 'Trigonometry deals with relationships between angles and sides of triangles. The fundamental identity sin²θ + cos²θ = 1 is derived from the Pythagorean theorem and is essential for solving many problems.',
    example: 'Example: If sin(θ) = 3/5, find cos(θ). Using sin²θ + cos²θ = 1: (3/5)² + cos²θ = 1, so cos²θ = 1 - 9/25 = 16/25, therefore cos(θ) = ±4/5.',
    commonMistake: 'Don\'t forget that cosine can be positive or negative depending on the quadrant. Always check the angle range to determine the correct sign.',
    tip: 'Remember SOHCAHTOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent.',
  },
  'Quadratic Equations': {
    concept: 'Quadratic Equations',
    explanation: 'Quadratic equations have the form ax² + bx + c = 0. The quadratic formula x = (-b ± √(b² - 4ac)) / 2a gives the solutions. The discriminant (b² - 4ac) determines the nature of roots.',
    example: 'Example: Solve 2x² + 5x - 3 = 0. Here a=2, b=5, c=-3. x = (-5 ± √(25 + 24)) / 4 = (-5 ± 7) / 4. So x = 1/2 or x = -3.',
    commonMistake: 'The most common error is forgetting the negative sign before b in the formula. It\'s -b, not b. Also, remember to divide by 2a, not just a.',
    tip: 'Always check your discriminant first: positive = two real roots, zero = one repeated root, negative = complex roots.',
  },
  'Kinematics': {
    concept: 'Kinematics',
    explanation: 'Kinematics describes motion without considering forces. Key equations: v = u + at, s = ut + ½at², v² = u² + 2as.',
    example: 'Example: A car accelerates from rest at 2 m/s² for 5 seconds. Final velocity: v = 0 + (2)(5) = 10 m/s. Distance: s = 0 + ½(2)(5)² = 25 m.',
    commonMistake: 'Mixing up velocity and speed (velocity is a vector), or using wrong signs for acceleration.',
    tip: 'Always list known and unknown variables first. Draw a diagram showing direction of motion.',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: RemediateRequest = await request.json();
    
    if (!body.concept) {
      return NextResponse.json(
        { error: 'Invalid request: concept required' },
        { status: 400 }
      );
    }

    // Get remediation content
    const content = REMEDIATION_CONTENT[body.concept];

    if (!content) {
      // Fallback for unknown concepts
      return NextResponse.json({
        concept: body.concept,
        explanation: `${body.concept} is an important topic. Focus on understanding the fundamental principles and practice solving problems step by step.`,
        example: 'Work through textbook examples and verify your understanding with practice problems.',
        commonMistake: 'Rushing through problems without understanding the underlying concepts.',
        tip: 'Break down complex problems into smaller steps and always check your units.',
      }, { status: 200 });
    }

    return NextResponse.json(content, { status: 200 });

  } catch (error) {
    console.error('Error in /api/remediate:', error);
    return NextResponse.json(
      { error: 'Failed to get remediation content' },
      { status: 500 }
    );
  }
}
