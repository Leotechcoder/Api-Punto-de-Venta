import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

export class PassportLocalAuthService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  setup() {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
          const user = await this.userRepository.findByEmail(email)
          if (!user || !user.validatePassword(password)) {
            return done(null, false, { message: "Invalid email or password" })
          }
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }),
    )

    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await this.userRepository.findById(id)
        done(null, user)
      } catch (error) {
        done(error)
      }
    })
  }
}

