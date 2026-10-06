import { ID_PATTERN, filesStore } from "../lib/files.mjs";

// Tipos que el navegador puede mostrar sin riesgo de ejecutar código en el dominio.
// Todo lo demás (HTML, SVG, XML, JS…) se fuerza a descarga.
const INLINE_TYPES = [
  /^image\/(png|jpeg|gif|webp|avif|bmp)$/,
  /^audio\//,
  /^video\//,
  /^application\/pdf$/,
  /^text\/plain$/,
];

function contentDisposition(kind, name) {
  const ascii = name.replace(/[^\x20-\x7e]/g, "_").replace(/[\\"]/g, "_");
  return `${kind}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

function notFound() {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Archivo no encontrado</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f4f5fb;color:#1f2340;text-align:center;padding:16px}a{color:#5b4bff}</style></head>
<body><main><h1>Archivo no encontrado</h1><p>El enlace no existe o el archivo fue eliminado.</p><p><a href="/">Ir a LinkToQR</a></p></main></body></html>`;
  return new Response(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export default async (req, context) => {
  const { id } = context.params;
  if (!ID_PATTERN.test(id || "")) return notFound();

  const entry = await filesStore().getWithMetadata(id, { type: "arrayBuffer" });
  if (!entry) return notFound();

  const { data, metadata = {} } = entry;
  const type = metadata.type || "application/octet-stream";
  const name = metadata.name || id;
  const inline = INLINE_TYPES.some((re) => re.test(type));
  const forceDownload = new URL(req.url).searchParams.has("download");

  const headers = {
    "Content-Type": type === "text/plain" ? "text/plain; charset=utf-8" : type,
    "Content-Length": String(data.byteLength),
    "Content-Disposition": contentDisposition(inline && !forceDownload ? "inline" : "attachment", name),
    "X-Content-Type-Options": "nosniff",
    // Los archivos son inmutables: se cachean en navegador y en el CDN de Netlify.
    "Cache-Control": "public, max-age=31536000, immutable",
    "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
  };
  if (!inline) headers["Content-Security-Policy"] = "sandbox; default-src 'none'";

  return new Response(req.method === "HEAD" ? null : data, { status: 200, headers });
};

export const config = {
  path: "/f/:id",
  method: ["GET", "HEAD"],
};
