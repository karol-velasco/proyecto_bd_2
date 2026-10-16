const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mysql = require("mysql2");

// Configuración de la conexión de la BD
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "tienda";

// Opciones de configuración
const configuracion = {
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Si el host es remoto (TiDB Cloud, Aiven, etc.), habilitar el SSL automáticamente
if (host !== "localhost" && host !== "127.0.0.1") {
  configuracion.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

// Crear el pool de conexiones con MySQL o TiDB Cloud
const conexion = mysql.createPool(configuracion);

// Comprobamos si la conexión fue exitosa
conexion.getConnection((error, conn) => {
  if (error) {
    console.error("Error al conectar con la Base de datos:", error.message);
    return;
  }
  console.log(`Conexión exitosa con la base de datos (${host}:${port})`);
  conn.release();
});

// Exportar la conexión para reutilizarla en las rutas del servidor
module.exports = conexion;