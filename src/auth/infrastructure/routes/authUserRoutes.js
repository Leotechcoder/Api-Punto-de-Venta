import { Router } from "express";
import { AuthMiddleware } from "../../../shared/middleware/AuthMiddleware.js";

export const authUserRoutes = Router();

authUserRoutes.get("/auth/authenticate", async (req, res) => {
  const authenticated = AuthMiddleware.isAuthenticated(req)
        console.log(req)
        if(!authenticated) {
            return res.status(401).json({
                username: 'invitado',
                error: true,
                message: 'Debes iniciar sesión para acceder a esta ruta'
            });

        }else{
            
            const {user} = req.session.passport
                
            if(!user){
                return res.status(401).json({
                    username: 'invitado',
                    error: true,
                    message: 'Debes iniciar sesión para acceder a esta ruta'
                });

            }else{
                //Si no hay error devuelve el nombre del usuario logueado
                res.status(200).json({
                    username: user.username,
                    error: false, 
                    message: 'Usuario autorizado'
                })
            }
        }
});
