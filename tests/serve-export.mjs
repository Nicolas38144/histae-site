// Local test server for the exported HTML and generated CSP, not a Caddy replacement.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const { policies, fallback } = JSON.parse(await readFile(".generated/security-headers.json", "utf8"));
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".txt": "text/plain", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1:3113").pathname);
  response.setHeader("Content-Security-Policy", policies[pathname] ?? fallback);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
  let file = path.resolve(root, "." + pathname);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) { response.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    const content = await readFile(file);
    response.setHeader("Content-Type", mime[path.extname(file)] ?? "application/octet-stream");
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.writeHead(404).end(await readFile(path.join(root, "404.html")));
  }
}).listen(3113, "127.0.0.1");
