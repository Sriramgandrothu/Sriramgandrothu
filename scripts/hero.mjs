// One-off: turns a photo into assets/hero.svg (halftone portrait + orbit + animated code editor).
// Run locally: node scripts/hero.mjs "E:\Pictures\Sriram-2.png"
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) throw new Error('usage: node scripts/hero.mjs <photo.png>');

// ---- minimal PNG decoder (8-bit RGB/RGBA/gray, non-interlaced) ----
function decodePng(buf) {
  let p = 8, w, h, ct, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8 || d[12] !== 0) throw new Error('need 8-bit non-interlaced PNG'); }
    if (type === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct]; if (!bpp) throw new Error('unsupported color type ' + ct);
  const raw = inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], o = y * stride, rs = y * (stride + 1) + 1;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? out[o + i - bpp] : 0, b = y ? out[o - stride + i] : 0, c = i >= bpp && y ? out[o - stride + i - bpp] : 0;
      let v = raw[rs + i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[o + i] = v & 255;
    }
  }
  return { w, h, bpp, data: out };
}
const img = decodePng(readFileSync(src));
const lumAt = (x, y) => { const i = (y * img.w + x) * img.bpp; return img.bpp < 3 ? img.data[i] : 0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 * img.data[i + 2]; };

// ---- sample to grid ----
const N = 96, crop = { x: 130, y: 120, s: 1000 }, cell = crop.s / N;
const L = [];
for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
  let s = 0, n = 0;
  for (let yy = 0; yy < cell; yy += 3) for (let xx = 0; xx < cell; xx += 3) { s += lumAt(Math.min(img.w - 1, Math.floor(crop.x + gx * cell + xx)), Math.min(img.h - 1, Math.floor(crop.y + gy * cell + yy))); n++; }
  L.push(s / n / 255);
}
const sorted = [...L].sort((a, b) => a - b), lo = sorted[Math.floor(N * N * 0.03)], hi = sorted[Math.floor(N * N * 0.97)];

// ---- portrait (two renderings: dots grow with darkness for light theme, with brightness for dark theme) ----
const CX = 255, CY = 250, R = 178, pitch = (R * 2) / N;
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const C1 = [56, 189, 248], C2 = [167, 139, 250], C3 = [244, 114, 182];
const colorAt = t => { const c = t < 0.5 ? mix(C1, C2, t * 2) : mix(C2, C3, (t - 0.5) * 2); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
const soft = v => Math.min(1, Math.max(0, v));
function build(invert) {
  const buckets = {};
  for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
    const px = CX - R + (gx + 0.5) * pitch, py = CY - R + (gy + 0.5) * pitch, dist = Math.hypot(px - CX, py - CY);
    if (dist > R) continue;
    const l = soft((L[gy * N + gx] - lo) / (hi - lo));
    const dark = Math.pow(invert ? l : 1 - l, invert ? 1.1 : 0.85), edge = Math.min(1, (R - dist) / 26);
    const head = soft((1 - Math.hypot((gx - 47) / 23, (gy - 34) / 30)) * 6);
    const body = gy < 54 ? 0 : soft((1 - Math.abs(gx - 52) / Math.min(48, 20 + (gy - 54) * 1.1)) * 5) * soft((gy - 54) / 4);
    const r = (0.35 + dark * (pitch * 0.62)) * (0.4 + 0.6 * edge) * Math.max(head, body);
    if (r < 0.5) continue;
    const key = colorAt(Math.min(0.999, Math.max(0, ((px - (CX - R)) + (py - (CY - R))) / (4 * R))));
    (buckets[key] ||= []).push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}"/>`);
  }
  return Object.entries(buckets).map(([c, v]) => `<g fill="${c}">${v.join('')}</g>`).join('');
}
const dots = `<g class="pl">${build(false)}</g><g class="pd">${build(true)}</g>`;

// ---- orbit chips ----
const chips = ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'React', 'Node.js', 'Docker', 'Figma'];
const OR = 205;
const chipEls = chips.map((t, i) => {
  const a = (360 / chips.length) * i, w = t.length * 8 + 26;
  return `<g transform="rotate(${a})"><g transform="translate(${OR},0)"><g><animateTransform attributeName="transform" type="rotate" from="${-a}" to="${-a - 360}" dur="40s" repeatCount="indefinite"/>
<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#0d1117" stroke="url(#g)" stroke-width="1.5"/><text y="4.5" text-anchor="middle" font-size="12" fill="#e6edf3" font-family="var(--m)">${t}</text></g></g></g>`;
}).join('');

