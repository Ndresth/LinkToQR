(function () {
  "use strict";

  var PREVIEW_SIZE = 320;
  var HISTORY_KEY = "ltq-history";
  var HISTORY_MAX = 12;

  var $ = function (id) { return document.getElementById(id); };

  var el = {
    urlInput: $("urlInput"), urlError: $("urlError"), pasteBtn: $("pasteBtn"),
    fgColor: $("fgColor"), bgColor: $("bgColor"), dotStyle: $("dotStyle"), cornerStyle: $("cornerStyle"),
    logoInput: $("logoInput"), logoClear: $("logoClear"), ecLevel: $("ecLevel"), exportSize: $("exportSize"),
    marginRange: $("marginRange"), marginValue: $("marginValue"), presets: $("presets"),
    qrFrame: $("qrFrame"), qrCanvas: $("qrCanvas"), qrTarget: $("qrTarget"),
    downloadPng: $("downloadPng"), downloadSvg: $("downloadSvg"), copyImage: $("copyImage"),
    historyList: $("historyList"), historyEmpty: $("historyEmpty"), historyClear: $("historyClear"),
    themeToggle: $("themeToggle"), toast: $("toast"), toastBody: $("toastBody")
  };

  var state = {
    data: null,
    logo: null
  };

  // ---------- Utilidades ----------

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* almacenamiento no disponible */ }
  }

  var toastInstance = null;
  function toast(message) {
    el.toastBody.textContent = message;
    if (!toastInstance) toastInstance = bootstrap.Toast.getOrCreateInstance(el.toast, { delay: 2500 });
    toastInstance.show();
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  function slugify(text) {
    return (text || "codigo")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      .toLowerCase().slice(0, 40) || "codigo";
  }

  // Acepta "midominio.com/ruta" y le añade https://. Devuelve null si no es válido.
  function normalizeUrl(raw) {
    var value = raw.trim();
    if (!value) return null;
    if (/^(mailto|tel|sms|geo):/i.test(value)) return value;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = "https://" + value;
    try {
      var url = new URL(value);
      if (/^https?:$/.test(url.protocol)) {
        var host = url.hostname;
        if (host !== "localhost" && host.indexOf(".") === -1) return null;
        if (/\.$/.test(host) || /\s/.test(value)) return null;
        // Tildes, ñ, etc. se codifican con % para que cualquier lector los interprete igual.
        if (/[^\x00-\x7f]/.test(value)) return url.href;
      }
      return value;
    } catch (e) {
      return null;
    }
  }

  // ---------- Generación del QR ----------

  function cornerDotFor(corner) {
    return corner === "square" ? "square" : "dot";
  }

  function qrOptions(size, type, data) {
    var scale = size / PREVIEW_SIZE;
    var fg = el.fgColor.value;
    var options = {
      width: size,
      height: size,
      type: type,
      data: data,
      margin: Math.round(Number(el.marginRange.value) * scale),
      qrOptions: { errorCorrectionLevel: el.ecLevel.value },
      dotsOptions: { color: fg, type: el.dotStyle.value },
      cornersSquareOptions: { color: fg, type: el.cornerStyle.value },
      cornersDotOptions: { color: fg, type: cornerDotFor(el.cornerStyle.value) },
      backgroundOptions: { color: el.bgColor.value },
      imageOptions: { crossOrigin: "anonymous", margin: Math.round(6 * scale), imageSize: 0.35, hideBackgroundDots: true }
    };
    if (state.logo) options.image = state.logo;
    return options;
  }

  function setActionsEnabled(enabled) {
    el.downloadPng.disabled = !enabled;
    el.downloadSvg.disabled = !enabled;
    el.copyImage.disabled = !enabled;
  }

  function renderQr() {
    var data = state.data;
    el.qrCanvas.innerHTML = "";

    if (!data) {
      el.qrFrame.classList.remove("has-qr");
      el.qrTarget.textContent = "Escribe un enlace para generar tu QR";
      el.qrTarget.title = "";
      setActionsEnabled(false);
      return;
    }

    var qr = new QRCodeStyling(qrOptions(PREVIEW_SIZE, "svg", data));
    qr.append(el.qrCanvas);

    var wasEmpty = !el.qrFrame.classList.contains("has-qr");
    el.qrFrame.classList.add("has-qr");
    if (wasEmpty) {
      el.qrFrame.classList.remove("pop");
      void el.qrFrame.offsetWidth;
      el.qrFrame.classList.add("pop");
    }
    el.qrTarget.textContent = data;
    el.qrTarget.title = data;
    setActionsEnabled(true);
  }

  var renderQrDebounced = debounce(renderQr, 120);

  function downloadName() {
    try { return "qr-" + slugify(new URL(state.data).hostname.replace(/^www\./, "")); }
    catch (e) { return "qr-" + slugify(state.data); }
  }

  function download(extension) {
    if (!state.data) return;
    var size = extension === "png" ? Number(el.exportSize.value) : 1024;
    var qr = new QRCodeStyling(qrOptions(size, extension === "png" ? "canvas" : "svg", state.data));
    qr.download({ name: downloadName(), extension: extension });
    addHistory();
  }

  function copyImage() {
    if (!state.data) return;
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      toast("Tu navegador no permite copiar imágenes. Usa Descargar PNG.");
      return;
    }
    var qr = new QRCodeStyling(qrOptions(Number(el.exportSize.value), "canvas", state.data));
    var blobPromise = qr.getRawData("png");
    navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })])
      .then(function () { toast("Imagen copiada al portapapeles"); addHistory(); })
      .catch(function () { toast("No se pudo copiar la imagen. Usa Descargar PNG."); });
  }

  // ---------- Enlace ----------

  function onUrlInput() {
    var raw = el.urlInput.value;
    var normalized = normalizeUrl(raw);
    var invalid = raw.trim() !== "" && !normalized;
    el.urlInput.classList.toggle("is-invalid", invalid);
    el.urlError.classList.toggle("d-none", !invalid);
    state.data = normalized;
    renderQrDebounced();
  }

  // ---------- Historial ----------

  function readHistory() {
    try {
      var items = JSON.parse(storageGet(HISTORY_KEY) || "[]");
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function addHistory() {
    var data = state.data;
    if (!data) return;
    var items = readHistory().filter(function (it) { return it.data !== data; });
    items.unshift({ data: data, ts: Date.now() });
    storageSet(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_MAX)));
    renderHistory();
  }

  function renderHistory() {
    var items = readHistory();
    el.historyList.innerHTML = "";
    el.historyEmpty.classList.toggle("d-none", items.length > 0);
    el.historyClear.classList.toggle("d-none", items.length === 0);

    items.forEach(function (item) {
      var li = document.createElement("li");

      var icon = document.createElement("span");
      icon.className = "h-icon";
      icon.innerHTML = '<i class="bi bi-link-45deg"></i>';

      var main = document.createElement("div");
      main.className = "h-main";
      var title = document.createElement("div");
      title.className = "h-title text-truncate";
      title.textContent = item.data;
      title.title = item.data;
      var sub = document.createElement("div");
      sub.className = "h-sub text-body-secondary";
      sub.textContent = new Date(item.ts).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
      main.appendChild(title);
      main.appendChild(sub);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-ghost";
      btn.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
      btn.title = "Volver a generar";
      btn.setAttribute("aria-label", "Volver a generar " + item.data);
      btn.addEventListener("click", function () { restoreHistory(item); });

      li.appendChild(icon);
      li.appendChild(main);
      li.appendChild(btn);
      el.historyList.appendChild(li);
    });
  }

  function restoreHistory(item) {
    el.urlInput.value = item.data;
    onUrlInput();
    window.scrollTo({ top: el.qrFrame.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  }

  // ---------- Personalización ----------

  function syncPresetHighlight() {
    var buttons = el.presets.querySelectorAll(".preset");
    buttons.forEach(function (b) {
      var match = b.dataset.fg === el.fgColor.value && b.dataset.bg === el.bgColor.value &&
        b.dataset.dots === el.dotStyle.value && b.dataset.corner === el.cornerStyle.value;
      b.classList.toggle("active", match);
    });
  }

  function onDesignChange() {
    el.marginValue.textContent = el.marginRange.value + " px";
    syncPresetHighlight();
    renderQrDebounced();
  }

  function loadLogo(file) {
    if (!file) return;
    if (file.type.indexOf("image/") !== 0) {
      toast("El logo debe ser una imagen.");
      el.logoInput.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      state.logo = reader.result;
      el.logoClear.classList.remove("d-none");
      // Con logo se tapa parte del código: se sube la corrección de error al máximo.
      if (el.ecLevel.value !== "H") {
        el.ecLevel.value = "H";
        toast("Corrección de error en Máxima para que el QR siga siendo legible con el logo.");
      }
      renderQr();
    };
    reader.readAsDataURL(file);
  }

  // ---------- Tema ----------

  function applyThemeIcon() {
    var dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    el.themeToggle.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
  }

  // ---------- Inicio ----------

  if (typeof QRCodeStyling === "undefined") {
    el.qrTarget.textContent = "No se pudo cargar el generador de QR. Revisa tu conexión y recarga la página.";
    return;
  }

  el.urlInput.addEventListener("input", onUrlInput);
  el.urlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && state.data) { renderQr(); addHistory(); }
  });
  el.pasteBtn.addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      el.urlInput.focus();
      toast("Usa Ctrl+V / Cmd+V para pegar.");
      return;
    }
    navigator.clipboard.readText()
      .then(function (text) { el.urlInput.value = text.trim(); onUrlInput(); })
      .catch(function () { el.urlInput.focus(); toast("Usa Ctrl+V / Cmd+V para pegar."); });
  });

  [el.fgColor, el.bgColor, el.dotStyle, el.cornerStyle, el.ecLevel, el.marginRange].forEach(function (input) {
    input.addEventListener("input", onDesignChange);
    input.addEventListener("change", onDesignChange);
  });

  el.presets.addEventListener("click", function (e) {
    var btn = e.target.closest(".preset");
    if (!btn) return;
    el.fgColor.value = btn.dataset.fg;
    el.bgColor.value = btn.dataset.bg;
    el.dotStyle.value = btn.dataset.dots;
    el.cornerStyle.value = btn.dataset.corner;
    onDesignChange();
  });

  el.logoInput.addEventListener("change", function () { loadLogo(el.logoInput.files[0]); });
  el.logoClear.addEventListener("click", function () {
    state.logo = null;
    el.logoInput.value = "";
    el.logoClear.classList.add("d-none");
    renderQr();
  });

  el.downloadPng.addEventListener("click", function () { download("png"); });
  el.downloadSvg.addEventListener("click", function () { download("svg"); });
  el.copyImage.addEventListener("click", copyImage);

  el.historyClear.addEventListener("click", function () {
    storageSet(HISTORY_KEY, "[]");
    renderHistory();
  });

  el.themeToggle.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    storageSet("ltq-theme", next);
    applyThemeIcon();
  });

  applyThemeIcon();
  syncPresetHighlight();
  renderHistory();

  // Permite abrir el sitio con ?url=https://... para generar directamente.
  var initial = new URLSearchParams(location.search).get("url");
  if (initial) {
    el.urlInput.value = initial;
    onUrlInput();
  }
})();
