import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlowerCard from '../../components/FlowerCard';
import { vi, describe, test, expect } from 'vitest';

const mockFlower = {
  id: 1,
  name: 'Тестовый цветок',
  description: 'Тестовое описание',
  price: 999,
  type: 'Роза',
  season: 'Лето',
  country: 'Россия',
  variety: 'Садовая',
  inStock: 10,
  supplierId: 1
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('FlowerCard Component', () => {
  test('отображает основные данные цветка', () => {
    renderWithRouter(<FlowerCard flower={mockFlower} />);
    
    expect(screen.getByText('Тестовый цветок')).toBeInTheDocument();
    expect(screen.getByText('Роза')).toBeInTheDocument();
    expect(screen.getByText('Лето')).toBeInTheDocument();
    expect(screen.getByText('Россия')).toBeInTheDocument();
    expect(screen.getByText('Садовая')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  test('отображает кнопку "Подробнее" с правильной ссылкой', () => {
    renderWithRouter(<FlowerCard flower={mockFlower} />);
    
    const detailsButton = screen.getByText('Подробнее');
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton.closest('a')).toHaveAttribute('href', '/flowers/1');
  });

  test('не отображает действия если showActions=false', () => {
    renderWithRouter(<FlowerCard flower={mockFlower} showActions={false} />);
    
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument();
    expect(screen.queryByText('Добавить в продажу')).not.toBeInTheDocument();
    expect(screen.queryByText('Убрать из продажи')).not.toBeInTheDocument();
  });

  test('отображает кнопку удаления для поставщика', () => {
    const handleDelete = vi.fn();
    
    renderWithRouter(
      <FlowerCard 
        flower={mockFlower} 
        showActions={true} 
        isSupplier={true} 
        onDelete={handleDelete} 
      />
    );
    
    const deleteButton = screen.getByText('Удалить');
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  test('отображает кнопку "Добавить в продажу" для продавца', () => {
    const handleAddToSeller = vi.fn();
    
    renderWithRouter(
      <FlowerCard 
        flower={mockFlower} 
        showActions={true} 
        isSeller={true} 
        onAddToSeller={handleAddToSeller} 
      />
    );
    
    const addButton = screen.getByText('Добавить в продажу');
    expect(addButton).toBeInTheDocument();
    
    fireEvent.click(addButton);
    expect(handleAddToSeller).toHaveBeenCalledWith(1);
  });

  test('отображает кнопку "Убрать из продажи" для продавца', () => {
    const handleRemoveFromSeller = vi.fn();
    
    renderWithRouter(
      <FlowerCard 
        flower={mockFlower} 
        showActions={true} 
        isSeller={true} 
        onRemoveFromSeller={handleRemoveFromSeller} 
      />
    );
    
    const removeButton = screen.getByText('Убрать из продажи');
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(handleRemoveFromSeller).toHaveBeenCalledWith(1);
  });
}); 