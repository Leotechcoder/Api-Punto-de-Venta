import { Router } from "express";
import { AuthMiddleware } from "../../../../shared/middleware/authMiddlewareV2.js";

export const authUserRoutes = Router();

/**
 * @route GET /auth/authenticate
 * @desc Verifica si el usuario está autenticado mediante sesión (Passport.js)
 * @access Protegido
 */
authUserRoutes.get("/auth/authenticate", (req, res) => {
  try {
    const isAuthenticated = AuthMiddleware.isAuthenticated
      ? AuthMiddleware.isAuthenticated(req)
      : req.isAuthenticated?.();

    if (!isAuthenticated) {
      return res.status(401).json({
        username: "invitado",
        error: true,
        message: "Debes iniciar sesión para acceder a esta ruta.",
      });
    }

    const user = req.session?.passport?.user;

    if (!user) {
      return res.status(401).json({
        username: "invitado",
        error: true,
        message: "Sesión no válida o usuario no encontrado.",
      });
    }

    // ✅ Usuario autenticado correctamente
    return res.status(200).json({
      username: user.username,
      error: false,
      message: "Usuario autorizado ✅",
    });
  } catch (error) {
    console.error("❌ [authUserRoutes] Error en /auth/authenticate:", error);
    return res.status(500).json({
      username: "invitado",
      error: true,
      message: "Error al verificar autenticación.",
      details: error.message,
    });
  }
});

/**
 * Ejemplo adicional (futuro):
 * Rutas protegidas con roles específicos
 * 
 * authUserRoutes.get("/auth/admin", 
 *   AuthMiddleware.ensureAuthenticated,
 *   AuthMiddleware.ensureRole("admin"),
 *   (req, res) => res.status(200).json({ message: "Acceso admin autorizado." })
 * );
 */

export default authUserRoutes;
