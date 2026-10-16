require("dotenv").config();
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
};

// Si el host es remoto (TiDB Cloud), habilitar  el SSL automaticamente
if (host !== "localhostt" && host !== "127.0.0.1") {
  configuracion.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauhorized: true,
  };
}

// Crear la conexión con MySQL o TiDB Cloud
const conexion = mysql.createConnection(configuracion);

// Comprobamos si la conexión fue exitosa
conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar con la Base de datos", error.message);
    return;
  }
  console.log(`Conexión exitosa con la base de datos (${host}:${port})`);
});

// Exportar la conexión para reutilizarla en las rutas del servidor
module.exports = conexion;