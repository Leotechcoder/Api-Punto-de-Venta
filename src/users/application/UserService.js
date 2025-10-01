import { User } from "../domain/User.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    const data = await this.userRepository.getAll();
    return data.map(
      (row) =>
        new User(
          row.id_,
          row.username,
          row.email,
          row.phone,
          row.address,
          row.avatar,
          row.registration_date
        )
    );
  }

  async getUserById(id) {
    const user = await this.userRepository.getById(id);
    if (!user) return null;
    return new User(
      user.id_,
      user.username,
      user.email,
      user.phone,
      user.address,
      user.avatar,
      user.registration_date
    );
  }

  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    return new User(
      user.id_,
      user.username,
      user.email,
      user.phone,
      user.address,
      user.avatar,
      user.registration_date
    );
  }

  async updateUser(id, userData) {
    const user = await this.userRepository.update(id, userData);
    if (!user) return null;
    return new User(
      user.id_,
      user.username,
      user.email,
      user.phone,
      user.address,
      user.avatar,
      user.registration_date
    );
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
}
