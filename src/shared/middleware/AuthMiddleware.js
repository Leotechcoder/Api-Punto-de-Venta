export class AuthMiddleware {
    static isAuthenticated(req) {
      const userAuthenticate = req.isAuthenticated();
      if(!userAuthenticate){
        return false;
      }else{
        return true;
      }
    }
  }