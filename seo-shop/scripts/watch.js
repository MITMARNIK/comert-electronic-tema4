/**
 * scripts/watch.js
 * Supravegheaza fisierele CSS si JS din /after si le comprima automat
 * in momentul in care le salvezi (Ctrl+S).
 *
 * Rulare: npm run watch
 */

const fs = require('fs');
const path = require('path');
const { minifyCss, minifyJs } = require('./minify');

const rootDir = path.resolve(__dirname, '..');
const cssFile = path.join(rootDir, 'after', 'css', 'style.css');
const jsFile = path.join(rootDir, 'after', 'js', 'main.js');

console.log('====================================================');
console.log('  TechShop – Compresie automata activa (Watcher)');
console.log('====================================================');
console.log('Fisiere urmarite:');
console.log(` - ${path.relative(rootDir, cssFile)}`);
console.log(` - ${path.relative(rootDir, jsFile)}`);
console.log('\nModifica si salveaza oricare fisier pentru recompresie automata.');
console.log('Apasa Ctrl+C pentru a opri watcher-ul.\n');

// Recomprimare initiala la pornire
(async () => {
  await minifyCss();
  await minifyJs();
  console.log('--- Astept modificari... ---\n');
})();

// Debounce pentru a preveni declansarile duble generate de unele editoare la salvare
let cssTimer = null;
let jsTimer = null;

if (fs.existsSync(cssFile)) {
  fs.watch(cssFile, (eventType) => {
    if (eventType === 'change') {
      clearTimeout(cssTimer);
      cssTimer = setTimeout(async () => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] S-a salvat style.css -> Recomprimare automata...`);
        await minifyCss();
        console.log('Gata! style.min.css a fost actualizat.\n');
      }, 100);
    }
  });
} else {
  console.warn(`[Atentie] Fisierul CSS nu a fost gasit: ${cssFile}`);
}

if (fs.existsSync(jsFile)) {
  fs.watch(jsFile, (eventType) => {
    if (eventType === 'change') {
      clearTimeout(jsTimer);
      jsTimer = setTimeout(async () => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] S-a salvat main.js -> Recomprimare automata...`);
        await minifyJs();
        console.log('Gata! main.min.js a fost actualizat.\n');
      }, 100);
    }
  });
} else {
  console.warn(`[Atentie] Fisierul JS nu a fost gasit: ${jsFile}`);
}

