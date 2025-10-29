import app from './app.js';
import { PORT } from './config/port.js';
import { connectDB } from './database/conexiondb.js';

async function main() {
  try {
    await connectDB();
    
    // Aquí puedes guardar la conexión en algún lugar global o en un pool si lo necesitas

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectarse a la base de datos:', error);
  }
}

main();
