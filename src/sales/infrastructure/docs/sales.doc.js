/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Módulo de Ventas — gestión de órdenes, pagos y cajas registradoras.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentAmounts:
 *       type: object
 *       properties:
 *         efectivo:
 *           type: string
 *           example: "2000"
 *         credito:
 *           type: string
 *           example: "3000"
 *         debito:
 *           type: string
 *           example: ""
 *     PaymentInfo:
 *       type: object
 *       properties:
 *         methods:
 *           type: array
 *           items:
 *             type: string
 *             enum: [efectivo, credito, debito]
 *           example: ["efectivo", "credito"]
 *         amounts:
 *           $ref: "#/components/schemas/PaymentAmounts"
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "Or-1310202-514"
 *         userId:
 *           type: string
 *           example: "Us-001"
 *         userName:
 *           type: string
 *           example: "Juan Pérez"
 *         totalAmount:
 *           type: number
 *           example: 12000
 *         status:
 *           type: string
 *           enum: [pending, paid, delivered]
 *         paymentInfo:
 *           $ref: "#/components/schemas/PaymentInfo"
 *         deliveryType:
 *           type: string
 *           example: "retiro"
 *         paidAt:
 *           type: string
 *           format: date-time
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *         cashRegisterId:
 *           type: string
 *           example: "CR-1"
 *
 *     CashRegister:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "CR-1"
 *         openedAt:
 *           type: string
 *           format: date-time
 *         closedAt:
 *           type: string
 *           format: date-time
 *         initialAmount:
 *           type: number
 *           example: 5000
 *         finalAmount:
 *           type: number
 *           example: 12000
 *         openedBy:
 *           type: string
 *           example: "system"
 *         closedBy:
 *           type: string
 *           example: "system"
 *         status:
 *           type: string
 *           enum: [open, closed]
 */

/**
 * @swagger
 * /api/sales/orders/pending:
 *   get:
 *     summary: Obtener órdenes pendientes de pago
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Lista de órdenes con estado 'pending'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
 */

/**
 * @swagger
 * /api/sales/orders/closed:
 *   get:
 *     summary: Obtener órdenes cerradas (pagadas o entregadas)
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de órdenes cerradas y estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEarnings:
 *                   type: number
 *                   example: 35000
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Order"
 */

/**
 * @swagger
 * /api/sales/orders/close:
 *   post:
 *     summary: Cerrar una orden (registrar pago)
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "Or-1310202-514"
 *               paymentInfo:
 *                 $ref: "#/components/schemas/PaymentInfo"
 *     responses:
 *       200:
 *         description: Orden actualizada como 'paid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       400:
 *         description: Error al cerrar la orden
 */

/**
 * @swagger
 * /api/sales/orders/deliver:
 *   post:
 *     summary: Marcar una orden como entregada
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "Or-1310202-514"
 *     responses:
 *       200:
 *         description: Orden actualizada como 'delivered'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 */

/**
 * @swagger
 * /api/sales/cash-registers/open:
 *   post:
 *     summary: Abrir una nueva caja registradora
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               initialAmount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Caja creada y abierta correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CashRegister"
 */

/**
 * @swagger
 * /api/sales/cash-registers/close:
 *   post:
 *     summary: Cerrar una caja registradora activa
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cashRegisterId:
 *                 type: string
 *                 example: "CR-1"
 *               finalAmount:
 *                 type: number
 *                 example: 12000
 *     responses:
 *       200:
 *         description: Caja cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CashRegister"
 */

/**
 * @swagger
 * /api/sales/cash-registers/active:
 *   get:
 *     summary: Obtener la caja activa actual (si existe)
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Caja abierta actualmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CashRegister"
 */

/**
 * @swagger
 * /api/sales/cash-registers/history:
 *   get:
 *     summary: Obtener el historial de cajas
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Lista del historial de cajas registradoras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CashRegister"
 */
