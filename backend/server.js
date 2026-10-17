const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

const whitelist = [
  'https://proyectobd2-frontend-pi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'null'
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      whitelist.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Acceso denegado por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar productos:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: "Nombre, precio y stock son obligatorios" });
  }

  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar producto:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: "Nombre, precio y stock son obligatorios" });
  }

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar producto:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

app.post("/contacto", (req, res) => {
  const { nombre, email, correo, asunto, mensaje } = req.body;
  const correoFinal = correo || email;

  if (!nombre || !correoFinal || !asunto || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO mensajes (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
  const valores = [nombre, correoFinal, asunto, mensaje];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al guardar mensaje de contacto:", error);
      return res.status(500).json({ mensaje: "Error al registrar el mensaje de contacto" });
    }

    res.status(201).json({
      mensaje: "Mensaje de contacto enviado con éxito",
      id: resultado.insertId,
    });
  });
});

app.get("/contacto", (req, res) => {
  const sql = "SELECT * FROM mensajes ORDER BY fecha_registro DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar mensajes de contacto:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes de contacto" });
    }
    res.json(resultados);
  });
});

app.delete("/contacto/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM mensajes WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar mensaje de contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje de contacto" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Mensaje de contacto no encontrado" });
    }

    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});