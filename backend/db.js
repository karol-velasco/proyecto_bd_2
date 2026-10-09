const mysql = require ("mysql2");

//Configuracion de la conexion a MySQL
const conexion = mysql.createConnection({
    port: 3307,
    host: "localhost",  //Servidor Local 
    user: "root",       //Usuario de MySQL (Por defecto en XAMPP)
    database: "tienda"  //Nombre de nuestra BD
});

//Comprobar si la conexion fue exitosa
conexion.connect((error) =>{
    if (error){
        console.error("❌ Error al conectar con MySQL: ", error);
        return;
    }
    console.log("Conexion existosa con MySQL");
})

//Eportar la conexion para reutilizarla en las rutas del servidor 
module.exports = conexion;