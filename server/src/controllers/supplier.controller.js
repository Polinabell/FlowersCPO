const db = require('../models');
const Supplier = db.Supplier;
const Flower = db.Flower;
const User = db.User;

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      ]
    });

    res.status(200).json({ suppliers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера при получении поставщиков' });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;

    const supplier = await Supplier.findByPk(supplierId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      ]
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Поставщик не найден' });
    }

    res.status(200).json({ supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера при получении поставщика' });
  }
};

exports.getSupplierFlowers = async (req, res) => {
  try {
    const supplierId = req.params.id;

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Поставщик не найден' });
    }

    const flowers = await Flower.findAll({
      where: { supplierId },
      include: [
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
      supplier,
      flowers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера при получении цветов поставщика' });
  }
}; 