import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';
import { vi, describe, test, expect, beforeEach } from 'vitest';


vi.mock('../../context/AuthContext', () => {
  
  const actual = vi.importActual('../../context/AuthContext');
  
  return {
    AuthProvider: ({ children }) => <>{children}</>,
    useAuth: vi.fn()
  };
});


const { useAuth } = vi.importMock('../../context/AuthContext');

describe('ProtectedRoute Component', () => {
  const mockOutlet = () => <div data-testid="outlet-content">Защищенное содержимое</div>;
  
  test('отображает загрузчик, когда isLoading=true', () => {
    
    useAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null
    });
    
    render(
      <BrowserRouter>
        <ProtectedRoute />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  test('перенаправляет на /login, когда пользователь не авторизован', () => {
    const useAuthMock = vi.fn(() => ({
      isLoading: false,
      isAuthenticated: false,
      user: null
    }));
    
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: useAuthMock,
      AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }));
    
    const { container } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/profile" element={<ProtectedRoute />}>
            <Route index element={mockOutlet()} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(container.innerHTML).toContain('Login Page');
  });
  
  test('отображает содержимое, когда пользователь авторизован и нет ограничений по ролям', () => {
    const useAuthMock = vi.fn(() => ({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'USER' }
    }));
    
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: useAuthMock,
      AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }));
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={mockOutlet()} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
  
  test('перенаправляет на /, когда у пользователя нет необходимой роли', () => {
    const useAuthMock = vi.fn(() => ({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'USER' }
    }));
    
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: useAuthMock,
      AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }));
    
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']} />}>
            <Route index element={mockOutlet()} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(container.innerHTML).toContain('Home Page');
  });
  
  test('отображает содержимое, когда у пользователя есть необходимая роль', () => {
    const useAuthMock = vi.fn(() => ({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'admin' }
    }));
    
    vi.doMock('../../context/AuthContext', () => ({
      useAuth: useAuthMock,
      AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }));
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute requiredRoles={['admin']} />}>
            <Route index element={mockOutlet()} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
}); 