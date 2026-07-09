import { readFileSync } from 'node:fs';
const html = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');
const lines = html.split('\n');

// Show login close / appWrapper open boundary
console.log('=== login -> appWrapper boundary ===');
const ai = lines.findIndex(l => l.includes('app-wrapper'));
for (let i = ai - 4; i < ai + 6; i++) console.log((i + 1) + ': ' + (lines[i] || ''));

// Show sidebar -> main boundary
console.log('\n=== sidebar -> main boundary ===');
const mi = lines.findIndex(l => l.includes('<main class="main-content"'));
for (let i = mi - 5; i < mi + 2; i++) console.log((i + 1) + ': ' + (lines[i] || ''));

// Show tail
console.log('\n=== tail ===');
console.log(lines.slice(-8).map((l, i) => (lines.length - 8 + i + 1) + ': ' + l).join('\n'));
