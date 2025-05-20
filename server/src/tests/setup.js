
process.env.NODE_ENV = 'test';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret';
}


jest.setTimeout(30000);


jest.mock('../utils/logger', () => ({
  logUserAction: jest.fn(),
  logError: jest.fn(),
  logInfo: jest.fn()
}));


afterAll(async () => {
}); 