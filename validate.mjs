#!/usr/bin/env node
import { readFileSync } from 'node:fs';
const html = readFileSync('C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html', 'utf8');

function count(re) { return (html.match(re) || []).length; }

console.log('================ TAG BALANCE (HTML landmarks) ================');
const tags = ['main','aside','nav','header','footer','section','article','button','table','thead','tbody'];
let ok = true;
for (const t of tags) {
  const open = count(new RegExp(`<${t}[ >]`, 'g'));
  const close = count(new RegExp(`</${t}>`, 'g'));
  const status = open === close ? 'OK' : '*** MISMATCH ***';
  if (open !== close) ok = false;
  console.log(`  ${t.padEnd(8)} open=${String(open).padStart(4)}  close=${String(close).padStart(4)}  ${status}`);
}

console.log('\n================ DIV BALANCE ================');
const divO = count(/<div[ >]/g), divC = count(/<\/div>/g);
console.log(`  <div> open=${divO}  close=${divC}  diff=${divO - divC}`);

console.log('\n================ JS COUPLING (must be intact) ================');
const checks = {
  'nav-link class preserved':      /class="nav-link[^"]*"/.test(html),
  'navigate(dashboard) onclick':   /onclick="navigate\('dashboard'\)"/.test(html),
  'id="sidebarNav" present':       /id="sidebarNav"/.test(html),
  'id="mainContent" present':      /id="mainContent"/.test(html),
  'id="loginScreen" present':      /id="loginScreen"/.test(html),
  'id="appWrapper" present':       /id="appWrapper"/.test(html),
  'logo-text small selector':      /logo-text small/.test(html),
  '#loginScreen h5 selector path': html.includes("querySelector('#loginScreen h5')"),
  'page- class containers':        count(/class="page[ active]*" id="page-/g),
  'navigate() function defined':   /function navigate\(page\)/.test(html),
  'applyLang() function defined':  /function applyLang\(\)/.test(html),
  'doLogin/doLogout defined':      /function doLogin\(/.test(html) && /function doLogout\(\)/.test(html),
  'bootstrap.Modal still used':    /bootstrap\.Modal/.test(html),
  'Swal / window.Swal still used': /Swal/.test(html),
  'Chart.js still referenced':     /new Chart\(/.test(html),
};
for (const [k, v] of Object.entries(checks)) {
  console.log(`  ${v ? 'OK ' : 'XX '} ${k}`);
  if (!v) ok = false;
}

console.log('\n================ A11Y / SEO RESULTS ================');
const results = {
  'img tags with alt':            count(/<img[^>]*\salt=/g),
  'img tags total':               count(/<img[ >]/g),
  'button with type=':            count(/<button[^>]*\btype=/g),
  'button total':                 count(/<button[ >]/g),
  'th with scope=':               count(/<th[^>]*\bscope=/g),
  'th total':                     count(/<th[ >]/g),
  'nav buttons (type=button nav-link)': count(/<button[^>]*class="nav-link[^"]*"[^>]*>/g),
  'aria-label attrs':             count(/aria-label=/g),
  'role= attrs':                  count(/role=/g),
  'meta description':             /name="description"/.test(html),
  'og: tags':                     count(/property="og:/g),
  'twitter: tags':                count(/name="twitter:/g),
  'JSON-LD script':               count(/application\/ld\+json/g),
  'preconnect hints':             count(/rel="preconnect"/g),
  'defer scripts':                count(/defer/g),
  'skip-link':                    /class="skip-link"/.test(html),
  'theme-color':                  /name="theme-color"/.test(html),
  'canonical':                    /rel="canonical"/.test(html),
  'viewport':                     /name="viewport"/.test(html),
};
for (const [k, v] of Object.entries(results)) console.log(`  ${String(v).padStart(4)}  ${k}`);

console.log('\n================ HEADING HIERARCHY ================');
for (const h of ['h1','h2','h3','h4','h5','h6']) {
  const n = count(new RegExp(`<${h}[ >]`, 'g'));
  if (n) console.log(`  ${h}: ${n}`);
}

console.log('\n================ VERDICT ================');
console.log(ok ? '  STRUCTURAL INTEGRITY: PASS' : '  STRUCTURAL INTEGRITY: ISSUES FOUND');
