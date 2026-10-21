import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const input = resolve(process.argv[2] ?? resolve(root, '../histae-app/build/previews/website'));
let bytes = 0;
for (const locale of ['fr', 'en', 'es', 'it']) {
  const output = resolve(root, 'public/images/app', locale);
  await mkdir(output, { recursive: true });
  for (const screen of ['feed', 'profile', 'chat', 'credits', 'privacy']) {
    const image = await sharp(resolve(input, locale, `${screen}.png`))
      .webp({ quality: 88, effort: 6 })
      .toFile(resolve(output, `${screen}.webp`));
    bytes += image.size;
  }
}
console.log(`Exported 20 localized app screenshots (${Math.round(bytes / 1024)} KiB).`);
