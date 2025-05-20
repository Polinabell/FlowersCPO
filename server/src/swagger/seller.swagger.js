/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: API для работы с продавцами
 */

/**
 * @swagger
 * /sellers:
 *   get:
 *     summary: Получение списка всех продавцов
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: Список продавцов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sellers:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Seller'
 *                       - type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               email:
 *                                 type: string
 *                                 format: email
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sellers/top/expensive:
 *   get:
 *     summary: Получение топа продавцов с самыми дорогими цветами
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: Топ продавцов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topSellers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       seller:
 *                         $ref: '#/components/schemas/Seller'
 *                       avgPrice:
 *                         type: number
 *                         format: float
 *                         description: Средняя цена цветов у продавца
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sellers/matching-suppliers:
 *   get:
 *     summary: Получение совпадающих поставщиков и продавцов
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: Совпадающие продавцы и поставщики успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       seller:
 *                         $ref: '#/components/schemas/Seller'
 *                       supplier:
 *                         $ref: '#/components/schemas/Supplier'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sellers/{id}:
 *   get:
 *     summary: Получение информации о продавце по ID
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продавца
 *     responses:
 *       200:
 *         description: Продавец успешно найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Seller'
 *                     - type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                           properties:
 *                             email:
 *                               type: string
 *                               format: email
 *       404:
 *         description: Продавец не найден
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

/**
 * @swagger
 * /sellers/{id}/flowers:
 *   get:
 *     summary: Получение цветов определенного продавца
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продавца
 *     responses:
 *       200:
 *         description: Цветы продавца успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller:
 *                   $ref: '#/components/schemas/Seller'
 *                 flowers:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Flower'
 *                       - type: object
 *                         properties:
 *                           FlowerSeller:
 *                             $ref: '#/components/schemas/FlowerSeller'
 *       404:
 *         description: Продавец не найден
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

/**
 * @swagger
 * /sellers/flowers:
 *   post:
 *     summary: Добавление цветка в продажу (только для продавцов)
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flowerId
 *               - price
 *               - quantity
 *             properties:
 *               flowerId:
 *                 type: integer
 *                 description: ID цветка
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена цветка у продавца
 *               quantity:
 *                 type: integer
 *                 description: Количество цветов
 *     responses:
 *       201:
 *         description: Цветок успешно добавлен в продажу
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цветок успешно добавлен в продажу
 *                 flowerSeller:
 *                   $ref: '#/components/schemas/FlowerSeller'
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
 *       404:
 *         description: Цветок не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sellers/flowers/{flowerId}:
 *   delete:
 *     summary: Удаление цветка из продажи (только для продавцов)
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flowerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цветка
 *     responses:
 *       200:
 *         description: Цветок успешно удален из продажи
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цветок успешно удален из продажи
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
 *         description: Цветок не найден в продаже у данного продавца
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 