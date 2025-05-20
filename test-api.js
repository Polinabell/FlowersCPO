const newman = require('newman');
const path = require('path');
const fs = require('fs');


const collectionPath = path.join(__dirname, 'BelkaDance_API_fixed.postman_collection.json');


if (!fs.existsSync(collectionPath)) {
  console.error('Файл коллекции не найден чьорт:', collectionPath);
  process.exit(1);
}


const environment = {
  values: [
    {
      key: 'token',
      value: '',
      enabled: true
    }
  ]
};


const options = {
  collection: require(collectionPath),
  environment: environment,
  reporters: ['cli'],
  
  reporter: {
    html: {
      export: './newman-report.html'
    }
  },
  
  timeout: 5000, // 5 секунд на запрос(ну с запасиком чо бы нет)
  insecure: true
};


console.log('Тестирование API BelkaDance пошло поехало');
newman.run(options)
  .on('start', function (err, args) {
    console.log('Запуск коллекции...');
  })
  .on('done', function (err, summary) {
    if (err || summary.error) {
      console.error('Тестирование завершилось с ошибками');
      process.exit(1);
    } else {
      console.log('Тестирование успешно завершено! круть');
      console.log(`Всего запросов: ${summary.run.stats.requests.total}`);
      console.log(`Успешно: ${summary.run.stats.requests.total - summary.run.stats.requests.failed}`);
      console.log(`Ошибок: ${summary.run.stats.requests.failed}`);
      process.exit(0);
    }
  }); 