import { ACCEPTED_ORIGINS } from "./access.js";

export class AccessControl {
  static corsHandler(req, res, next) {
    const origin = req.header("origin");

    if (ACCEPTED_ORIGINS.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
    } else {
      console.warn(`🧱 CORS bloqueado: origen no permitido → ${origin}`);
      return res.status(403).json({ message: "CORS: Origin not allowed" });
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(204); // respuesta vacía estándar para preflight
    }

    next(); // <-- muy importante para continuar el flujo
  }
}
