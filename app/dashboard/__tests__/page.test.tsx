import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { DashboardData } from '@/lib/types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock Chatbot component
jest.mock('@/components/ui/Chatbot', () => {
  return function MockChatbot() {
    return <div data-testid="chatbot">Chatbot</div>;
  };
});

// Mock the mockData module
let mockDashboardData: DashboardData;
jest.mock('@/lib/mockData', () => ({
  get dashboardData() {
    return mockDashboardData;
  },
}));

// Import DashboardPage after mocks are set up
import DashboardPage from '../page';

/**
 * Feature: edugap-frontend, Property 5: Dashboard Data Display
 * Validates: Requirements 3.2, 3.3, 3.5
 * 
 * For any valid dashboard data structure, all required elements
 * (risk percentage, weak concepts list, charts) should be present in the DOM.
 */
describe('Property 5: Dashboard Data Display', () => {
  it('should render all required elements for any valid dashboard data', () => {
    // Generator for valid dashboard data with unique IDs
    const dashboardDataArbitrary = fc.record({
      examFailureRisk: fc.integer({ min: 0, max: 100 }),
      weakConcepts: fc.array(
        fc.record({
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => s.trim()),
          riskPercentage: fc.integer({ min: 0, max: 100 }),
        }),
        { minLength: 1, maxLength: 10 }
      ).map((concepts) => 
        // Add unique IDs based on index
        concepts.map((concept, index) => ({
          ...concept,
          id: `concept-${index}`,
        }))
      ),
      subjectPerformance: fc.array(
        fc.record({
          subject: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => s.trim()),
          score: fc.integer({ min: 0, max: 100 }),
        }),
        { minLength: 1, maxLength: 10 }
      ),
    });

    fc.assert(
      fc.property(dashboardDataArbitrary, (data: DashboardData) => {
        // Set the mock data
        mockDashboardData = data;

        const { container, unmount } = render(<DashboardPage />);

        try {
          // Requirement 3.2: Verify risk percentage is displayed in the RiskCard
          // Look for the risk percentage within the context of "Exam Failure Risk"
          const riskSections = screen.getAllByText('Exam Failure Risk');
          expect(riskSections.length).toBeGreaterThan(0);
          const riskSection = riskSections[0].closest('div');
          expect(riskSection).toBeInTheDocument();
          expect(riskSection).toHaveTextContent(`${data.examFailureRisk}%`);

          // Requirement 3.3: Verify weak concepts list is displayed
          // Check that the "Weak Concepts" heading exists
          expect(screen.getByText('Weak Concepts')).toBeInTheDocument();

          // Verify "Fix Now" buttons are present for each concept
          const fixNowButtons = screen.getAllByText('Fix Now');
          expect(fixNowButtons.length).toBeGreaterThanOrEqual(data.weakConcepts.length);

          // Requirement 3.5: Verify charts section is present
          // Check for chart headings
          expect(screen.getByText('Subject Performance')).toBeInTheDocument();
          expect(screen.getByText('Knowledge Gap Analysis')).toBeInTheDocument();

          // Verify the main heading is present (Requirement 3.1)
          expect(screen.getByText('Your Learning Dashboard')).toBeInTheDocument();
        } finally {
          // Clean up after each property test run
          unmount();
          cleanup();
        }
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: edugap-frontend, Property 6: Remediation Navigation
 * Validates: Requirements 3.6
 * 
 * For any weak concept with a "Fix Now" button, clicking the button should
 * navigate to /remediation with the correct concept ID in the URL.
 */
describe('Property 6: Remediation Navigation', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should navigate to remediation page with correct concept ID for any concept', () => {
    // Generator for weak concepts with unique IDs
    const weakConceptArbitrary = fc.record({
      id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      riskPercentage: fc.integer({ min: 0, max: 100 }),
    });

    fc.assert(
      fc.property(weakConceptArbitrary, (concept: any) => {
        // Set up minimal dashboard data with just this concept
        mockDashboardData = {
          examFailureRisk: 50,
          weakConcepts: [concept],
          subjectPerformance: [{ subject: 'Test', score: 50 }],
        };

        const { unmount } = render(<DashboardPage />);

        try {
          // Find and click the "Fix Now" button
          const fixNowButton = screen.getByText('Fix Now');
          fixNowButton.click();

          // Verify navigation was called with correct URL
          expect(mockPush).toHaveBeenCalledWith(`/remediation?concept=${concept.id}`);
        } finally {
          unmount();
          cleanup();
          mockPush.mockClear();
        }
      }),
      { numRuns: 100 }
    );
  });
});
