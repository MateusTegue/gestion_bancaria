import 'dotenv/config';
import app from './app.js';
import { PORT } from './config/port.js';
import { connectDB } from './database/conexiondb.js';

async function main() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectarse a la base de datos:', error);
  }
}

main();
