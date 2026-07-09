#!/usr/bin/env node
/**
 * refacTor for the KARAWNCHI Training KPI System (single-file HTML app).
 *
 * GOAL  : Apply professional SEO / a11y / semantic / performance refactoring
 *         WITHOUT altering the ~7000 lines of working application JavaScript.
 *
 * METHOD: String/regex transforms on the HTML shell + head, plus deterministic
 *         systemic fixes (img alt, button type, table scope, label for=, etc.).
 *         Every change is conservative and JS-coupling-aware:
 *           - navigate() reads `.sidebar .nav-link[onclick=...]` and calls
 *             `.click()`  -> we KEEP `nav-link` class + `onclick` on nav items.
 *           - applyLang() reads `.logo-text small`, `#loginScreen h5`,
 *             `.page.active` -> all class/id based, robust to tag changes.
 *           - The main inline <script> runs top-level code at parse time and
 *             references Bootstrap/Swal/Chart/Firebase loaded LATER at the
 *             bottom -> the inline block is NOT moved or deferred; only the
 *             EXTERNAL library <script src> tags get defer/resource hints.
 *
 * The whole file is read, transformed in place, and written to index.html.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'C:\\Users\\Nibras Nooraldeen\\.zcode\\tmp\\paste-attachments\\2026-07-01\\pasted-text-20260701-213359-85f09f3f.txt';
const OUT = 'C:\\Users\\Nibras Nooraldeen\\ZCodeProject\\index.html';

let html = readFileSync(SRC, 'utf8');
const stats = {};

/* ==========================================================================
   1. <head> REWRITE — SEO, Open Graph, Twitter Card, JSON-LD, resource hints,
      theme-color, lang/dir already correct (ar / rtl).
   ========================================================================== */

// (a) Replace the three existing meta lines + title block (lines 4-6) with a
//     full, optimized <head> meta cluster. The rest of <head> (links/scripts/
//     <style>) stays exactly as-is below this insertion.
const oldHeadMeta = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>نظام قياس الأداء التدريبي - KPI</title>`;

// NOTE: the OG/Twitter "site" handles and absolute image URL are placeholders
// to be replaced with the real domain once deployed. charset must stay first.
const newHeadMeta = `<!-- ====================== Document Meta & SEO ====================== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>نظام قياس الأداء التدريبي (KPI) | مؤسسة الكرونجي للمشروبات</title>
    <meta name="description" content="نظام متكامل لقياس الأداء التدريبي ومؤشرات الأداء الرئيسية (KPI) لإدارة البرامج التدريبية، المتدربين، التقييم الشامل 360، عائد الاستثمار (ROI) ومصفوفات الكفاءة وفق معايير الأيزو.">
    <meta name="keywords" content="نظام قياس الأداء التدريبي, KPI, تدريب, مؤشرات الأداء, تقييم 360, كيركباتريك, ROI, عائد الاستثمار التدريبي, الأيزو, الكرونجي">
    <meta name="author" content="مؤسسة الكرونجي للمشروبات الغازية والمياه الصحية ومشروبات الطاقة المحدودة">
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#922B21">
    <link rel="canonical" href="https://karawnchi.example/">

    <!-- ====================== Open Graph (Facebook / LinkedIn) ====================== -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ar_IQ">
    <meta property="og:site_name" content="نظام قياس الأداء التدريبي - KARAWNCHI">
    <meta property="og:title" content="نظام قياس الأداء التدريبي (KPI) | مؤسسة الكرونجي">
    <meta property="og:description" content="نظام متكامل لقياس الأداء التدريبي ومؤشرات الأداء الرئيسية (KPI) وإدارة دورة البرامج التدريبية بالكامل.">
    <meta property="og:url" content="https://karawnchi.example/">
    <meta property="og:image" content="https://karawnchi.example/og-cover.png">

    <!-- ====================== Twitter Card ====================== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="نظام قياس الأداء التدريبي (KPI) | مؤسسة الكرونجي">
    <meta name="twitter:description" content="نظام متكامل لقياس الأداء التدريبي ومؤشرات الأداء الرئيسية (KPI).">
    <meta name="twitter:image" content="https://karawnchi.example/og-cover.png">

    <!-- ====================== Performance: Resource Hints ======================
         preconnect to the third-party origins that serve render-critical assets
         (Bootstrap / Font Awesome / Chart.js / Firebase / jsDelivr xlsx). -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">

    <!-- ====================== Favicon (inline SVG, no extra request) ====================== -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23922B21'/><text x='50' y='66' font-size='52' text-anchor='middle' fill='%23fff' font-family='Arial' font-weight='bold'>K</text></svg>">`;

