const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

async function createAdmin() {
  try {
    
    
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      console.log('Администратор уже существует йоу:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log('Для входа используйте пароль, который вы задали при создании.');
      return;
    }
    
    
    const adminData = {
      email: 'admin@belkadance.ru',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    };
    
    const admin = await User.create(adminData);
    
    console.log('Администратор создан:');
    console.log(`Email: ${admin.email}`);
    console.log('Пароль: admin123');
    
    
  } catch (error) {
    console.error('Ошибка сори:', error);
  }
}


if (require.main === module) {

  db.sequelize.authenticate()
    .then(() => {
      return createAdmin();
    })
    .then(() => {

      process.exit(0);
    })
    .catch(err => {
      console.error('Ошибка при подключении к базе хз чо норм общались:', err);
      process.exit(1);
    });
}

module.exports = createAdmin; 