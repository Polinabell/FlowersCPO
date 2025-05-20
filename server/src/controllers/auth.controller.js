const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const db = require('../models');
const User = db.User;
const Supplier = db.Supplier;
const Seller = db.Seller;
const { logUserAction } = require('../utils/logger');


exports.register = async (req, res) => {
  try {
    const { email, password, role, fullName, farmType, address } = req.body;
    

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logUserAction('ошибка', req, `Попытка регистрации с уже существующим email: ${email}`);
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role: ['user', 'supplier', 'seller'].includes(role) ? role : 'user'
    });
    

    if (role === 'supplier') {
      if (!fullName || !farmType || !address) {
        await user.destroy();
        logUserAction('ошибка', req, `Неполные данные для регистрации поставщика: ${email}`);
        return res.status(400).json({ 
          message: 'Для поставщика требуется указать полное имя, тип фермы и адрес' 
        });
      }
      
      await Supplier.create({
        userId: user.id,
        fullName,
        farmType,
        address
      });
    } else if (role === 'seller') {
      if (!fullName || !address) {
        await user.destroy();
        logUserAction('ошибка', req, `Неполные данные для регистрации продавца: ${email}`);
        return res.status(400).json({ 
          message: 'Для продавца требуется указать полное имя и адрес' 
        });
      }
      
      await Seller.create({
        userId: user.id,
        fullName,
        address
      });
    }
    
    
    const token = generateToken(user.id, user.role);
    
    
    logUserAction('добавление', req, `Зарегистрирован новый пользователь: ${email} (роль: ${role})`);
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при регистрации: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logUserAction('ошибка', req, `Попытка входа с несуществующим email: ${email}`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logUserAction('ошибка', req, `Неверный пароль для пользователя: ${email}`);
      return res.status(401).json({ message: 'Неверный пароль' });
    }
    
    
    const token = generateToken(user.id, user.role);
    
    
    logUserAction('авторизация', req, `Вход пользователя: ${email} (ID: ${user.id}, роль: ${user.role})`);
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при авторизации: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          required: false
        },
        {
          model: Seller,
          as: 'seller',
          required: false
        }
      ]
    });
    
    if (!user) {
      logUserAction('ошибка', req, `Попытка получения несуществующего профиля (ID: ${userId})`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    logUserAction('ошибка', req, `Ошибка при получении профиля: ${error.message}`);
    res.status(500).json({ message: 'Ошибка сервера при получении профиля' });
  }
}; 