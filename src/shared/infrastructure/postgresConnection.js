import pg from 'pg';
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}

console.log( 'Se conecto a la base de datos: ' + process.env.DB_NAME, process.env.DB_HOST, process.env.DB_PORT )

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log({
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
});

export default pool