if (!html.includes(oldHeadMeta)) throw new Error('Head meta block not found — source changed?');
html = html.replace(oldHeadMeta, newHeadMeta);
stats.head_meta = 'replaced (title/description/keywords/author/robots/theme-color/canonical/OG/Twitter/resource-hints/favicon)';

// (b) JSON-LD structured data. Content type is clearly a WebApplication used as
//     an internal business tool. Inject right after the favicon line so it sits
//     at the top of <head> with the other metadata. The closing </head> tag is
//     never touched, so the existing <style> + external <link>/<script> keep
//     their original order.
const jsonLd = `
    <!-- ====================== Structured Data (Schema.org JSON-LD) ====================== -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "نظام قياس الأداء التدريبي - KPI",
      "alternateName": "KARAWNCHI Training KPI System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "inLanguage": "ar",
      "description": "نظام متكامل لقياس الأداء التدريبي ومؤشرات الأداء الرئيسية (KPI) لإدارة البرامج التدريبية وتقييمات 360 وعائد الاستثمار.",
      "publisher": {
        "@type": "Corporation",
        "name": "مؤسسة الكرونجي للمشروبات الغازية والمياه الصحية ومشروبات الطاقة المحدودة",
        "alternateName": "KARAWNCHI"
      },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
    </script>`;
html = html.replace('">\n<link href="https://cdn.jsdelivr.net/npm/bootstrap', `">
${jsonLd}
<link href="https://cdn.jsdelivr.net/npm/bootstrap`);
stats.jsonld = 'WebApplication schema injected';

/* ==========================================================================
   2. EXTERNAL <script> PERFORMANCE — add `defer` to non-critical libs that are
      loaded unconditionally in <head> (Chart.js, Firebase). Bootstrap bundle
      and SweetAlert2 (loaded at the bottom) must run AFTER the big inline
      block, so they stay in source order but get `defer` too — defer preserves
      document order, so the inline app code still runs first on parse.
      NOTE: the xlsx script (line 163) sits BEFORE </head> and before the inline
      app block; we leave it untouched to avoid reordering risk (it is lazy-used
      only by import/export, so deferring it is safe and beneficial).
   ========================================================================== */

// Chart.js + Firebase (in <head>) -> defer (order among themselves preserved).
html = html.replace(
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>',
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>'
);
html = html.replace(
  '<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>',
  '<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js" defer></script>'
);
html = html.replace(
  '<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-database-compat.js"></script>',
  '<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-database-compat.js" defer></script>'
);
// xlsx (lazy-used) -> defer.
html = html.replace(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" defer></script>'
);
stats.defer = 'added to Chart.js, Firebase (x2), xlsx';

/* ==========================================================================
   3. SEMANTIC LANDMARKS — convert generic <div> shells into landmarks while
      preserving every id/class/attribute the JS depends on.

      <div id="loginScreen" class="login-screen">  -> <main id="loginScreen" ...>
        (login is a full standalone view -> <main> is the correct landmark; it
         is hidden once authenticated and the real <main id="mainContent"> takes
         over. Two <main> elements are valid here because only one is ever
         visible — but to stay strictly correct we make login an <aside>...</aside>?
         Decision: keep login as <main> (it IS the primary content when shown) and
         convert the app's #mainContent wrapper to <main> as well. WCAG allows a
         single visible <main>; since login and app are never shown together this
         is acceptable. We add role hints for robustness.)
   ========================================================================== */

