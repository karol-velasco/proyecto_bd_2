const API_URL = "http://localhost:3000";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        // MODO ACTUALIZAR (PUT)
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        // MODO CREAR (POST)
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// 5. Formulario de contacto (demostrativo en contacto.html)
if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("contactoNombre").value.trim();
    const email = document.getElementById("contactoEmail").value.trim();
    const asunto = document.getElementById("contactoAsunto").value.trim();
    const mensaje = document.getElementById("contactoMensaje").value.trim();
    const botonSubmit = formContacto.querySelector("button[type='submit']");

    try {
      if (botonSubmit) {
        botonSubmit.disabled = true;
        botonSubmit.textContent = "Enviando...";
      }

      const respuesta = await fetch(`${API_URL}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, asunto, mensaje }),
      });

      if (respuesta.ok) {
        alert("¡Mensaje enviado con éxito!");
        formContacto.reset();
        cargarMensajes();
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error al enviar contacto:", error);
    } finally {
      if (botonSubmit) {
        botonSubmit.disabled = false;
        botonSubmit.textContent = "Enviar Mensaje";
      }
    }
  });
}

// 6. Consultar y mostrar los mensajes de contacto en pantalla (READ - GET /contacto)
async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/contacto`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (!Array.isArray(mensajes) || mensajes.length === 0) {
      listaMensajes.innerHTML =
        "<p style='color: #64748b; font-style: italic;'>No hay mensajes registrados aún en la base de datos.</p>";
      return;
    }

    mensajes.forEach((msg) => {
      const fecha = msg.fecha_registro
        ? new Date(msg.fecha_registro).toLocaleString("es-ES")
        : "Fecha no disponible";

      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${msg.nombre}</h3>
          <p><strong>Correo:</strong> ${msg.correo}</p>
          <p><strong>Asunto:</strong> ${msg.asunto}</p>
          <p><strong>Mensaje:</strong> ${msg.mensaje}</p>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">📅 ${fecha}</p>
        </div>
        <div class="acciones" style="margin-top: 10px;">
          <button class="btn-eliminar" onclick="eliminarMensaje(${msg.id})">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar los mensajes:", error);
  }
}

// 7. Eliminar un mensaje de contacto (DELETE /contacto/:id)
async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje de contacto?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/contacto/${id}`, {
      method: "DELETE",
    });

    if (respuesta.ok) {
      cargarMensajes();
    } else {
      alert("No se pudo eliminar el mensaje.");
    }
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
  }
}
// Llamados iniciales al cargar la página
cargarProductos();
cargarMensajes();