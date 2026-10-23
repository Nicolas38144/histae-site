import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export function contentSecurityPolicy(html) {
  const hashes = new Set();
  // Hash the exact script text, including whitespace (HTML normalizes CR/CRLF to LF).
  const scripts = /<script\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi;
  for (const [, attributes, body] of html.matchAll(scripts)) {
    if (/(?:^|\s)src\s*=/i.test(attributes)) continue;
    if (body) hashes.add(`'sha256-${createHash("sha256").update(body.replace(/\r\n?/g, "\n")).digest("base64")}'`);
  }
  const policy = [
    "default-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
    "object-src 'none'", "img-src 'self' data:",
    `script-src 'self' ${[...hashes].sort().join(" ")}`.trim(),
    "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'", "font-src 'self'",
    "connect-src 'self'", "manifest-src 'self'",
  ].join("; ");
  if (Buffer.byteLength(policy) > 7500) throw new Error("Page CSP exceeds the header budget");
  return policy;
}

async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(file));
    else if (entry.isFile() && entry.name.endsWith(".html")) result.push(file);
  }
  return result.sort();
}

export async function buildSecurityHeaders(outputDirectory = path.resolve("out"), generatedDirectory = path.resolve(".generated")) {
  const policies = {};
  const files = await htmlFiles(outputDirectory);
  if (!files.length) throw new Error("Build the static export before generating CSP headers");
  for (const file of files) {
    const relative = path.relative(outputDirectory, file).split(path.sep).join("/");
    const policy = contentSecurityPolicy(await readFile(file, "utf8"));
    policies[`/${relative}`] = policy;
    if (relative === "index.html") policies["/"] = policy;
    else if (relative.endsWith("/index.html")) {
      const route = `/${relative.slice(0, -"/index.html".length)}`;
      policies[route] = policy;
      policies[`${route}/`] = policy;
    }
  }
  if (!policies["/404.html"]) throw new Error("Missing exported 404 page");
  const fallback = policies["/404.html"];
  const lines = Object.entries(policies).sort(([a], [b]) => a.localeCompare(b))
    .map(([route, policy]) => `\t${JSON.stringify(route)} ${JSON.stringify(policy)}`);
  const caddy = ["# Generated from this exact HTML export; deploy together.",
    "map {path} {histae_csp} {", ...lines, `\tdefault ${JSON.stringify(fallback)}`, "}", ""].join("\n");
  await mkdir(generatedDirectory, { recursive: true });
  await writeFile(path.join(generatedDirectory, "security-headers.caddy"), caddy);
  await writeFile(path.join(generatedDirectory, "security-headers.json"), JSON.stringify({ policies, fallback }, null, 2) + "\n");
  console.log(`Generated hash-based CSP for ${files.length} HTML files (${Object.keys(policies).length} paths).`);
}
