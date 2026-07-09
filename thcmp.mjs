import { readFileSync } from 'node:fs';
const SRC = 'C:\\Users\\Nibras Nooraldeen\\.zcode\\tmp\\paste-attachments\\2026-07-01\\pasted-text-20260701-213359-85f09f3f.txt';
function measure(path) {
  const h = readFileSync(path, 'utf8')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const co = re => (h.match(re) || []).length;
  return {
    'thead-open': co(/<thead/g),
    'thead-close': co(/<\/thead>/g),
    'th-open': co(/<th[ >]/g),
    'th-close': co(/<\/th>/g),
    'scope': co(/scope=/g),
  };
}
for (const [label, p] of [['SRC', SRC], ['OUT', 'C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html']]) {
  console.log(label, JSON.stringify(measure(p)));
}
