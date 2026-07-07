import { readFileSync } from 'node:fs';
const h = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');
const lines = h.split('\n');
let c = 0;
lines.forEach((l, i) => { if (/thead/.test(l) && c < 8) { console.log((i + 1) + ': ' + l.substring(0, 160)); c++; } });
console.log('--- raw total <thead :', (h.match(/<thead/g) || []).length, ' raw </thead> :', (h.match(/<\/thead>/g) || []).length);
