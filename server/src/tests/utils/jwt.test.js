const { generateToken, verifyToken } = require('../../utils/jwt');
const jwt = require('jsonwebtoken');

describe('JWT Utility', () => {
  const userId = 1;
  const role = 'user';
  
  test('generateToken должен создавать JWT токен с правильными данными', () => {
    const token = generateToken(userId, role);
    
    
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    
    expect(payload.id).toBe(userId);
    expect(payload.role).toBe(role);
    expect(payload).toHaveProperty('exp');
    expect(payload).toHaveProperty('iat');
  });
  
  test('verifyToken должен правильно декодировать валидный токен', () => {
    const token = generateToken(userId, role);
    const payload = verifyToken(token);
    
    expect(payload).not.toBeNull();
    expect(payload.id).toBe(userId);
    expect(payload.role).toBe(role);
  });
  
  test('verifyToken должен возвращать null для невалидного токена', () => {
    const invalidToken = 'invalid.token.string';
    const payload = verifyToken(invalidToken);
    
    expect(payload).toBeNull();
  });
  
  test('verifyToken должен возвращать null для пустого токена', () => {
    expect(verifyToken('')).toBeNull();
    expect(verifyToken(null)).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });
}); 