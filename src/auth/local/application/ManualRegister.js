export class ManualRegister {
    constructor(userRepository) {
      this.userRepository = userRepository
    }
  
    async execute(userData) {
      return this.userRepository.create(userData)
    }
  }
  
  