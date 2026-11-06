/* ==========================================================================
   ARCHIVO DE LÓGICA INTERACTIVA: script.js
   Proyecto: Catálogo Interactivo El Dorado (Medio Mundo • Végueta)
   ==========================================================================
   ÍNDICE DE SECCIONES:
   1. CONFIGURACIÓN GENERAL (Número de WhatsApp)
   2. ESTADO DE LA APLICACIÓN (Categoría activa, Carrito, Modo Canva)
   3. LECTURA AUTOMÁTICA DE PRODUCTOS DESDE EL HTML
   4. FILTRADO POR CATEGORÍAS DEL CATÁLOGO
   5. CONTROL DE CANTIDADES (+ / -) Y BOTÓN "AGREGAR"
   6. BARRA FLOTANTE DE PEDIDO Y ENLACE DE WHATSAPP
   7. MODO CANVA (TARJETAS CUADRADAS 1080 × 1080)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================================
     1. CONFIGURACIÓN GENERAL
     Cambia el número aquí (con código de país 51 sin el signo +) si deseas
     que el carrito de pedidos envíe el mensaje a otro WhatsApp.
     ======================================================================== */
  const TELEFONO_WHATSAPP = "51987654321";


  /* ========================================================================
     2. ESTADO DE LA APLICACIÓN
     ======================================================================== */
  let categoriaActual = "Todos";
  let modoCanvaActivo = false;
  let detalleCarritoAbierto = false;
  let temporizadorAviso = null;

  // Objeto que guarda cuántos productos se han agregado al pedido: { "Nombre": { nombre, precio, cantidad } }
  const carrito = {};


  /* ========================================================================
     3. LECTURA E INICIALIZACIÓN DE LAS TARJETAS DE PRODUCTO DEL HTML
     Lee automáticamente el nombre, precio y categoría de cada <article> en index.html,
     para que cualquier cambio que hagas en el HTML funcione de inmediato.
     ======================================================================== */
  const tarjetasProductos = Array.from(document.querySelectorAll(".tarjeta-producto"));

  function obtenerDatosTarjeta(tarjeta) {
    const nombreEl = tarjeta.querySelector(".nombre-producto");
    const precioEl = tarjeta.querySelector(".precio-producto");

    const nombre = (nombreEl ? nombreEl.textContent.trim() : tarjeta.dataset.nombre) || "Producto";
    const categoria = tarjeta.dataset.categoria || "Todos";

    // Obtiene el precio desde el texto visible (ej. "S/30") o desde data-precio="30"
    let precio = parseFloat(tarjeta.dataset.precio || "0");
    if (precioEl) {
      const numeroVisible = parseFloat(precioEl.textContent.replace(/[^0-9.]/g, ""));
      if (!isNaN(numeroVisible)) {
        precio = numeroVisible;
      }
    }

    return { nombre, categoria, precio };
  }


  /* ========================================================================
     4. FILTRADO POR CATEGORÍAS DEL CATÁLOGO
     ======================================================================== */
  const botonesFiltro = Array.from(document.querySelectorAll("[data-filtro-categoria]"));
  const textoContadorProductos = document.getElementById("texto-contador-productos");

  function aplicarFiltroCategoria(nuevaCategoria) {
    categoriaActual = nuevaCategoria;
    let visibles = 0;

    // Actualizar estilos de los botones de categoría
    botonesFiltro.forEach((boton) => {
      const esActiva = boton.dataset.filtroCategoria === categoriaActual;
      if (esActiva) {
        boton.className = "shrink-0 rounded-full px-4 py-2.5 text-sm font-extrabold border bg-[#0F2A1A] text-white border-[#0F2A1A]";
      } else {
        boton.className = "shrink-0 rounded-full px-4 py-2.5 text-sm font-extrabold border bg-white text-[#0F2A1A] border-[#E5D5AF]";
      }
    });

    // Mostrar u ocultar las tarjetas según la categoría seleccionada
    tarjetasProductos.forEach((tarjeta) => {
      const { categoria } = obtenerDatosTarjeta(tarjeta);
      const mostrar = categoriaActual === "Todos" || categoria === categoriaActual;
      tarjeta.style.display = mostrar ? "" : "none";
      if (mostrar) visibles++;
    });

    // Actualizar contador de productos
    if (textoContadorProductos) {
      const palabra = visibles === 1 ? "producto" : "productos";
      textoContadorProductos.textContent = `${visibles} ${palabra} en ${categoriaActual}`;
    }
  }

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      aplicarFiltroCategoria(boton.dataset.filtroCategoria);
    });
  });


  /* ========================================================================
     5. CONTROL DE CANTIDADES (+ / -) Y BOTÓN "AGREGAR" EN CADA TARJETA
     ======================================================================== */
  const avisoProductoAgregado = document.getElementById("aviso-producto-agregado");

  tarjetasProductos.forEach((tarjeta) => {
    let cantidadSeleccionada = 1;

    const spanCantidad = tarjeta.querySelector(".cantidad-producto");
    const btnRestar = tarjeta.querySelector(".btn-restar");
    const btnSumar = tarjeta.querySelector(".btn-sumar");
    const btnAgregar = tarjeta.querySelector(".btn-agregar");
    const pieModoCanva = tarjeta.querySelector(".pie-modo-canva");

    function actualizarVistaCantidad() {
      const { precio } = obtenerDatosTarjeta(tarjeta);
      if (spanCantidad) spanCantidad.textContent = cantidadSeleccionada;
      if (btnAgregar) btnAgregar.textContent = `Agregar • S/${precio * cantidadSeleccionada}`;
      if (pieModoCanva) pieModoCanva.textContent = `EL DORADO • MEDIO MUNDO • S/${precio}`;
    }

    // Inicializar textos con el precio actual del HTML
    actualizarVistaCantidad();

    if (btnRestar) {
      btnRestar.addEventListener("click", () => {
        cantidadSeleccionada = Math.max(1, cantidadSeleccionada - 1);
        actualizarVistaCantidad();
      });
    }

    if (btnSumar) {
      btnSumar.addEventListener("click", () => {
        cantidadSeleccionada += 1;
        actualizarVistaCantidad();
      });
    }

    if (btnAgregar) {
      btnAgregar.addEventListener("click", () => {
        const { nombre, precio } = obtenerDatosTarjeta(tarjeta);
        if (!carrito[nombre]) {
          carrito[nombre] = { nombre, precio, cantidad: 0 };
        }
        carrito[nombre].precio = precio;
        carrito[nombre].cantidad += cantidadSeleccionada;

        // Mostrar confirmación temporal "✓ Producto agregado"
        if (avisoProductoAgregado) {
          avisoProductoAgregado.textContent = `✓ ${nombre} agregado`;
          avisoProductoAgregado.classList.remove("hidden");
          if (temporizadorAviso) clearTimeout(temporizadorAviso);
          temporizadorAviso = setTimeout(() => {
            avisoProductoAgregado.classList.add("hidden");
          }, 1800);
        }

        actualizarBarraCarrito();
      });
    }
  });


  /* ========================================================================
     6. BARRA FLOTANTE DE PEDIDO Y GENERACIÓN DE ENLACE WHATSAPP
     ======================================================================== */
  const barraCarrito = document.getElementById("barra-carrito");
  const espaciadorCarrito = document.getElementById("espaciador-carrito");
  const detalleCarrito = document.getElementById("detalle-carrito");
  const listaItemsCarrito = document.getElementById("lista-items-carrito");
  const btnToggleDetalle = document.getElementById("btn-toggle-detalle-carrito");
  const badgeCantidadCarrito = document.getElementById("badge-cantidad-carrito");
  const textoVerPedido = document.getElementById("texto-ver-pedido");
  const resumenTotalCarrito = document.getElementById("resumen-total-carrito");
  const btnLimpiarCarrito = document.getElementById("btn-limpiar-carrito");
  const enlaceWhatsappCarrito = document.getElementById("enlace-whatsapp-carrito");

  function actualizarBarraCarrito() {
    const items = Object.values(carrito).filter((item) => item.cantidad > 0);
    const totalUnidades = items.reduce((acc, item) => acc + item.cantidad, 0);
    const totalSoles = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

    if (totalUnidades === 0) {
      if (barraCarrito) barraCarrito.classList.add("hidden");
      if (espaciadorCarrito) espaciadorCarrito.classList.add("hidden");
      detalleCarritoAbierto = false;
      if (detalleCarrito) detalleCarrito.classList.add("hidden");
      return;
    }

    if (barraCarrito) barraCarrito.classList.remove("hidden");
    if (espaciadorCarrito) espaciadorCarrito.classList.remove("hidden");

    if (badgeCantidadCarrito) badgeCantidadCarrito.textContent = totalUnidades;
    if (resumenTotalCarrito) resumenTotalCarrito.textContent = `Total S/${totalSoles} • ${totalUnidades} productos`;
    if (textoVerPedido) textoVerPedido.textContent = detalleCarritoAbierto ? "Ocultar pedido" : "Ver mi pedido";

    // Renderizar lista desplegable del pedido
    if (listaItemsCarrito) {
      listaItemsCarrito.innerHTML = items
        .map(
          (item) => `
          <div class="flex items-center justify-between gap-3 border-b border-white/10 py-2 text-sm last:border-0">
            <span>${item.cantidad} × ${item.nombre}</span>
            <span class="font-bold">S/${item.cantidad * item.precio}</span>
          </div>`
        )
        .join("");
    }

    // Construir mensaje de WhatsApp con el resumen del pedido
    const lineasPedido = items.map((item) => `• ${item.cantidad} x ${item.nombre} — S/${item.cantidad * item.precio}`).join("\n");
    const mensaje = `Hola El Dorado, quiero pedir:\n${lineasPedido}\nTotal: S/${totalSoles}\n¿Me confirmas disponibilidad y entrega?`;
    if (enlaceWhatsappCarrito) {
      enlaceWhatsappCarrito.href = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    }
  }

  if (btnToggleDetalle) {
    btnToggleDetalle.addEventListener("click", () => {
      detalleCarritoAbierto = !detalleCarritoAbierto;
      if (detalleCarrito) {
        detalleCarrito.classList.toggle("hidden", !detalleCarritoAbierto);
      }
      if (textoVerPedido) {
        textoVerPedido.textContent = detalleCarritoAbierto ? "Ocultar pedido" : "Ver mi pedido";
      }
    });
  }

  if (btnLimpiarCarrito) {
    btnLimpiarCarrito.addEventListener("click", () => {
      Object.keys(carrito).forEach((clave) => delete carrito[clave]);
      detalleCarritoAbierto = false;
      actualizarBarraCarrito();
    });
  }


  /* ========================================================================
     7. MODO CANVA (TARJETAS CUADRADAS 1080 × 1080)
     ======================================================================== */
  const btnCanvaHeader = document.getElementById("btn-canva-header");
  const textoBtnCanvaHeader = document.getElementById("texto-btn-canva-header");
  const btnCanvaQr = document.getElementById("btn-canva-qr");
  const btnCanvaBanner = document.getElementById("btn-canva-banner");
  const avisoModoCanva = document.getElementById("aviso-modo-canva");

  function actualizarModoCanva(nuevoEstado) {
    modoCanvaActivo = nuevoEstado;

    // Mostrar u ocultar aviso de Modo Canva
    if (avisoModoCanva) {
      avisoModoCanva.classList.toggle("hidden", !modoCanvaActivo);
    }

    // Actualizar botón del encabezado
    if (btnCanvaHeader) {
      btnCanvaHeader.className = `hidden sm:flex items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold ${
        modoCanvaActivo ? "bg-[#C65D2E] text-white" : "bg-white/10 text-white"
      }`;
    }
    if (textoBtnCanvaHeader) {
      textoBtnCanvaHeader.textContent = modoCanvaActivo ? "Salir de Canva" : "Modo Canva";
    }

    // Actualizar botón inferior de la sección QR
    if (btnCanvaBanner) {
      btnCanvaBanner.textContent = modoCanvaActivo ? "Desactivar Modo Canva" : "Ver tarjetas cuadradas";
    }

    // Actualizar cada tarjeta de producto entre vista normal y tarjeta cuadrada 1:1
    tarjetasProductos.forEach((tarjeta) => {
      const contenedorImg = tarjeta.querySelector(".contenedor-imagen-producto");
      const controlesCompra = tarjeta.querySelector(".controles-compra");
      const pieModoCanva = tarjeta.querySelector(".pie-modo-canva");

      if (modoCanvaActivo) {
        tarjeta.classList.add("square-card", "flex", "flex-col");
        if (contenedorImg) {
          contenedorImg.classList.remove("h-60", "sm:h-64");
          contenedorImg.classList.add("h-[58%]");
        }
        if (controlesCompra) controlesCompra.classList.add("hidden");
        if (pieModoCanva) pieModoCanva.classList.remove("hidden");
      } else {
        tarjeta.classList.remove("square-card", "flex", "flex-col");
        if (contenedorImg) {
          contenedorImg.classList.remove("h-[58%]");
          contenedorImg.classList.add("h-60", "sm:h-64");
        }
        if (controlesCompra) controlesCompra.classList.remove("hidden");
        if (pieModoCanva) pieModoCanva.classList.add("hidden");
      }
    });
  }

  if (btnCanvaHeader) {
    btnCanvaHeader.addEventListener("click", () => actualizarModoCanva(!modoCanvaActivo));
  }

  if (btnCanvaBanner) {
    btnCanvaBanner.addEventListener("click", () => actualizarModoCanva(!modoCanvaActivo));
  }

  if (btnCanvaQr) {
    btnCanvaQr.addEventListener("click", () => {
      actualizarModoCanva(true);
      const seccionCatalogo = document.getElementById("catalogo");
      if (seccionCatalogo) {
        seccionCatalogo.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

});
