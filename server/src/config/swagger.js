const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Белка Dance - API Цветочного магазина',
      version: '1.0.0',
      description: 'API для работы с цветочным магазином. Включает функциональность для поставщиков, продавцов и клиентов.',
      contact: {
        name: 'Белка Dance',
        url: 'https://белка-dance.ru',
        email: 'support@белка-dance.ru'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Основной API сервер'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор пользователя'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя (используется для входа)'
            },
            role: {
              type: 'string',
              enum: ['user', 'supplier', 'seller'],
              description: 'Роль пользователя в системе'
            }
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор поставщика'
            },
            userId: {
              type: 'integer',
              description: 'ID пользователя-поставщика'
            },
            fullName: {
              type: 'string',
              description: 'Полное имя поставщика'
            },
            companyName: {
              type: 'string',
              description: 'Название компании поставщика'
            },
            farmType: {
              type: 'string',
              description: 'Тип фермы поставщика'
            },
            address: {
              type: 'string',
              description: 'Адрес поставщика'
            }
          }
        },
        Seller: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор продавца'
            },
            userId: {
              type: 'integer',
              description: 'ID пользователя-продавца'
            },
            storeName: {
              type: 'string',
              description: 'Название магазина продавца'
            },
            address: {
              type: 'string',
              description: 'Адрес магазина продавца'
            }
          }
        },
        Flower: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор цветка'
            },
            name: {
              type: 'string',
              description: 'Название цветка'
            },
            type: {
              type: 'string',
              description: 'Тип цветка'
            },
            season: {
              type: 'string',
              description: 'Сезон цветения'
            },
            country: {
              type: 'string',
              description: 'Страна происхождения'
            },
            variety: {
              type: 'string',
              description: 'Сорт цветка'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Базовая цена цветка от поставщика'
            },
            supplierId: {
              type: 'integer',
              description: 'ID поставщика цветка'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL изображения цветка'
            },
            description: {
              type: 'string',
              description: 'Описание цветка'
            }
          }
        },
        FlowerSeller: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор связи цветка и продавца'
            },
            flowerId: {
              type: 'integer',
              description: 'ID цветка'
            },
            sellerId: {
              type: 'integer',
              description: 'ID продавца'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Цена цветка у данного продавца'
            },
            quantity: {
              type: 'integer',
              description: 'Количество цветов у продавца'
            }
          }
        },
        Request: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор запроса'
            },
            userId: {
              type: 'integer',
              description: 'ID пользователя, создавшего запрос'
            },
            flowerSellerId: {
              type: 'integer',
              description: 'ID связи цветка и продавца'
            },
            quantity: {
              type: 'integer',
              description: 'Количество запрашиваемых цветов'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'completed'],
              description: 'Статус запроса'
            },
            comment: {
              type: 'string',
              description: 'Комментарий к запросу'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Сообщение об ошибке'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/swagger/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 