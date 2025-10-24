import dotenv from "dotenv";
dotenv.config();

export const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "API Documentation 'Cangre Burgers'",
    version: "1.0.0",
    description: `
      📘 Documentación pública de la API para "Cangre Burgers". Acá podes encontrar todos los endpoints (por modulo) disponibles, 
      sus parámetros, respuestas y ejemplos de uso.
    `,
    contact: {
      name: "LeoTechCoder",
      email: "fuentes.leo_14@hotmail.com",
      url: "https://www.linkedin.com/in/leotechcoder/",
    },
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api",
      description: process.env.SWAGGER_SERVER_DESCRIPTION || "Servidor local",
    },
  ],
};
