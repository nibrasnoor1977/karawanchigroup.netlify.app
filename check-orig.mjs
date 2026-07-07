import { readFileSync } from 'node:fs';
const orig = readFileSync('C:\\Users\\Nibras Nooraldeen\\.zcode\\tmp\\paste-attachments\\2026-07-01\\pasted-text-20260701-213359-85f09f3f.txt', 'utf8');
const c = re => (orig.match(re) || []).length;
console.log('ORIGINAL SOURCE (pre-transform) tag counts:');
for (const t of ['main','aside','nav','button','thead','tbody','table']) {
  const o = c(new RegExp('<' + t + '[ >]', 'g')), cl = c(new RegExp('</' + t + '>', 'g'));
  console.log(`  ${t.padEnd(8)} open=${o}  close=${cl}  diff=${o - cl}`);
}
const divO = c(/<div[ >]/g), divC = c(/<\/div>/g);
console.log(`  div      open=${divO}  close=${divC}  diff=${divO - divC}`);
