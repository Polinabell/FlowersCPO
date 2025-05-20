/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API для работы с поставщиками
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Получение списка всех поставщиков
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Список поставщиков успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Supplier'
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
 * /suppliers/{id}:
 *   get:
 *     summary: Получение информации о поставщике по ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID поставщика
 *     responses:
 *       200:
 *         description: Поставщик успешно найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Supplier'
 *                     - type: object
 *                       properties:
 *                         user:
 *                           type: object
 *                           properties:
 *                             email:
 *                               type: string
 *                               format: email
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

/**
 * @swagger
 * /suppliers/{id}/flowers:
 *   get:
 *     summary: Получение цветов определенного поставщика
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID поставщика
 *     responses:
 *       200:
 *         description: Цветы поставщика успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier:
 *                   $ref: '#/components/schemas/Supplier'
 *                 flowers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flower'
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