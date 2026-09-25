import { inspectBossLayout } from './sprite-layout.mjs';
import { gaitPrompt, createGaitGuide, normalizeGrid, validateGait } from '../character-creation/locomotion.mjs';

export const bossAnimationRows = [
  { key: 'idle', frames: 1, fps: 1, loop: true },
  { key: 'walk', frames: 8, fps: 10, loop: true },
  { key: 'run', frames: 8, fps: 14, loop: true },
  { key: 'attack', frames: 4, fps: 8, loop: false },
  { key: 'hurt', frames: 4, fps: 6, loop: false },
  { key: 'death', frames: 4, fps: 6, loop: false },
  { key: 'enrage', frames: 4, fps: 6, loop: false },
];

export function packedBossLayout() {
  return { width: 2048, height: 1792, unavailable: [], animations: bossAnimationRows.map((row, y) => ({
    key: row.key, fps: row.fps, loop: row.loop,
    frames: Array.from({ length: row.frames }, (_, x) => ({ x: x * 256, y: y * 256, width: 256, height: 256 })),
  })) };
}

export function actionPrompt(key, boss = {}) {
  const poses = {
    attack: '1 anticipation: crouch and draw the weapon behind the body. 2 wind-up: weapon lifted above and behind the head. 3 strike: swing forward with the weapon clearly extended ahead of the boss. 4 recovery: weapon lowered and body returning to its guard. Each pose must have visibly different arms and weapon angles.',
    enrage: '1 energy gathering: hunch, fists clenched, dim cracks. 2 tension: brace legs and arch torso, cracks brighten. 3 release: spread arms and roar as energy breaks through the armour. 4 fully enraged: hold a threatening empowered fighting stance. Preserve the same boss identity; show a visible pose change as well as increasing energy.',
    recovery: 'Row 1: idle standing, idle standing. Row 2: hurt impact, hurt recoil. Row 3: death stagger, falling. Row 4: fallen, final defeated pose. No gore.',
  };
  const grid = key === 'recovery' ? '2 columns by 4 rows, eight' : '2 columns by 2 rows, four';
  return `Create an animation pass for the boss in image 1 (identity reference). Image 2 is a layout guide only. Keep the same face, armour, proportions, colours and weapon. Strict SIDE VIEW facing RIGHT for a platformer. The boss must look imposing and badass.
Output exactly ${grid} full-body poses, read left-to-right then top-to-bottom. ${poses[key]}
Boss direction: ${JSON.stringify(boss).slice(0, 5000)}
Keep the entire boss, every weapon and all energy effects within the inner 65% of its cell. Render each boss SMALL enough to leave at least 80 pixels of completely transparent padding on all four sides of each 512-pixel cell. The vertical AND horizontal centre lines of the image must be entirely transparent. Do not fill the sheet with oversized artwork. Same scale, camera and ground anchor throughout. No shadows, backdrop, labels, borders, guide marks, text or cropped parts. Energy must never touch adjacent cells. This pass contains only ${key} poses, not a complete multi-action sheet.`;
}

