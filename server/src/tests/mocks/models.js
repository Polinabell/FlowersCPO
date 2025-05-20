
const mockSequelize = {
  define: jest.fn(),
  sync: jest.fn().mockResolvedValue(),
  authenticate: jest.fn().mockResolvedValue(),
  transaction: jest.fn().mockImplementation(fn => fn())
};


const createModelMock = () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
  bulkCreate: jest.fn(),
  findAndCountAll: jest.fn()
});


const UserMock = createModelMock();
const SupplierMock = createModelMock();
const SellerMock = createModelMock();
const FlowerMock = createModelMock();
const FlowerSellerMock = createModelMock();
const RequestMock = createModelMock();


module.exports = {
  sequelize: mockSequelize,
  Sequelize: jest.fn(),
  User: UserMock,
  Supplier: SupplierMock,
  Seller: SellerMock,
  Flower: FlowerMock,
  FlowerSeller: FlowerSellerMock,
  Request: RequestMock
}; 