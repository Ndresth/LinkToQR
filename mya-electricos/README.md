# Sitio web — M&A Eléctricos e Ingeniería S.A.S.

Sitio estático (HTML + CSS + JS, sin build) construido a partir del brochure de la empresa.

## Estructura

- `index.html` — inicio: presentación, líneas de productos, nosotros, marcas, contacto y sedes.
- `productos.html` — catálogo completo por línea, con buscador y botón de cotización por WhatsApp.
- `js/catalogo.js` — **datos del catálogo** (líneas, subcategorías, marcas, referencias e imágenes). Para agregar o cambiar productos solo se edita este archivo.
- `js/app.js` — pinta el catálogo, menú móvil, buscador y enlaces de WhatsApp.
- `css/styles.css` — estilos (colores de marca en las variables de `:root`).
- `img/prod/` — fotos de producto tomadas del brochure; `img/marcas/` — logos de marcas.

## Ver en local

Abrir `index.html` en el navegador, o servir la carpeta: `npx serve mya-electricos`.

## Publicar

Es una carpeta estática: se puede subir tal cual a Netlify, Render (static site), GitHub Pages o cualquier hosting.
En Netlify, usar `mya-electricos` como directorio de publicación, sin comando de build.

## Datos de contacto usados

- WhatsApp: (318) 575 6242 — Celular: (318) 392 0090
- Correo: electricoseingenierias@hotmail.com
- Principal: Cr 45 # 99C - 84, Barranquilla — Sucursal: Calle 5 # 10 - 01, barrio 10 de Marzo, Guamal (Magdalena)
