/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints para la gestión de órdenes y sus ítems
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentAmounts:
 *       type: object
 *       description: Monto especificado para cada método de pago
 *       properties:
 *         efectivo:
 *           type: string
 *           example: "12000"
 *         credito:
 *           type: string
 *           example: ""
 *         debito:
 *           type: string
 *           example: ""
 *       example:
 *         efectivo: "12000"
 *         credito: ""
 *         debito: ""

 *     PaymentInfo:
 *       type: object
 *       description: Información sobre los métodos de pago utilizados
 *       properties:
 *         methods:
 *           type: array
 *           items:
 *             type: string
 *             enum: [efectivo, credito, debito]
 *           example: ["efectivo"]
 *         amounts:
 *           $ref: '#/components/schemas/PaymentAmounts'
 *       example:
 *         methods: ["efectivo"]
 *         amounts:
 *           efectivo: "12000"
 *           credito: ""
 *           debito: ""

 *     Item:
 *       type: object
 *       description: Ítem incluido dentro de una orden
 *       properties:
 *         id:
 *           type: string
 *           example: "It-2410202-425"
 *         productId:
 *           type: string
 *           example: "Pr-5102025-603"
 *         productName:
 *           type: string
 *           example: "Pizza de jamon"
 *         description:
 *           type: string
 *           example: "Pizza con jamón y muzzarella"
 *         unitPrice:
 *           type: string
 *           example: "12000"
 *         quantity:
 *           type: integer
 *           example: 1

 *     Order:
 *       type: object
 *       description: Representa una orden del sistema
 *       properties:
 *         id:
 *           type: string
 *           example: "Or-2410202-542"
 *         userId:
 *           type: string
 *           example: "Us-2410202-542"
 *         userName:
 *           type: string
 *           example: "Invitado"
 *         status:
 *           type: string
 *           enum: [pending, paid, canceled, completed]
 *           example: "pending"
 *         totalAmount:
 *           type: number
 *           example: 12000
 *         paymentInfo:
 *           $ref: '#/components/schemas/PaymentInfo'
 *         deliveryType:
 *           type: string
 *           example: "local"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-22T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-22T15:00:00Z"
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de órdenes encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: "Órdenes encontradas 🙌"
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada 🤝
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: "Orden encontrada 🤝"
 *       404:
 *         description: Orden no encontrada
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               userId: "Us-2410202-542"
 *               userName: "Invitado"
 *               status: "pending"
 *               items:
 *                 - productId: "Pr-5102025-603"
 *                   productName: "Pizza de jamon"
 *                   description: ""
 *                   unitPrice: "12000"
 *                   quantity: 1
 *               totalAmount: 12000
 *               paymentInfo:
 *                 methods: ["efectivo"]
 *                 amounts:
 *                   efectivo: "12000"
 *                   credito: ""
 *                   debito: ""
 *               deliveryType: "local"
 *     responses:
 *       201:
 *         description: Orden creada correctamente 🤘
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: "Orden creada correctamente 🤘"
 *       400:
 *         description: Error en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Debe especificarse al menos un método de pago"
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Eliminar una orden existente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden eliminada correctamente 🧺
 *       404:
 *         description: Orden no encontrada 🤔
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /orders/{id}/items:
 *   post:
 *     summary: Agregar un nuevo ítem a una orden pendiente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Ítem agregado correctamente 👍
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     newItem:
 *                       $ref: '#/components/schemas/Item'
 *                 message:
 *                   type: string
 *                   example: "Ítem agregado correctamente 👍"
 *       400:
 *         description: Error en los datos enviados
 */

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   patch:
 *     summary: Actualizar un ítem dentro de una orden pendiente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               description: "Ejemplo de descripción actualizada"
 *               quantity: 3
 *     responses:
 *       200:
 *         description: Ítem actualizado correctamente 🤙
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     updatedItem:
 *                       $ref: '#/components/schemas/Item'
 *                 message:
 *                   type: string
 *                   example: "Ítem actualizado correctamente 🤙"
 *       400:
 *         description: Error en la actualización (ítem u orden no válida)
 */

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   delete:
 *     summary: Eliminar un ítem de una orden pendiente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ítem eliminado correctamente 👌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     deletedItemId:
 *                       type: string
 *                       example: "It-2410202-425"
 *                 message:
 *                   type: string
 *                   example: "Ítem eliminado correctamente 👌"
 *       400:
 *         description: Error (item no encontrado u orden no válida)
 */
