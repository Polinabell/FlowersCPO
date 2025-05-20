import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlowerCatalog from '../../pages/FlowerCatalog';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { mockFlowers } from '../utils/apiMock';


vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    cartItems: [],
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    totalPrice: 0
  })
}));

vi.mock('../../api', () => ({
  flowersAPI: {
    getAllFlowers: vi.fn()
  }
}));

describe('FlowerCatalog Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('отображает загрузчик при начальной загрузке', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ flowers: [] }), 100))
    );

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('отображает цветы после успешной загрузки', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockResolvedValue({
      flowers: mockFlowers
    });

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText('Каталог цветов')).toBeInTheDocument();
    });

    
    await waitFor(() => {
      expect(screen.getByText('Красная Роза')).toBeInTheDocument();
      expect(screen.getByText('Белый Тюльпан')).toBeInTheDocument();
    });
  });

  test('отображает сообщение об ошибке при неудачной загрузке', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockRejectedValue(
      new Error('API error')
    );

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    // Ожидаем сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Не удалось загрузить данные о цветах')).toBeInTheDocument();
      expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
    });
  });

  test('фильтрует цветы по поисковому запросу', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockResolvedValue({
      flowers: mockFlowers
    });

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText('Красная Роза')).toBeInTheDocument();
      expect(screen.getByText('Белый Тюльпан')).toBeInTheDocument();
    });

    
    const searchInput = screen.getByPlaceholderText('Поиск цветов');
    fireEvent.change(searchInput, { target: { value: 'Роза' } });

    
    expect(screen.getByText('Красная Роза')).toBeInTheDocument();
    expect(screen.queryByText('Белый Тюльпан')).not.toBeInTheDocument();
  });

  test('фильтрует цветы по типу', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockResolvedValue({
      flowers: mockFlowers
    });

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText('Красная Роза')).toBeInTheDocument();
    });

    
    const typeSelect = screen.getByRole('combobox', { name: /тип/i });
    fireEvent.change(typeSelect, { target: { value: 'Розы' } });

    
    expect(screen.getByText('Красная Роза')).toBeInTheDocument();
    expect(screen.queryByText('Белый Тюльпан')).not.toBeInTheDocument();
  });

  test('сбрасывает все фильтры при нажатии на кнопку сброса', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockResolvedValue({
      flowers: mockFlowers
    });

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText('Красная Роза')).toBeInTheDocument();
      expect(screen.getByText('Белый Тюльпан')).toBeInTheDocument();
    });

    
    const searchInput = screen.getByPlaceholderText('Поиск цветов');
    fireEvent.change(searchInput, { target: { value: 'Роза' } });

    
    expect(screen.getByText('Красная Роза')).toBeInTheDocument();
    expect(screen.queryByText('Белый Тюльпан')).not.toBeInTheDocument();

    
    fireEvent.click(screen.getByText('Сбросить фильтры'));

    
    expect(screen.getByText('Красная Роза')).toBeInTheDocument();
    expect(screen.getByText('Белый Тюльпан')).toBeInTheDocument();
    
    expect(searchInput).toHaveValue('');
  });

  test('сортирует цветы по цене (по возрастанию)', async () => {
    
    vi.mocked(require('../../api').flowersAPI.getAllFlowers).mockResolvedValue({
      flowers: mockFlowers
    });

    render(
      <BrowserRouter>
        <FlowerCatalog />
      </BrowserRouter>
    );

    
    await waitFor(() => {
      expect(screen.getByText('Красная Роза')).toBeInTheDocument();
      expect(screen.getByText('Белый Тюльпан')).toBeInTheDocument();
    });

    
    const sortSelect = screen.getByRole('combobox', { name: /сортировка/i });
    fireEvent.change(sortSelect, { target: { value: 'asc' } });

    
    
    const flowerCards = screen.getAllByTestId('flower-card');
    expect(flowerCards[0]).toHaveTextContent('Белый Тюльпан');
    expect(flowerCards[1]).toHaveTextContent('Красная Роза');
  });
}); 