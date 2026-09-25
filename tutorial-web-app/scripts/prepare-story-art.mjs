import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const images = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../storyline-engine/images');

for (const mood of ['restored', 'drought', 'flood']) {
  await sharp(path.join(images, `grove-${mood}-v1.png`))
    .extract({ left: 0, top: 224, width: 1536, height: 576 })
    .resize(960, 360)
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(images, `grove-${mood}-stage.webp`));
}

for (const [name, crop] of [
  ['explorer', { left: 180, top: 100, width: 540, height: 830 }],
  ['guardian', { left: 90, top: 8, width: 800, height: 1008 }],
]) {
  await sharp(path.join(images, `${name}-v1.png`))
    .extract(crop)
    .resize({ height: 256 })
    .webp({ quality: 95, effort: 6 })
    .toFile(path.join(images, `${name}-stage.webp`));
}

await sharp(path.join(images, 'dialogue-bubble-v1.png'))
  .extract({ left: 100, top: 390, width: 1340, height: 280 })
  .resize({ width: 880 })
  .webp({ quality: 95, effort: 6 })
  .toFile(path.join(images, 'dialogue-bubble-stage.webp'));
