/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para la gestión de productos en el sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: Pr-26102025-001
 *         name:
 *           type: string
 *           example: Pizza Napolitana
 *         price:
 *           type: number
 *           example: 12000
 *         category:
 *           type: string
 *           example: Pizzas
 *         stock:
 *           type: integer
 *           example: 25
 *         imageUrl:
 *           type: string
 *           example: https://cdn.miapp.com/products/pizza-napo.jpg
 *         description:
 *           type: string
 *           example: Pizza artesanal con tomate natural, mozzarella y albahaca fresca.
 *         available:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-26T20:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-26T21:00:00Z
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Pizza Napolitana
 *         price:
 *           type: number
 *           example: 12000
 *         category:
 *           type: string
 *           example: Pizzas
 *         stock:
 *           type: integer
 *           example: 25
 *         imageUrl:
 *           type: string
 *           example: https://cdn.miapp.com/products/pizza-napo.jpg
 *         description:
 *           type: string
 *           example: Pizza artesanal con tomate natural, mozzarella y albahaca fresca.
 *         available:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Operación completada ✅
 *       404:
 *         description: No se encontraron productos
 *       500:
 *         description: Error interno del servidor
 *
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hamburguesa Clásica
 *               price:
 *                 type: number
 *                 example: 8000
 *               category:
 *                 type: string
 *                 example: Hamburguesas
 *               stock:
 *                 type: integer
 *                 example: 50
 *               imageUrl:
 *                 type: string
 *                 example: https://cdn.miapp.com/products/hamburguesa.jpg
 *               description:
 *                 type: string
 *                 example: Pan artesanal, doble carne y cheddar.
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Producto creado correctamente 🎉
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: object
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Producto creado correctamente 🎉
 *       400:
 *         description: Error al crear el producto
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado correctamente 👌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Producto encontrado correctamente 👌
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   patch:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/ProductUpdate'
 *             
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente 🤙
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Producto actualizado correctamente 🤙
 *       400:
 *         description: Objeto no válido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente 🧹
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado correctamente 🧹
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
