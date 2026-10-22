// Generates every SVG in assets/ (except hero.svg, see hero.mjs). No dependencies. Run: node scripts/generate.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const USER = 'Sriramgandrothu';
const OUT = fileURLToPath(new URL('../assets/', import.meta.url));
mkdirSync(OUT, { recursive: true });
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const write = (n, s) => writeFileSync(OUT + n, s);
const wrap = (t, n) => { const out = []; let l = ''; for (const w of t.split(' ')) { if ((l + ' ' + w).trim().length > n) { out.push(l); l = w; } else l = (l + ' ' + w).trim(); } if (l) out.push(l); return out; };

const STYLE = `<style>
.fg{fill:#1f2328}.mu{fill:#656d76}.ln{stroke:#d0d7de}.cd{fill:#f6f8fa;stroke:#d0d7de}.cd2{fill:#ffffff;stroke:#d0d7de}
.l0{fill:#ebedf0}.l1{fill:#9be9a8}.l2{fill:#40c463}.l3{fill:#30a14e}.l4{fill:#216e39}
@media (prefers-color-scheme:dark){.fg{fill:#e6edf3}.mu{fill:#8b949e}.ln{stroke:#30363d}.cd{fill:#0d1117;stroke:#30363d}.cd2{fill:#010409;stroke:#30363d}
.l0{fill:#161b22}.l1{fill:#0e4429}.l2{fill:#006d32}.l3{fill:#26a641}.l4{fill:#39d353}}
</style>`;
const GRAD = (id = 'g') => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#f472b6"/></linearGradient>`;
const svg = (w, h, inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${SANS}">${STYLE}<defs>${GRAD()}${extra}</defs>${inner}</svg>`;

// ---------- 1. wordmark ----------
{
  const G = {
    S: '.####|#....|#....|.###.|....#|....#|####.', R: '####.|#...#|#...#|####.|#.#..|#..#.|#...#',
    I: '#####|..#..|..#..|..#..|..#..|..#..|#####', A: '.###.|#...#|#...#|#####|#...#|#...#|#...#',
    M: '#...#|##.##|#.#.#|#...#|#...#|#...#|#...#',
  };
  const word = 'SRIRAM', c = 15, gap = 18, lw = 5 * c, total = word.length * lw + (word.length - 1) * gap;
  const x0 = (900 - total) / 2, y0 = 18;
  let r = '';
  [...word].forEach((ch, li) => G[ch].split('|').forEach((row, ry) => [...row].forEach((v, rx) => {
    if (v !== '#') return;
    const x = x0 + li * (lw + gap) + rx * c, y = y0 + ry * c, d = (li * 5 + rx) * 0.045 + ry * 0.02;
    r += `<rect x="${x}" y="${y}" width="${c - 3}" height="${c - 3}" rx="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${d.toFixed(2)}s" dur="0.4s" fill="freeze"/></rect>`;
  })));
  write('wordmark.svg', svg(900, 172, `<g fill="url(#sh)">${r}</g>
<text x="450" y="154" text-anchor="middle" font-family="${MONO}" font-size="13" letter-spacing="2" class="mu">FULL STACK DEVELOPER  ·  SYSTEMS  ·  FREELANCE ENGINEER</text>`,
    `<linearGradient id="sh" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="500" y2="0" spreadMethod="reflect">
<stop offset="0" stop-color="#38bdf8"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#f472b6"/>
<animateTransform attributeName="gradientTransform" type="translate" from="-500 0" to="500 0" dur="5s" repeatCount="indefinite"/></linearGradient>`));
}

// ---------- 2. section headings ----------
['about', 'skills', 'how i build', 'experience', 'projects', 'freelance', 'activity', 'contact'].forEach((h, i) => {
  write(`h-${h.replace(/ /g, '-')}.svg`, svg(900, 56, `
<text x="0" y="34" font-size="15" font-family="${MONO}" class="mu">0${i + 1}</text>
<text x="34" y="36" font-size="24" font-weight="700" font-family="${MONO}" class="fg">${h}</text>
<rect x="0" y="48" width="900" height="2" rx="1" fill="url(#g)" opacity=".5"/>
<rect x="0" y="48" width="90" height="2" rx="1" fill="url(#g)"><animate attributeName="x" values="0;810;0" dur="6s" repeatCount="indefinite"/></rect>`));
});

// ---------- 3. link buttons ----------
[['portfolio', 'portfolio ↗', 140], ['freelance', 'swiftproject.in ↗', 190], ['linkedin', 'linkedin ↗', 130], ['email', 'email me', 120], ['call', 'book a 15-min call ↗', 220], ['visit', 'visit swiftproject.in ↗', 230]].forEach(([n, t, w], i) => {
  write(`btn-${n}.svg`, svg(w + 4, 48, `<rect x="2" y="2" width="${w}" height="40" rx="20" fill="none" stroke="url(#g)" stroke-width="1.8"/>
<rect x="2" y="2" width="${w}" height="40" rx="20" fill="url(#g)" opacity="0"><animate attributeName="opacity" values="0;.2;0" dur="3.2s" begin="${i * 0.5}s" repeatCount="indefinite"/></rect>
<text x="${w / 2 + 2}" y="27" text-anchor="middle" font-size="14" font-family="${MONO}" class="fg">${esc(t)}</text>`));
});

// ---------- 4. marquee ----------
{
  const W = ['Next.js', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'Docker', 'Redis', 'Flutter', 'Tailwind CSS', 'Zod', 'Better Auth', 'RAG', 'Figma'];
  const seg = W.map(w => w + '   ✦   ').join(''), len = seg.length * 9.6;
  const run = o => `<text x="${o}" y="28" font-size="16" font-family="${MONO}" class="mu" textLength="${len}" lengthAdjust="spacing" xml:space="preserve">${esc(seg)}</text>`;
  write('marquee.svg', svg(900, 44, `<mask id="fd"><linearGradient id="fg2"><stop offset="0" stop-color="#000"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><rect width="900" height="44" fill="url(#fg2)"/></mask>
<g mask="url(#fd)"><g><animateTransform attributeName="transform" type="translate" from="0 0" to="${-len} 0" dur="34s" repeatCount="indefinite"/>${run(0)}${run(len)}${run(2 * len)}</g></g>`));
}

// ---------- 5. skills matrix ----------
{
  const S = [
    ['Frontend', 'FE', ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Vue.js', 'Bootstrap', 'Chart.js']],
    ['Backend & Data', 'BE', ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Firebase', 'Drizzle ORM', 'Prisma']],
    ['Languages', '</>', ['TypeScript', 'JavaScript', 'Python', 'Dart', 'Java', 'C', 'SQL']],
    ['Auth & Security', 'AS', ['Better Auth', 'RBAC', 'AES-GCM', 'Zod', 'Audit logs']],
    ['AI Workflows', 'AI', ['OpenAI APIs', 'RAG pipelines', 'Ollama', 'Cursor AI', 'Copilot']],
    ['DevOps & Cloud', 'OP', ['Git', 'Docker', 'CI/CD', 'Vercel', 'Netlify', 'Cloudflare', 'Nginx', 'PM2']],
    ['Mobile & Web Apps', 'MW', ['Flutter', 'React Native', 'PWA', 'WebAssembly', 'FFmpeg.wasm']],
    ['UI/UX Design', 'UX', ['Figma', 'Design systems', 'Prototyping', 'Adobe XD', 'Zeplin']],
    ['Payments & Integrations', '$', ['Razorpay', 'Webhooks', 'WhatsApp gateway', 'REST integrations']],
  ];
  const CWd = 290, IN = 258, gx = 15; let all = '', delay = 0;
  const lay = items => { let x = 0, y = 0, out = []; items.forEach(it => { const w = it.length * 7 + 20; if (x + w > IN) { x = 0; y += 28; } out.push([it, x, y, w]); x += w + 6; }); return { out, h: y + 28 }; };
  const cards = S.map(([n, g, items]) => ({ n, g, items, ...lay(items) }));
  let yy = 0;
  for (let row = 0; row < 3; row++) {
    const rowCards = cards.slice(row * 3, row * 3 + 3), H = 68 + Math.max(...rowCards.map(c => c.h));
    rowCards.forEach((c, ci) => {
      const x = ci * (CWd + gx);
      all += `<g transform="translate(${x},${yy})"><rect x="1" y="1" width="${CWd - 2}" height="${H - 2}" rx="12" class="cd"/>
<rect x="16" y="16" width="30" height="30" rx="8" fill="url(#g)"/><text x="31" y="36" text-anchor="middle" font-size="${c.g.length > 2 ? 11 : 13}" font-weight="700" font-family="${MONO}" fill="#0d1117">${esc(c.g)}</text>
<text x="56" y="30" font-size="15" font-weight="700" class="fg">${esc(c.n)}</text><text x="56" y="45" font-size="11" font-family="${MONO}" class="mu">${c.items.length} tools</text>
${c.out.map(([t, cx, cy, w]) => `<g opacity="0"><animate attributeName="opacity" to="1" begin="${(delay += 0.04).toFixed(2)}s" dur=".4s" fill="freeze"/><rect x="${16 + cx}" y="${62 + cy}" width="${w}" height="22" rx="11" class="cd2"/><text x="${16 + cx + w / 2}" y="${62 + cy + 15}" text-anchor="middle" font-size="11" font-family="${MONO}" class="fg">${esc(t)}</text></g>`).join('')}</g>`;
    });
    yy += H + gx;
  }
  write('skills.svg', svg(900, yy - gx, all));
}

// ---------- 6. request flow ----------
{
  const nodes = [['Browser', 'React · UI/UX', 90], ['Next.js', 'server actions · routes', 330], ['Zod', 'validate · dedupe', 570], ['Supabase', 'Postgres · Auth · RLS', 810]];
  let n = '', p = '';
  nodes.forEach(([a, b, x], i) => {
    n += `<rect x="${x - 70}" y="70" width="140" height="64" rx="12" class="cd"/>
<text x="${x}" y="98" text-anchor="middle" font-size="16" font-weight="700" font-family="${MONO}" class="fg">${a}</text>
<text x="${x}" y="118" text-anchor="middle" font-size="11" font-family="${MONO}" class="mu">${esc(b)}</text>`;
    if (i < 3) {
      const x2 = nodes[i + 1][2];
      p += `<path id="p${i}" d="M${x + 70} 102 H${x2 - 70}" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5 5" fill="none"/>`;
      for (let k = 0; k < 2; k++) p += `<circle r="5" fill="#38bdf8"><animateMotion dur="1.6s" begin="${(i * 0.5 + k * 0.8).toFixed(1)}s" repeatCount="indefinite"><mpath href="#p${i}"/></animateMotion></circle>`;
    }
  });
  p += `<path id="back" d="M810 134 V180 H90 V134" stroke="#4ade80" stroke-width="2" stroke-dasharray="3 6" fill="none" opacity=".7"/>
<circle r="5" fill="#4ade80"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#back"/></animateMotion></circle>
<text x="450" y="30" text-anchor="middle" font-size="12" font-family="${MONO}" class="mu">no unvalidated input reaches the database</text>
<text x="450" y="204" text-anchor="middle" font-size="12" font-family="${MONO}" class="mu">typed response · optimistic UI</text>`;
  write('flow.svg', svg(900, 220, p + n));
}

// ---------- 7. experience as git log ----------
{
  const E = [
    ['a41f9c2', 'HEAD -> main', 'Oct 2025 – present', 'Full Stack Developer', 'Saptarishi Solutions Pvt. Ltd. · Hyderabad', 'Leads end-to-end delivery of enterprise apps: an HRMS platform, an LMA and data-migration dashboards. Owns backend services, real-time data flows and PR checks.', 'Next.js · Redux · PostgreSQL'],
    ['7be03d1', 'freelance', 'Jan 2024 – present', 'Freelance Full Stack Developer', 'SwiftProject · remote', 'Client websites, custom platforms and business tools. 11+ apps live in production, fixed quotes, 1–2 week sprints.', 'Next.js · Node.js · PostgreSQL · AI'],
    ['c92a6e8', '', 'Dec 2024 – Oct 2025', 'Engineering Intern', 'Sumeru Technology Pvt. Ltd. · Bengaluru', 'Event and course management system: serverless backend queries, Zod validation, duplicate detection. System exceptions down 30% in QA.', 'Next.js · Supabase · Zod'],
    ['3d58b07', '', 'Aug 2024', 'Full Stack Mentor', 'Vedic Vision Hackathon · Bhimavaram', 'Mentored teams through hackathon submissions and integration debugging.', 'React · Node.js · MongoDB'],
    ['e10c4fa', 'tag: b.tech', 'Nov 2021 – May 2025', 'B.Tech, Electronics & Communication', 'SRKR Engineering College', 'CGPA 8.45 / 10.', ''],
  ];
  let y = 24, s = '', t = 0; const heights = [];
  E.forEach((e, i) => {
    const lines = wrap(e[5], 92), h = 92 + lines.length * 18 + (e[6] ? 30 : 6); heights.push(h);
    s += `<g opacity="0" transform="translate(0,${y})"><animate attributeName="opacity" to="1" begin="${t.toFixed(2)}s" dur=".6s" fill="freeze"/>
<circle cx="24" cy="12" r="7" fill="url(#g)"/>${i === 0 ? `<circle cx="24" cy="12" r="7" fill="none" stroke="#4ade80" stroke-width="2"><animate attributeName="r" values="7;20" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></circle>` : ''}
<text x="52" y="17" font-size="13" font-family="${MONO}" fill="#fbbf24">${e[0]}</text>
${e[1] ? `<rect x="116" y="1" width="${e[1].length * 7.4 + 16}" height="22" rx="11" fill="none" stroke="#4ade80" stroke-width="1.3"/><text x="${124}" y="16" font-size="11" font-family="${MONO}" fill="#4ade80">${esc(e[1])}</text>` : ''}
<text x="880" y="17" text-anchor="end" font-size="13" font-family="${MONO}" class="mu">${e[2]}</text>
<text x="52" y="44" font-size="18" font-weight="700" class="fg">${esc(e[3])}</text>
<text x="52" y="64" font-size="13" font-family="${MONO}" fill="#38bdf8">${esc(e[4])}</text>
${lines.map((l, k) => `<text x="52" y="${88 + k * 18}" font-size="14" class="fg" opacity=".85">${esc(l)}</text>`).join('')}
${e[6] ? `<text x="52" y="${88 + lines.length * 18 + 8}" font-size="12" font-family="${MONO}" class="mu">stack: ${esc(e[6])}</text>` : ''}</g>`;
    y += h; t += 0.45;
  });
  s = `<path d="M24 36 V${y - 40}" stroke="#a78bfa" stroke-width="2" stroke-dasharray="${y}" stroke-dashoffset="${y}" fill="none"><animate attributeName="stroke-dashoffset" to="0" dur="2.4s" fill="freeze"/></path>` + s;
  write('experience.svg', svg(900, y, s));
}

// ---------- 8. projects as browser cards ----------
{
  const P = [
    ['DevForge', 'devforge.swiftproject.in', 'Developer learning platform in the browser: Git simulator, system design lab, project generator and 11 roadmaps.', ['Next.js', 'TypeScript', 'PWA'], 'web app', ['#38bdf8', '#6366f1']],
    ['DevStation', 'devstation.swiftproject.in', 'Developer toolbox with 80+ client-side utilities. Installs and works offline as a PWA.', ['Next.js', 'TypeScript', 'Tailwind', 'PWA'], 'tool', ['#a78bfa', '#ec4899']],
    ['Swift Vault', 'vault.swiftproject.in', 'Encrypted password and env-variable manager with AES-GCM storage and project-scoped team folders.', ['Next.js', 'Supabase', 'Drizzle', 'AES-GCM'], 'security', ['#4ade80', '#06b6d4']],
    ['WhatsApp Gateway', 'wg.swiftproject.in', 'Self-hosted WhatsApp automation: real-time message queueing, media compression and REST APIs.', ['Node.js', 'Express', 'PostgreSQL'], 'backend', ['#22c55e', '#84cc16']],
    ['Swift Converter', 'swiftconvert.vercel.app', 'Image, video and audio converter that runs entirely in the browser using WebAssembly.', ['Next.js', 'FFmpeg.wasm', 'WebAssembly'], 'tool', ['#f59e0b', '#ef4444']],
    ['Mock Station', 'Google Play', 'Mobile exam-prep app for government exams with mock tests, payments and a Play Store release.', ['Flutter', 'Node.js', 'MongoDB'], 'mobile', ['#06b6d4', '#3b82f6']],
    ['AOLD Birthdays', 'aoldbirthdays.swiftproject.in', 'Birthday and member recognition platform for a community, with authentication and event tracking.', ['Next.js', 'TypeScript', 'Tailwind'], 'web app', ['#f472b6', '#f59e0b']],
    ['KathaKaalaamsam V2', 'kathakaalaamsam.vercel.app', 'Storytelling and podcast platform: upload stories, vocals and episodes, with admin roles.', ['Next.js', 'PostgreSQL', 'Drizzle'], 'web app', ['#a78bfa', '#38bdf8']],
    ['Sri Poojitha Dry Fruits', 'sripoojithadryfruits.in', 'E-commerce storefront with product catalogs and WhatsApp order routing.', ['Next.js', 'Tailwind CSS'], 'client', ['#fb923c', '#facc15']],
    ['SCK', 'sharathkancherla.com', 'Client portfolio with integrated real-time consultation slot booking.', ['Next.js', 'TypeScript', 'Drizzle', 'PostgreSQL'], 'client', ['#14b8a6', '#6366f1']],
    ['Swift Linker', 'url.swiftproject.in', 'URL shortener with custom links and live analytics.', ['React', 'Firebase', 'REST APIs'], 'tool', ['#38bdf8', '#22c55e']],
    ['Swift Planner', 'swiftplanner.vercel.app', 'Student productivity app: tasks, reminders, notes and finance tracking.', ['React', 'Vite', 'Redux Toolkit'], 'web app', ['#c084fc', '#f472b6']],
  ];
  P.forEach(([name, url, desc, tags, kind, [c1, c2]], i) => {
    const id = 'p' + i, lines = wrap(desc, 50), ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    let tx = 20;
    const chips = tags.map(t => { const w = t.length * 6.8 + 18, o = `<rect x="${tx}" y="168" width="${w}" height="22" rx="11" fill="none" stroke="${c1}" stroke-opacity=".7"/><text x="${tx + w / 2}" y="183" text-anchor="middle" font-size="11" font-family="${MONO}" class="fg">${esc(t)}</text>`; tx += w + 6; return o; }).join('');
    write(`project-${i + 1}.svg`, svg(440, 208, `
<rect x="1" y="1" width="438" height="206" rx="14" class="cd"/>
<path d="M1 15a14 14 0 0 1 14-14h410a14 14 0 0 1 14 14v22H1z" fill="url(#${id})" opacity=".18"/>
<circle cx="20" cy="19" r="4.5" fill="#ff5f57"/><circle cx="36" cy="19" r="4.5" fill="#febc2e"/><circle cx="52" cy="19" r="4.5" fill="#28c840"/>
<rect x="72" y="8" width="296" height="22" rx="11" class="cd2"/><text x="220" y="23" text-anchor="middle" font-size="11" font-family="${MONO}" class="mu">${url === 'Google Play' ? 'play.google.com' : 'https://' + esc(url)}</text>
<rect x="72" y="8" width="60" height="22" rx="11" fill="url(#${id})" opacity="0"><animate attributeName="x" values="72;308" dur="4s" begin="${i * 0.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.28;0" dur="4s" begin="${i * 0.3}s" repeatCount="indefinite"/></rect>
<circle cx="412" cy="19" r="4" fill="#4ade80"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
<rect x="20" y="52" width="46" height="46" rx="12" fill="url(#${id})"/><text x="43" y="82" text-anchor="middle" font-size="17" font-weight="800" font-family="${MONO}" fill="#0d1117">${ini}</text>
<text x="80" y="72" font-size="19" font-weight="700" class="fg">${esc(name)}</text>
<text x="80" y="92" font-size="11" font-family="${MONO}" fill="${c1}" letter-spacing="1">${kind.toUpperCase()}  ·  LIVE</text>
${lines.map((l, k) => `<text x="20" y="${122 + k * 17}" font-size="13" class="fg" opacity=".85">${esc(l)}</text>`).join('')}
${chips}`, `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`));
  });
}

// ---------- 9. freelance studio ----------
{
  const stats = [['11+', 'apps live in production'], ['1–2 wk', 'MVP to real users'], ['100%', 'fixed quotes'], ['&lt; 24 h', 'reply, direct to engineer']];
  const tiers = [
    ['Sprint Audit', '2–3 days', ['Architecture + code health review', 'Bottleneck and security teardown', 'Lighthouse fix plan, video walkthrough']],
    ['Rapid MVP', '1–2 weeks', ['Production Next.js / Node.js build', 'Auth, schema, API integrations', 'Daily Slack / WhatsApp updates']],
    ['Full Production Build', '2–4 weeks', ['Roles, permissions, audit logging', 'Payments, webhooks, CI/CD', 'Docs, handover, 14-day warranty']],
  ];
  let s = stats.map(([v, l], i) => `<g transform="translate(${i * 229},0)"><rect x="1" y="1" width="213" height="84" rx="12" class="cd"/>
<text x="107" y="46" text-anchor="middle" font-size="32" font-weight="700" font-family="${MONO}" fill="url(#g)" opacity="0">${v}<animate attributeName="opacity" to="1" begin="${i * 0.2}s" dur=".6s" fill="freeze"/></text>
<text x="107" y="68" text-anchor="middle" font-size="12" font-family="${MONO}" class="mu">${l}</text></g>`).join('');
  s += tiers.map(([n, d, b], i) => `<g transform="translate(${i * 305},108)"><rect x="1" y="1" width="288" height="176" rx="14" class="cd"/>
<rect x="1" y="1" width="288" height="5" rx="2" fill="url(#g)"/>
<text x="20" y="38" font-size="18" font-weight="700" class="fg">${n}</text>
<text x="20" y="58" font-size="12" font-family="${MONO}" fill="#38bdf8">${d} · fixed quote</text>
${b.map((t, k) => `<circle cx="26" cy="${86 + k * 28}" r="3.5" fill="url(#g)"/><text x="40" y="${90 + k * 28}" font-size="13" class="fg" opacity=".9">${esc(t)}</text>`).join('')}
<rect x="1" y="1" width="288" height="176" rx="14" fill="none" stroke="url(#g)" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;.9;0" dur="6s" begin="${i * 2}s" repeatCount="indefinite"/></rect></g>`).join('');
  const sv = ['Web apps', 'Backends & APIs', 'Internal tools', 'AI integrations', 'E-commerce & payments', 'Flutter & PWAs']; let x = 0;
  s += sv.map(t => { const w = t.length * 7.6 + 26, o = `<g><rect x="${x + 1}" y="305" width="${w}" height="28" rx="14" fill="none" stroke="url(#g)" stroke-opacity=".8"/><text x="${x + 1 + w / 2}" y="323" text-anchor="middle" font-size="12" font-family="${MONO}" class="fg">${esc(t)}</text></g>`; x += w + 8; return o; }).join('');
  write('freelance.svg', svg(900, 340, s));
}

// ---------- 10. live activity ----------
async function getJson(u) { const r = await fetch(u, { headers: { 'User-Agent': 'readme-gen' } }); if (!r.ok) throw new Error(r.status); return r.json(); }
let days = [], total = 0, langs = {}, repos = 0;
try {
  const html = await (await fetch(`https://github.com/users/${USER}/contributions`, { headers: { 'User-Agent': 'readme-gen' } })).text();
  const tips = {}; const tre = /for="([^"]+)"[^>]*>\s*(No|\d+) contribution/g; let x;
  while ((x = tre.exec(html))) tips[x[1]] = x[2] === 'No' ? 0 : +x[2];
  const m = {};
  for (const td of html.match(/<td[^>]*data-date[^>]*>/g) || []) {
    const d = /data-date="([^"]+)"/.exec(td), l = /data-level="(\d)"/.exec(td), id = /id="([^"]+)"/.exec(td);
    if (d && l) m[d[1]] = { level: +l[1], n: id ? tips[id[1]] ?? (+l[1] > 0 ? 1 : 0) : 0 };
  }
  days = Object.keys(m).sort().map(d => ({ d, ...m[d] }));
  total = days.reduce((a, b) => a + b.n, 0);
} catch (e) { console.warn('contributions fetch failed', e.message); }
try {
  const list = (await getJson(`https://api.github.com/users/${USER}/repos?per_page=100`)).filter(r => !r.fork);
  repos = list.length; list.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
} catch (e) { console.warn('repos fetch failed', e.message); }

{
  const cs = 11, gp = 3, ox = 20, oy = 34;
  const first = days.length ? new Date(days[0].d).getUTCDay() : 0;
  let cells = '', cur = 0, best = 0, run = 0;
  days.forEach((o, i) => {
    const idx = i + first, col = Math.floor(idx / 7), row = idx % 7;
    cells += `<rect x="${ox + col * (cs + gp)}" y="${oy + row * (cs + gp)}" width="${cs}" height="${cs}" rx="2" class="l${o.level}" opacity="0"><animate attributeName="opacity" to="1" begin="${(col * 0.03).toFixed(2)}s" dur=".3s" fill="freeze"/></rect>`;
    run = o.n > 0 ? run + 1 : 0; best = Math.max(best, run);
  });
  for (let i = days.length - 1; i >= 0; i--) { if (days[i].n > 0) cur++; else if (i < days.length - 1) break; }
  const legend = [0, 1, 2, 3, 4].map((l, i) => `<rect x="${700 + i * 16}" y="156" width="11" height="11" rx="2" class="l${l}"/>`).join('');
  write('activity.svg', svg(900, 180, `${cells}<text x="20" y="22" font-size="13" font-family="${MONO}" class="mu">${total} contributions in the last year</text>
<text x="690" y="166" font-size="11" font-family="${MONO}" class="mu" text-anchor="end">less</text>${legend}<text x="786" y="166" font-size="11" font-family="${MONO}" class="mu">more</text>`));
  const T = [['16', 'projects shipped'], ['11+', 'apps live in production'], [String(total), 'contributions, last 12 mo'], [`${best} d`, `longest streak · now ${cur} d`]];
  write('totals.svg', svg(900, 100, T.map(([v, l], i) => `<g transform="translate(${i * 229},0)"><rect x="1" y="1" width="213" height="92" rx="12" class="cd"/>
<text x="107" y="52" text-anchor="middle" font-size="34" font-weight="700" font-family="${MONO}" fill="url(#g)" opacity="0">${v}<animate attributeName="opacity" to="1" begin="${i * 0.2}s" dur=".6s" fill="freeze"/></text>
<text x="107" y="76" text-anchor="middle" font-size="12" font-family="${MONO}" class="mu">${esc(l)}</text></g>`).join('')));
}
{
  const COL = { TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#a78bfa', Python: '#3776ab', Java: '#ed8b00', C: '#6e7681', PLpgSQL: '#336790' };
  const e = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6), sum = e.reduce((a, b) => a + b[1], 0) || 1;
  let x = 0, bar = '', lg = '';
  e.forEach(([k, v], i) => {
    const w = (v / sum) * 860; bar += `<rect x="${20 + x}" y="14" width="${w}" height="14" fill="${COL[k] || '#8b949e'}"/>`; x += w;
    lg += `<circle cx="28" cy="0" r="0"/><circle cx="${28 + i * 140}" cy="52" r="5" fill="${COL[k] || '#8b949e'}"/><text x="${40 + i * 140}" y="56" font-size="12" font-family="${MONO}" class="fg">${k} ${Math.round(v / sum * 100)}%</text>`;
  });
  write('langs.svg', svg(900, 70, `<clipPath id="r"><rect x="20" y="14" width="860" height="14" rx="7"/></clipPath><g clip-path="url(#r)">${bar}</g>${lg}`));
}
console.log('done', { days: days.length, total, repos });
