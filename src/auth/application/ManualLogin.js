export class ManualLogin {
    constructor(authService) {
      this.authService = authService
    }
  
    async execute(email, password) {
      return this.authService.login(email, password)
    }
  }
  
  