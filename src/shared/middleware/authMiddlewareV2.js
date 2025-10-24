export class AuthMiddleware {
    
  static ensureAuthenticated(req, res, next) {
    try {
      const isAuth = req.isAuthenticated?.();

      if (!isAuth) {
        return res.status(401).json({ message: "No autorizado. Inicia sesión." });
      }

      next();
    } catch (error) {
      console.error("Error en AuthMiddleware:", error);
      return res.status(500).json({ message: "Error al verificar autenticación." });
    }
  }

  // Ejemplo extendido (futuro)
  static ensureRole(role) {
    return (req, res, next) => {
      const user = req.user;
      if (!user || user.role !== role) {
        return res.status(403).json({ message: "Acceso denegado." });
      }
      next();
    };
  }
}
