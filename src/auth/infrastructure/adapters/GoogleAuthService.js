import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import { DatabaseUserRepository } from "./DatabaseUserRepository.js"
import { CLIENT_ID_GOOGLE, SECRET_CLIENT_GOOGLE, CLIENT_AUTH_URL_GOOGLE } from "../../../shared/config.js"

export class GoogleAuthService {
  static passportSetup() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: CLIENT_ID_GOOGLE,
          clientSecret: SECRET_CLIENT_GOOGLE,
          callbackURL: CLIENT_AUTH_URL_GOOGLE,
          scope: ["profile"],
        },
        (accessToken, refreshToken, profile, cb) => {
          const { id, displayName, emails } = profile
          const email = emails[0].value
          DatabaseUserRepository.findOrCreate(id, displayName, email)
            .then((user) => cb(null, user))
            .catch((err) => cb(err, null))
        },
      ),
    )

    passport.serializeUser((user, done) => {
      done(null, user)
    })

    passport.deserializeUser((user, done) => {
      done(null, user)
    })
  }
}

