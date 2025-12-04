import 'dotenv/config';
import oracledb from 'oracledb'; 

export async function connectDB() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,      
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT,
    });
    console.log('Database connection established');
    return connection; 
  } catch (err) {
    throw err;
  }
}

