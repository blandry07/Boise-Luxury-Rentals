'use strict';
/**
 * Minimal, dependency-free JPEG dimension reader, used at build time to add
 * width/height attributes to <img> tags (prevents layout shift / CLS).
 * Caches results so each file is only read from disk once per build.
 */
const fs = require('fs');
const path = require('path');

const cache = new Map();

function readJpegSize(buf) {
  // JPEG: scan markers looking for a Start Of Frame (SOF0, SOF2, etc).
  let offset = 2; // skip the initial 0xFFD8 SOI marker
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) { offset++; continue; }
    const marker = buf[offset + 1];
    // SOF0-SOF3, SOF5-SOF7, SOF9-SOF11, SOF13-SOF15 carry width/height; skip others.
    const isSOF = (marker >= 0xc0 && marker <= 0xcf) && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    const len = buf.readUInt16BE(offset + 2);
    if (isSOF) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + len;
  }
  return null;
}

/** Returns { width, height } for an image under /public, given its site-relative src (e.g. '/images/foo.jpg'). */
function imgSize(src) {
  if (cache.has(src)) return cache.get(src);
  let dims = null;
  try {
    const filePath = path.join(__dirname, '..', 'public', src.replace(/^\//, ''));
    const buf = fs.readFileSync(filePath);
    dims = readJpegSize(buf);
  } catch (e) {
    dims = null;
  }
  cache.set(src, dims);
  return dims;
}

module.exports = { imgSize };
