export const bossRows = ['idle', 'walk', 'run', 'attack', 'hurt', 'death', 'enrage'];

// Locate transparent gutters in the actual pixels, including older sheets whose
// rows are uneven. A failed seam disables BOTH adjacent animations, never crops
// through a pose to make a plausible-looking frame.
export function inspectBossLayout(data, width, height, keys = bossRows) {
  const occupied = (x, y) => data[(y * width + x) * 4 + 3] > 32;
  function seams(length, count, score) {
    const cuts = [0], valid = [true];
    for (let i = 1; i < count; i++) {
      const expected = Math.round(i * length / count);
      const radius = Math.floor(length / count * .45);
      let best = expected, minimum = Infinity;
      for (let p = Math.max(1, expected - radius); p <= Math.min(length - 1, expected + radius); p++) {
        const rank = score(p) * length + Math.abs(p - expected);
        if (rank < minimum) { minimum = rank; best = p; }
      }
      cuts.push(best); valid.push(score(best) === 0);
    }
    cuts.push(length); valid.push(true);
    return { cuts, valid };
  }
  const horizontal = seams(height, keys.length, y => {
    let total = 0;
    for (let x = 0; x < width; x++) total += occupied(x, y);
    return total;
  });
  const animations = [], unavailable = [];
  keys.forEach((key, row) => {
    const top = horizontal.cuts[row], bottom = horizontal.cuts[row + 1];
    if (!horizontal.valid[row] || !horizontal.valid[row + 1]) { unavailable.push(key); return; }
    const vertical = seams(width, 4, x => {
      let total = 0;
      for (let y = top; y < bottom; y++) total += occupied(x, y);
      return total;
    });
    if (vertical.valid.some(value => !value)) { unavailable.push(key); return; }
    const frames = [];
    for (let col = 0; col < 4; col++) {
      let left = width, right = -1, first = height, last = -1;
      for (let y = top; y < bottom; y++) for (let x = vertical.cuts[col]; x < vertical.cuts[col + 1]; x++) {
        if (occupied(x, y)) { left = Math.min(left, x); right = Math.max(right, x); first = Math.min(first, y); last = Math.max(last, y); }
      }
      if (right < left) break;
      frames.push({ x: left, y: first, width: right - left + 1, height: last - first + 1 });
    }
    if (frames.length !== 4) { unavailable.push(key); return; }
    animations.push({ key, fps: key === 'run' ? 10 : 7, loop: !['death', 'enrage'].includes(key), frames: key === 'idle' ? frames.slice(0, 1) : frames });
  });
  return { width, height, animations, unavailable };
}
