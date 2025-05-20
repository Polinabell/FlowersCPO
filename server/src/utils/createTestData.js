const db = require('../models');

async function createTestRequests() {
  try {
    await db.sequelize.authenticate();
    console.log('Соединение с БД установлено');
    
    let admin = await db.User.findOne({where: {role: 'admin'}});
    if (!admin) {
      console.log('Администратор не найден');
      return;
    }
    
    console.log(`Создание тестовых запросов для администратора (ID: ${admin.id})`);
    
    const requests = [
      {
        title: 'Срочный заказ роз',
        description: 'Нужно 100 красных роз для мероприятия завтра',
        status: 'new',
        userId: admin.id,
        flowerType: 'Розы',
        quantity: 100,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        contactPhone: '+7-999-123-4567',
        contactEmail: 'admin@belkadance.ru'
      },
      {
        title: 'Букет на свадьбу',
        description: 'Большой свадебный букет из белых лилий',
        status: 'processing',
        userId: admin.id,
        flowerType: 'Лилии',
        quantity: 30,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        contactPhone: '+7-999-765-4321',
        contactEmail: 'admin@belkadance.ru'
      },
      {
        title: 'Тюльпаны для офиса',
        description: 'Требуются желтые тюльпаны для украшения офиса',
        status: 'completed',
        userId: admin.id,
        flowerType: 'Тюльпаны',
        quantity: 50,
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        contactPhone: '+7-999-111-2222',
        contactEmail: 'admin@belkadance.ru'
      },
      {
        title: 'Орхидеи для выставки',
        description: 'Редкие орхидеи для ботанической выставки',
        status: 'cancelled',
        userId: admin.id,
        flowerType: 'Орхидеи',
        quantity: 25,
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        contactPhone: '+7-999-333-4444',
        contactEmail: 'admin@belkadance.ru'
      }
    ];
    
    for (const req of requests) {
      const [result, created] = await db.Request.findOrCreate({
        where: { title: req.title },
        defaults: req
      });
      
      console.log(`Запрос "${req.title}" ${created ? 'создан' : 'уже существует'}`);
    }
    
    console.log('Тестовые запросы успешно созданы!');
  } catch (error) {
    console.error('Ошибка при создании тестовых данных:', error);
  }
}

if (require.main === module) {
  createTestRequests()
    .then(() => {
      console.log('Операция завершена');
      process.exit(0);
    })
    .catch(err => {
      console.error('Ошибка выполнения:', err);
      process.exit(1);
    });
}

module.exports = createTestRequests; 