import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import RemediationPage from '../page';
import { remediationContentBySubject } from '@/lib/mockData';
import { SubjectProvider } from '@/lib/SubjectContext';
import { ReactNode } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock SubjectContext with a selected subject
jest.mock('@/lib/SubjectContext', () => {
  const actual = jest.requireActual('@/lib/SubjectContext');
  return {
    ...actual,
    useSubject: jest.fn(() => ({
      selectedSubject: 'mathematics',
      setSelectedSubject: jest.fn(),
      getSubjectInfo: actual.subjects.find((s: any) => s.id === 'mathematics') 
        ? () => actual.subjects.find((s: any) => s.id === 'mathematics')
        : jest.fn(),
    })),
  };
});

describe('Remediation Page', () => {
  let mockPush: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockGet = jest.fn();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    it('displays concept content correctly for valid concept ID', async () => {
      // Test with calculus concept (mathematics subject)
      mockGet.mockReturnValue('calculus');
      
      render(<RemediationPage />);
      
      const content = remediationContentBySubject.mathematics['calculus'];
      
      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText(content.conceptName)).toBeInTheDocument();
      });
      
      // Verify explanation section is displayed
      expect(screen.getByText('Explanation')).toBeInTheDocument();
      expect(screen.getByText(content.explanation)).toBeInTheDocument();
      
      // Verify example section is displayed
      expect(screen.getByText('Example')).toBeInTheDocument();
      expect(screen.getByText(content.example)).toBeInTheDocument();
      
      // Verify common mistake section is displayed
      expect(screen.getByText('Common Mistake')).toBeInTheDocument();
      expect(screen.getByText(content.commonMistake)).toBeInTheDocument();
      
      // Verify Mark as Fixed button is present
      expect(screen.getByRole('button', { name: /mark as fixed/i })).toBeInTheDocument();
    });

    it('displays concept content correctly for trigonometry concept', async () => {
      mockGet.mockReturnValue('trigonometry');
      
      render(<RemediationPage />);
      
      const content = remediationContentBySubject.mathematics['trigonometry'];
      
      await waitFor(() => {
        expect(screen.getByText(content.conceptName)).toBeInTheDocument();
      });
      
      expect(screen.getByText(content.explanation)).toBeInTheDocument();
      expect(screen.getByText(content.example)).toBeInTheDocument();
      expect(screen.getByText(content.commonMistake)).toBeInTheDocument();
    });

    it('displays concept content correctly for calculus concept', async () => {
      mockGet.mockReturnValue('calculus');
      
      render(<RemediationPage />);
      
      const content = remediationContentBySubject.mathematics['calculus'];
      
      await waitFor(() => {
        expect(screen.getByText(content.conceptName)).toBeInTheDocument();
      });
      
      expect(screen.getByText(content.explanation)).toBeInTheDocument();
      expect(screen.getByText(content.example)).toBeInTheDocument();
      expect(screen.getByText(content.commonMistake)).toBeInTheDocument();
    });

    it('displays concept content correctly for algebra concept', async () => {
      mockGet.mockReturnValue('algebra');
      
      render(<RemediationPage />);
      
      const content = remediationContentBySubject.mathematics['algebra'];
      
      await waitFor(() => {
        expect(screen.getByText(content.conceptName)).toBeInTheDocument();
      });
      
      expect(screen.getByText(content.explanation)).toBeInTheDocument();
      expect(screen.getByText(content.example)).toBeInTheDocument();
      expect(screen.getByText(content.commonMistake)).toBeInTheDocument();
    });

    it('shows "Concept Not Found" message for invalid concept ID', async () => {
      mockGet.mockReturnValue('invalid-concept-id');
      
      render(<RemediationPage />);
      
      // Wait for error state to render
      await waitFor(() => {
        expect(screen.getByText('Concept Not Found')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/the concept you're looking for doesn't exist/i)).toBeInTheDocument();
      
      // Verify return to dashboard button is present
      expect(screen.getByRole('button', { name: /return to dashboard/i })).toBeInTheDocument();
    });

    it('shows "Concept Not Found" message when concept ID is null', () => {
      mockGet.mockReturnValue(null);
      
      render(<RemediationPage />);
      
      expect(screen.getByText('Concept Not Found')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /return to dashboard/i })).toBeInTheDocument();
    });

    it('navigates to dashboard when "Return to Dashboard" button is clicked', async () => {
      mockGet.mockReturnValue('invalid-concept-id');
      
      render(<RemediationPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Concept Not Found')).toBeInTheDocument();
      });
      
      const returnButton = screen.getByRole('button', { name: /return to dashboard/i });
      fireEvent.click(returnButton);
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('provides visual feedback when "Mark as Fixed" button is clicked', async () => {
      mockGet.mockReturnValue('calculus');
      
      render(<RemediationPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /mark as fixed/i })).toBeInTheDocument();
      });
      
      const markAsFixedButton = screen.getByRole('button', { name: /mark as fixed/i });
      
      // Click the button
      fireEvent.click(markAsFixedButton);
      
      // Verify button text changes to show success state
      expect(screen.getByRole('button', { name: /marked as fixed/i })).toBeInTheDocument();
      
      // Verify success message is displayed
      expect(screen.getByText(/great! keep practicing this concept/i)).toBeInTheDocument();
    });

    it('navigates to dashboard when "Back to Dashboard" link is clicked', async () => {
      mockGet.mockReturnValue('calculus');
      
      render(<RemediationPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
      });
      
      const backButton = screen.getByText(/back to dashboard/i);
      fireEvent.click(backButton);
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
