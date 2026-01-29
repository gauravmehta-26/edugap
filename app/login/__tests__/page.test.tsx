import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import * as fc from 'fast-check';
import LoginPage from '../page';

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
}));

describe('Login Page', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 1: Login Navigation', () => {
    /**
     * Feature: edugap-frontend, Property 1: Login navigation
     * Validates: Requirements 1.2
     * 
     * For any valid email input, clicking the login button should navigate to /profile
     */
    it('should navigate to /profile for any valid email format', () => {
      // Generator for valid email strings
      const validEmailArbitrary = fc.tuple(
        fc.stringMatching(/^[a-zA-Z0-9]+$/), // local part
        fc.stringMatching(/^[a-zA-Z0-9]+$/), // domain name
        fc.constantFrom('com', 'org', 'net', 'edu', 'io') // TLD
      ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

      fc.assert(
        fc.property(validEmailArbitrary, (email) => {
          // Reset mock before each property test iteration
          mockPush.mockClear();

          // Render the login page
          const { unmount } = render(<LoginPage />);

          // Find the email input and login button
          const emailInput = screen.getByLabelText(/email address/i);
          const loginButton = screen.getByRole('button', { name: /continue to dashboard/i });

          // Enter the generated email
          fireEvent.change(emailInput, { target: { value: email } });

          // Click the login button
          fireEvent.click(loginButton);

          // Verify navigation to /profile occurred
          expect(mockPush).toHaveBeenCalledWith('/profile');
          expect(mockPush).toHaveBeenCalledTimes(1);

          // Cleanup
          unmount();
        }),
        { numRuns: 100 } // Run 100 iterations as specified in design
      );
    });
  });

  // Unit tests for specific behaviors
  describe('Unit Tests', () => {
    it('renders login form with email input and button', () => {
      render(<LoginPage />);
      
      expect(screen.getByText(/edugap/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue to dashboard/i })).toBeInTheDocument();
    });

    it('disables login button when email is empty', () => {
      render(<LoginPage />);
      
      const loginButton = screen.getByRole('button', { name: /continue to dashboard/i });
      expect(loginButton).toBeDisabled();
    });

    it('disables login button when email is invalid', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const loginButton = screen.getByRole('button', { name: /continue to dashboard/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      expect(loginButton).toBeDisabled();
    });

    it('enables login button when email is valid', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const loginButton = screen.getByRole('button', { name: /continue to dashboard/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(loginButton).not.toBeDisabled();
    });

    it('does not navigate when email is invalid', () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const loginButton = screen.getByRole('button', { name: /continue to dashboard/i });

      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.click(loginButton);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
