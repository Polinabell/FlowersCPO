const db = require('../models');
const { Op } = require('sequelize');
const Flower = db.Flower;
const Supplier = db.Supplier;
const Seller = db.Seller;
const User = db.User;
const { logUserAction } = require('../utils/logger');


exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.findAll({
      include: [
        {
          model: Supplier,
          as: 'supplier',
          include: [{
            model: User,
            as: 'user',
            attributes: ['email']
          }]
        },
        {
          model: Seller,
          as: 'sellers',
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(200).json({ flowers });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при получении списка цветов: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении цветов' });
  }
};


exports.getFlowerById = async (req, res) => {
  try {
    const flowerId = req.params.id;
    
    const flower = await Flower.findByPk(flowerId, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          include: [{
            model: User,
            as: 'user',
            attributes: ['email']
          }]
        },
        {
          model: Seller,
          as: 'sellers',
          through: { attributes: [] }
        }
      ]
    });
    
    if (!flower) {
      logUserAction('ошибка', req, `Цветок с ID ${flowerId} не найден`);
      return res.status(404).json({ message: 'Цветок не найден' });
    }
    
    res.status(200).json({ flower });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при получении цветка: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении цветка' });
  }
};


exports.createFlower = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, season, country, variety, price, imageUrl, description, inStock } = req.body;
    

    const supplier = await Supplier.findOne({ where: { userId } });
    if (!supplier) {
      logUserAction('ошибка', req, 'Попытка создания цветка неавторизованным поставщиком');
      return res.status(403).json({ message: 'Только поставщики могут добавлять цветы' });
    }
    

    const flower = await Flower.create({
      name,
      type,
      season,
      country,
      variety,
      price,
      supplierId: supplier.id,
      imageUrl,
      description,
      inStock: inStock || 0
    });
    
    
    logUserAction('добавление', req, `Создан новый цветок "${name}" (ID: ${flower.id})`);
    
    res.status(201).json({
      message: 'Цветок успешно создан',
      flower
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при создании цветка: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при создании цветка' });
  }
};


exports.deleteFlower = async (req, res) => {
  try {
    const userId = req.user.id;
    const flowerId = req.params.id;
    
    
    const supplier = await Supplier.findOne({ where: { userId } });
    if (!supplier) {
      logUserAction('ошибка', req, 'Попытка удаления цветка неавторизованным поставщиком');
      return res.status(403).json({ message: 'Только поставщики могут удалять цветы' });
    }
    
    
    const flower = await Flower.findByPk(flowerId);
    if (!flower) {
      logUserAction('ошибка', req, `Попытка удаления несуществующего цветка (ID: ${flowerId})`);
      return res.status(404).json({ message: 'Цветок не найден' });
    }
    
    
    if (flower.supplierId !== supplier.id) {
      logUserAction('ошибка', req, `Попытка удаления чужого цветка "${flower.name}" (ID: ${flowerId})`);
      return res.status(403).json({ message: 'Вы можете удалять только свои цветы' });
    }
    
    
    const flowerName = flower.name;
    
    
    await flower.destroy();
    
    
    logUserAction('удаление', req, `Удален цветок "${flowerName}" (ID: ${flowerId})`);
    
    res.status(200).json({ message: 'Цветок успешно удален' });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при удалении цветка: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при удалении цветка' });
  }
};


exports.searchBySeasons = async (req, res) => {
  try {
    const { season } = req.query;
    
    if (!season) {
      return res.status(400).json({ message: 'Параметр season обязателен' });
    }
    
    const flowers = await Flower.findAll({
      where: {
        season: {
          [Op.iLike]: `%${season}%`
        }
      },
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.status(200).json({ flowers });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при поиске цветов по сезону: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при поиске цветов по сезону' });
  }
};


exports.searchByCountry = async (req, res) => {
  try {
    const { country } = req.query;
    
    if (!country) {
      return res.status(400).json({ message: 'Параметр country обязателен' });
    }
    
    const flowers = await Flower.findAll({
      where: {
        country: {
          [Op.iLike]: `%${country}%`
        }
      },
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.status(200).json({ flowers });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при поиске цветов по стране: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при поиске цветов по стране' });
  }
};


exports.searchByVariety = async (req, res) => {
  try {
    const { variety } = req.query;
    
    if (!variety) {
      return res.status(400).json({ message: 'Параметр variety обязателен' });
    }
    
    const flowers = await Flower.findAll({
      where: {
        variety: {
          [Op.iLike]: `%${variety}%`
        }
      },
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.status(200).json({ flowers });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при поиске цветов по сорту: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при поиске цветов по сорту' });
  }
};


exports.getFlowersBySupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    console.log(`Запрос цветов для поставщика с ID ${supplierId}`);
    
    
    const supplier = await Supplier.findOne({ 
      where: { id: supplierId },
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email']
      }]
    });
    
    if (!supplier) {
      return res.status(404).json({ message: 'Поставщик не найден' });
    }
    
   
    const flowers = await Flower.findAll({
      where: { supplierId },
      include: [{
        model: Supplier,
        as: 'supplier',
        include: [{
          model: User,
          as: 'user',
          attributes: ['email']
        }]
      }]
    });
    
    console.log(`Найдено ${flowers.length} цветов для поставщика ${supplierId}`);
    
    return res.status(200).json({ flowers });
    
  } catch (error) {
    console.error('Ошибка в getFlowersBySupplier:', error);
    return res.status(500).json({ message: 'Ошибка сервера при получении цветов поставщика', error: error.message });
  }
}; 