import '@testing-library/jest-dom';

// Мок localStorage для тестов
class LocalStorageMock {
  store: Record<string, string>;
  
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Подавление предупреждений от React-Router в тестах
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: useNavigate() may be used only in the context of a <Router> component')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 