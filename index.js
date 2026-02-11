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
import { localAuthRoutes } from "./src/auth/local/infrastructure/routes/LocalAuthRoutes.js";
import { googleAuthRoutes } from "./src/auth/google/infrastructure/routes/GoogleAuthRoutes.js";
import { authUserRoutes } from "./src/auth/local/infrastructure/routes/authUserRoutes.js";
import { facebookAuthRoutes } from "./src/auth/facebook/infrastructure/routes/FacebookAuthRoutes.js";
import { routerUsers } from "./src/users/infrastructure/routes/UserRoutes.js";
import { routerOrders } from "./src/orders/infrastructure/routes/OrderRoutes.js";
import { routerProducts } from "./src/products/infrastructure/routes/ProductRoutes.js";
import { routerItems } from "./src/items/infrastructure/routes/itemRoutes.js"
import { errorHandler } from "./src/afip/infrastructure/http/middlewares/errorHandler.js";

// Imports del store
import routerStoreProducts from "./src/products/infrastructure/routes/storeProductRoutes.js";
import routerOrdersStore from "./src/orders/infrastructure/routes/orderRoutesStore.js";
import { routerItemsStore } from "./src/items/infrastructure/routes/itemRoutesStore.js";


//Setup socket.io
import { initSocket } from "./src/config/socket.js";
import http from "http";
//Setup swagger
import { setupSwagger } from "./src/shared/infrastructure/http/swagger/swagger.setup.js";
// Setup authentication strategies
import { GoogleAuthService } from "./src/auth/google/application/GoogleAuthService.js";
import { FacebookAuthService } from "./src/auth/facebook/application/FacebookAuthService.js";
import { PassportLocalAuthService } from "./src/auth/local/application/PassportLocalAuthService.js";
import { ACCEPTED_ORIGINS } from "./src/shared/access.js";
import { DatabaseUserRepository } from "./src/auth/local/infrastructure/adapters/DatabaseUserRepository.js";
import { salesRoutes } from "./src/sales/infrastructure/routes/salesRoutes.js";

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
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
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
app.use("/api/sales", salesRoutes)

// Store routes
app.use("/store", cors(corsObject), routerStoreProducts);
app.use("/store", cors(corsObject), routerOrdersStore);
app.use("/store", cors(corsObject), routerItemsStore);

// Error handling
app.use(errorHandler);

// Setup swagger
setupSwagger(app);

//Setup server with socket.io
const httpServer = http.createServer(app);
initSocket(httpServer);

// Start server

httpServer.listen(process.env.PORT, () => {
  console.log(`🚀 API + Socket corriendo en el puerto ${process.env.PORT}`);
});
