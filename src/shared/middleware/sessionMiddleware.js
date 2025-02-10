import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import pool from "../infrastructure/postgresConnection.js"

const PgSession = connectPgSimple(session)

const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "session_user",
    createTableIfMissing: true,
  }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict",
    httpOnly: true,
  },
})

export default sessionMiddleware

