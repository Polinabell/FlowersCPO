import { describe, test, expect } from 'vitest';

// Простые утилитарные функции для тестирования
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

describe('String Utils', () => {
  describe('truncateText', () => {
    test('не обрезает текст, если он короче максимальной длины', () => {
      const text = 'Короткий текст';
      expect(truncateText(text, 20)).toBe(text);
    });

    test('обрезает текст и добавляет многоточие, если он длиннее максимальной длины', () => {
      const text = 'Это очень длинный текст, который нужно обрезать';
      expect(truncateText(text, 10)).toBe('Это очень ...');
    });

    test('работает с пустой строкой', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('formatPrice', () => {
    test('форматирует целое число с разделителями разрядов', () => {
      expect(formatPrice(1000)).toBe('1 000');
    });

    test('форматирует большое число', () => {
      expect(formatPrice(1234567)).toBe('1 234 567');
    });

    test('работает с нулем', () => {
      expect(formatPrice(0)).toBe('0');
    });
  });

  describe('capitalizeFirstLetter', () => {
    test('делает первую букву заглавной, а остальные строчными', () => {
      expect(capitalizeFirstLetter('привет')).toBe('Привет');
      expect(capitalizeFirstLetter('ПРИВЕТ')).toBe('Привет');
    });

    test('работает с одной буквой', () => {
      expect(capitalizeFirstLetter('а')).toBe('А');
    });

    test('возвращает пустую строку для пустого ввода', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });
  });
}); 