const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.url, config);

const db = {
  sequelize,
  Sequelize,
  User: require('./user.model')(sequelize, Sequelize),
  Supplier: require('./supplier.model')(sequelize, Sequelize),
  Seller: require('./seller.model')(sequelize, Sequelize),
  Flower: require('./flower.model')(sequelize, Sequelize),
  FlowerSeller: require('./flowerSeller.model')(sequelize, Sequelize),
  Request: require('./request.model')(sequelize, Sequelize)
};

db.User.hasOne(db.Supplier, {
  foreignKey: 'userId',
  as: 'supplier'
});
db.Supplier.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

db.User.hasOne(db.Seller, {
  foreignKey: 'userId',
  as: 'seller'
});
db.Seller.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

db.Supplier.hasMany(db.Flower, {
  foreignKey: 'supplierId',
  as: 'flowers'
});
db.Flower.belongsTo(db.Supplier, {
  foreignKey: 'supplierId',
  as: 'supplier'
});

db.Flower.belongsToMany(db.Seller, {
  through: db.FlowerSeller,
  foreignKey: 'flowerId',
  otherKey: 'sellerId',
  as: 'sellers'
});
db.Seller.belongsToMany(db.Flower, {
  through: db.FlowerSeller,
  foreignKey: 'sellerId',
  otherKey: 'flowerId',
  as: 'flowers'
});

db.User.hasMany(db.Request, {
  foreignKey: 'userId',
  as: 'requests'
});
db.Request.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = db; 