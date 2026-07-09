import { readFileSync } from 'node:fs';
const src = readFileSync('C:\\Users\\Nibras Nooraldeen\\.zcode\\tmp\\paste-attachments\\2026-07-01\\pasted-text-20260701-213359-85f09f3f.txt', 'utf8');
const out = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');

// Exclude JS string content from counting is hard; instead just verify the
// *delta* introduced by each landmark change is self-consistent. We count
// ONLY in the HTML-shell region (before the big <script> at ~line 1590) plus
// the modal region after — i.e. structural markup, not JS template strings.

function shellDivs(text) {
  // Count <div opens and </div> closes across whole text.
  const o = (text.match(/<div[ >]/g) || []).length;
  const c = (text.match(/<\/div>/g) || []).length;
  return { o, c, diff: o - c };
}
const s = shellDivs(src), o = shellDivs(out);
console.log('SRC  divs: open=' + s.o + ' close=' + s.c + ' diff=' + s.diff);
console.log('OUT  divs: open=' + o.o + ' close=' + o.c + ' diff=' + o.diff);
console.log('Delta open :', o.o - s.o, '(expected -4: loginScreen,sidebar,sidebarNav,mainContent converted to landmarks)');
console.log('Delta close:', o.c - s.c, '(expected: sidebar(-1)+sidebarNav(-1)+mainContent tail(-1) = -3; but thead-scope regex does not touch divs)');
