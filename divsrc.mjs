import { readFileSync } from 'node:fs';
function bal(path) {
  const h = readFileSync(path, 'utf8')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  return {
    divOpen: (h.match(/<div(?=[ >])/g) || []).length,
    divClose: (h.match(/<\/div>/g) || []).length,
  };
}
const SRC = 'C:\\Users\\Nibras Nooraldeen\\.zcode\\tmp\\paste-attachments\\2026-07-01\\pasted-text-20260701-213359-85f09f3f.txt';
console.log('SRC markup-only:', JSON.stringify(bal(SRC)));
console.log('OUT markup-only:', JSON.stringify(bal('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html')));
