/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Endpoints de solo lectura para consultar ítems asociados a órdenes.
 *   externalDocs:
 *     description: Más información sobre el contexto de Items
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtiene todos los ítems registrados en el sistema.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ítems obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 message:
 *                   type: string
 *                   example: OK
 *       401:
 *         description: No autorizado. Inicia sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado. Inicia sesión.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtiene un ítem específico por su ID.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del ítem a consultar.
 *         schema:
 *           type: string
 *           example: It-2610202-222
 *     responses:
 *       200:
 *         description: Ítem encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *                 message: 
 *                   type: string
 *                   example: Item encontrado 👌
 *       404:
 *         description: Ítem no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ítem no encontrado 👎.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: It-2610202-222
 *         orderId:
 *           type: string
 *           example: Or-1310202-514
 *         productId:
 *           type: string
 *           example: Pr-5102025-710
 *         productName:
 *           type: string
 *           example: Pizza crudo y rúcula
 *         description:
 *           type: string
 *           example: Pizza artesanal con rúcula fresca y jamón crudo
 *         quantity:
 *           type: integer
 *           example: 2
 *         unitPrice:
 *           type: number
 *           format: float
 *           example: 7500
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 15000
 *       required:
 *         - id
 *         - orderId
 *         - productId
 *         - productName
 *         - quantity
 *         - unitPrice
 *       example:
 *         id: It-2610202-222
 *         orderId: Or-1310202-514
 *         productId: Pr-5102025-710
 *         productName: Pizza crudo y rúcula
 *         quantity: 2
 *         unitPrice: 7500
 *         subtotal: 15000
 */

