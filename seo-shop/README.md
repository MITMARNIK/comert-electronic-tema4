# Proiect SEO & Page Speed – Magazin de laptopuri (TechShop)

Site static (HTML + CSS + JavaScript + Bootstrap 5 din CDN), fără bază de date, rulat local pe **WAMP (Apache)**.
Conține două versiuni ale aceluiași site, ca să compari scorurile Lighthouse:

| Folder | Ce conține |
|---|---|
| `/after`  | Versiunea **optimizată** (SEO complet + viteză) |
| `/before` | Versiunea **neoptimizată** (imagini PNG de ~13 MB, fără lazy loading, fără width/height, JS blocant, fără gzip/cache) |

## 1. Structura fișierelor

```
seo-shop/
├── index.html                    # pagină de start: alegi Before sau After
├── package.json                  # configurare Node.js (compresie automata CSS & JS)
├── README.md
├── scripts/
│   ├── minify.js                 # compresie CSS (style.min.css) si JS (main.min.js)
│   └── watch.js                  # supraveghere fisiere: recompresie automata la salvare (Ctrl+S)
├── after/                        # VERSIUNEA OPTIMIZATĂ
│   ├── .htaccess                 # 404 personalizat, gzip, cache, redirect 301
│   ├── index.html                # lista de produse
│   ├── laptop-asus.html          # pagină produs ASUS (galerie 3 imagini + modal lightbox + semnale Google)
│   ├── laptop-hp.html            # pagină produs HP (galerie 3 imagini + modal lightbox + semnale Google)
│   ├── laptop-lenovo.html        # pagină produs Lenovo (galerie 3 imagini + modal lightbox + semnale Google)
│   ├── specificatii-laptopuri.html  # pagina internă cu detalii (tabel comparativ)
│   ├── 404.html                  # pagina de eroare
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── css/
│   │   ├── style.css             # CSS sursa (documentat)
│   │   └── style.min.css         # CSS comprimat automat (-40.7%)
│   ├── js/
│   │   ├── main.js               # JS sursa (meniu mobil + galerie foto + modal nativ)
│   │   └── main.min.js           # JS comprimat automat (-46.1%)
│   └── img/                      # imagini WebP & JPG (400px și 800px) + favicon.svg
└── before/                       # VERSIUNEA NEOPTIMIZATĂ (aceleași pagini)
    ├── .htaccess                 # fără gzip, fără cache
    ├── *.html, css/style.css
    └── img/                      # imagini PNG 2400x1800 (~13 MB fiecare)
```

## 2. Instalare pe WAMP

1. Instalează WampServer și pornește-l (iconița din bara de sistem trebuie să fie **verde**).
2. Copiază folderul `seo-shop` în **`C:\wamp64\www\`** → rezultă `C:\wamp64\www\seo-shop\`.
3. Activează modulele Apache: click stânga pe iconița WAMP → **Apache → Apache modules** și bifează:
   - `rewrite_module` (redirect 301 pentru URL canonic)
   - `deflate_module` (compresie gzip)
   - `expires_module` (cache în browser)
   - `headers_module` (antete HTTP)

   Alternativ, deschide `C:\wamp64\bin\apache\apache2.4.xx\conf\httpd.conf` și șterge `#` din fața liniilor:
   ```
   LoadModule deflate_module modules/mod_deflate.so
   LoadModule expires_module modules/mod_expires.so
   LoadModule headers_module modules/mod_headers.so
   LoadModule rewrite_module modules/mod_rewrite.so
   ```
4. Verifică faptul că pentru `C:/wamp64/www` este setat `AllowOverride All` (implicit în WAMP), altfel `.htaccess` este ignorat.
5. **Restart All Services** din meniul WAMP.
6. Deschide în browser:
   - http://localhost/seo-shop/ (pagina de start)
   - http://localhost/seo-shop/after/index.html
   - http://localhost/seo-shop/before/index.html
   - Test 404: http://localhost/seo-shop/after/pagina-inexistenta

