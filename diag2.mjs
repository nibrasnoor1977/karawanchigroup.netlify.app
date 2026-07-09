import { readFileSync } from 'node:fs';
const html = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');
const lines = html.split('\n');

// 1. thead: where did the open tags go? Show all <thead occurrences (static + JS strings)
console.log('=== <thead occurrences (first 8) ===');
let n = 0;
lines.forEach((l, i) => {
  if (/<thead/.test(l) && n < 8) {
    console.log(`  @${i + 1}: ${l.trim().substring(0, 90)}`);
    n++;
  }
});
const theadAll = (html.match(/<thead/g) || []).length;
console.log('  total <thead occurrences in file:', theadAll);

// 2. Tail
console.log('\n=== TAIL (last 7 lines) ===');
console.log(lines.slice(-7).join('\n'));

// 3. sidebar/aside boundary
console.log('\n=== around </nav></aside> boundary ===');
const ai = lines.findIndex(l => l.includes('<main class="main-content"'));
for (let i = ai - 4; i < ai + 1; i++) console.log((i + 1) + ': ' + lines[i]);
