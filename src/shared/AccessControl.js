import { ACCEPTED_ORIGINS } from "./access.js";
import { AuthMiddleware } from "./middleware/AuthMiddleware.js";

export class AccessControl {
  static handleRequest(req, res) {
    const origin = req.header("origin");

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");

      console.log(`Se está accediendo desde el origen: ${origin}`);

      if (!AuthMiddleware.isAuthenticated(req)) {
        return res.status(401).json({ message: "Debes iniciar sesión para acceder a esta ruta" });
      }

      if (req.method === "OPTIONS") {
        return true;
      }

      return true;
    }

    console.log(`Origen no permitido: ${origin}`);
    return res.status(403).send("CORS: Origin not allowed");
  }
}
