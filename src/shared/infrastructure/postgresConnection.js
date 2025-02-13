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


export default pool

