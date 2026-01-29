/**
 * Property-Based Test for Responsive Layout
 * Feature: edugap-frontend, Property 7: Responsive Layout Integrity
 * Validates: Requirements 5.1, 5.2, 5.3
 */

import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import LoginPage from '../login/page';
import QuizPage from '../quiz/page';
import DashboardPage from '../dashboard/page';
import RemediationPage from '../remediation/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => 'electrostatics'),
  }),
  usePathname: () => '/',
}));

describe('Property 7: Responsive Layout Integrity', () => {
  /**
   * Property: For any viewport width between 320px and 1920px,
   * all page content should remain visible and accessible without horizontal scrolling
   */
  it('should not have horizontal overflow at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // Generate random viewport widths
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          // Test each page component
          const pages = [
            { name: 'Login', component: LoginPage },
            { name: 'Quiz', component: QuizPage },
            { name: 'Dashboard', component: DashboardPage },
            { name: 'Remediation', component: RemediationPage },
          ];

          for (const page of pages) {
            const { container, unmount } = render(<page.component />);
            
            try {
              // Check that no element has width greater than viewport
              const allElements = container.querySelectorAll('*');
              
              for (const element of Array.from(allElements)) {
                const htmlElement = element as HTMLElement;
                
                // Skip elements that are intentionally hidden or have display: none
                const computedStyle = window.getComputedStyle(htmlElement);
                if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                  continue;
                }
                
                // Get the element's bounding rect
                const rect = htmlElement.getBoundingClientRect();
                
                // Check that element doesn't cause horizontal overflow
                // Allow for small rounding errors (1px tolerance)
                if (rect.width > 0) {
                  expect(rect.right).toBeLessThanOrEqual(viewportWidth + 1);
                }
              }
            } finally {
              unmount();
            }
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations with different viewport widths
    );
  });

  it('should render correctly on mobile viewport (320px-768px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 768 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          // Test that pages render without errors on mobile
          const { container: loginContainer, unmount: unmountLogin } = render(<LoginPage />);
          expect(loginContainer).toBeTruthy();
          unmountLogin();
          
          const { container: quizContainer, unmount: unmountQuiz } = render(<QuizPage />);
          expect(quizContainer).toBeTruthy();
          unmountQuiz();
          
          const { container: dashboardContainer, unmount: unmountDashboard } = render(<DashboardPage />);
          expect(dashboardContainer).toBeTruthy();
          unmountDashboard();
          
          const { container: remediationContainer, unmount: unmountRemediation } = render(<RemediationPage />);
          expect(remediationContainer).toBeTruthy();
          unmountRemediation();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render correctly on laptop viewport (1024px+)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          // Test that pages render without errors on laptop
          const { container: loginContainer, unmount: unmountLogin } = render(<LoginPage />);
          expect(loginContainer).toBeTruthy();
          unmountLogin();
          
          const { container: quizContainer, unmount: unmountQuiz } = render(<QuizPage />);
          expect(quizContainer).toBeTruthy();
          unmountQuiz();
          
          const { container: dashboardContainer, unmount: unmountDashboard } = render(<DashboardPage />);
          expect(dashboardContainer).toBeTruthy();
          unmountDashboard();
          
          const { container: remediationContainer, unmount: unmountRemediation } = render(<RemediationPage />);
          expect(remediationContainer).toBeTruthy();
          unmountRemediation();
        }
      ),
      { numRuns: 100 }
    );
  });
});
