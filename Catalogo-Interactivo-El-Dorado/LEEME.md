# Catálogo Interactivo — El Dorado (Medio Mundo • Végueta)

Esta carpeta contiene el código fuente separado, limpio y comentado para que puedas editar fácilmente cada sección, estilo e imagen del catálogo.

## Estructura de la Carpeta

```text
Catalogo-Interactivo-El-Dorado/
├── index.html          # Estructura HTML5 separada y comentada por secciones y productos
├── styles.css          # Hoja de estilos CSS separada y comentada por bloques
├── script.js           # Lógica interactiva (filtros, cantidades +/-, carrito WhatsApp y Modo Canva)
├── LEEME.md            # Guía rápida de edición
└── imagenes/           # Carpeta con todas las imágenes individuales para personalizar
    ├── hero-granja.jpg                  # Foto de fondo de la portada principal (Hero)
    ├── albuferas-medio-mundo.jpg        # Foto del banner "Frente a las Albuferas"
    ├── cuy-vivo-en-pie.jpg              # Producto 1: Cuy Vivo en Pie
    ├── cuy-beneficiado-premium.jpg      # Producto 2: Cuy Beneficiado Premium
    ├── cuy-chactado-crocante.jpg        # Producto 3: Cuy Chactado Crocante
    ├── cuy-al-palo.png                  # Producto 4: Cuy Al Palo
    ├── pepian-de-cuy.jpg                # Producto 5: Pepián de Cuy
    ├── pachamanca-para-4.jpg            # Producto 6: Pachamanca para 4
    ├── combo-domingo-familiar.jpg       # Producto 7: Combo Domingo Familiar
    ├── tour-vivencial-granja.jpg        # Producto 8: Tour Vivencial Granja
    ├── abono-organico.jpg               # Producto 9: Abono Orgánico
    ├── qr-whatsapp.png                  # Código QR para pedir por WhatsApp
    └── qr-catalogo.png                  # Código QR para compartir el catálogo
```

## ¿Cómo personalizar las imágenes?

Tienes dos formas muy sencillas de cambiar cualquier imagen:

1. **Reemplazando el archivo en la carpeta `imagenes/`**:
   Cada producto y sección tiene su propio archivo independiente en `imagenes/`. Si guardas tu nueva foto en la carpeta `imagenes/` con el mismo nombre (por ejemplo, `cuy-vivo-en-pie.jpg`), el cambio se verá automáticamente sin tocar el código.
2. **Cambiando la ruta en `index.html`**:
   Guarda tu foto nueva dentro de la carpeta `imagenes/` (por ejemplo, `mi-foto.jpg`), abre `index.html`, busca el comentario del producto o sección (ej. `PRODUCTO 1: Cuy Vivo en Pie`) y cambia el atributo `src`:
   ```html
   <img src="imagenes/mi-foto.jpg" alt="Cuy Vivo en Pie" class="h-full w-full object-cover">
   ```

## ¿Cómo editar textos, precios o agregar productos?

- Abre **`index.html`** en cualquier editor de texto (como VS Code, Sublime Text o el Bloc de notas).
- Cada sección está dividida con comentarios grandes (`<!-- === SECCIÓN 1 ... === -->` hasta `SECCIÓN 9`).
- Dentro de **`SECCIÓN 5: CATÁLOGO INTERACTIVO DE PRODUCTOS`**, cada tarjeta `<article class="tarjeta-producto">` tiene su propio comentario (`PRODUCTO 1` al `PRODUCTO 9`).
- Si cambias el precio en `<div class="precio-producto ...">S/30</div>` y `data-precio="30"`, el botón **Agregar** y el total de WhatsApp se actualizarán automáticamente.

## ¿Cómo cambiar los colores o fuentes?

- Abre **`styles.css`** y revisa las primeras secciones (`1. FUENTES TIPOGRÁFICAS` y `2. VARIABLES DE COLOR Y TEMA`), donde encontrarás comentados los colores principales (`--green`, `--gold`, `--terra`, `--surface`, `--card`).