export async function actionGuide(sharp, key) {
  const rows = key === 'recovery' ? 4 : 2;
  const arms = key === 'attack'
    ? ['M235 220 L190 265 L130 230 M130 230 L105 150', 'M235 220 L180 180 L200 120 M200 120 L330 100', 'M235 220 L300 255 L370 240 M370 240 L410 330', 'M235 220 L275 270 L310 310 M310 310 L365 390']
    : ['M235 220 L280 275 L245 280', 'M235 220 L290 245 L310 200', 'M235 220 L320 170 L385 140 M235 220 L150 170 L110 140', 'M235 220 L310 235 L340 180 M235 220 L160 250 L135 195'];
  const cells = Array.from({ length: rows * 2 }, (_, index) => `<g transform="translate(${index % 2 * 512} ${Math.floor(index / 2) * 512})"><rect x="1" y="1" width="510" height="510" fill="white" stroke="#aaa"/><rect x="64" y="64" width="384" height="384" fill="none" stroke="#bbb" stroke-dasharray="6 8"/><text x="32" y="40" font-size="22">${key.toUpperCase()} ${index + 1}</text><path d="M235 200 L256 330 L218 442 M256 330 L296 442" fill="none" stroke="#555" stroke-width="14"/><circle cx="235" cy="163" r="25" fill="#555"/><path d="${arms[index % 4]}" fill="none" stroke="#20abc6" stroke-width="12" stroke-linejoin="round"/></g>`).join('');
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="${rows * 512}">${cells}</svg>`)).png().toBuffer();
}

// Every action is packed from isolated cells with an explicit frame count.
// The eight movement frames are never re-sliced as a four-frame legacy sheet.
export async function repairBossSheet(sharp, source, boss, { edit, load, save, saveRaw = async () => {} }) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const legacy = inspectBossLayout(data, info.width, info.height);
  const idle = legacy.animations.find(row => row.key === 'idle');
  const reference = idle ? await sharp(source).extract({ left: idle.frames[0].x, top: idle.frames[0].y, width: idle.frames[0].width, height: idle.frames[0].height }).png().toBuffer() : source;
  async function pass(key, prompt, guide, columns, rows) {
    const cached = await load(key);
    if (cached) return cached;
    const raw = await edit({ key, prompt, reference, guide, size: key === 'recovery' ? '1024x2048' : '1024x1024' });
    await saveRaw(key, raw);
    let result;
    try {
      result = await normalizeGrid(sharp, raw, columns, rows);
      if (key === 'gait') await validateGait(sharp, result);
    } catch (error) {
      throw Object.assign(new Error(`${key} animation needs another attempt: ${error.message} Completed passes are saved.`), { statusCode: 422 });
    }
    await save(key, result);
    return result;
  }
  const gait = await pass('gait', gaitPrompt, await createGaitGuide(sharp), 4, 4);
  const attack = await pass('attack', actionPrompt('attack', boss), await actionGuide(sharp, 'attack'), 2, 2);
  const enrage = await pass('enrage', actionPrompt('enrage', boss), await actionGuide(sharp, 'enrage'), 2, 2);
  const reusable = ['idle', 'hurt', 'death'].every(key => legacy.animations.some(row => row.key === key));
  const recovery = reusable ? null : await pass('recovery', actionPrompt('recovery', boss), await actionGuide(sharp, 'recovery'), 2, 4);
  const images = [];
  const legacyFrames = legacy.animations.filter(row => ['idle', 'hurt', 'death'].includes(row.key)).flatMap(row => row.frames);
  const scale = legacyFrames.length ? Math.min(...legacyFrames.map(f => Math.min(232 / f.width, 232 / f.height))) : 1;
  for (const [row, animation] of bossAnimationRows.entries()) {
    for (let frame = 0; frame < animation.frames; frame++) {
      let input;
      if (animation.key === 'walk' || animation.key === 'run') {
        input = await sharp(gait).extract({ left: frame % 4 * 256, top: ((animation.key === 'run' ? 2 : 0) + Math.floor(frame / 4)) * 256, width: 256, height: 256 }).png().toBuffer();
      } else if (animation.key === 'attack' || animation.key === 'enrage') {
        input = await sharp(animation.key === 'attack' ? attack : enrage).extract({ left: frame % 2 * 256, top: Math.floor(frame / 2) * 256, width: 256, height: 256 }).png().toBuffer();
      } else if (recovery) {
        const index = animation.key === 'idle' ? 0 : animation.key === 'hurt' ? 2 + frame % 2 : 4 + frame;
        input = await sharp(recovery).extract({ left: index % 2 * 256, top: Math.floor(index / 2) * 256, width: 256, height: 256 }).png().toBuffer();
      } else {
        const f = legacy.animations.find(a => a.key === animation.key).frames[frame];
        const width = Math.max(1, Math.round(f.width * scale)), height = Math.max(1, Math.round(f.height * scale));
        const pose = await sharp(source).extract({ left: f.x, top: f.y, width: f.width, height: f.height }).resize(width, height).png().toBuffer();
        input = await sharp({ create: { width: 256, height: 256, channels: 4, background: '#00000000' } }).composite([{ input: pose, left: Math.floor((256 - width) / 2), top: 240 - height }]).png().toBuffer();
      }
      images.push({ input, left: frame * 256, top: row * 256 });
    }
  }
  const bytes = await sharp({ create: { width: 2048, height: 1792, channels: 4, background: '#00000000' } }).composite(images).png().toBuffer();
  return { bytes, layout: packedBossLayout() };
}
