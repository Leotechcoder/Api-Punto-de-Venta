import passport from "passport"
import bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from "passport-local"

export class PassportLocalAuthService {
  static setup(userRepository) {

    passport.use(
      new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
          const user = await userRepository.findByEmail(email)
          if (!user) {
            console.log("aca 1")
            return done(null, false, { message: "Invalid email or password" })
          }

          const isValid = await bcrypt.compare(password, user.password_)
          if (!isValid) {
            console.log("aca 2")
            return done(null, false, { message: "Invalid email or password" })
          }

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }),
    )

    passport.serializeUser((user, done) => {
      done(null, user.id_)
    })

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await userRepository.findById(id)
        done(null, user)
      } catch (error) {
        done(error)
      }
    })
  }
}
