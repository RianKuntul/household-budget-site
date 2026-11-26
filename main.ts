// HomeLedger hand-in program (Node 22, standard library only).
//
// The site is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), its content held
// in its own files: nothing it runs, styles or shows loads over the network.
// This program hands it in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary the
// judge reads (screenshots, the first load's files and bytes, and the
// source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to
// be byte for byte what its own copy writes.
//
// Serve the site locally with any static server rooted at app/, for
// example `npx serve app` or `python3 -m http.server --directory app`.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight: refuse to hand in a broken entry instead of letting the
// scorer refuse it. app/index.html must exist, and screenshots/ must hold
// 3 or 4 images, each at most 256 KiB (the gate's own caps).
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: the site cannot be handed in');
}
const shotDir = join(here, 'screenshots');
const shots = existsSync(shotDir)
  ? readdirSync(shotDir).filter((f) => !f.startsWith('.') && statSync(join(shotDir, f)).isFile())
  : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`screenshots/ holds ${shots.length} images, need 3 or 4`);
}
for (const f of shots) {
  const size = statSync(join(shotDir, f)).size;
  if (size > 262144) throw new Error(`screenshots/${f} is ${size} bytes, over the 256 KiB cap`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 16 MiB of
// app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(`HomeLedger handed in: ${shots.length} screenshots, dossier.json ${dossierBytes} bytes -> ${out}`);
