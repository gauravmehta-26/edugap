import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from '../page';
import { SubjectProvider } from '@/lib/SubjectContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Chatbot component
jest.mock('@/components/ui/Chatbot', () => {
  return function MockChatbot() {
    return <div data-testid="chatbot">Chatbot</div>;
  };
});

// Helper function to render with SubjectProvider
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SubjectProvider>
      {component}
    </SubjectProvider>
  );
};

describe('ProfilePage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renders profile page with subject selection', () => {
    renderWithProvider(<ProfilePage />);
    
    expect(screen.getByText('Select Your Subject')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Chemistry')).toBeInTheDocument();
    expect(screen.getByText('Biology')).toBeInTheDocument();
  });

  it('allows selecting a subject', () => {
    renderWithProvider(<ProfilePage />);
    
    const physicsCard = screen.getByText('Physics').closest('div')?.parentElement?.parentElement;
    expect(physicsCard).toBeInTheDocument();
    
    if (physicsCard) {
      fireEvent.click(physicsCard);
      expect(physicsCard).toHaveClass('ring-4', 'ring-blue-500');
    }
  });

  it('enables start quiz button when subject is selected', () => {
    renderWithProvider(<ProfilePage />);
    
    // Initially button shows "Select a Subject to Continue"
    const startButton = screen.getByRole('button', { name: /Select a Subject to Continue/i });
    expect(startButton).toBeDisabled();
    
    const physicsCard = screen.getByText('Physics').closest('div')?.parentElement?.parentElement;
    if (physicsCard) {
      fireEvent.click(physicsCard);
    }
    
    // After selection, button shows "Start Diagnostic Quiz"
    const updatedButton = screen.getByRole('button', { name: /Start Diagnostic Quiz/i });
    expect(updatedButton).not.toBeDisabled();
  });

  it('navigates to quiz page when start button is clicked', () => {
    renderWithProvider(<ProfilePage />);
    
    // Select a subject
    const physicsCard = screen.getByText('Physics').closest('div')?.parentElement?.parentElement;
    if (physicsCard) {
      fireEvent.click(physicsCard);
    }
    
    // Click start button (text changes after selection)
    const startButton = screen.getByRole('button', { name: /Start Diagnostic Quiz/i });
    fireEvent.click(startButton);
    
    expect(mockPush).toHaveBeenCalledWith('/quiz');
  });

  it('displays profile statistics', () => {
    renderWithProvider(<ProfilePage />);
    
    expect(screen.getByText('Your Learning Journey')).toBeInTheDocument();
    expect(screen.getByText('Quizzes Taken')).toBeInTheDocument();
    expect(screen.getByText('Avg Score')).toBeInTheDocument();
    expect(screen.getByText('Concepts Fixed')).toBeInTheDocument();
    expect(screen.getByText('Study Hours')).toBeInTheDocument();
  });

  it('stores selected subject in global context when start button is clicked', () => {
    let capturedSubject: string | null = null;
    
    // Create a test component that captures the subject from context
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
      const { selectedSubject } = require('@/lib/SubjectContext').useSubject();
      capturedSubject = selectedSubject;
      return <>{children}</>;
    };
    
    render(
      <SubjectProvider>
        <TestWrapper>
          <ProfilePage />
        </TestWrapper>
      </SubjectProvider>
    );
    
    // Select a subject
    const physicsCard = screen.getByText('Physics').closest('div')?.parentElement?.parentElement;
    if (physicsCard) {
      fireEvent.click(physicsCard);
    }
    
    // Click start button
    const startButton = screen.getByRole('button', { name: /Start Diagnostic Quiz/i });
    fireEvent.click(startButton);
    
    // Verify subject was stored in context
    expect(capturedSubject).toBe('physics');
  });
});
