export class UserService {
    constructor(userRepository) {
      this.userRepository = userRepository
    }
  
    async getAllUsers() {
      return this.userRepository.getAll()
    }
  
    async getUserById(id) {
      return this.userRepository.getById(id)
    }
  
    async createUser(userData) {
      return this.userRepository.create(userData)
    }
  
    async updateUser(id, userData) {
      return this.userRepository.update(id, userData)
    }
  
    async deleteUser(id) {
      return this.userRepository.delete(id)
    }
  }
  
  