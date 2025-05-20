/**
 * @swagger
 * tags:
 *   name: Flowers
 *   description: API для работы с цветами
 */

/**
 * @swagger
 * /flowers:
 *   get:
 *     summary: Получение списка всех цветов
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список цветов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Создание нового цветка (только для поставщиков)
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - season
 *               - country
 *               - variety
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название цветка
 *               type:
 *                 type: string
 *                 description: Тип цветка
 *               season:
 *                 type: string
 *                 description: Сезон цветения
 *               country:
 *                 type: string
 *                 description: Страна происхождения
 *               variety:
 *                 type: string
 *                 description: Сорт цветка
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена цветка
 *               imageUrl:
 *                 type: string
 *                 description: URL изображения цветка
 *               description:
 *                 type: string
 *                 description: Описание цветка
 *     responses:
 *       201:
 *         description: Цветок успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цветок успешно создан
 *                 flower:
 *                   $ref: '#/components/schemas/Flower'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Нет прав на выполнение операции
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /flowers/{id}:
 *   get:
 *     summary: Получение информации о цветке по ID
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цветка
 *     responses:
 *       200:
 *         description: Цветок успешно найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flower:
 *                   $ref: '#/components/schemas/Flower'
 *       404:
 *         description: Цветок не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Удаление цветка (только для поставщиков)
 *     tags: [Flowers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цветка
 *     responses:
 *       200:
 *         description: Цветок успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цветок успешно удален
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Нет прав на выполнение операции
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Цветок не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /flowers/search/by-season:
 *   get:
 *     summary: Поиск цветов по сезону
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         required: true
 *         description: Сезон для поиска
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список цветов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /flowers/search/by-country:
 *   get:
 *     summary: Поиск цветов по стране
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: Страна для поиска
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список цветов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /flowers/search/by-variety:
 *   get:
 *     summary: Поиск цветов по сорту
 *     tags: [Flowers]
 *     parameters:
 *       - in: query
 *         name: variety
 *         schema:
 *           type: string
 *         required: true
 *         description: Сорт для поиска
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список цветов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /flowers/by-supplier/{supplierId}:
 *   get:
 *     summary: Получение цветов конкретного поставщика
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID поставщика
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список цветов поставщика успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
 *                 supplier:
 *                   $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Поставщик не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 