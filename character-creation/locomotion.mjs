// The same contract is used for every template and every student-created character.
export const animationRows = [
  { key: 'idle', frames: 1, fps: 1 },
  { key: 'walk', frames: 8, fps: 12 },
  { key: 'run', frames: 8, fps: 18 },
  { key: 'attack', frames: 4, fps: 10 },
  { key: 'jump', frames: 4, fps: 7 },
  { key: 'hurt', frames: 4, fps: 5 },
  { key: 'death', frames: 4, fps: 6 },
];

export const gaitPrompt = `Create a precise 4-column x 4-row locomotion sprite sheet, 16 square cells.
Image 1 is the character identity reference; image 2 is the POSE AND LAYOUT guide.
Preserve the reference character's face, outfit, palette, weapon and art style, but REPLACE its leg poses with the guide's poses. Do not copy the reference's repeated standing legs.
All frames face RIGHT in a side view. The cyan guide leg is the SAME near-side leg in every cell; the coral leg is the far-side leg. These colors explain depth only: render the character's original colors, not skeleton colors.
Read left-to-right, then next row. Rows 1 and 2 together are ONE eight-frame WALK cycle. Rows 3 and 4 together are ONE eight-frame RUN cycle.
For each cycle the sequence is: near-foot forward contact, down/recoil, passing with near-foot behind and far knee coming through, up, FAR-foot forward contact, down/recoil, opposite passing, up. Frame 5 must swap the leading anatomical leg from frame 1, not repeat it. Frames 3 and 7 must visibly overlap/cross the lower legs under the hips. Show the far leg behind the near leg, not two feet permanently standing side by side. Follow the guide's foot and knee positions exactly.
Walk has a grounded supporting foot. Run has bent recovery knees, larger strides, forward lean and airborne phases. Arms counter-swing. Keep feet visible even under capes/robes: move cloth naturally aside for the stride, without changing the costume identity. Adapt the gait to the character's anatomy if non-humanoid; do not add human legs to a creature that has none.
Keep the head/hips anchored to each guide cell, identical scale and fixed camera. No horizontal drift, no whole-body sliding as a substitute for leg articulation. Keep all weapons, hair, capes and limbs fully inside each cell with a clear transparent gutter. Transparent alpha background, no floor, shadows, text, labels, guide lines, colored skeletons or grid. Output only the finished 4x4 sprite sheet.`;

