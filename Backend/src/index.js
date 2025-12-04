import 'dotenv/config';
import app from './app.js';
import { PORT } from './config/port.js';
import { connectDB } from './database/conexiondb.js';

async function main() {
  try {
    await connectDB();
    app.listen(PORT);
    console.log(`Server is running on port http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

main();
