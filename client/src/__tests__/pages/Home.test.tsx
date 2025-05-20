import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { describe, test, expect } from 'vitest';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Home Page', () => {
  test('отображает заголовок страницы', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Платформа')).toBeInTheDocument();
    expect(screen.getByText('«Цветы»')).toBeInTheDocument();
  });

  test('отображает основное описание платформы', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/Соединяем поставщиков, продавцов и любителей цветов/i)).toBeInTheDocument();
  });

  test('отображает кнопку "Исследовать цветы"', () => {
    renderWithRouter(<Home />);
    
    const exploreButton = screen.getByText('Исследовать цветы');
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/flowers');
  });

  test('отображает кнопку "Регистрация"', () => {
    renderWithRouter(<Home />);
    
    const registerButton = screen.getByText('Регистрация');
    expect(registerButton).toBeInTheDocument();
    expect(registerButton.closest('a')).toHaveAttribute('href', '/register');
  });

  test('отображает секцию "Возможности платформы"', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Возможности платформы')).toBeInTheDocument();
    expect(screen.getByText('Каталог цветов')).toBeInTheDocument();
    expect(screen.getByText('Поставщики')).toBeInTheDocument();
    expect(screen.getByText('Продавцы')).toBeInTheDocument();
    expect(screen.getByText('Поиск и фильтрация')).toBeInTheDocument();
  });
}); 