// Technical pose reference, not substitute character art. Eight explicit phases,
// with the near and far legs exchanged after half a cycle.
export function gaitGuideSvg() {
  const walk = [
    [[149,183],[166,226]], [[137,188],[144,226]],
    [[125,186],[128,226]], [[115,181],[96,226]],
    [[109,183],[90,226]], [[119,183],[105,211]],
    [[148,178],[117,213]], [[155,180],[152,215]],
  ];
  const run = [
    [[158,178],[180,222]], [[142,188],[145,226]],
    [[124,187],[115,223]], [[96,174],[69,205]],
    [[95,172],[86,199]], [[119,155],[93,178]],
    [[162,161],[114,205]], [[173,169],[188,207]],
  ];
  const cells = [];
  for (let cycle = 0; cycle < 2; cycle++) {
    const poses = cycle ? run : walk;
    for (let frame = 0; frame < 8; frame++) {
      const x = (frame % 4) * 256;
      const y = (cycle * 2 + Math.floor(frame / 4)) * 256;
      const near = poses[frame];
      const far = poses[(frame + 4) % 8];
      const leg = (points, color) => `<path d="M128 148 L${points[0].join(' ')} L${points[1].join(' ')} l12 0" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
      cells.push(`<g transform="translate(${x} ${y})"><rect x="1" y="1" width="254" height="254" fill="#fff" stroke="#ddd"/><text x="12" y="20" font-size="12">${cycle ? 'RUN' : 'WALK'} ${frame + 1}</text>${leg(far, '#ed7764')}<path d="M128 148 L${cycle ? 144 : 130} 94" stroke="#444" stroke-width="16"/><circle cx="${cycle ? 149 : 133}" cy="70" r="19" fill="#444"/><path d="M${cycle ? 166 : 150} 68 l10 6 -10 3" fill="#444"/>${leg(near, '#20abc6')}</g>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${cells.join('')}</svg>`;
}

export async function createGaitGuide(sharp) {
  return sharp(Buffer.from(gaitGuideSvg())).png().toBuffer();
}

// Generated images do not always honour exact pixel boundaries. Locate clear
// seams before slicing; never let the next row's helmet become this row's feet.
export async function normalizeGrid(sharp, bytes, columns, rows) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const occupied = (x, y) => data[(y * info.width + x) * 4 + 3] > 32;
  function cuts(length, count, score) {
    const result = [0];
    for (let n = 1; n < count; n++) {
      const expected = Math.round(n * length / count);
      const radius = Math.floor(length / count * .18);
      let best = expected, bestScore = Infinity;
      for (let p = expected - radius; p <= expected + radius; p++) {
        const value = score(p) * 10000 + Math.abs(p - expected);
        if (value < bestScore) { bestScore = value; best = p; }
      }
      if (score(best) > 2) throw new Error('Sprite poses overlap across cells. Please regenerate with wider transparent gutters.');
      result.push(best);
    }
    result.push(length);
    return result;
  }
  const ys = cuts(info.height, rows, y => {
    let total = 0;
    for (let x = 0; x < info.width; x++) total += occupied(x, y);
    return total;
  });
  const frames = [];
  for (let row = 0; row < rows; row++) {
    const xs = cuts(info.width, columns, x => {
      let total = 0;
      for (let y = ys[row]; y < ys[row + 1]; y++) total += occupied(x, y);
      return total;
    });
    for (let col = 0; col < columns; col++) {
      let left = xs[col + 1], right = xs[col], top = ys[row + 1], bottom = ys[row];
      for (let y = ys[row]; y < ys[row + 1]; y++) for (let x = xs[col]; x < xs[col + 1]; x++) {
        if (occupied(x, y)) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
      }
      if (right < left || bottom < top) throw new Error('A generated animation cell is empty. Please regenerate.');
      frames.push({ left, top, width: right - left + 1, height: bottom - top + 1, row, col });
    }
  }
  const scale = Math.min(...frames.map(frame => Math.min(232 / frame.width, 232 / frame.height)));
  const composite = [];
  for (const frame of frames) {
    const width = Math.max(1, Math.round(frame.width * scale));
    const height = Math.max(1, Math.round(frame.height * scale));
    const input = await sharp(bytes).extract({ left: frame.left, top: frame.top, width: frame.width, height: frame.height }).resize(width, height).png().toBuffer();
    composite.push({ input, left: frame.col * 256 + Math.floor((256 - width) / 2), top: frame.row * 256 + 240 - height });
  }
  return sharp({ create: { width: columns * 256, height: rows * 256, channels: 4, background: '#00000000' } }).composite(composite).png().toBuffer();
}

// Reject gross failures before publishing. Pixel checks cannot prove anatomical
// correctness, but catch opaque backdrops, edge bleed and repeated static legs.
export async function validateGait(sharp, bytes) {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== info.height || info.width % 4) throw new Error('Locomotion sheet must be a square 4x4 grid.');
  const size = info.width / 4;
  const signatures = [];
  for (let index = 0; index < 16; index++) {
    const ox = index % 4 * size, oy = Math.floor(index / 4) * size;
    let filled = 0, edge = 0;
    const lower = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const p = ((oy + y) * info.width + ox + x) * 4;
      const alpha = data[p + 3];
      if (alpha > 32) {
        filled++;
        if (x < 2 || y < 2 || x >= size - 2 || y >= size - 2) edge++;
      }
      if (y >= size * .6 && x % 2 === 0 && y % 2 === 0) lower.push(alpha > 32 ? 1 : 0);
    }
    if (filled < size * size * .015 || filled > size * size * .85 || edge > size * .15) {
      throw new Error('Locomotion frame is empty, opaque or crosses its cell boundary. Please regenerate.');
    }
    signatures.push(lower);
  }
  for (const start of [0, 8]) {
    let changedPhases = 0;
    for (let phase = 1; phase < 8; phase++) {
      const a = signatures[start], b = signatures[start + phase];
      const changed = a.reduce((sum, value, i) => sum + (value !== b[i] ? 1 : 0), 0);
      if (changed / a.length >= .012) changedPhases++;
    }
    if (changedPhases < 4) throw new Error('Locomotion repeats static lower-body poses. Please regenerate.');
  }
}

export async function packSpriteSheet(sharp, base, gait) {
  // Exact integer cell sizes prevent sampling pixels from the neighbouring row.
  const baseImage = await sharp(base).resize(1024, 1792, { fit: 'fill' }).ensureAlpha().png().toBuffer();
  const gaitImage = await sharp(gait).resize(1024, 1024, { fit: 'fill' }).ensureAlpha().png().toBuffer();
  const cells = [];
  for (let row = 0; row < 7; row++) {
    for (let frame = 0; frame < animationRows[row].frames; frame++) {
      const moving = row === 1 || row === 2;
      const left = (moving ? frame % 4 : frame) * 256;
      const top = (moving ? (row - 1) * 2 + Math.floor(frame / 4) : row) * 256;
      let input = await sharp(moving ? gaitImage : baseImage).extract({ left, top, width: 256, height: 256 }).png().toBuffer();
      if (row === 0 && frame === 0) input = await cleanIdleCell(sharp, input);
      cells.push({ input, left: frame * 256, top: row * 256 });
    }
  }
  return sharp({ create: { width: 2048, height: 1792, channels: 4, background: '#00000000' } }).composite(cells).png().toBuffer();
}

async function cleanIdleCell(sharp, input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const bands = [];
  for (let y = 0; y < info.height; y++) {
    let pixels = 0;
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 32) pixels++;
    }
    if (!pixels) continue;
    const previous = bands.at(-1);
    if (previous && y - previous.end < 8) { previous.end = y; previous.pixels += pixels; }
    else bands.push({ end: y, pixels });
  }
  const main = bands.reduce((largest, band) => !largest || band.pixels > largest.pixels ? band : largest, null);
  if (!main || !bands.some(band => band.end > main.end)) return input;
  data.fill(0, (main.end + 1) * info.width * info.channels);
  return sharp(data, { raw: info }).png().toBuffer();
}
