import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/ha-mammotion-luba-card.js', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const output = source.replaceAll('__VERSION__', pkg.version);
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/ha-mammotion-luba-card.js', import.meta.url), output);
console.log(`Built ha-mammotion-luba-card ${pkg.version}`);
