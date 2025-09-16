import z from "zod";

export class UserSchema {
  static createSchema = z.object({
    username: z.string(),
    password_: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    avatar: z.string(),
    registration_date: z.string(),
  });

  static updateSchema = z.object({
    username: z.string(),
    phone: z.string(),
    address: z.string(),
  });

  static validateUser(user) {
    return this.createSchema.safeParse(user);
  }

  static validatePartialUser(user) {
    return this.createSchema.partial().safeParse(user);
  }

  static validateUserUpdate(user) {
    return this.updateSchema.partial().safeParse(user);
  }
}
