const { getConnection } = require('../database/conexiondb');

async function crearUsuario(nombre, email) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `BEGIN CREAR_USUARIO(:nombre, :email); END;`,
      {
        nombre: nombre,
        email: email
      }
    );
    await conn.commit();
  } catch (err) {
    console.error('Error ejecutando PL/SQL:', err);
    throw err;
  } finally {
    await conn.close();
  }
}
