import express from "express";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";
import helmet from "helmet";
import sessionMiddleware from "./src/shared/middleware/sessionMiddleware.js";
import { PORT } from "./configuro.js";

// Import routes
// import { setupAfipRoutes } from "./src/afip/infrastructure/http/routes/afipRoutes.js";
// import { authRoutes } from "./src/auth/infrastructure/routes/AuthRoutes.js";
// import { localAuthRoutes } from "./src/auth/infrastructure/routes/LocalAuthRoutes.js";
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
import { ACCEPTED_ORIGINS } from "./src/shared/access.js";

const app = express();

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
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsObject));

GoogleAuthService.passportSetup();
FacebookAuthService.passportSetup();

app.use("/api", cors(corsObject), authUserRoutes)
// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth/local", localAuthRoutes);
// app.use("/api/afip", setupAfipRoutes());
app.use("/api", googleAuthRoutes);
app.use("/api", facebookAuthRoutes);
app.use("/api", routerUsers);
app.use("/api", routerOrders);
app.use("/api", routerProducts);
app.use("/api", routerItems);

// Error handling
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
