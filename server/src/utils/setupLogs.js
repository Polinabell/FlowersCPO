const fs = require('fs');
const path = require('path');


const logsDir = path.join(__dirname, '../../logs');


if (!fs.existsSync(logsDir)) {
  console.log('Создаем директорию для логов...');
  fs.mkdirSync(logsDir, { recursive: true });
  console.log(`Директория для логов создана: ${logsDir}`);
} else {
  console.log(`Директория для логов существует: ${logsDir}`);
}


const logFilePath = path.join(logsDir, 'user-actions.log');


if (!fs.existsSync(logFilePath)) {
  console.log('Создаем файл журнала действий пользователей ');
  fs.writeFileSync(logFilePath, '--- Журнал действий пользователей ---\n', 'utf8');
  console.log(`Файл журнала: ${logFilePath}`);
}


console.log('все ок');

module.exports = {
  logsDir,
  logFilePath
}; 