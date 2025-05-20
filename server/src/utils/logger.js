const fs = require('fs');
const path = require('path');


const logsDir = path.join(__dirname, '../../logs');


try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Ошибка при создании директории логов:', error);
}


const logFilePath = path.join(logsDir, 'user-actions.log');

/**
 * Записывает действие пользователя в лог-файл
 * @param {string} action - Действие пользователя (добавление, удаление, ошибка)
 * @param {object} req - Express request объект
 * @param {string} details - Дополнительные детали (опционально)
 */
const logUserAction = (action, req, details = '') => {
  if (!req) {
    console.error('Ошибка логирования: объект запроса не передан');
    return;
  }
  
  try {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'неизвестно';
    const method = req.method || 'неизвестно';
    const url = req.originalUrl || 'неизвестно';
    const userId = req.user ? req.user.id : 'неавторизован';
    
    const logEntry = `[${timestamp}] IP: ${ip} | Пользователь: ${userId} | ${method} ${url} | Действие: ${action} | ${details}\n`;
    
    
    try {
      fs.appendFileSync(logFilePath, logEntry);
    } catch (fileError) {
    
      console.log('Ошибка при записи в лог-файл:', fileError.message);
      console.log('Лог:', logEntry);
    }
  } catch (error) {
    console.error('Ошибка при логировании действия:', error);
  }
};


const requestLogger = (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'неизвестно';
    const method = req.method || 'неизвестно';
    const url = req.originalUrl || 'неизвестно';
    
    const logEntry = `[${timestamp}] IP: ${ip} | ${method} ${url}\n`;
    
    
    try {
      fs.appendFileSync(logFilePath, logEntry);
    } catch (fileError) {
    
      console.log('Ошибка при записи в лог-файл:', fileError.message);
      console.log('Лог запроса:', logEntry);
    }
  } catch (error) {
    console.error('Ошибка при логировании запроса:', error);
  }
  
  next();
};

module.exports = {
  logUserAction,
  requestLogger
}; 