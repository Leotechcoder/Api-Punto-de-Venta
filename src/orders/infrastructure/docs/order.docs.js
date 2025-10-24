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
 *     PaymentInfo:
 *       type: object
 *       description: Métodos de pago asociados a la orden
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
 *
 *     Item:
 *       type: object
 *       description: Ítem de un pedido
 *       properties:
 *         product_id:
 *           type: string
 *           example: "prod-123"
 *         product_name:
 *           type: string
 *           example: "Pizza Napolitana"
 *         description:
 *           type: string
 *           example: "Pizza con salsa de tomate, muzzarella y albahaca"
 *         unit_price:
 *           type: number
 *           example: 2500
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     Order:
 *       type: object
 *       description: Representa una orden del sistema
 *       properties:
 *         id:
 *           type: string
 *           example: "Orders-123abc"
 *         userId:
 *           type: string
 *           example: "User-001"
 *         userName:
 *           type: string
 *           example: "thunderClient"
 *         totalAmount:
 *           type: number
 *           example: 12000
 *         status:
 *           type: string
 *           enum: [pending, paid, cancelled, completed]
 *           example: "pending"
 *         paymentInfo:
 *           $ref: '#/components/schemas/PaymentInfo'
 *         deliveryType:
 *           type: string
 *           example: "takeaway"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
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
 *                   example: "Ordenes encontradas 🙌"
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
 *             $ref: '#/components/schemas/Order'
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
 *                     total:
 *                       type: number
 *                       example: 14500
 *                 message:
 *                   type: string
 *                   example: "Item agregado correctamente 👍"
 *       400:
 *         description: Error en los datos o la orden no está en estado pending
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
 *               quantity: 3
 *               unit_price: 2000
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
 *                     total:
 *                       type: number
 *                       example: 15000
 *                 message:
 *                   type: string
 *                   example: "Item actualizado correctamente 🤙"
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
 *                       example: "item-001"
 *                     total:
 *                       type: number
 *                       example: 12000
 *                 message:
 *                   type: string
 *                   example: "Item eliminado correctamente 👌"
 *       400:
 *         description: Error (orden no encontrada o no en estado pending)
 */
