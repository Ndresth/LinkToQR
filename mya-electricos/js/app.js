(function () {
  'use strict';
  var MYA = window.MYA;
  var E = MYA.empresa;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function wa(mensaje) {
    return 'https://wa.me/' + E.whatsapp + '?text=' + encodeURIComponent(mensaje);
  }
  var ICONO_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  /* Icono de WhatsApp en los elementos marcados con .ico-wa */
  document.querySelectorAll('.ico-wa').forEach(function (el) { el.insertAdjacentHTML('afterbegin', ICONO_WA); });

  /* Enlaces de WhatsApp declarados en el HTML: <a data-wa="mensaje"> */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = wa(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* Menú móvil */
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', abierto);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Año del pie */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* Inicio: tarjetas de líneas */
  var grid = document.getElementById('lineas-grid');
  if (grid) {
    grid.innerHTML = MYA.lineas.map(function (l) {
      return '<a class="linea" href="productos.html#' + l.id + '">' +
        '<div class="foto"><img src="img/prod/' + l.portada + '.jpg" alt="" loading="lazy"></div>' +
        '<div class="cuerpo"><h3>' + esc(l.nombre) + '</h3><p>' + esc(l.resumen) + '</p>' +
        '<span class="ver">Ver productos →</span></div></a>';
    }).join('');
  }

  /* Inicio: lista de líneas del pie y selector del formulario */
  var pieLineas = document.getElementById('pie-lineas');
  if (pieLineas) {
    pieLineas.innerHTML = MYA.lineas.slice(0, 7).map(function (l) {
      return '<li><a href="productos.html#' + l.id + '">' + esc(l.nombre) + '</a></li>';
    }).join('');
  }
  var selLinea = document.getElementById('f-linea');
  if (selLinea) {
    selLinea.insertAdjacentHTML('beforeend', MYA.lineas.map(function (l) {
      return '<option>' + esc(l.nombre) + '</option>';
    }).join(''));
  }

  /* Inicio: logos de marcas */
  var logos = document.getElementById('marcas-logos');
  if (logos) {
    logos.innerHTML = MYA.marcasLogos.map(function (m) {
      return '<li><img src="img/marcas/' + m + '.png" alt="' + esc(m.replace(/-/g, ' ')) + '" loading="lazy"></li>';
    }).join('');
  }

  /* Formulario → WhatsApp */
  var form = document.getElementById('form-cotizar');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hola, soy ' + d.get('nombre') + '.';
      if (d.get('ciudad')) msg += ' Escribo desde ' + d.get('ciudad') + '.';
      if (d.get('linea')) msg += '\nLínea de interés: ' + d.get('linea') + '.';
      msg += '\n' + d.get('mensaje');
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  /* Productos: catálogo completo */
  var cat = document.getElementById('catalogo');
  if (cat) {
    var indice = document.getElementById('indice-nav');
    indice.innerHTML = MYA.lineas.map(function (l) {
      return '<a href="#' + l.id + '">' + esc(l.nombre) + '</a>';
    }).join('');

    cat.innerHTML = MYA.lineas.map(function (l) {
      return '<section class="bloque-linea" id="' + l.id + '"><h2>' + esc(l.nombre) + '</h2>' +
        '<p class="resumen">' + esc(l.resumen) + '</p>' +
        l.grupos.map(function (g) {
          var buscar = (l.nombre + ' ' + g.nombre + ' ' + g.marcas.join(' ') + ' ' + g.items.join(' ')).toLowerCase();
          return '<article class="grupo" data-buscar="' + esc(buscar) + '">' +
            '<div class="grupo-cab"><h3>' + esc(g.nombre) + '</h3>' +
            '<a class="btn btn-wa btn-chico" target="_blank" rel="noopener" href="' +
            wa('Hola, quiero cotizar productos de: ' + g.nombre + '.') + '">' + ICONO_WA + 'Cotizar</a></div>' +
            (g.marcas.length ? '<ul class="chips"><li class="rot">Marcas:</li>' +
              g.marcas.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '') +
            '<div class="grupo-cuerpo"><ul class="refs">' +
            g.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
            '<ul class="fotos">' + g.imgs.map(function (i) {
              return '<li><img src="img/prod/' + i + '.jpg" alt="' + esc(g.nombre) + '" loading="lazy"></li>';
            }).join('') + '</ul></div></article>';
        }).join('') + '</section>';
    }).join('') + '<p class="sin-resultados" id="sin-resultados" hidden>No encontramos productos con esa búsqueda. ' +
      'Escríbanos por WhatsApp y le ayudamos a conseguirlo.</p>';

    /* Buscador */
    var q = document.getElementById('buscar');
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    q.addEventListener('input', function () {
      var t = norm(q.value.trim());
      var total = 0;
      cat.querySelectorAll('.bloque-linea').forEach(function (b) {
        var visibles = 0;
        b.querySelectorAll('.grupo').forEach(function (g) {
          var ok = !t || norm(g.getAttribute('data-buscar')).indexOf(t) !== -1;
          g.hidden = !ok;
          if (ok) visibles++;
        });
        b.hidden = !visibles;
        total += visibles;
      });
      document.getElementById('sin-resultados').hidden = total > 0;
    });

    /* Resaltar la línea visible en el índice */
    if ('IntersectionObserver' in window) {
      var enlaces = {};
      indice.querySelectorAll('a').forEach(function (a) { enlaces[a.getAttribute('href').slice(1)] = a; });
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            Object.keys(enlaces).forEach(function (k) { enlaces[k].classList.toggle('activo', k === en.target.id); });
          }
        });
      }, { rootMargin: '-110px 0px -70% 0px' });
      cat.querySelectorAll('.bloque-linea').forEach(function (b) { obs.observe(b); });
    }

    /* El catálogo se pinta después de cargar: reubicar si la URL trae #linea */
    if (location.hash) {
      var destino = document.getElementById(location.hash.slice(1));
      if (destino) destino.scrollIntoView();
    }
  }
})();
