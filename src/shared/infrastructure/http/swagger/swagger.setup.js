import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";
import dotenv from "dotenv";
import { swaggerSpec } from "./swagger.loader.js";

dotenv.config();

export const setupSwagger = (app) => {
  const path = process.env.SWAGGER_PATH || "/api-docs";
  const user = process.env.SWAGGER_USER || "admin";
  const password = process.env.SWAGGER_PASSWORD || "admin123";

  // 🔐 Protección opcional con autenticación básica
  const swaggerAuth = basicAuth({
    users: { [user]: password },
    challenge: true,
  });

  app.use(
    path,
    swaggerAuth, // <- elimina esta línea si querés dejarlo público
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: "🍔 Cangre Burgers API Docs",
      customCss: `
        .topbar-wrapper img { content:url('https://i.imgur.com/aG0xZbE.png'); width:80px; }
        .topbar { background-color: #ffc107 !important; }
        body { background-color: #e6e3e3ff; }
      `,
    })
  );

  console.log(`📘 Swagger disponible en: ${path}`);
};
