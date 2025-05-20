const bcrypt = require('bcryptjs');
const authController = require('../../controllers/auth.controller');
const { generateToken } = require('../../utils/jwt');
const { logUserAction } = require('../../utils/logger');


jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn()
}));


jest.mock('../../utils/jwt', () => ({
  generateToken: jest.fn().mockReturnValue('mock_token')
}));


jest.mock('../../models', () => {
  const mockModels = require('../mocks/models');
  return mockModels;
});


const db = require('../../models');

describe('Auth Controller', () => {

  let req, res;
  
  beforeEach(() => {

    jest.clearAllMocks();
    

    req = {
      body: {},
      user: { id: 1 }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    test('должен успешно регистрировать пользователя', async () => {
      
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };
      
     
      db.User.findOne.mockResolvedValue(null);
      
     
      db.User.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
      
      
      await authController.register(req, res);
      
      
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(db.User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user'
      });
      expect(generateToken).toHaveBeenCalledWith(1, 'user');
      expect(logUserAction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Пользователь успешно зарегистрирован',
        token: 'mock_token',
        user: { id: 1, email: 'test@example.com', role: 'user' }
      });
    });
    
    test('должен возвращать ошибку, если пользователь уже существует', async () => {
      
      req.body = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'user'
      };
      
      
      db.User.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });
      
      
      await authController.register(req, res);
      
      
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(db.User.create).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь с таким email уже существует' });
    });
    
    test('должен создавать поставщика при регистрации с ролью supplier', async () => {
    
      req.body = {
        email: 'supplier@example.com',
        password: 'password123',
        role: 'supplier',
        fullName: 'Supplier Name',
        farmType: 'Farm Type',
        address: 'Supplier Address'
      };
      
      
      db.User.findOne.mockResolvedValue(null);
      
      
      db.User.create.mockResolvedValue({
        id: 1,
        email: 'supplier@example.com',
        role: 'supplier'
      });
      
      
      db.Supplier.create.mockResolvedValue({
        id: 1,
        userId: 1,
        fullName: 'Supplier Name',
        farmType: 'Farm Type',
        address: 'Supplier Address'
      });
      
      
      await authController.register(req, res);
      
      
      expect(db.User.create).toHaveBeenCalled();
      expect(db.Supplier.create).toHaveBeenCalledWith({
        userId: 1,
        fullName: 'Supplier Name',
        farmType: 'Farm Type',
        address: 'Supplier Address'
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login', () => {
    test('должен успешно авторизовать пользователя с правильными учетными данными', async () => {
      
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      
      db.User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user'
      });
      
      
      bcrypt.compare.mockResolvedValue(true);
      
      
      await authController.login(req, res);
      
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(generateToken).toHaveBeenCalledWith(1, 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mock_token',
        user: { id: 1, email: 'test@example.com', role: 'user' }
      });
    });
    
    test('должен возвращать ошибку, если пользователь не найден', async () => {
      
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      
      db.User.findOne.mockResolvedValue(null);
      
      
      await authController.login(req, res);
      
      
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не найден' });
    });
    
    test('должен возвращать ошибку при неверном пароле', async () => {
      
      req.body = {
        email: 'test@example.com',
        password: 'wrong_password'
      };
      
      
      db.User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user'
      });
      
      
      bcrypt.compare.mockResolvedValue(false);
      
      
      await authController.login(req, res);
      
      
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
      expect(generateToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Неверный пароль' });
    });
  });

  describe('getProfile', () => {
    test('должен возвращать профиль авторизованного пользователя', async () => {
      
      db.User.findByPk.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'user',
        supplier: null,
        seller: null
      });
      
      
      await authController.getProfile(req, res);
      
      
      expect(db.User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'user',
          supplier: null,
          seller: null
        }
      });
    });
    
    test('должен возвращать ошибку, если пользователь не найден', async () => {
      
      db.User.findByPk.mockResolvedValue(null);
      
      
      await authController.getProfile(req, res);
      
      
      expect(db.User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не найден' });
    });
  });
}); 