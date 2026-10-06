import { MAX_BYTES, filesStore, json, newId } from "../lib/files.mjs";

const MIME_PATTERN = /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i;

function safeDecode(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return "";
  }
}

function cleanName(raw) {
  // Sin rutas, sin caracteres de control y longitud acotada.
  const name = safeDecode(raw).split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f"]/g, "").trim();
  return (name || "archivo").slice(0, 150);
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Método no permitido." }, 405, { Allow: "POST" });
  }

  const password = Netlify.env.get("UPLOAD_PASSWORD");
  if (password && safeDecode(req.headers.get("x-upload-password")) !== password) {
    return json({ error: "Se requiere una contraseña de subida válida.", code: "password_required" }, 401);
  }

  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_BYTES) {
    return json({ error: "El archivo supera el límite de 4 MB.", code: "too_large" }, 413);
  }

  const data = await req.arrayBuffer();
  if (data.byteLength === 0) {
    return json({ error: "El archivo está vacío.", code: "empty" }, 400);
  }
  if (data.byteLength > MAX_BYTES) {
    return json({ error: "El archivo supera el límite de 4 MB.", code: "too_large" }, 413);
  }

  const rawType = (req.headers.get("content-type") || "").split(";")[0].trim();
  const type = MIME_PATTERN.test(rawType) ? rawType.toLowerCase() : "application/octet-stream";
  const name = cleanName(req.headers.get("x-file-name"));

  const store = filesStore();
  let id = newId();
  // Colisión prácticamente imposible (57^12), pero se verifica igual.
  while (await store.getMetadata(id)) id = newId();

  await store.set(id, data, {
    metadata: { name, type, size: data.byteLength, createdAt: new Date().toISOString() },
  });

  return json({ id, path: `/f/${id}`, name, type, size: data.byteLength }, 201);
};

export const config = {
  path: "/api/upload",
  method: "POST",
};
