const supplierController = require('../../controllers/supplier.controller');

jest.mock('../../models', () => {
  const mockModels = require('../mocks/models');
  return mockModels;
});

const db = require('../../models');

describe('Supplier Controller', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: {},
      user: { id: 1 }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllSuppliers', () => {
    test('должен возвращать всех поставщиков', async () => {
      const mockSuppliers = [
        { id: 1, fullName: 'Поставщик 1', user: { email: 'supplier1@example.com' } },
        { id: 2, fullName: 'Поставщик 2', user: { email: 'supplier2@example.com' } }
      ];
      
      db.Supplier.findAll.mockResolvedValue(mockSuppliers);
      
      await supplierController.getAllSuppliers(req, res);
      
      expect(db.Supplier.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['email']
          }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ suppliers: mockSuppliers });
    });
    
    test('должен обрабатывать ошибки при получении всех поставщиков', async () => {
      const error = new Error('Ошибка при получении поставщиков');
      db.Supplier.findAll.mockRejectedValue(error);
      
      console.error = jest.fn();
      
      await supplierController.getAllSuppliers(req, res);
      
      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка сервера при получении поставщиков' });
    });
  });
  
  describe('getSupplierById', () => {
    test('должен возвращать поставщика по ID', async () => {
      const mockSupplier = { 
        id: 1, 
        fullName: 'Поставщик 1',
        user: { email: 'supplier1@example.com' }
      };
      
      req.params.id = '1';
      db.Supplier.findByPk.mockResolvedValue(mockSupplier);
      
      await supplierController.getSupplierById(req, res);
      
      expect(db.Supplier.findByPk).toHaveBeenCalledWith('1', {
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['email']
          }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ supplier: mockSupplier });
    });
    
    test('должен возвращать 404, если поставщик не найден', async () => {
      req.params.id = '999';
      db.Supplier.findByPk.mockResolvedValue(null);
      
      await supplierController.getSupplierById(req, res);
      
      expect(db.Supplier.findByPk).toHaveBeenCalledWith('999', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Поставщик не найден' });
    });
    
    test('должен обрабатывать ошибки при получении поставщика по ID', async () => {
      req.params.id = '1';
      const error = new Error('Ошибка при получении поставщика');
      db.Supplier.findByPk.mockRejectedValue(error);
      
      console.error = jest.fn();
      
      await supplierController.getSupplierById(req, res);
      
      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка сервера при получении поставщика' });
    });
  });
  
  describe('getSupplierFlowers', () => {
    test('должен возвращать цветы поставщика', async () => {
      const mockSupplier = { id: 1, fullName: 'Поставщик 1' };
      const mockFlowers = [
        { id: 1, name: 'Роза', color: 'Красная', supplierId: 1 },
        { id: 2, name: 'Тюльпан', color: 'Жёлтый', supplierId: 1 }
      ];
      
      req.params.id = '1';
      db.Supplier.findByPk.mockResolvedValue(mockSupplier);
      db.Flower.findAll.mockResolvedValue(mockFlowers);
      
      await supplierController.getSupplierFlowers(req, res);
      
      expect(db.Supplier.findByPk).toHaveBeenCalledWith('1');
      expect(db.Flower.findAll).toHaveBeenCalledWith({
        where: { supplierId: '1' },
        include: [
          {
            model: db.Supplier,
            as: 'supplier',
            include: [{
              model: db.User,
              as: 'user',
              attributes: ['email']
            }]
          }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        supplier: mockSupplier,
        flowers: mockFlowers
      });
    });
    
    test('должен возвращать 404, если поставщик не найден', async () => {
      req.params.id = '999';
      db.Supplier.findByPk.mockResolvedValue(null);
      
      await supplierController.getSupplierFlowers(req, res);
      
      expect(db.Supplier.findByPk).toHaveBeenCalledWith('999');
      expect(db.Flower.findAll).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Поставщик не найден' });
    });
    
    test('должен обрабатывать ошибки при получении цветов поставщика', async () => {
      req.params.id = '1';
      const error = new Error('Ошибка при получении цветов');
      db.Supplier.findByPk.mockRejectedValue(error);
      
      console.error = jest.fn();
      
      await supplierController.getSupplierFlowers(req, res);
      
      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ошибка сервера при получении цветов поставщика' });
    });
  });
}); 