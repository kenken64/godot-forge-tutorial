// Coordinates are integer pixels in the exported PNG, from its top-left corner.
// Gameplay collision shapes and semantic tile names are intentionally left for
// the level designer; they cannot be inferred safely from image pixels alone.
const rectangle = (x, y, width, height) => ({ x, y, width, height });

function base(kind, image, width, height) {
  return {
    version: 1,
    kind,
    coordinateSystem: { origin: 'top-left', unit: 'px', x: 'right', y: 'down' },
    image: { file: image.originalName, assetUrl: image.assetUrl, width, height },
  };
}

export function characterManifest(image, width, height, sheet = {}) {
  const manifest = base('character', image, width, height);
  const cellWidth = Number(sheet.frameWidth), cellHeight = Number(sheet.frameHeight);
  const columns = Number(sheet.columns), rows = Array.isArray(sheet.rows) ? sheet.rows : [];
  const validGrid = Number.isInteger(cellWidth) && cellWidth > 0 && Number.isInteger(cellHeight) && cellHeight > 0 &&
    Number.isInteger(columns) && columns > 0 && width === columns * cellWidth && height === rows.length * cellHeight;
  if (!validGrid) {
    manifest.animations = [];
    manifest.frames = [rectangle(0, 0, width, height)];
    return manifest;
  }
  manifest.frameSize = { width: cellWidth, height: cellHeight };
  manifest.anchor = { x: Math.floor(cellWidth / 2), y: Math.round(cellHeight * 240 / 256) };
  manifest.animations = rows.map((row, y) => ({
    name: String(row.key || `row-${y}`),
    fps: Number(row.fps) > 0 ? Number(row.fps) : 1,
    loop: ['idle', 'walk', 'run'].includes(row.key),
    frames: Array.from({ length: Math.min(columns, Math.max(0, Number(row.frames) || 0)) }, (_, x) => rectangle(x * cellWidth, y * cellHeight, cellWidth, cellHeight)),
  }));
  return manifest;
}

export function bossManifest(image, width, height, layout) {
  const manifest = base('boss', image, width, height);
  manifest.anchor = layout?.spriteSheetVersion === 3 ? { x: 128, y: 240 } : null;
  manifest.animations = (layout?.animations || []).map(row => ({
    name: row.key, fps: row.fps, loop: row.loop,
    frames: row.frames.map(frame => rectangle(frame.x, frame.y, frame.width, frame.height)),
  }));
  manifest.unavailable = layout?.unavailable || [];
  return manifest;
}

export function assetPackManifest(image, width, height, category = 'unknown') {
  const manifest = base('asset-pack', image, width, height);
  manifest.category = category;
  const columns = width % 4 === 0 && height % 4 === 0 && width >= 4 && height >= 4 ? 4 : 1;
  const rows = columns === 4 ? 4 : 1;
  const cellWidth = width / columns, cellHeight = height / rows;
  manifest.grid = { columns, rows, cellWidth, cellHeight };
  manifest.cells = Array.from({ length: columns * rows }, (_, index) => ({
    index, column: index % columns, row: Math.floor(index / columns),
    ...rectangle(index % columns * cellWidth, Math.floor(index / columns) * cellHeight, cellWidth, cellHeight),
  }));
  return manifest;
}
