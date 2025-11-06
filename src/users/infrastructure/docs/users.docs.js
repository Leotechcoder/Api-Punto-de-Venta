/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios del sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Representa un usuario del sistema
 *       properties:
 *         id:
 *           type: string
 *           example: "Us-2410202-847"
 *         username:
 *           type: string
 *           example: "Leoto"
 *         email:
 *           type: string
 *           example: "correo@ejemplo.com"
 *         phone:
 *           type: string
 *           example: "2984123457"
 *         address:
 *           type: string
 *           example: "Avenida Siempre Viva"
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: null
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           example: "2025-10-24T19:45:46.811Z"
 *         updateProfile:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-10-24T20:10:00.000Z"
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios encontrados 🙌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuarios encontrados 🙌"
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado 🤝
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuario encontrado 🤝"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 details:
 *                   type: string
 *                   example: "Detalles del error"
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "Leoto"
 *               password_: "123456"
 *               email: "correo@ejemplo.com"
 *               phone: "2984123457"
 *               address: "Avenida Siempre Viva"
 *               avatar: "https://cdn.example.com/avatar.png"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente 🤘
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 createdUser:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuario creado correctamente 🤘"
 *       400:
 *         description: Error en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos inválidos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 details:
 *                   type: string
 *                   example: "Detalles del error"
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "Leoto actualizado"
 *               phone: "2984123499"
 *               address: "Calle nueva 123"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente 🤙
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedUser:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente 🤙"
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente 👌
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedId:
 *                   type: string
 *                   example: "Us-4112025-34"
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado correctamente 👌"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
