import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const c = crc32(typeAndData);
  chunk.writeUInt32BE(c, 8 + len);
  return chunk;
}

function encodeRGBAtoPNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowSize = 1 + width * 4;
  const rawScanlines = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawScanlines[rowOffset] = 0; // filter None
    const srcOffset = y * width * 4;
    rgbaBuffer.copy(rawScanlines, rowOffset + 1, srcOffset, srcOffset + width * 4);
  }

  const compressed = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function generateIcon(width, height, isMaskable = false) {
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2;

  // Render pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = (x - cx) / r;
      const dy = (y - cy) / r;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep synthwave navy to purple gradient
      const bgGrad = y / height;
      let red = Math.round(15 + 20 * bgGrad);
      let green = Math.round(23 - 5 * bgGrad);
      let blue = Math.round(42 + 40 * bgGrad);
      let alpha = 255;

      // Rounded squircle border for non-maskable
      if (!isMaskable) {
        const borderDist = Math.max(Math.abs(x - cx) / (width * 0.46), Math.abs(y - cy) / (height * 0.46));
        if (borderDist > 1.0) {
          // rounded outer border
          const cornerDist = Math.hypot(Math.max(0, Math.abs(x - cx) - width * 0.35), Math.max(0, Math.abs(y - cy) - height * 0.35));
          if (cornerDist > width * 0.12) {
            alpha = 0;
          }
        }
      }

      // Neon grid lines at bottom
      if (y > height * 0.55 && alpha > 0) {
        const gridX = Math.abs(x - cx) / (width * 0.5);
        if (Math.abs((y - height * 0.55) % (height * 0.08)) < 2 || Math.abs((x - cx) % (width * 0.12)) < 2) {
          red = Math.min(255, red + 60);
          green = Math.min(255, green + 140);
          blue = Math.min(255, blue + 200);
        }
      }

      // Central rhythm diamond & arrows
      const scale = isMaskable ? 0.7 : 0.82;
      const nx = (x - cx) / (r * scale);
      const ny = (y - cy) / (r * scale);

      // Yellow top triangle (Up Arrow)
      if (ny < -0.15 && ny > -0.75 && Math.abs(nx) < (ny + 0.75) * 0.8) {
        red = 249;
        green = 201;
        blue = 68; // #f9c944
      }

      // Cyan left triangle (Left Arrow)
      if (nx < -0.15 && nx > -0.75 && Math.abs(ny) < (nx + 0.75) * 0.8) {
        red = 6;
        green = 182;
        blue = 212; // #06b6d4
      }

      // Pink right triangle (Right Arrow)
      if (nx > 0.15 && nx < 0.75 && Math.abs(ny) < (-nx + 0.75) * 0.8) {
        red = 236;
        green = 72;
        blue = 153; // #ec4899
      }

      // Center Microphone / Core circle
      const centerDist = Math.hypot(nx, ny);
      if (centerDist < 0.22) {
        red = 255;
        green = 255;
        blue = 255;
      } else if (centerDist < 0.26) {
        red = 0;
        green = 0;
        blue = 0;
      }

      buffer[idx] = red;
      buffer[idx + 1] = green;
      buffer[idx + 2] = blue;
      buffer[idx + 3] = alpha;
    }
  }

  return encodeRGBAtoPNG(width, height, buffer);
}

// Ensure public dir
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generateIcon(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generateIcon(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generateIcon(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIcon(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateIcon(64, 64, false));

console.log('Successfully generated all PWA icons (192x192, 512x512, maskable, apple-touch-icon, favicon.ico)!');
