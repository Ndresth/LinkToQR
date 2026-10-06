import { getStore } from "@netlify/blobs";

// Netlify Functions aceptan peticiones de hasta 6 MB (codificadas en base64),
// por eso el límite real de archivo queda en ~4 MB.
export const MAX_BYTES = 4 * 1024 * 1024;

export const ID_PATTERN = /^[A-Za-z0-9]{12}$/;

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

// Store a nivel de sitio: persiste entre despliegues y no tiene TTL.
export const filesStore = () => getStore({ name: "linktoqr-files", consistency: "strong" });

export function newId(length = 12) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let id = "";
  for (const b of bytes) id += ID_ALPHABET[b % ID_ALPHABET.length];
  return id;
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