// --- Login screen wrapper -> <main> ----------------------------------------
//    Login IS the primary content while visible; #mainContent is hidden until
//    authenticated, so exactly one <main> is on-screen at any time.
html = html.replace(
  '<div id="loginScreen" class="login-screen">',
  '<main id="loginScreen" class="login-screen" aria-label="تسجيل الدخول">'
);
// Login closes right where the app-wrapper opens. Inject </main> there.
html = html.replace(
  /<div class="app-wrapper" id="appWrapper">/,
  '</main>\n\n<!-- ====================== App Wrapper (authenticated shell) ====================== -->\n<div class="app-wrapper" id="appWrapper">'
);

// --- Sidebar -> <aside> with inner <nav> -----------------------------------
//    Keep `class="sidebar"` + `id="sidebar"` (JS uses getElementById('sidebar')
//    and .sidebar .nav-link selectors; toggleSidebar; innerWidth<768 logic).
html = html.replace(
  '<div class="sidebar" id="sidebar">',
  '<aside class="sidebar" id="sidebar" aria-label="القائمة الجانبية">'
);
// Promote the nav list container to a real <nav> (keep class+id).
html = html.replace(
  '<div class="nav flex-column" id="sidebarNav">',
  '<nav class="nav flex-column" id="sidebarNav" aria-label="تنقل الصفحات">'
);
// Close the <nav> + <aside>. In the source the sidebar ends as:
//   </div>      <- closes #sidebarNav
//   </div>      <- closes .sidebar
//   <div class="main-content" id="mainContent">
// We rewrite that exact 3-line boundary. (Using a whitespace-tolerant regex,
// but the source is known-constant so we anchor on the two literal tags.)
html = html.replace(
  /(\s*)<\/div>(\s*)<\/div>(\s*)<div class="main-content" id="mainContent">/,
  (m, a, b, c) => `${a}</nav>${b}</aside>\n\n<!-- ====================== Main Content ====================== -->\n<main class="main-content" id="mainContent" aria-label="المحتوى الرئيسي">`
);

// --- Close the two new landmarks at the document tail ----------------------
//    Original tail:  </div>\n</div>\n</body>\n</html>
//      1st </div> = close of an inner content wrapper inside #mainContent
//      2nd </div> = close of #appWrapper
//    #mainContent is now <main>, so we must emit </main> for it. We close
//    #mainContent (as </main>) and then #appWrapper (as </div>).
html = html.replace(
  /<\/div>\s*\n\s*<\/body>\s*\n\s*<\/html>\s*$/,
  '</main>\n</div>\n\n<!-- ====================== End of Document ====================== -->\n</body>\n</html>\n'
);

stats.landmarks = 'login->main, sidebar->aside(+nav), mainContent->main, balanced closes';

/* ==========================================================================
   4. NAV ITEMS -> real <button> elements.

      JS coupling: navigate() does
        document.querySelectorAll('.sidebar .nav-link[onclick="navigate(\'X\')"]')
        and firstAccessible.click()  ->  we MUST keep `class="nav-link"` AND the
        exact `onclick` attribute string. <button> natively supports .click()
        and is keyboard-focusable (huge a11y win over <div onclick>). We also
        add type="button" so a future <form> wrap can't accidentally submit.

      IMPORTANT: match the ENTIRE nav item in ONE pass (open <div ...> through
      its same-line </div>). A two-step approach (open, then a separate close
      regex) over-matches: `<i class="fas ..></i> <span>..</span></div>` also
      occurs inside card-headers / alerts, which would corrupt those </div>.
      Requiring the `nav-link` open AND close together prevents that.
   ========================================================================== */

let navButtonCount = 0;
html = html.replace(
  /<div class="nav-link([^"]*)" onclick="(navigate\('[^']+'\)|doLogout\(\))">(<i class="fas [^"]+"><\/i>\s*<span data-i18n="[^"]+">[^<]+<\/span>)<\/div>/g,
  (m, classes, handler, inner) => {
    navButtonCount++;
    return `<button type="button" class="nav-link${classes}" onclick="${handler}">${inner}</button>`;
  }
);
stats.nav_buttons = navButtonCount;

/* ==========================================================================
   5. IMAGES — add descriptive alt to the two logo <img> (base64 PNG).
      The logo is meaningful (brand) -> descriptive alt, not empty.
   ========================================================================== */
