# Design Document: EduGap Frontend

## Overview

The EduGap frontend is a Next.js application that guides users through a learning assessment journey: login → diagnostic quiz → risk dashboard → targeted remediation. The application uses modern React patterns with TypeScript, styled with Tailwind CSS, and enhanced with Framer Motion animations and Recharts visualizations.

The design prioritizes simplicity, visual clarity, and smooth user experience suitable for a hackathon demo. All data is mocked for the MVP, with structure designed to accommodate future API integration.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useContext)

### Application Structure

```
app/
├── layout.tsx              # Root layout with global styles
├── page.tsx                # Landing/redirect page
├── login/
│   └── page.tsx           # Login page
├── quiz/
│   └── page.tsx           # Diagnostic quiz page
├── dashboard/
│   └── page.tsx           # Risk overview dashboard
└── remediation/
    └── page.tsx           # Concept remediation page

components/
├── ui/
│   ├── Button.tsx         # Reusable button component
│   ├── Card.tsx           # Card container component
│   └── Input.tsx          # Input field component
├── quiz/
│   ├── QuestionCard.tsx   # Quiz question display
│   └── ProgressBar.tsx    # Quiz progress indicator
├── dashboard/
│   ├── RiskCard.tsx       # Risk percentage display
│   ├── WeakConceptsList.tsx  # List of weak concepts
│   └── PerformanceCharts.tsx # Recharts visualizations
└── remediation/
    └── ConceptContent.tsx # Remediation content display

lib/
├── mockData.ts            # Mock quiz questions and dashboard data
├── types.ts               # TypeScript type definitions
└── utils.ts               # Utility functions

```

### Routing Flow

```
/login → /quiz → /dashboard → /remediation?concept={conceptId}
```

## Components and Interfaces

### Core Types

```typescript
// lib/types.ts

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
}

export interface WeakConcept {
  id: string;
  name: string;
  riskPercentage: number;
}

export interface DashboardData {
  examFailureRisk: number;
  weakConcepts: WeakConcept[];
  subjectPerformance: {
    subject: string;
    score: number;
  }[];
}

export interface RemediationContent {
  conceptId: string;
  conceptName: string;
  explanation: string;
  example: string;
  commonMistake: string;
}
```

### Page Components

#### Login Page (`app/login/page.tsx`)

- Email input field with validation styling
- Login button with hover and click animations
- Framer Motion fade-in animation on mount
- Navigation to `/quiz` on button click
- Centered layout with card design

#### Quiz Page (`app/quiz/page.tsx`)

- State management for current question index and answers
- Single question display with 4 multiple-choice options
- Progress bar showing question N of 5
- Next/Submit button (Submit on last question)
- Framer Motion slide transitions between questions
- Navigation to `/dashboard` on completion

#### Dashboard Page (`app/dashboard/page.tsx`)

- Large risk percentage display (RiskCard component)
- Grid layout for weak concepts with individual risk bars
- Two charts: Bar chart (subject performance) and Radar chart (knowledge gaps)
- "Fix Now" buttons for each weak concept
- Staggered animation for list items
- Navigation to `/remediation?concept={id}` on Fix Now click

#### Remediation Page (`app/remediation/page.tsx`)

- Concept name as heading
- Explanation section with formatted text
- Example section with highlighted box
- Common mistake section with warning styling
- "Mark as Fixed" button with success feedback
- Framer Motion fade and slide-up animations

### Reusable UI Components

#### Button Component

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
}
```

- Tailwind classes for styling
- Hover and active states
- Framer Motion whileTap animation
- Accessible focus states

#### Card Component

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

- White background with soft shadow
- Rounded corners
- Padding and responsive sizing

#### Input Component

```typescript
interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}
```

- Styled input with focus states
- Accessible labels
- Error state styling (optional)

## Data Models

### Mock Data Structure

```typescript
// lib/mockData.ts

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: 1
  },
  // ... 4 more questions
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
    explanation: 'Electrostatics is the study of electric charges at rest...',
    example: 'Consider two charges: q₁ = +5μC and q₂ = -3μC separated by 2cm...',
    commonMistake: 'Students often forget that like charges repel and unlike charges attract...'
  },
  // ... more concepts
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Login Navigation

*For any* valid email input, clicking the login button should navigate the user to the `/quiz` page.

**Validates: Requirements 1.2**

