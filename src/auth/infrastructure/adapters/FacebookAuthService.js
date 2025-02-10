import { Strategy as FacebookStrategy } from "passport-facebook"
import passport from "passport"
import { DatabaseUserRepository } from "./DatabaseUserRepository.js"
import { CLIENT_AUTH_URL_FACEBOOK, CLIENT_ID_FACEBOOK, SECRET_CLIENT_FACEBOOK } from "../../../shared/config.js"

export class FacebookAuthService {
  static passportSetup() {
    passport.use(
      new FacebookStrategy(
        {
          clientID: CLIENT_ID_FACEBOOK,
          clientSecret: SECRET_CLIENT_FACEBOOK,
          callbackURL: CLIENT_AUTH_URL_FACEBOOK,
          scope: ["public_profile"],
        },
        (accessToken, refreshToken, profile, cb) => {
          const { id, displayName } = profile
          console.log(profile)
          DatabaseUserRepository.findOrCreate(id, displayName)
            .then((user) => cb(null, user))
            .catch((err) => {
              console.error(err)
              cb(err, null)
            })
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

