# LinkToQR

Generador de códigos QR **que no expiran** a partir de un enlace. Hecho con Bootstrap 5, sitio 100 % estático, listo para Netlify.

## Funciones

- Enlace → QR al instante, generado en el navegador (ningún dato pasa por un servidor).
- Personalización: plantillas, colores, forma de puntos y esquinas, logo central, margen y nivel de corrección de error.
- Descarga en **PNG** (512 / 1024 / 2048 px) o **SVG**, y copiar imagen al portapapeles.
- Historial de QR recientes (solo en el navegador), modo claro/oscuro y diseño responsive.
- Atajo: `https://tu-sitio/?url=https://ejemplo.com` abre la página con el QR ya generado.

## ¿Por qué no expiran?

Son **QR estáticos**: la URL se codifica directamente en la imagen, sin acortadores ni redirecciones. El código funciona para siempre mientras el enlace de destino exista, aunque esta página deje de estar en línea.

## Estructura

```
public/
  index.html        Página (Bootstrap 5.3 + qr-code-styling desde CDN)
  css/styles.css    Estilos
  js/app.js         Lógica del generador
  favicon.svg
netlify.toml        Carpeta a publicar y cabeceras de seguridad
```

## Desplegar en Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) e inicia sesión con GitHub.
2. *Add new project → Import an existing project → GitHub* y autoriza el acceso al repositorio `LinkToQR`.
3. Elige la rama `master`. Netlify lee `netlify.toml`, así que los campos aparecen ya rellenos:
   - Build command: *(vacío)*
   - Publish directory: `public`
4. Pulsa *Deploy*. En menos de un minuto tendrás una URL tipo `https://nombre-aleatorio.netlify.app`.
5. (Opcional) *Project configuration → General → Change project name* para cambiar la URL, o *Domain management → Add a domain* para usar tu propio dominio (Netlify emite el certificado HTTPS automáticamente).

Cada `git push` a `master` vuelve a desplegar el sitio solo.

Alternativa sin Git: arrastra la carpeta `public/` a [app.netlify.com/drop](https://app.netlify.com/drop).

## Desarrollo local

No hace falta instalar nada. Sirve la carpeta `public/` con cualquier servidor estático:

```bash
python3 -m http.server 8080 --directory public
# http://localhost:8080
```
