import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import QuizPage from '../page';
import * as fc from 'fast-check';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('QuizPage', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  /**
   * Feature: edugap-frontend, Property 2: Quiz Progress Tracking
   * Validates: Requirements 2.6
   */
  it('should display correct progress for any question index', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4 }), // Generate random question indices 0-4
        (questionIndex) => {
          const { container, unmount } = render(<QuizPage />);
          
          try {
            // Navigate to the specific question index by clicking Next
            for (let i = 0; i < questionIndex; i++) {
              // Select an option
              const options = screen.getAllByRole('button', { name: /./i }).filter(
                (btn) => !btn.textContent?.includes('Next') && !btn.textContent?.includes('Submit')
              );
              fireEvent.click(options[0]);
              
              // Click Next
              const nextButton = screen.getByRole('button', { name: /Next/i });
              fireEvent.click(nextButton);
            }
            
            // Verify progress shows "Question N"
            const questionHeading = screen.getByText(`Question ${questionIndex + 1}`);
            expect(questionHeading).toBeInTheDocument();
            
            // Verify progress percentage is displayed
            const progressPercentage = Math.round(((questionIndex + 1) / 5) * 100);
            expect(screen.getByText(`${progressPercentage}%`)).toBeInTheDocument();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: edugap-frontend, Property 3: Quiz Answer Storage
   * Validates: Requirements 2.3
   */
  it('should store and retrieve all selected answers', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 5, maxLength: 5 }), // Generate 5 random answer selections
        (answerSelections) => {
          const { unmount } = render(<QuizPage />);
          
          try {
            // Answer all questions with the generated selections
            answerSelections.forEach((selectedOption, questionIndex) => {
              // Select the option
              const options = screen.getAllByRole('button', { name: /./i }).filter(
                (btn) => !btn.textContent?.includes('Next') && !btn.textContent?.includes('Submit')
              );
              fireEvent.click(options[selectedOption]);
              
              // Verify the option is selected (has blue styling)
              const selectedButton = options[selectedOption];
              expect(selectedButton.className).toContain('border-blue-500');
              expect(selectedButton.className).toContain('from-blue-50');
              
              // Click Next or Submit
              if (questionIndex < 4) {
                const nextButtons = screen.getAllByRole('button', { name: /Next/i });
                fireEvent.click(nextButtons[0]);
              }
            });
            
            // Verify we can navigate to dashboard (answers were stored)
            const submitButtons = screen.getAllByRole('button', { name: /Submit/i });
            expect(submitButtons[0]).not.toBeDisabled();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: edugap-frontend, Property 4: Quiz Completion Navigation
   * Validates: Requirements 2.5
   */
  it('should navigate to dashboard after completing all questions', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 5, maxLength: 5 }), // Generate 5 random answer selections
        (answerSelections) => {
          const { unmount } = render(<QuizPage />);
          
          try {
            // Answer all 5 questions
            answerSelections.forEach((selectedOption, questionIndex) => {
              // Select the option
              const options = screen.getAllByRole('button', { name: /./i }).filter(
                (btn) => !btn.textContent?.includes('Next') && !btn.textContent?.includes('Submit')
              );
              fireEvent.click(options[selectedOption]);
              
              // Click Next or Submit
              if (questionIndex < 4) {
                const nextButtons = screen.getAllByRole('button', { name: /Next/i });
                fireEvent.click(nextButtons[0]);
              } else {
                // On last question, click Submit
                const submitButtons = screen.getAllByRole('button', { name: /Submit/i });
                fireEvent.click(submitButtons[0]);
                
                // Verify navigation to dashboard was called
                expect(mockPush).toHaveBeenCalledWith('/dashboard');
              }
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
