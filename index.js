import express from "express";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";
import helmet from "helmet";
import sessionMiddleware from "./src/shared/middleware/sessionMiddleware.js";
import dotenv from 'dotenv';

// Import routes
// import { setupAfipRoutes } from "./src/afip/infrastructure/http/routes/afipRoutes.js";
// import { authRoutes } from "./src/auth/infrastructure/routes/AuthRoutes.js";
import { localAuthRoutes } from "./src/auth/infrastructure/routes/LocalAuthRoutes.js";
import { googleAuthRoutes } from "./src/auth/infrastructure/routes/GoogleAuthRoutes.js";
import { authUserRoutes } from "./src/auth/infrastructure/routes/authUserRoutes.js";
import { facebookAuthRoutes } from "./src/auth/infrastructure/routes/FacebookAuthRoutes.js";
import { routerUsers } from "./src/users/infrastructure/routes/UserRoutes.js";
import { routerOrders } from "./src/orders/infrastructure/routes/OrderRoutes.js";
import { routerProducts } from "./src/products/infrastructure/routes/ProductRoutes.js";
import { routerItems } from "./src/items/infrastructure/routes/itemRoutes.js"
import { errorHandler } from "./src/afip/infrastructure/http/middlewares/errorHandler.js";

// Setup authentication strategies
import { GoogleAuthService } from "./src/auth/infrastructure/adapters/GoogleAuthService.js";
import { FacebookAuthService } from "./src/auth/infrastructure/adapters/FacebookAuthService.js";
import { PassportLocalAuthService } from "./src/auth/infrastructure/adapters/PassportLocalAuthService.js";
import { ACCEPTED_ORIGINS } from "./src/shared/access.js";
import { DatabaseUserRepository } from "./src/auth/infrastructure/adapters/DatabaseUserRepository.js";

// Capturar errores globales para debug
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

app.set("trust proxy", 1); // Necesario para que Express detecte HTTPS detrás de un proxy

if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use(helmet());
app.use(morgan("dev"));
const corsObject = {
  origin: ACCEPTED_ORIGINS, //Puedes cambiar esto para permitir solo una IP o un dominio
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true, //Esto habilita las cookies para las peticiones CORS
  preflightContinue: true, //Esto permite que el navegador permita la petición CORS
  optionsSuccessStatus: 200  //Si preflightContinue es true, esta cabecera se establece en 200
}
app.use(cors(corsObject));//debe ir antes de iniciar session
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

GoogleAuthService.passportSetup();
FacebookAuthService.passportSetup();
//Local
const dataBaseUserRepository = new DatabaseUserRepository();
PassportLocalAuthService.setup(dataBaseUserRepository);

// Protected routes

app.use("/api", cors(corsObject), authUserRoutes)
// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/auth/local", localAuthRoutes);
// app.use("/api/afip", setupAfipRoutes());
app.use("/api", googleAuthRoutes);
app.use("/api", facebookAuthRoutes);
app.use("/api", routerUsers);
app.use("/api", routerOrders);
app.use("/api", routerProducts);
app.use("/api", routerItems);

// Error handling
app.use(errorHandler);


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