// ---- code editor window ----
const K = '#c4b5fd', P = '#7dd3fc', S = '#86efac', T = '#e6edf3', M = '#6e7681', NUM = '#fbbf24', B = '#f9a8d4';
const code = [
  [['const ', K], ['sriram', P], [' = {', T]],
  [['  role', P], [': ', T], ['"Full Stack Developer"', S], [',', T]],
  [['  base', P], [': ', T], ['"Bangalore · Hyderabad"', S], [',', T]],
  [['  stack', P], [': [', T], ['"Next.js"', S], [', ', T], ['"TypeScript"', S], [',', T]],
  [['    ', T], ['"PostgreSQL"', S], [', ', T], ['"Supabase"', S], ['],', T]],
  [['  shipped', P], [': ', T], ['16', NUM], [',  ', T], ['// projects', M]],
  [['  freelance', P], [': ', T], ['"swiftproject.in"', S], [',', T]],
  [['  openToWork', P], [': ', T], ['true', B], [',', T]],
  [['};', T]],
];
const WX = 520, WY = 62, WW = 365, WH = 376, CW = 7.9, LH = 26, LY = WY + 82;
let codeEls = '', tt = 1.0;
code.forEach((line, i) => {
  const len = line.reduce((a, [s]) => a + s.length, 0), w = len * CW, y = LY + i * LH, dur = Math.max(0.35, len * 0.03);
  codeEls += `<text x="${WX + 14}" y="${y}" font-size="12" fill="#484f58" font-family="var(--m)" text-anchor="start">${i + 1}</text>
<clipPath id="k${i}"><rect x="${WX + 40}" y="${y - 16}" width="0" height="22"><animate attributeName="width" to="${w + 6}" begin="${tt.toFixed(2)}s" dur="${dur.toFixed(2)}s" fill="freeze"/></rect></clipPath>
<text x="${WX + 40}" y="${y}" font-size="13" font-family="var(--m)" xml:space="preserve" clip-path="url(#k${i})">${line.map(([s, c]) => `<tspan fill="${c}">${s.replace(/&/g, '&amp;')}</tspan>`).join('')}</text>`;
  tt += dur + 0.12;
});
const endY = LY + code.length * LH;
codeEls += `<text x="${WX + 14}" y="${endY}" font-size="12" fill="#484f58" font-family="var(--m)">${code.length + 1}</text>
<rect x="${WX + 40}" y="${endY - 15}" width="8" height="19" fill="#38bdf8" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.01;0.5;1" dur="1.1s" begin="${tt.toFixed(2)}s" repeatCount="indefinite"/></rect>`;
const win = `<g>
<rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="12" fill="#0d1117" stroke="url(#g)" stroke-width="1.8"/>
<path d="M${WX} ${WY + 12}a12 12 0 0 1 12-12h${WW - 24}a12 12 0 0 1 12 12v30H${WX}z" fill="#161b22"/>
<circle cx="${WX + 18}" cy="${WY + 21}" r="5" fill="#ff5f57"/><circle cx="${WX + 36}" cy="${WY + 21}" r="5" fill="#febc2e"/><circle cx="${WX + 54}" cy="${WY + 21}" r="5" fill="#28c840"/>
<text x="${WX + 190}" y="${WY + 25}" font-size="12" fill="#c9d1d9" font-family="var(--m)" text-anchor="middle">sriram.ts</text>
<rect x="${WX + 150}" y="${WY + 40}" width="80" height="2" fill="url(#g)"/>
<rect x="${WX}" y="${WY + WH - 28}" width="${WW}" height="28" fill="#161b22"/><path d="M${WX} ${WY + WH - 28}h${WW}v16a12 12 0 0 1-12 12h-${WW - 24}a12 12 0 0 1-12-12z" fill="#161b22"/>
<circle cx="${WX + 16}" cy="${WY + WH - 14}" r="4" fill="#4ade80"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
<text x="${WX + 28}" y="${WY + WH - 10}" font-size="11" fill="#8b949e" font-family="var(--m)">no errors</text>
<text x="${WX + WW - 14}" y="${WY + WH - 10}" font-size="11" fill="#8b949e" font-family="var(--m)" text-anchor="end">TypeScript · UTF-8</text>
${codeEls}</g>`;

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500" font-family="-apple-system,'Segoe UI',Helvetica,Arial,sans-serif" style="--m:${MONO}">
<style>.pd{display:none}@media (prefers-color-scheme:dark){.pl{display:none}.pd{display:inline}}</style>
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#f472b6"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#a78bfa" stop-opacity=".28"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient>
<clipPath id="rev"><rect x="${CX - R - 4}" y="${CY - R - 4}" width="${2 * R + 8}" height="0"><animate attributeName="height" to="${2 * R + 8}" dur="2.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1"/></rect></clipPath>
<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity="0"/><stop offset=".5" stop-color="#38bdf8" stop-opacity=".9"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient>
</defs>
<circle cx="${CX}" cy="${CY}" r="${R + 60}" fill="url(#glow)"><animate attributeName="r" values="${R + 50};${R + 70};${R + 50}" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="${CX}" cy="${CY}" r="${R + 12}" fill="none" stroke="url(#g)" stroke-width="1.5" stroke-dasharray="3 7" opacity=".7"><animateTransform attributeName="transform" type="rotate" from="0 ${CX} ${CY}" to="360 ${CX} ${CY}" dur="60s" repeatCount="indefinite"/></circle>
<circle cx="${CX}" cy="${CY}" r="${OR}" fill="none" stroke="url(#g)" stroke-width="1" opacity=".35"/>
<g clip-path="url(#rev)">${dots}</g>
<rect x="${CX - R}" y="${CY - R}" width="${2 * R}" height="26" fill="url(#scan)" opacity="0"><animate attributeName="y" values="${CY - R - 26};${CY + R}" dur="2.6s" fill="freeze"/><animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.1;.9;1" dur="2.6s" fill="freeze"/></rect>
<g transform="translate(${CX},${CY})"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" additive="sum" dur="40s" repeatCount="indefinite"/>${chipEls}</g>
${win}
</svg>`;
const out = fileURLToPath(new URL('../assets/hero.svg', import.meta.url));
writeFileSync(out, svg);
console.log('hero.svg', (svg.length / 1024).toFixed(0) + ' KB');
