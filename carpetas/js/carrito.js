// Selección de elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const contenedorTotal = document.querySelector("#total");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const botonComprar = document.querySelector(".carrito-acciones-comprar");
// Variable para almacenar los productos en el carrito
let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Función para obtener y mostrar la hora actual
function mostrarHoraActual() {
  const fechaActual = new Date();
  const hora = fechaActual.getHours().toString().padStart(2, "0");
  const minutos = fechaActual.getMinutes().toString().padStart(2, "0");
  const segundos = fechaActual.getSeconds().toString().padStart(2, "0");
  const horaActual = `${hora}:${minutos}:${segundos}`;
  document.getElementById("hora-actual").innerText = horaActual;
}

// Actualizamos la hora cada segundo
setInterval(mostrarHoraActual, 1000);
// Función para cargar los productos en el carrito y mostrarlos en la vista
function cargarProductosCarrito() {
  const carritoVacio = productosEnCarrito.length === 0;
  // Mostrar u ocultar los elementos según si el carrito está vacío o no
  contenedorCarritoVacio.classList.toggle("disabled", !carritoVacio);
  contenedorCarritoProductos.classList.toggle("disabled", carritoVacio);
  contenedorCarritoAcciones.classList.toggle("disabled", carritoVacio);
  contenedorCarritoComprado.classList.toggle("disabled", true);

  if (!carritoVacio) {
    // Limpiar el contenedor de productos antes de cargar los nuevos
    contenedorCarritoProductos.innerHTML = "";
    // Mostrar cada producto del carrito en la vista
    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen" src="../${producto.imagen}" alt="${
        producto.titulo
      }"/>
        <div class="carrito-producto-titulo">
          <small>Titulo</small>
          <p>${producto.titulo}</p>
        </div>
        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>${producto.precio}</p>
        </div>
        <div class="carrito-producto subtotal">
          <small>Subtotal</small>
          <p>${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" data-id="${producto.id}">
          <i class="bi bi-trash3"></i>
        </button>
      `;
      contenedorCarritoProductos.append(div);
    });

    // Agregar eventos para eliminar productos del carrito
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", eliminarDelCarrito);
    });
  }
  // Actualizar el total del carrito
  actualizarTotal();
}
// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
  const idProducto = e.currentTarget.dataset.id;
  productosEnCarrito = productosEnCarrito.filter(
    (producto) => producto.id !== idProducto
  );
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
  cargarProductosCarrito();
}
// Función para vaciar completamente el carrito
function vaciarCarrito() {
  productosEnCarrito = [];
  localStorage.removeItem("productos-en-carrito");
  cargarProductosCarrito();
}
// Función para actualizar el total del carrito
function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  contenedorTotal.innerText = `$${totalCalculado}`;
}
// Función para finalizar la compra, vaciando el carrito y mostrando el mensaje de compra finalizada
function comprarCarrito() {
  productosEnCarrito = [];
  localStorage.removeItem("productos-en-carrito");
  cargarProductosCarrito();
  // Mostrar el mensaje de "Carrito comprado"
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}
// Event listeners para los botones de "Vaciar carrito" y "Comprar"
botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);
// Cargar los productos del carrito al cargar la página
cargarProductosCarrito();
