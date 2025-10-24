export class User {
  constructor({ id, username, password_, email, phone, address, avatar, registrationDate, updateProfile }) {
    this.id = id;
    this.username = username;
    this.password_ = password_;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.avatar = avatar;
    this.registrationDate = registrationDate;
    this.updateProfile = updateProfile;
  }

  // ✅ FACTORY METHODS
  static fromPersistence(dbRecord) {
    return new User({
      id: dbRecord.id_,
      username: dbRecord.username,
      password_: dbRecord.password_,
      email: dbRecord.email,
      phone: dbRecord.phone,
      address: dbRecord.address,
      avatar: dbRecord.avatar,
      registrationDate: dbRecord.registration_date,
      updateProfile: dbRecord.update_profile
    });
  }

  static fromDTO(dto) {
    return new User({
      id: dto.id,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      avatar: dto.avatar,
      registrationDate: dto.registrationDate,
      updateProfile: dto.updateProfile
    });
  }

  // ✅ MÉTODOS DE DOMINIO
  updateProfileData({ username, phone, address }) {
    if (username) this.username = username;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    this.updateProfile = new Date().toISOString();
  }

  // ✅ SERIALIZERS
  toDTO() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      address: this.address,
      avatar: this.avatar,
      registrationDate: this.registrationDate,
      updateProfile: this.updateProfile
    };
  }

  toPersistence() {
    return {
      id_: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      address: this.address,
      avatar: this.avatar,
      registration_date: this.registrationDate,
      update_profile: this.updateProfile
    };
  }

  toPersistenceForCreate() {
    return {
      username: this.username,
      email: this.email,
      phone: this.phone,
      address: this.address,
      avatar: this.avatar,
      password_: this.password_
    };
  }
}
