import { readFileSync } from 'node:fs';
const html = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');
const lines = html.split('\n');

let issues = 0;
lines.forEach((ln, i) => {
  if (ln.includes('<button type="button" class="nav-link') && ln.includes('onclick="navigate')) {
    if (!ln.includes('</button>')) { console.log('UNCLOSED nav btn @' + (i + 1) + ': ' + ln.substring(0, 110)); issues++; }
  }
});
console.log('Unclosed nav-button same-line:', issues);

const spanButtonClose = (html.match(/<\/span><\/button>/g) || []).length;
console.log('</span></button> occurrences:', spanButtonClose);

let extra = 0;
lines.forEach((ln, i) => {
  const o = (ln.match(/<button[ >]/g) || []).length;
  const c = (ln.match(/<\/button>/g) || []).length;
  if (c > o && !ln.includes('modal') && !ln.includes('requires-write') && !ln.includes('btn ')) {
    if (extra < 12) console.log(`  +close@${i + 1}: ${ln.substring(0, 120)}`);
    extra++;
  }
});
console.log('Suspicious extra-close lines:', extra);
