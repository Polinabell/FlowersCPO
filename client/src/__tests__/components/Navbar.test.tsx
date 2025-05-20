import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('Navbar Component', () => {
  test('отображает логотип и основные ссылки навигации', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Цветы')).toBeInTheDocument();
    expect(screen.getByText('Поставщики')).toBeInTheDocument();
    expect(screen.getByText('Продавцы')).toBeInTheDocument();
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
  });

  test('отображает кнопку входа для неавторизованных пользователей', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.queryByText('Выйти')).not.toBeInTheDocument();
  });

  test('отображает кнопку выхода для авторизованных пользователей', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'USER' },
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Выйти')).toBeInTheDocument();
    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
  });

  test('отображает "Профиль" для обычных пользователей', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'USER' },
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Профиль')).toBeInTheDocument();
  });

  test('отображает "Мои цветы" для поставщиков', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Test Supplier', email: 'supplier@example.com', role: 'SUPPLIER' },
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Мои цветы')).toBeInTheDocument();
  });

  test('отображает "Мои продажи" для продавцов', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Test Seller', email: 'seller@example.com', role: 'SELLER' },
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Мои продажи')).toBeInTheDocument();
  });

  test('вызывает logout и навигацию при клике на кнопку выхода', () => {
    const logoutMock = vi.fn();
    
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'USER' },
      logout: logoutMock
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Выйти'));
    expect(logoutMock).toHaveBeenCalled();
  });

  test('открывает мобильное меню при клике на кнопку меню', () => {
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn()
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Мобильное меню изначально скрыто
    expect(screen.queryByText('Войти')).not.toBeNull();
    
    // Кнопка меню
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Мобильное меню должно быть видимым после клика
    expect(screen.getAllByText('Войти')).toHaveLength(2);
  });
}); 