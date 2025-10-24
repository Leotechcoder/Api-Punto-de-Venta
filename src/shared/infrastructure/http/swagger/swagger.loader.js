// src/shared/infrastructure/http/swagger/swagger.loader.js
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { swaggerDefinition } from "./swagger.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga todos los archivos *.docs.js de los módulos
const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "../../../../**/infrastructure/docs/*.js"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
