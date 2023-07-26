// Selección de elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numero = document.querySelector("#numero");

// Variable para almacenar los productos en el carrito
let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Función para cargar los productos en el contenedor de productos
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = productosElegidos
    .map(
      (producto) => `
        <div class="producto">
          <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" />
          <div class="productos-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="precio">${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
          </div>
        </div>
      `
    )
    .join("");

  actualizarBotonesAgregar();
}

// Cargar todos los productos inicialmente
cargarProductos(productos);

// Event listeners para los botones de categorías
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    // Cambiar la clase "active" al botón de categoría seleccionado
    botonesCategorias.forEach((boton) =>
      boton.classList.toggle("active", boton === e.currentTarget)
    );

    // Filtrar los productos según la categoría seleccionada
    const categoriaSeleccionada = e.currentTarget.id;
    const productosFiltrados =
      categoriaSeleccionada === "Todos"
        ? productos
        : productos.filter(
            (producto) => producto.categoria.id === categoriaSeleccionada
          );

    // Cambiar el título principal según la categoría seleccionada
    tituloPrincipal.innerText =
      categoriaSeleccionada === "Todos"
        ? "Todos los productos"
        : e.currentTarget.innerText;

    // Cargar los productos filtrados en el contenedor de productos
    cargarProductos(productosFiltrados);
  });
});

// Función para actualizar los botones "Agregar" en el contenedor de productos
function actualizarBotonesAgregar() {
  document
    .querySelectorAll(".producto-agregar")
    .forEach((boton) => boton.addEventListener("click", agregarAlCarrito));
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );

  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    // Si el producto ya está en el carrito, aumentar la cantidad
    productosEnCarrito.forEach((producto) => {
      if (producto.id === idBoton) producto.cantidad++;
    });
  } else {
    // Si es un producto nuevo en el carrito, agregarlo con cantidad 1
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  // Actualizar el número de productos en el carrito
  actualizarNumero();

  // Guardar los productos en el carrito en localStorage
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Función para actualizar el número de productos en el carrito
function actualizarNumero() {
  const nuevoNumero = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numero.innerText = nuevoNumero;
}
