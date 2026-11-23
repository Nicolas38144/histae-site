import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const input = resolve(process.argv[2] ?? resolve(root, '../histae-app/build/previews/website'));
let bytes = 0;
const versions = {};
for (const locale of ['fr', 'en', 'es', 'it']) {
  const output = resolve(root, 'public/images/app', locale);
  versions[locale] = {};
  await mkdir(output, { recursive: true });
  for (const screen of ['feed', 'profile', 'chat', 'credits', 'privacy']) {
    const source = sharp(resolve(input, locale, `${screen}.png`));
    const { width, height } = await source.metadata();
    if (width !== 780 || height !== 1688) {
      throw new Error(`${locale}/${screen}: expected a 780 × 1688 source image`);
    }
    const original = await source.clone().webp({ quality: 88, effort: 6 }).toBuffer();
    const small = await source.clone().resize({ width: 320 }).webp({ quality: 88, effort: 6 }).toBuffer();
    await Promise.all([
      writeFile(resolve(output, `${screen}.webp`), original),
      writeFile(resolve(output, `${screen}-320.webp`), small),
    ]);
    bytes += original.length + small.length;
    versions[locale][screen] = {
      original: createHash('sha256').update(original).digest('hex').slice(0, 12),
      small: createHash('sha256').update(small).digest('hex').slice(0, 12),
    };
  }
}
await writeFile(resolve(root, 'config/app-screenshots.json'), JSON.stringify(versions, null, 2) + '\n');
console.log(`Exported 40 localized app screenshot files (${Math.round(bytes / 1024)} KiB).`);
