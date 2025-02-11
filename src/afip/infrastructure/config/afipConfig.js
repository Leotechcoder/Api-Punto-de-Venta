
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const afipConfig = {
  cuit: process.env.AFIP_CUIT, // Usamos la variable importada desde config.js
  production: process.env.PRODUCTION === "production", // Usamos la variable importada desde config.js
  cert: fs.readFileSync(path.resolve(__dirname, "../../../certs/certificate.crt"), "utf8"),
  key: fs.readFileSync(path.resolve(__dirname, "../../../certs/private.key"), "utf8"),
  wsaaWsdl: process.env.AFIP_WSAA_WSDL, // Usamos la variable importada desde config.js
  wsfeWsdl: process.env.AFIP_WSFE_WSDL, // Usamos la variable importada desde config.js
};