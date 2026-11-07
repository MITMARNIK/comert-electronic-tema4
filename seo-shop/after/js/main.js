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

// Galerie foto produs: schimbare imagine principala la click pe miniatura + deschidere modal mare (Lightbox)
var mainImg = document.getElementById('mainProductImg');
var thumbBtns = document.querySelectorAll('.thumb-btn');
var imageModal = document.getElementById('imageModal');
var modalImg = document.getElementById('modalImg');
var modalCaption = document.getElementById('modalCaption');
var closeBtn = document.querySelector('.lightbox-close');

if (mainImg && thumbBtns.length > 0) {
  thumbBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      thumbBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var newSrc = btn.getAttribute('data-full');
      var thumbImg = btn.querySelector('img');
      if (newSrc) {
        mainImg.src = newSrc;
        if (thumbImg) {
          mainImg.alt = thumbImg.alt;
        }
      }
    });
  });

  if (imageModal && modalImg) {
    mainImg.addEventListener('click', function () {
      modalImg.src = mainImg.src;
      modalImg.alt = mainImg.alt;
      if (modalCaption) {
        modalCaption.textContent = mainImg.alt;
      }
      imageModal.showModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        imageModal.close();
      });
    }

    // Inchidere la click pe fundalul intunecat
    imageModal.addEventListener('click', function (e) {
      if (e.target === imageModal) {
        imageModal.close();
      }
    });
  }
}
