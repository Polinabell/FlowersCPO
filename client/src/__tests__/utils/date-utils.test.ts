import { describe, test, expect, vi } from 'vitest';

// Простые утилитарные функции для тестирования дат
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'только что';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${getMinutesText(minutes)} назад`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${getHoursText(hours)} назад`;
  } else {
    return formatDate(dateString);
  }
};

const getMinutesText = (minutes: number): string => {
  if (minutes === 1 || (minutes > 20 && minutes % 10 === 1)) {
    return 'минуту';
  } else if ((minutes >= 2 && minutes <= 4) || (minutes > 20 && minutes % 10 >= 2 && minutes % 10 <= 4)) {
    return 'минуты';
  } else {
    return 'минут';
  }
};

const getHoursText = (hours: number): string => {
  if (hours === 1 || (hours > 20 && hours % 10 === 1)) {
    return 'час';
  } else if ((hours >= 2 && hours <= 4) || (hours > 20 && hours % 10 >= 2 && hours % 10 <= 4)) {
    return 'часа';
  } else {
    return 'часов';
  }
};

describe('Date Utils', () => {
  describe('formatDate', () => {
    test('форматирует дату в формате ДД.ММ.ГГГГ', () => {
      expect(formatDate('2023-05-15')).toBe('15.05.2023');
    });
  });

  describe('isToday', () => {
    test('возвращает true, если дата сегодняшняя', () => {
      const today = new Date();
      expect(isToday(today.toISOString())).toBe(true);
    });

    test('возвращает false, если дата не сегодняшняя', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday.toISOString())).toBe(false);
    });
  });

  describe('getRelativeTimeString', () => {
    beforeEach(() => {
      // Мокируем текущую дату как 2023-05-15 15:30:00
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 4, 15, 15, 30, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('возвращает "только что" для времени менее минуты назад', () => {
      const date = new Date(2023, 4, 15, 15, 29, 30); // 30 секунд назад
      expect(getRelativeTimeString(date.toISOString())).toBe('только что');
    });

    test('возвращает "X минут назад" для времени менее часа назад', () => {
      const date = new Date(2023, 4, 15, 15, 0, 0); // 30 минут назад
      expect(getRelativeTimeString(date.toISOString())).toBe('30 минут назад');
      
      const dateOneMinute = new Date(2023, 4, 15, 15, 29, 0); // 1 минуту назад
      expect(getRelativeTimeString(dateOneMinute.toISOString())).toBe('1 минуту назад');
      
      const dateTwoMinutes = new Date(2023, 4, 15, 15, 28, 0); // 2 минуты назад
      expect(getRelativeTimeString(dateTwoMinutes.toISOString())).toBe('2 минуты назад');
    });

    test('возвращает "X часов назад" для времени менее суток назад', () => {
      const date = new Date(2023, 4, 15, 10, 30, 0); // 5 часов назад
      expect(getRelativeTimeString(date.toISOString())).toBe('5 часов назад');
      
      const dateOneHour = new Date(2023, 4, 15, 14, 30, 0); // 1 час назад
      expect(getRelativeTimeString(dateOneHour.toISOString())).toBe('1 час назад');
      
      const dateTwoHours = new Date(2023, 4, 15, 13, 30, 0); // 2 часа назад
      expect(getRelativeTimeString(dateTwoHours.toISOString())).toBe('2 часа назад');
    });

    test('возвращает форматированную дату для времени более суток назад', () => {
      const date = new Date(2023, 4, 14, 15, 30, 0); // 1 день назад
      expect(getRelativeTimeString(date.toISOString())).toBe('14.05.2023');
    });
  });
}); 