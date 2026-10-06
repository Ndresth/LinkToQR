(function () {
  "use strict";

  var MAX_BYTES = 4 * 1024 * 1024;
  var PREVIEW_SIZE = 320;
  var HISTORY_KEY = "ltq-history";
  var PASSWORD_KEY = "ltq-upload-password";
  var HISTORY_MAX = 12;

  var $ = function (id) { return document.getElementById(id); };

  var el = {
    urlInput: $("urlInput"), urlError: $("urlError"), pasteBtn: $("pasteBtn"),
    dropZone: $("dropZone"), fileInput: $("fileInput"), fileSelected: $("fileSelected"),
    fileName: $("fileName"), fileSize: $("fileSize"), fileIcon: $("fileIcon"), fileClear: $("fileClear"),
    passwordGroup: $("passwordGroup"), uploadPassword: $("uploadPassword"),
    progressWrap: $("uploadProgressWrap"), progress: $("uploadProgress"), uploadError: $("uploadError"),
    uploadBtn: $("uploadBtn"), fileResult: $("fileResult"), fileUrl: $("fileUrl"), fileOpen: $("fileOpen"),
    fgColor: $("fgColor"), bgColor: $("bgColor"), dotStyle: $("dotStyle"), cornerStyle: $("cornerStyle"),
    logoInput: $("logoInput"), logoClear: $("logoClear"), ecLevel: $("ecLevel"), exportSize: $("exportSize"),
    marginRange: $("marginRange"), marginValue: $("marginValue"), presets: $("presets"),
    qrFrame: $("qrFrame"), qrCanvas: $("qrCanvas"), qrTarget: $("qrTarget"),
    downloadPng: $("downloadPng"), downloadSvg: $("downloadSvg"), copyImage: $("copyImage"),
    historyList: $("historyList"), historyEmpty: $("historyEmpty"), historyClear: $("historyClear"),
    themeToggle: $("themeToggle"), toast: $("toast"), toastBody: $("toastBody")
  };

  var state = {
    mode: "link",
    linkData: null,
    fileData: null,
    fileLabel: null,
    pendingFile: null,
    logo: null,
    uploading: false
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

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function fileIconFor(type, name) {
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (type === "application/pdf" || ext === "pdf") return "bi-file-earmark-pdf";
    if (type.indexOf("image/") === 0) return "bi-file-earmark-image";
    if (type.indexOf("audio/") === 0) return "bi-file-earmark-music";
    if (type.indexOf("video/") === 0) return "bi-file-earmark-play";
    if (/^(zip|rar|7z|gz|tar)$/.test(ext)) return "bi-file-earmark-zip";
    if (/^(doc|docx|odt|rtf)$/.test(ext)) return "bi-file-earmark-word";
    if (/^(xls|xlsx|ods|csv)$/.test(ext)) return "bi-file-earmark-excel";
    if (/^(ppt|pptx|odp)$/.test(ext)) return "bi-file-earmark-ppt";
    if (type.indexOf("text/") === 0 || ext === "txt") return "bi-file-earmark-text";
    return "bi-file-earmark";
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

  function currentData() {
    return state.mode === "link" ? state.linkData : state.fileData;
  }

  function currentLabel() {
    return state.mode === "link" ? state.linkData : (state.fileLabel || state.fileData);
  }

  function setActionsEnabled(enabled) {
    el.downloadPng.disabled = !enabled;
    el.downloadSvg.disabled = !enabled;
    el.copyImage.disabled = !enabled;
  }

  function renderQr() {
    var data = currentData();
    el.qrCanvas.innerHTML = "";

    if (!data) {
      el.qrFrame.classList.remove("has-qr");
      el.qrTarget.textContent = state.mode === "link" ? "Escribe un enlace o sube un archivo" : "Sube un archivo para generar su QR";
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
    el.qrTarget.textContent = currentLabel();
    el.qrTarget.title = data;
    setActionsEnabled(true);
  }

  var renderQrDebounced = debounce(renderQr, 120);

  function downloadName() {
    if (state.mode === "file") return "qr-" + slugify((state.fileLabel || "archivo").replace(/\.[^.]+$/, ""));
    try { return "qr-" + slugify(new URL(state.linkData).hostname.replace(/^www\./, "")); }
    catch (e) { return "qr-" + slugify(state.linkData); }
  }

  function download(extension) {
    var data = currentData();
    if (!data) return;
    var size = extension === "png" ? Number(el.exportSize.value) : 1024;
    var qr = new QRCodeStyling(qrOptions(size, extension === "png" ? "canvas" : "svg", data));
    qr.download({ name: downloadName(), extension: extension });
    addHistory();
  }

  function copyImage() {
    var data = currentData();
    if (!data) return;
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      toast("Tu navegador no permite copiar imágenes. Usa Descargar PNG.");
      return;
    }
    var qr = new QRCodeStyling(qrOptions(Number(el.exportSize.value), "canvas", data));
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
    state.linkData = normalized;
    renderQrDebounced();
  }

  // ---------- Archivo ----------

  function selectFile(file) {
    hideUploadError();
    if (!file) return;
    if (file.size === 0) {
      showUploadError("El archivo está vacío.");
      return;
    }
    if (file.size > MAX_BYTES) {
      showUploadError("El archivo pesa " + formatBytes(file.size) + ". El máximo permitido es 4 MB.");
      return;
    }
    state.pendingFile = file;
    el.fileName.textContent = file.name;
    el.fileSize.textContent = formatBytes(file.size);
    el.fileIcon.className = "bi " + fileIconFor(file.type || "", file.name);
    el.fileSelected.classList.remove("d-none");
    el.uploadBtn.disabled = false;
  }

  function clearFile() {
    state.pendingFile = null;
    el.fileInput.value = "";
    el.fileSelected.classList.add("d-none");
    el.uploadBtn.disabled = true;
    hideUploadError();
  }

  function showUploadError(message) {
    el.uploadError.textContent = message;
    el.uploadError.classList.remove("d-none");
  }
  function hideUploadError() {
    el.uploadError.classList.add("d-none");
  }

  function setUploading(on) {
    state.uploading = on;
    el.uploadBtn.disabled = on || !state.pendingFile;
    el.uploadBtn.innerHTML = on
      ? '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Subiendo…'
      : '<i class="bi bi-cloud-upload me-1"></i> Subir y generar QR';
    el.progressWrap.classList.toggle("d-none", !on);
    if (on) el.progress.style.width = "0%";
  }

  function showFileResult(url, label) {
    state.fileData = url;
    state.fileLabel = label;
    el.fileUrl.value = url;
    el.fileOpen.href = url;
    el.fileResult.classList.remove("d-none");
    renderQr();
  }

  function upload() {
    var file = state.pendingFile;
    if (!file || state.uploading) return;
    hideUploadError();
    setUploading(true);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
    var password = el.uploadPassword.value || storageGet(PASSWORD_KEY);
    if (password) xhr.setRequestHeader("X-Upload-Password", encodeURIComponent(password));

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) el.progress.style.width = Math.round((e.loaded / e.total) * 100) + "%";
    };

    xhr.onload = function () {
      setUploading(false);
      var body = {};
      try { body = JSON.parse(xhr.responseText); } catch (e) { /* respuesta no JSON */ }

      if (xhr.status === 201 && body.path) {
        if (password) storageSet(PASSWORD_KEY, password);
        var url = location.origin + body.path;
        showFileResult(url, body.name || file.name);
        addHistory();
        clearFile();
        toast("Archivo subido. Tu QR está listo.");
        if (window.innerWidth < 992) el.qrFrame.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (xhr.status === 401) {
        try { localStorage.removeItem(PASSWORD_KEY); } catch (e) { /* sin almacenamiento */ }
        el.passwordGroup.classList.remove("d-none");
        el.uploadPassword.focus();
        showUploadError(password ? "Contraseña incorrecta." : "Este sitio requiere una contraseña para subir archivos.");
        return;
      }
      if (xhr.status === 404) {
        showUploadError("No se encontró el servicio de subida. Si estás en local, ejecuta el sitio con «netlify dev».");
        return;
      }
      showUploadError(body.error || "No se pudo subir el archivo (error " + xhr.status + ").");
    };

    xhr.onerror = function () {
      setUploading(false);
      showUploadError("Error de red al subir el archivo. Revisa tu conexión e inténtalo de nuevo.");
    };

    xhr.send(file);
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
    var data = currentData();
    if (!data) return;
    var items = readHistory().filter(function (it) { return it.data !== data; });
    items.unshift({ kind: state.mode, data: data, label: currentLabel(), ts: Date.now() });
    storageSet(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_MAX)));
    renderHistory();
  }

  function renderHistory() {
    var items = readHistory();
    el.historyList.innerHTML = "";
    el.historyEmpty.classList.toggle("d-none", items.length > 0);
    el.historyClear.classList.toggle("d-none", items.length === 0);

    items.forEach(function (item, index) {
      var li = document.createElement("li");

      var icon = document.createElement("span");
      icon.className = "h-icon";
      icon.innerHTML = item.kind === "file" ? '<i class="bi bi-file-earmark"></i>' : '<i class="bi bi-link-45deg"></i>';

      var main = document.createElement("div");
      main.className = "h-main";
      var title = document.createElement("div");
      title.className = "h-title text-truncate";
      title.textContent = item.label || item.data;
      title.title = item.data;
      var sub = document.createElement("div");
      sub.className = "h-sub text-body-secondary";
      sub.textContent = (item.kind === "file" ? "Archivo · " : "Enlace · ") + new Date(item.ts).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
      main.appendChild(title);
      main.appendChild(sub);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-ghost";
      btn.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
      btn.title = "Volver a generar";
      btn.setAttribute("aria-label", "Volver a generar " + (item.label || item.data));
      btn.addEventListener("click", function () { restoreHistory(items[index]); });

      li.appendChild(icon);
      li.appendChild(main);
      li.appendChild(btn);
      el.historyList.appendChild(li);
    });
  }

  function restoreHistory(item) {
    if (item.kind === "file") {
      bootstrap.Tab.getOrCreateInstance($("tab-file")).show();
      state.mode = "file";
      showFileResult(item.data, item.label);
    } else {
      bootstrap.Tab.getOrCreateInstance($("tab-link")).show();
      state.mode = "link";
      el.urlInput.value = item.data;
      onUrlInput();
    }
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

  // ---------- Eventos ----------

  el.urlInput.addEventListener("input", onUrlInput);
  el.urlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && state.linkData) { renderQr(); addHistory(); }
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

  el.dropZone.addEventListener("click", function () { el.fileInput.click(); });
  el.dropZone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.fileInput.click(); }
  });
  el.fileInput.addEventListener("change", function () { selectFile(el.fileInput.files[0]); });
  ["dragenter", "dragover"].forEach(function (type) {
    el.dropZone.addEventListener(type, function (e) { e.preventDefault(); el.dropZone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (type) {
    el.dropZone.addEventListener(type, function (e) { e.preventDefault(); el.dropZone.classList.remove("dragover"); });
  });
  el.dropZone.addEventListener("drop", function (e) {
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) selectFile(files[0]);
  });
  el.fileClear.addEventListener("click", clearFile);
  el.uploadBtn.addEventListener("click", upload);

  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = $(btn.getAttribute("data-copy-target"));
      var text = input.value;
      if (!text) return;
      var done = function () { toast("Enlace copiado"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { input.select(); document.execCommand("copy"); done(); });
      } else {
        input.select();
        document.execCommand("copy");
        done();
      }
    });
  });

  document.querySelectorAll('#modeTabs button[data-bs-toggle="pill"]').forEach(function (tab) {
    tab.addEventListener("shown.bs.tab", function (e) {
      state.mode = e.target.id === "tab-file" ? "file" : "link";
      renderQr();
    });
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

  // ---------- Inicio ----------

  if (typeof QRCodeStyling === "undefined") {
    el.qrTarget.textContent = "No se pudo cargar el generador de QR. Revisa tu conexión y recarga la página.";
    return;
  }

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