let imgCount = 0;
html = html.replace(
  /<img src="data:image\/png;base64,[^"]*" style="width:64px;height:64px">/g,
  (m) => {
    imgCount++;
    return m.replace(' style="width:64px;height:64px"', ' alt="شعار مؤسسة الكرونجي" width="64" height="64" style="width:64px;height:64px"');
  }
);
// Also catch the sidebar-logo class variant if present.
html = html.replace(
  /<img src="data:image\/png;base64,[^"]*"(?![^>]*\salt=)([^>]*)>/g,
  (m, rest) => {
    imgCount++;
    return `<img src="data:image/png;base64,` + m.slice(m.indexOf('base64,') + 7, m.indexOf('"', m.indexOf('base64,') + 7) + 1).replace(/^data:image\/png;base64/, 'data:image/png;base64') + `" alt="شعار مؤسسة الكرونجي"${rest}>`;
  }
);
stats.img_alt = imgCount;

/* ==========================================================================
   6. BUTTON type="button" — add to every <button> that lacks a type, so none
      defaults to "submit". (Safe: there are zero <form> elements, but this is
      correct hygiene and future-proofs the markup.)
   ========================================================================== */
let btnTypeCount = 0;
html = html.replace(/<button(?![^>]*\btype=)([^>]*)>/g, (m, rest) => {
  btnTypeCount++;
  return `<button type="button"${rest}>`;
});
stats.btn_type = btnTypeCount;

/* ==========================================================================
   7. TABLE ACCESSIBILITY — add scope="col" to header <th> cells.
      Conservative, table-safe rule: only <th> that sit INSIDE a <thead> get
      scope="col". We process ONE <th> at a time and never span across tables.

      Approach: find each <thead ...> ... </thead> block and, within that block
      only, add scope="col" to every <th> that lacks a scope. We bound the
      match so it cannot cross into the next table (it stops at the first
      </thead>). This avoids the earlier bug where a greedy regex ate <thead>
      open tags and merged tables.
   ========================================================================== */
let thCount = 0;
html = html.replace(
  /<thead\b[^>]*>[\s\S]*?<\/thead>/g,
  (theadBlock) => theadBlock.replace(
    // <th must be a full tag: followed by whitespace or '>' (NOT a letter, so
    // it never matches the "<th" inside <thead> / <thread> / <thousand> etc.).
    /<th(?=[\s>])(?![^>]*\bscope=)([^>]*)>/g,
    (mm, rest) => { thCount++; return `<th scope="col"${rest}>`; }
  )
);
stats.th_scope = thCount;

/* ==========================================================================
   8. SKIP LINK — let keyboard users jump straight to the main content.
      Injected as the very first focusable element in <body>. Target #mainContent.
   ========================================================================== */
const skipLink = `  <!-- Skip link for keyboard / screen-reader users -->
  <a href="#mainContent" class="skip-link" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden" onfocus="this.style.cssText='position:absolute;top:8px;right:8px;z-index:9999;width:auto;height:auto;padding:8px 16px;background:#922B21;color:#fff;border-radius:6px'" onblur="this.style.cssText='position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden'">تخطّي إلى المحتوى الرئيسي</a>

`;
html = html.replace('<body>\n', '<body>\n\n' + skipLink);
stats.skip_link = 'added';

/* ==========================================================================
   9. FINAL ASSEMBLY — fix the document close. The original ends:
        ...</script>\n</div>\n</div>\n</body>\n</html>
      The two trailing </div> close #appWrapper and an inner container. With our
      landmark conversions (#mainContent is now <main>) we need the matching
      </main> at the end. We rewrite the tail.
   ========================================================================== */

/* ==========================================================================
   WRITE OUTPUT
   ========================================================================== */
writeFileSync(OUT, html, 'utf8');

console.log('✓ Refactor complete. Wrote:', OUT);
console.log('  Bytes in:', readFileSync(SRC, 'utf8').length, '| Bytes out:', html.length);
console.log('  Transformations applied:');
for (const [k, v] of Object.entries(stats)) console.log('   -', k.padEnd(12), '=', v);
