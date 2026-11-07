/**
 * scripts/minify.js
 * Script de compresie (minificare) pentru CSS si JavaScript.
 * Functioneaza fie cu pachetele clean-css si terser (daca sunt instalate),
 * fie nativ cu motorul intern integrat (zero dependinte obligatorii).
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cssSource = path.join(rootDir, 'after', 'css', 'style.css');
const cssOutput = path.join(rootDir, 'after', 'css', 'style.min.css');
const jsSource = path.join(rootDir, 'after', 'js', 'main.js');
const jsOutput = path.join(rootDir, 'after', 'js', 'main.min.js');

// Minificator CSS nativ (fallback cand clean-css nu e instalat)
function fallbackMinifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // sterge comentariile
    .replace(/\s+/g, ' ')             // unifica spatiile
    .replace(/\s*([{}:;,>+~])\s*/g, '$1') // sterge spatiile din jurul delimitatorilor
    .replace(/;}/g, '}')              // sterge ultimul punct si virgula din bloc
    .trim();
}

// Minificator JS nativ (fallback cand terser nu e instalat)
function fallbackMinifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')     // sterge comentariile multilinie
    .replace(/(?<!:)\/\/.*$/gm, '')        // sterge comentariile de o linie
    .replace(/^\s+|\s+$/gm, '')           // sterge spatiile de la inceputul/sfarsitul liniilor
    .replace(/\s*([=+\-*\/{}();,:!<>|&])\s*/g, '$1') // spatii in jurul operatorilor
    .replace(/\n+/g, '\n')                // sterge liniile goale
    .trim();
}

async function minifyCss() {
  if (!fs.existsSync(cssSource)) {
    console.error(`[Eroare] Nu gasesc fisierul sursa CSS: ${cssSource}`);
    return;
  }
  const original = fs.readFileSync(cssSource, 'utf8');
  let minified = '';

  try {
    const CleanCSS = require('clean-css');
    const result = new CleanCSS({ level: 2 }).minify(original);
    minified = result.styles;
  } catch (e) {
    minified = fallbackMinifyCss(original);
  }

  fs.writeFileSync(cssOutput, minified, 'utf8');
  const origSize = Buffer.byteLength(original, 'utf8');
  const minSize = Buffer.byteLength(minified, 'utf8');
  const saved = ((1 - minSize / origSize) * 100).toFixed(1);
  console.log(`[CSS] ${path.basename(cssSource)} -> ${path.basename(cssOutput)}`);
  console.log(`      Dimensiune: ${origSize} B -> ${minSize} B (-${saved}%)`);
}

async function minifyJs() {
  if (!fs.existsSync(jsSource)) {
    console.error(`[Eroare] Nu gasesc fisierul sursa JS: ${jsSource}`);
    return;
  }
  const original = fs.readFileSync(jsSource, 'utf8');
  let minified = '';

  try {
    const Terser = require('terser');
    const result = await Terser.minify(original, {
      compress: true,
      mangle: true
    });
    minified = result.code;
  } catch (e) {
    minified = fallbackMinifyJs(original);
  }

  fs.writeFileSync(jsOutput, minified, 'utf8');
  const origSize = Buffer.byteLength(original, 'utf8');
  const minSize = Buffer.byteLength(minified, 'utf8');
  const saved = ((1 - minSize / origSize) * 100).toFixed(1);
  console.log(`[JS]  ${path.basename(jsSource)} -> ${path.basename(jsOutput)}`);
  console.log(`      Dimensiune: ${origSize} B -> ${minSize} B (-${saved}%)`);
}

async function run() {
  const start = Date.now();
  console.log('--- Pornire compresie CSS & JS (TechShop) ---');
  await minifyCss();
  await minifyJs();
  console.log(`Finalizat in ${Date.now() - start} ms.\n`);
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run, minifyCss, minifyJs };

