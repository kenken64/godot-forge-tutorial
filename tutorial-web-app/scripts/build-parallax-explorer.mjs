import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const images = path.join(projectRoot, 'parallax-tiling-map/images');
const source = path.join(images, 'originals/practice-explorer-walk-run.png');
const jumpSource = path.join(images, 'originals/practice-explorer-jump.png');
const idleSource = path.join(images, 'practice-explorer.webp');
const outputPng = path.join(images, 'originals/practice-explorer-motion-sheet-v2.png');
const outputWebp = path.join(images, 'practice-explorer-motion-v2.webp');
const frameWidth = 160, frameHeight = 192, columns = 4, rows = 5;

const { data, info } = await sharp(source).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const { data: jumpData, info: jumpInfo } = await sharp(jumpSource).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
for (const sourceInfo of [info, jumpInfo]) if (sourceInfo.width !== 1536 || sourceInfo.height !== 1024) throw new Error('Expected 1536 × 1024 source sheets.');

function opaque(pixels, sourceInfo, x, y) { return pixels[(y * sourceInfo.width + x) * sourceInfo.channels + 3] > 20; }

function subjectBounds(pixels, sourceInfo, row) {
  const top = row * 512, ranges = [];
  let first = -1;
  for (let x = 0; x <= sourceInfo.width; x++) {
    let occupied = false;
    if (x < sourceInfo.width) for (let y = top; y < top + 512; y++) if (opaque(pixels, sourceInfo, x, y)) { occupied = true; break; }
    if (occupied && first < 0) first = x;
    if (!occupied && first >= 0) { if (x - first >= 80) ranges.push({ left: first, right: x - 1 }); first = -1; }
  }
  if (ranges.length !== 4) throw new Error(`Expected four separate characters in row ${row}, found ${ranges.length}.`);
  return ranges.map(({ left, right }) => {
    let minY = top + 512, maxY = top;
    for (let y = top; y < top + 512; y++) for (let x = left; x <= right; x++) if (opaque(pixels, sourceInfo, x, y)) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    return { left, top: minY, width: right - left + 1, height: maxY - minY + 1 };
  });
}

const poses = [
  { source, rects: subjectBounds(data, info, 0) },
  { source, rects: subjectBounds(data, info, 1) },
  { source: jumpSource, rects: subjectBounds(jumpData, jumpInfo, 0) },
  { source: jumpSource, rects: subjectBounds(jumpData, jumpInfo, 1) },
];
const widest = Math.max(...poses.flatMap(row => row.rects).map(rect => rect.width));
const tallest = Math.max(...poses.flatMap(row => row.rects).map(rect => rect.height));
const scale = Math.min(148 / widest, 176 / tallest);
const idle = await sharp(idleSource).resize({ height: 176 }).png().toBuffer();
const idleInfo = await sharp(idle).metadata();
const entries = [];

for (let column = 0; column < columns; column++) {
  entries.push({ input: idle, left: column * frameWidth + Math.round((frameWidth - idleInfo.width) / 2), top: 188 - idleInfo.height });
}
for (let row = 0; row < poses.length; row++) for (let column = 0; column < columns; column++) {
  const rect = poses[row].rects[column];
  const width = Math.round(rect.width * scale), height = Math.round(rect.height * scale);
  const input = await sharp(poses[row].source).extract(rect).resize(width, height).png().toBuffer();
  entries.push({ input, left: column * frameWidth + Math.round((frameWidth - width) / 2), top: (row + 1) * frameHeight + 188 - height });
}

await sharp({ create: { width: frameWidth * columns, height: frameHeight * rows, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(entries).png().toFile(outputPng);
await sharp(outputPng).webp({ quality: 95, effort: 6 }).toFile(outputWebp);
console.log(`Created ${outputWebp}: idle 0–3, walk 4–7, run 8–11, jump 12–19`);