**Verificare gzip:** F12 → tab *Network* → click pe `index.html` → în *Response Headers* trebuie să apară `Content-Encoding: gzip` (pentru `/after`) și `Expires` / `Cache-Control: max-age=...`.

> Notă: dacă modulele `deflate` și `expires` nu sunt activate, site-ul funcționează (blocurile sunt în `<IfModule>`), dar fără compresie și cache.

## 2.1 Compresie automată CSS & JS cu Node.js (package.json)

Proiectul include un sistem automatizat de compresie (minificare) pentru fișierele CSS și JS proprii:

1. **Instalare dependințe (opțional):**
   ```bash
   npm install
   ```
   *(Scripturile au și motor de minificare nativ integrat, funcționând direct cu `node` chiar și fără `npm install`)*.

2. **Rularea compresiei unice (build):**
   ```bash
   npm run build
   ```
   Comprimă `after/css/style.css` în `after/css/style.min.css` (-40.7%) și `after/js/main.js` în `after/js/main.min.js` (-46.1%).

3. **Compresie automată la salvare (Watcher activ):**
   ```bash
   npm run watch
   ```
   Lasă terminalul deschis: de fiecare dată când modifici și salvezi (`Ctrl+S`) `style.css` sau `main.js`, fișierele `.min.css` și `.min.js` sunt regenerate automat instantaneu!

## 3. Ce optimizări SEO au fost aplicate

| # | Cerință | Unde se vede |
|---|---|---|
| 1 | Nume de fișiere descriptive | `laptop-asus.html`, `specificatii-laptopuri.html`, `laptop-asus-vivobook-15-800.webp` |
| 2 | `<title>` unic (~60) și meta description (~155) | `<head>` din fiecare pagină |
| 3 | Un singur `<h1>`, h2/h3 logic, HTML semantic | `header`, `nav`, `main`, `article`, `section`, `footer` |
| 4 | `alt` descriptiv pe toate imaginile | toate `<img>` |
| 5 | JSON-LD `Product` (preț, monedă, stoc, rating, 3 imagini, specificații) | paginile de produs – valori identice cu textul vizibil |
| 6 | `BreadcrumbList` + breadcrumb vizibil | paginile de produs și comparație |
| 7 | FAQ vizibil + `FAQPage` JSON-LD | paginile de produs (`<details>`, fără JS) |
| 8 | `<link rel="canonical">` | toate paginile indexabile |
| 9 | Open Graph + Twitter Card | toate paginile |
| 10 | `sitemap.xml` + `robots.txt` | `/after` |
| 11 | 404 personalizat în `.htaccess` | `ErrorDocument 404` |
| 12 | **Marcarea informațiilor importante pentru Google** | Taguri `<strong>` pe atribute cheie, etichete trust (`✔ În stoc`, `Livrare gratuită`, `Garanție`), date structurate `additionalProperty` și `MerchantReturnPolicy` |
| 13 | **Galerie 3 imagini per produs + Mărire (Lightbox)** | 3 miniaturi per produs (unghi principal, tastatură, porturi laterale); click pe miniatură schimbă imaginea afișată, iar click pe imaginea mare deschide un modal nativ `<dialog>` fără impact pe CLS |
| 14 | **Prețuri semantice HTML5 (`<data value="...">`)** | Toate prețurile folosesc tagul nativ W3C `<data value="2799.99">2.799,99</data> lei` – leagă valoarea numerică citită de mașini de textul formatat pentru oameni |
| + | `lang="ro"`, link-uri interne descriptive, link extern cu `rel="noopener"`, 404 cu `noindex`, `before` cu `noindex` | — |

## 4. Ce optimizări de viteză au fost aplicate

