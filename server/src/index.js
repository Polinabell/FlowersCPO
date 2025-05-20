require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { sequelize } = require('./models');
const { logRequests } = require('./middlewares/logger.middleware');


const authRoutes = require('./routes/auth.routes');
const flowerRoutes = require('./routes/flower.routes');
const supplierRoutes = require('./routes/supplier.routes');
const sellerRoutes = require('./routes/seller.routes');
const requestRoutes = require('./routes/request.routes');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(logRequests);

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Белка Dance - API дока! бек хороший поставьте 5',
}));


app.use('/api', authRoutes);
app.use('/api', flowerRoutes);
app.use('/api', supplierRoutes);
app.use('/api', sellerRoutes);
app.use('/api/requests', requestRoutes);

//для теста(теста под пиццу)
app.get('/', (req, res) => {
  res.send('API сервера "Цветы" работает!');
});

app.get('/swagger', (req, res) => {
  res.redirect('/api/swagger');
});

app.use((err, req, res, next) => {
  
  const { logUserAction } = require('./utils/logger');
  logUserAction('ошибка', req, err.message || 'Внутренняя ошибка сервера');
  
  console.error(err.stack);
  res.status(500).send('500 во всем бек виноват опять, те кто кнопочки красит молодцы');
});


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('все ок синканулось');
    
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Модели синканулись с бд');
    }

    app.listen(PORT, () => {
      console.log(`Слушаем ${PORT}`);
      console.log('Логирование в файле смотреть');
      console.log(`Swagger UI : http://localhost:${PORT}/api/swagger`);
    });
  } catch (error) {
    console.error('Невозможно подключиться к базе данных ты чет сломала! :', error);
  }
}

startServer(); 