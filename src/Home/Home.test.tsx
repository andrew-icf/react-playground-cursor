import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';
import '@testing-library/jest-dom';
// import clients from '../../assets/data/clients.json';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ClientCard component
vi.mock('./ClientCard/ClientCard', () => ({
  default: ({ name, email }: { name: string; email: string }) => (
    <div data-testid="client-card">
      {name} - {email}
    </div>
  ),
}));

// Mock clients data
vi.mock('../../assets/data/clients.json', () => ({
  default: {
    clients: [
      { id: 1, name: 'Client 1', email: 'client1@example.com' },
      { id: 2, name: 'Client 2', email: 'client2@example.com' },
      { id: 3, name: 'Client 3', email: 'client3@example.com' },
    ],
  },
}));

// Mock SCSS import
vi.mock('./Home.scss', () => ({}));

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    test('renders welcome message', () => {
      renderHome();
      expect(screen.getByText('Welcome Home!')).toBeInTheDocument();
    });

    test('renders success login message', () => {
      renderHome();
      expect(screen.getByText('You have successfully logged in.')).toBeInTheDocument();
    });

    test('renders logout button', () => {
      renderHome();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('renders add client button', () => {
      renderHome();
      expect(screen.getByRole('button', { name: /add a client/i })).toBeInTheDocument();
    });

    test('renders three client cards', () => {
      renderHome();
      const clientCards = screen.getAllByTestId('client-card');
      expect(clientCards).toHaveLength(3);
    });

    test('renders initial client count', () => {
      renderHome();
      expect(screen.getByText(/client count 3/i)).toBeInTheDocument();
    });
  });

  describe('Client Count Functionality', () => {
    test('initializes count with correct number of clients', () => {
      renderHome();
      expect(screen.getByText('Client count 3.')).toBeInTheDocument();
    });

    test('increments count when Add a Client button is clicked', () => {
      renderHome();
      const addButton = screen.getByRole('button', { name: /add a client/i });
      
      fireEvent.click(addButton);
      expect(screen.getByText('Client count 4.')).toBeInTheDocument();
    });

    test('increments count multiple times', () => {
      renderHome();
      const addButton = screen.getByRole('button', { name: /add a client/i });
      
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      
      expect(screen.getByText('Client count 6.')).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    test('removes authToken from localStorage when logout is clicked', () => {
      localStorage.setItem('authToken', 'test-token-123');
      renderHome();
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    test('navigates to login page when logout is clicked', () => {
      renderHome();
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('handles logout when no authToken exists', () => {
      renderHome();
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Client Cards Integration', () => {
    test('passes correct props to ClientCard components', () => {
      renderHome();
      
      expect(screen.getByText(/client 1 - client1@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/client 2 - client2@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/client 3 - client3@example.com/i)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders header section with correct structure', () => {
      renderHome();
      const header = screen.getByRole('banner');
      
      expect(header).toBeInTheDocument();
      expect(header).toContainElement(screen.getByText('Welcome Home!'));
      expect(header).toContainElement(screen.getByRole('button', { name: /logout/i }));
    });

    test('applies correct CSS classes', () => {
      const { container } = renderHome();
      
      expect(container.querySelector('.home-container')).toBeInTheDocument();
      expect(container.querySelector('.cards-container')).toBeInTheDocument();
    });
  });
});