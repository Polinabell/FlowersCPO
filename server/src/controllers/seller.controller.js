const db = require('../models');
const { Op } = require('sequelize');
const Seller = db.Seller;
const Flower = db.Flower;
const User = db.User;
const Supplier = db.Supplier;
const FlowerSeller = db.FlowerSeller;
const { logUserAction } = require('../utils/logger');


exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      ]
    });
    
    res.status(200).json({ sellers });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при получении списка продавцов: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении продавцов' });
  }
};


exports.getSellerById = async (req, res) => {
  try {
    const sellerId = req.params.id;
    

    const seller = await Seller.findByPk(sellerId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      ]
    });
    
    if (!seller) {
      logUserAction('ошибка', req, `Продавец с ID ${sellerId} не найден`);
      return res.status(404).json({ message: 'Продавец не найден' });
    }
    
   
    const sellerWithFlowers = await Seller.findByPk(sellerId, {
      include: [
        {
          model: Flower,
          as: 'flowers',
          include: [
            {
              model: Supplier,
              as: 'supplier',
              attributes: ['fullName', 'companyName']
            }
          ],
          through: {
            attributes: ['price', 'quantity']
          }
        }
      ]
    });
    
    
    let flowers = [];
    if (sellerWithFlowers && sellerWithFlowers.flowers) {
      flowers = sellerWithFlowers.flowers.map(flower => {
        const flowerData = flower.toJSON();
        
    
        if (flower.FlowerSeller) {
          flowerData.price = flower.FlowerSeller.price;
          flowerData.quantity = flower.FlowerSeller.quantity;
        }
        
        return flowerData;
      });
    }
    
    res.status(200).json({
      seller,
      flowers
    });
  } catch (error) {
    console.error('Ошибка при получении данных продавца:', error);
    logUserAction('ошибка', req, `Ошибка при получении данных продавца (ID: ${req.params.id}): ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении продавца', error: error.message });
  }
};


exports.getSellerFlowers = async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
      logUserAction('ошибка', req, `Продавец с ID ${sellerId} не найден при запросе его цветов`);
      return res.status(404).json({ message: 'Продавец не найден' });
    }
    
    const flowers = await Flower.findAll({
      include: [
        {
          model: Seller,
          as: 'sellers',
          through: { attributes: [] },
          where: { id: sellerId }
        },
        {
          model: Supplier,
          as: 'supplier',
          include: [{
            model: User,
            as: 'user',
            attributes: ['email']
          }]
        }
      ]
    });
    
    res.status(200).json({ 
      seller,
      flowers 
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при получении цветов продавца (ID: ${req.params.id}): ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении цветов продавца' });
  }
};


exports.addFlowerToSeller = async (req, res) => {
  try {
    const userId = req.user.id;
    const { flowerId } = req.body;
    
    
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      logUserAction('ошибка', req, 'Попытка добавления цветка в продажу неавторизованным продавцом');
      return res.status(403).json({ message: 'Только продавцы могут добавлять цветы в продажу' });
    }
    
    
    const flower = await Flower.findByPk(flowerId);
    if (!flower) {
      logUserAction('ошибка', req, `Попытка добавления в продажу несуществующего цветка (ID: ${flowerId})`);
      return res.status(404).json({ message: 'Цветок не найден' });
    }
    
    
    const existingRelation = await FlowerSeller.findOne({
      where: { flowerId, sellerId: seller.id }
    });
    
    if (existingRelation) {
      logUserAction('ошибка', req, `Попытка повторного добавления цветка "${flower.name}" (ID: ${flowerId}) в продажу`);
      return res.status(400).json({ message: 'Этот цветок уже добавлен в продажу' });
    }
    
    
    await FlowerSeller.create({
      flowerId,
      sellerId: seller.id
    });
    
    
    logUserAction('добавление', req, `Цветок "${flower.name}" (ID: ${flowerId}) добавлен в продажу продавцом (ID: ${seller.id})`);
    
    res.status(200).json({ 
      message: 'Цветок успешно добавлен в продажу'
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при добавлении цветка в продажу: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при добавлении цветка в продажу' });
  }
};


exports.removeFlowerFromSeller = async (req, res) => {
  try {
    const userId = req.user.id;
    const flowerId = req.params.flowerId;
    
    
    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      logUserAction('ошибка', req, 'Попытка удаления цветка из продажи неавторизованным продавцом');
      return res.status(403).json({ message: 'Только продавцы могут удалять цветы из продажи' });
    }
    
    
    const flower = await Flower.findByPk(flowerId);
    const flowerName = flower ? flower.name : `ID: ${flowerId}`;
    
    
    const relation = await FlowerSeller.findOne({
      where: { flowerId, sellerId: seller.id }
    });
    
    if (!relation) {
      logUserAction('ошибка', req, `Попытка удаления из продажи несуществующего цветка "${flowerName}"`);
      return res.status(404).json({ message: 'Этот цветок не найден в вашей продаже' });
    }
    
    
    await relation.destroy();
    
    
    logUserAction('удаление', req, `Цветок "${flowerName}" (ID: ${flowerId}) удален из продажи продавцом (ID: ${seller.id})`);
    
    res.status(200).json({ 
      message: 'Цветок успешно удален из продажи'
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при удалении цветка из продажи: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при удалении цветка из продажи' });
  }
};


exports.getTopExpensiveSellers = async (req, res) => {
  try {
    console.log('Запрос на получение топа продавцов с самыми дорогими цветами');
    
    
    const flowersellersModel = await db.sequelize.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'flower_seller\'');
    console.log('Колонки в таблице flower_seller:', flowersellersModel[0]);
    
    
    const sellers = await db.sequelize.query(`
      SELECT 
        s.id, 
        s."fullName", 
        s.address,
        MAX(f.price) as max_price,
        COUNT(DISTINCT f.id) as flower_count
      FROM 
        sellers s
      JOIN 
        "flower_seller" fs ON s.id = fs."sellerId"
      JOIN 
        flowers f ON fs."flowerId" = f.id
      GROUP BY 
        s.id, s."fullName", s.address
      HAVING 
        COUNT(DISTINCT f.id) > 0
      ORDER BY 
        max_price DESC
      LIMIT 5
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    console.log('Топ продавцов с самыми дорогими цветами:', sellers);
    
    res.status(200).json({ sellers });
  } catch (error) {
    console.error('Ошибка при получении топа продавцов:', error);
    logUserAction('ошибка', req, `Ошибка при получении топа продавцов: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении топа продавцов', error: error.message });
  }
};


exports.getMatchingSuppliers = async (req, res) => {
  try {
    console.log('Запрос на получение совпадающих поставщиков и продавцов');
    
    const matchingData = await db.sequelize.query(`
      SELECT 
        s."fullName" AS seller_name, 
        sup."fullName" AS supplier_name, 
        COUNT(DISTINCT f.id) AS flower_count
      FROM 
        sellers AS s
      JOIN 
        "flower_seller" AS fs ON s.id = fs."sellerId"
      JOIN 
        flowers AS f ON fs."flowerId" = f.id
      JOIN 
        suppliers AS sup ON f."supplierId" = sup.id
      GROUP BY 
        s."fullName", sup."fullName"
      HAVING 
        COUNT(DISTINCT f.id) > 0
      ORDER BY 
        flower_count DESC
      LIMIT 20
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    console.log('Найдено совпадающих поставщиков:', matchingData.length);
    
    res.status(200).json({ matchingData });
  } catch (error) {
    console.error('Ошибка при получении данных совпадающих поставщиков и продавцов:', error);
    logUserAction('ошибка', req, `Ошибка при получении данных совпадающих поставщиков и продавцов: ${error.message}`);
    res.status(500).json({ 
      message: 'Ошибка сервера при получении совпадающих данных', 
      error: error.message 
    });
  }
}; 