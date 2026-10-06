# LinkToQR

Generador de códigos QR **que no expiran**, a partir de un enlace o de un archivo. Hecho con Bootstrap 5 y pensado para desplegarse en Netlify.

## Funciones

- **Enlace → QR** al instante, generado 100 % en el navegador (no pasa por ningún servidor).
- **Archivo → QR**: el archivo se sube a [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) y el QR apunta a una URL fija del propio sitio (`/f/<id>`).
- Personalización: colores, plantillas, forma de puntos y esquinas, logo central, margen y nivel de corrección de error.
- Descarga en **PNG** (512 / 1024 / 2048 px) o **SVG**, y copiar imagen al portapapeles.
- Historial de QR recientes (guardado solo en el navegador), modo claro/oscuro y diseño responsive.

## ¿Por qué no expiran?

| Tipo | Qué guarda el QR | Dependencias |
|---|---|---|
| Enlace | La URL tal cual (QR estático) | Ninguna. Funciona aunque el sitio se apague. |
| Archivo | `https://tu-sitio.netlify.app/f/<id>` | Que el sitio siga en Netlify. Los blobs no tienen TTL y persisten entre despliegues. |

Recomendación: conecta un **dominio propio** antes de imprimir QR de archivos; así puedes cambiar de plan o de proyecto sin romper los códigos.

## Estructura

```
public/                 Sitio estático (HTML + Bootstrap + JS)
  index.html
  css/styles.css
  js/app.js
netlify/functions/
  upload.mjs            POST /api/upload  → guarda el archivo en Netlify Blobs
  file.mjs              GET  /f/:id       → sirve el archivo
netlify/lib/files.mjs   Utilidades compartidas (store, límites, ids)
netlify.toml            Configuración de Netlify
```

## Desplegar en Netlify

> El arrastrar-y-soltar (Netlify Drop) **no** sirve: no despliega funciones. Usa Git o la CLI.

**Opción A – desde GitHub (recomendada)**

1. En Netlify: *Add new project → Import an existing project → GitHub* y elige este repositorio.
2. Netlify lee `netlify.toml`, así que no hay que configurar nada: publish `public`, funciones en `netlify/functions`, sin comando de build.
3. *Deploy*. Netlify Blobs se activa solo, sin claves ni configuración extra.

**Opción B – Netlify CLI**

```bash
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
```

## Proteger la subida de archivos (recomendado)

El endpoint de subida es público: cualquiera que encuentre el sitio puede subir archivos y gastar tu cuota. Para limitarlo, define la variable de entorno en Netlify:

*Project configuration → Environment variables → Add variable*

| Clave | Valor |
|---|---|
| `UPLOAD_PASSWORD` | La contraseña que quieras |

Vuelve a desplegar. La página pedirá la contraseña la primera vez que alguien suba un archivo y la recordará en ese navegador. Los QR de enlaces siguen funcionando sin contraseña.

## Límites y seguridad

- Tamaño máximo por archivo: **4 MB** (las Netlify Functions aceptan peticiones de hasta 6 MB codificadas en base64).
- Se muestran en el navegador solo tipos seguros (imágenes, PDF, audio, vídeo y texto plano). HTML, SVG, scripts y el resto se fuerzan a descarga con `Content-Security-Policy: sandbox` para evitar XSS en tu dominio.
- Añade `?download` a la URL de un archivo para forzar la descarga.
- Los archivos se cachean en el CDN de Netlify (son inmutables), así que la mayoría de escaneos no consumen invocaciones de función.
- Para borrar un archivo: *Netlify → tu proyecto → Blobs → store `linktoqr-files`*, o con `npx netlify-cli blobs:delete linktoqr-files <id>`.

## Desarrollo local

```bash
npm install
npx netlify-cli dev     # http://localhost:8888, con funciones y Blobs locales
```

Atajo: `https://tu-sitio/?url=https://ejemplo.com` abre la página con el QR ya generado.