| Optimizare | Efect (Core Web Vitals) |
|---|---|
| Imagini WebP comprimate (~20 KB în loc de ~13 MB) + `srcset` | LCP mult mai mic |
| `width` + `height` pe fiecare imagine | CLS ≈ 0 |
| `loading="lazy"` pe imaginile de sub ecran; imaginea principală cu `fetchpriority="high"` + `preload` | LCP mai bun, mai puține date |
| Fără `bootstrap.bundle.js` (~80 KB): meniul mobil e făcut cu `main.js` (< 1 KB), încărcat cu `defer` | INP și TBT mai mici, fără resurse blocante |
| Font de sistem (fără Google Fonts) | o cerere blocantă în minus, fără „flash” de text |
| `preconnect` către `cdn.jsdelivr.net` | Bootstrap CSS se descarcă mai repede |
| gzip (`mod_deflate`) + cache 1 an (`mod_expires`) | fișiere text de 3-5× mai mici, vizite repetate instant |

> **Despre „doar părțile din Bootstrap necesare”:** am eliminat complet JavaScript-ul Bootstrap. CSS-ul Bootstrap din CDN vine ca un singur fișier (~25 KB comprimat); pentru a păstra *doar* grid, card și navbar ar trebui compilat din surse Sass sau curățat cu PurgeCSS – pas care necesită Node.js, deci nu l-am inclus ca să rămână proiectul simplu.

## 5. Cum rulezi Lighthouse (local)

1. Deschide pagina în **Google Chrome** într-o fereastră **Incognito** (extensiile pot strica scorul).
2. `F12` → tab **Lighthouse**.
3. Bifează *Performance, Accessibility, Best Practices, SEO*; alege **Mobile** (apoi repetă pentru **Desktop**).
4. Click **Analyze page load**.
5. Rulează pe `before/index.html` și pe `after/index.html` (și pe o pagină de produs), apoi completează tabelul de mai jos.

> Pentru `/before` dezactivează cache-ul (F12 → Network → *Disable cache*) ca să vezi diferența reală.

## 6. PageSpeed Insights

[PageSpeed Insights](https://pagespeed.web.dev/) testează **doar site-uri publice** – nu poate accesa `localhost`. Variante:
- Publici temporar site-ul (ex. GitHub Pages, Netlify Drop – tragi folderul `after` în pagină) și testezi URL-ul public;
- sau expui WAMP temporar cu un tunel (ex. `ngrok http 80`) și testezi `https://xxxx.ngrok-free.app/seo-shop/after/index.html`.

PageSpeed Insights arată și datele reale (CrUX) dacă site-ul are trafic, plus aceleași metrici Lighthouse.

## 7. Validarea datelor structurate (JSON-LD)

1. Deschide [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Pentru că site-ul e local, alege tab-ul **Code**: deschide pagina în browser → `Ctrl+U` (View Source) → copiază tot codul → lipește-l → **Test code**.
3. Trebuie să apară fără erori: **Product snippets**, **Breadcrumbs**, **FAQ**.
4. Opțional, validare completă schema.org: [validator.schema.org](https://validator.schema.org/).

> Google afișează rich results pentru FAQ doar pentru anumite site-uri (guvernamentale/medicale), dar marcajul rămâne valid și util pentru motoarele de răspuns AI.

## 8. Tabel de rezultate (de completat)

### Mobile

| Pagina | Versiune | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| index.html | Before | | | | | | | |
| index.html | After  | | | | | | | |
| laptop-asus.html | Before | | | | | | | |
| laptop-asus.html | After  | | | | | | | |

### Desktop

| Pagina | Versiune | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| index.html | Before | | | | | | | |
| index.html | After  | | | | | | | |
| laptop-asus.html | Before | | | | | | | |
| laptop-asus.html | After  | | | | | | | |

### Dimensiune transferată (F12 → Network, jos)

| Pagina | Before | After |
|---|---|---|
| index.html | | |
| laptop-asus.html | | |

## 9. Note

- URL-urile absolute (canonical, Open Graph, sitemap, JSON-LD) folosesc `http://localhost/seo-shop/after/`. La publicarea pe un domeniu real, înlocuiește-le cu domeniul tău (Find & Replace).
- `robots.txt` trebuie mutat la rădăcina domeniului în producție.
- Linkurile către site-urile producătorilor se pot modifica în timp; verifică-le înainte de prezentare.
- Prețurile, ratingurile și recenziile sunt fictive (proiect didactic).
