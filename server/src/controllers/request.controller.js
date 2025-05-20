const db = require('../models');
const Request = db.Request;
const User = db.User;
const { Op } = require('sequelize');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, flowerType, quantity, deadline, contactPhone, contactEmail } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Необходимо указать название и описание запроса' });
    }

    const newRequest = await Request.create({
      title,
      description,
      flowerType,
      quantity,
      deadline,
      contactPhone,
      contactEmail,
      userId: req.userId,
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Запрос успешно создан',
      request: newRequest
    });
  } catch (error) {
    console.error('Ошибка при создании запроса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при создании запроса',
      error: error.message 
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status, search, fromDate, toDate } = req.query;

    const whereCondition = {};

    if (status && status !== 'all') {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { flowerType: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (fromDate || toDate) {
      whereCondition.createdAt = {};

      if (fromDate) {
        whereCondition.createdAt[Op.gte] = new Date(fromDate);
      }

      if (toDate) {
        const toDateObj = new Date(toDate);
        toDateObj.setDate(toDateObj.getDate() + 1); 
        whereCondition.createdAt[Op.lt] = toDateObj;
      }
    }

    const requests = await Request.findAll({
      where: whereCondition,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Ошибка при получении запросов:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при получении запросов',
      error: error.message 
    });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Ошибка при получении запросов пользователя ты наверн не туда обращаешься:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при получении запросов пользователя',
      error: error.message 
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findByPk(requestId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      }]
    });

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Запрос не найден' 
      });
    }

    if (req.userRole !== 'admin' && request.userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'У вас нет доступа к этому запросу онет!' 
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Ошибка при получении запроса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при получении запроса',
      error: error.message 
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!['new', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'не тот статус ' 
      });
    }

    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Запрос не найден' 
      });
    }

    if (req.userRole !== 'admin') {
      if (request.userId !== req.userId) {
        return res.status(403).json({ 
          success: false,
          message: 'У вас нет доступа для изменения этого запроса' 
        });
      }

      if (status !== 'cancelled') {
        return res.status(403).json({ 
          success: false,
          message: 'Вы можете только отменять свои запросы' 
        });
      }
    }

    await request.update({ status });

    res.status(200).json({
      success: true,
      message: 'Статус запроса успешно обновлен',
      request
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса запроса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при обновлении статуса запроса',
      error: error.message 
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Запрос не найден' 
      });
    }

    if (req.userRole !== 'admin' && request.userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'У вас нет доступа для удаления этого запроса' 
      });
    }

    await request.destroy();

    res.status(200).json({
      success: true,
      message: 'Запрос успешно удален'
    });
  } catch (error) {
    console.error('Ошибка при удалении запроса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Произошла ошибка при удалении запроса',
      error: error.message 
    });
  }
}; 