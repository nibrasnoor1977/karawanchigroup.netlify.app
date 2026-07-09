import { readFileSync } from 'node:fs';

// Lightweight HTML structure check: walk the markup outside of <script>/<style>
// and confirm every container open has a matching close. This ignores JS-string
// <div>s that live inside <script> blocks (the bulk of the false positives).

const html = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');

// Strip <script>...</script> and <style>...</style> blocks entirely.
const stripped = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '');

// Also strip HTML comments.
const markup = stripped.replace(/<!--[\s\S]*?-->/g, '');

const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const stack = [];
const errors = [];
let m;
while ((m = tagRe.exec(markup))) {
  const whole = m[0];
  const name = m[1].toLowerCase();
  const attrs = m[2];
  const isClose = whole.startsWith('</');
  const isSelf = /\/\s*$/.test(attrs);
  if (voids.has(name)) continue;
  if (isClose) {
    // pop until we find match
    if (stack.length === 0) { errors.push(`Close </${name}> with empty stack`); continue; }
    const top = stack[stack.length - 1];
    if (top === name) stack.pop();
    else {
      // search down
      const idx = stack.lastIndexOf(name);
      if (idx === -1) errors.push(`</${name}> has no open (top=${top})`);
      else { errors.push(`</${name}> closes out-of-order; auto-closing ${stack.slice(idx + 1).join(',')} at near ${name}`); stack.length = idx; }
    }
  } else if (!isSelf) {
    stack.push(name);
  }
}

console.log('Unclosed at EOF:', stack.length ? stack.join(', ') : '(none)');
console.log('Errors found :', errors.length);
errors.slice(0, 25).forEach(e => console.log('  -', e));

// Now also report open/close for the structural tags we care about (on stripped markup).
console.log('\n=== Structural tag balance (markup only, JS/CSS stripped) ===');
for (const t of ['html','head','body','main','aside','nav','div','button','table','thead','tbody','tr','td','th','section','article','header','footer']) {
  const o = (markup.match(new RegExp('<' + t + '(?=[ >])', 'g')) || []).length;
  const c = (markup.match(new RegExp('</' + t + '>', 'g')) || []).length;
  if (o || c) console.log(`  ${t.padEnd(8)} open=${String(o).padStart(4)} close=${String(c).padStart(4)} ${o === c ? '' : '  <-- diff ' + (o - c)}`);
}
