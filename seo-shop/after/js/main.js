/* ==========================================================================
   main.js – singurul JavaScript al site-ului (< 1 KB).
   VITEZA: in loc de bootstrap.bundle.min.js (~80 KB) folosim cateva randuri
   care fac exact ce ne trebuie: deschid/inchid meniul pe mobil.
   Este incarcat cu "defer" => nu blocheaza afisarea paginii.
   ========================================================================== */

// Gasim butonul "hamburger" si meniul pe care il controleaza.
var toggler = document.querySelector('.navbar-toggler');
var menu = document.getElementById('mainNav');

if (toggler && menu) {
  toggler.addEventListener('click', function () {
    // Clasa "show" este cea folosita de CSS-ul Bootstrap pentru meniul deschis.
    var isOpen = menu.classList.toggle('show');
    // Accesibilitate: cititoarele de ecran afla daca meniul e deschis.
    toggler.setAttribute('aria-expanded', isOpen);
  });
}

// Anul curent in footer (ca sa nu-l actualizam manual).
var year = document.getElementById('year');
if (year) { year.textContent = new Date().getFullYear(); }
