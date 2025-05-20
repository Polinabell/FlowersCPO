const fs = require('fs');
const path = require('path');


const logFilePath = path.join(__dirname, '../../logs/user-actions.log');


if (!fs.existsSync(logFilePath)) {
  console.error('Файл журнала не найден. Возможно, система логирования еще не настроена.');
  console.error('Запустите npm run setup-logs для настройки логирования.');
  process.exit(1);
}


try {
  const logContent = fs.readFileSync(logFilePath, 'utf8');
  const lines = logContent.split('\n');
  
  
  const lineCount = process.argv[2] ? parseInt(process.argv[2]) : 50;
  
  console.log(`=== Последние ${lineCount} записей журнала действий пользователей ===\n`);
  
  
  const startLine = Math.max(0, lines.length - lineCount);
  for (let i = startLine; i < lines.length; i++) {
    if (lines[i].trim()) {
      console.log(lines[i]);
    }
  }
  
  console.log('\n=== Конец журнала ===');
  console.log(`Всего записей в журнале: ${lines.filter(line => line.trim()).length}`);
  console.log(`Путь к файлу журнала: ${logFilePath}`);
  
} catch (error) {
  console.error('Ошибка при чтении файла журнала:', error.message);
  process.exit(1);
} 