### Property 2: Quiz Progress Tracking

*For any* quiz session, the progress indicator should accurately reflect the current question number out of total questions (N of 5).

**Validates: Requirements 2.6**

### Property 3: Quiz Answer Storage

*For any* question answered during the quiz, the selected answer should be stored in application state and retrievable.

**Validates: Requirements 2.3**

### Property 4: Quiz Completion Navigation

*For any* completed quiz (all 5 questions answered), clicking submit should navigate to the `/dashboard` page.

**Validates: Requirements 2.5**

### Property 5: Dashboard Data Display

*For any* dashboard render, all required elements (risk percentage, weak concepts list, charts) should be present in the DOM.

**Validates: Requirements 3.2, 3.3, 3.5**

### Property 6: Remediation Navigation

*For any* weak concept with a "Fix Now" button, clicking the button should navigate to `/remediation` with the correct concept ID in the URL.

**Validates: Requirements 3.6**

### Property 7: Responsive Layout Integrity

*For any* viewport width between 320px and 1920px, all page content should remain visible and accessible without horizontal scrolling.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 8: Animation Presence

*For any* page load or interactive element, Framer Motion animations should execute without errors.

**Validates: Requirements 1.4, 2.5, 3.7, 4.5, 6.6**

## Error Handling

### Navigation Errors

- If navigation fails, display error message and provide retry option
- Fallback to previous page if target route is invalid

### Missing Data

- If concept ID is not found in remediation data, display "Concept not found" message
- Provide button to return to dashboard

### State Management Errors

- If quiz state is lost, redirect to quiz start
- If dashboard data fails to load, show error state with retry button

### Animation Errors

- Gracefully degrade if Framer Motion fails to load
- Ensure core functionality works without animations

## Testing Strategy

### Unit Tests

The application will use **Jest** and **React Testing Library** for unit testing. Tests will focus on:

- Component rendering with correct props
- User interaction handlers (button clicks, input changes)
- Navigation logic
- State updates
- Edge cases (empty data, missing props)

Example unit tests:
- Login button is disabled when email is empty
- Quiz displays correct question based on current index
- Dashboard renders all weak concepts from mock data
- Remediation page shows "not found" for invalid concept ID

### Property-Based Tests

The application will use **fast-check** for property-based testing. Each test will run a minimum of 100 iterations.

Property tests will verify:

**Property 1: Login Navigation**
- Generate random valid email strings
- Verify navigation to `/quiz` occurs for all inputs
- **Feature: edugap-frontend, Property 1: Login navigation**

**Property 2: Quiz Progress Tracking**
- Generate random question indices (0-4)
- Verify progress shows correct "N of 5" for all indices
- **Feature: edugap-frontend, Property 2: Quiz progress tracking**

**Property 3: Quiz Answer Storage**
- Generate random question IDs and answer selections
- Verify all answers are stored and retrievable
- **Feature: edugap-frontend, Property 3: Quiz answer storage**

**Property 4: Quiz Completion Navigation**
- Generate random sets of 5 answers
- Verify navigation to `/dashboard` occurs when complete
- **Feature: edugap-frontend, Property 4: Quiz completion navigation**

**Property 5: Dashboard Data Display**
- Generate random dashboard data structures
- Verify all required elements render for any valid data
- **Feature: edugap-frontend, Property 5: Dashboard data display**

**Property 6: Remediation Navigation**
- Generate random concept IDs from weak concepts list
- Verify correct URL parameter for all concept selections
- **Feature: edugap-frontend, Property 6: Remediation navigation**

**Property 7: Responsive Layout Integrity**
- Generate random viewport widths (320-1920px)
- Verify no horizontal overflow for any width
- **Feature: edugap-frontend, Property 7: Responsive layout integrity**

**Property 8: Animation Presence**
- Generate random page navigation sequences
- Verify animations execute without throwing errors
- **Feature: edugap-frontend, Property 8: Animation presence**

### Integration Tests

- Full user flow: login → quiz → dashboard → remediation
- Chart rendering with Recharts
- Animation sequences with Framer Motion
- Responsive behavior across breakpoints

### Testing Balance

- Unit tests handle specific examples and edge cases
- Property tests verify behavior across many generated inputs
- Integration tests ensure components work together correctly
- Both unit and property tests are necessary for comprehensive coverage
