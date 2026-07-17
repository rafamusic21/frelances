const DATA_JSON_PATH = './data.json';

let state = { classes: [] };
let autoDownload = true;
let dataSource = 'repo'; // 'repo' | 'vacio' | 'sin-servidor'

const pickSVG = `<svg class="pick" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2 C6 2 3 7 3 12 C3 17 8 22 12 22 C16 22 21 17 21 12 C21 7 18 2 12 2 Z"
        fill="none" stroke="var(--cyan)" stroke-width="2"/>
</svg>`;

function showToast(msg, type){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('error', 'success');
  if(type) t.classList.add(type);
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ---------- Detección de palabras duplicadas (en inglés) ---------- */

function findDuplicate(en){
  const target = en.trim().toLowerCase();
  for(const c of state.classes){
    const found = c.words.find(w => w.en.trim().toLowerCase() === target);
    if(found) return { classNumber: c.number, word: found };
  }
  return null;
}

let dupHideTimer = null;
function showDuplicateAlert(en, classNumber){
  const overlay = document.getElementById('dupOverlay');
  document.getElementById('dupWord').textContent = `"${en}"`;
  document.getElementById('dupSub').textContent = `Ya la tenés anotada en la clase ${classNumber}`;
  overlay.classList.add('show');
  clearTimeout(dupHideTimer);
  dupHideTimer = setTimeout(() => overlay.classList.remove('show'), 2000);
}

/* ---------------------------------------------------------
   Fuente de verdad: ÚNICAMENTE data.json en el repositorio.

   No se usa localStorage ni ningún otro caché del navegador.
   Al abrir la página siempre se lee data.json tal cual está.
   Mientras trabajás en la sesión actual, los cambios viven en
   memoria y se reflejan en la pantalla, y cada cambio descarga
   un data.json actualizado para que vos lo reemplaces en el
   repo. Si refrescás la página SIN haber reemplazado el
   archivo, todo vuelve a lo que diga el data.json del repo.

   IMPORTANTE: fetch('./data.json') requiere que la página se
   sirva por http/https (Live Server, `python3 -m http.server`,
   GitHub Pages, etc). Si abrís el archivo con doble clic
   (file://), el navegador bloquea esa lectura por seguridad;
   en ese caso se avisa y se trabaja solo en memoria durante
   la sesión (se pierde al refrescar).
--------------------------------------------------------- */

async function loadState(){
  try{
    const res = await fetch(DATA_JSON_PATH, { cache: 'no-store' });
    if(!res.ok) throw new Error('No se encontró data.json');
    const parsed = await res.json();
    if(parsed && Array.isArray(parsed.classes)){
      state = parsed;
      dataSource = 'repo';
    }else{
      state = { classes: [] };
      dataSource = 'vacio';
    }
  }catch(e){
    console.warn('No se pudo leer data.json:', e.message);
    state = { classes: [] };
    dataSource = 'sin-servidor';
  }
  render();
  updateSourceStatus();
}

async function reloadFromRepo(){
  try{
    const res = await fetch(DATA_JSON_PATH, { cache: 'no-store' });
    if(!res.ok) throw new Error('No se encontró data.json');
    const parsed = await res.json();
    if(!parsed || !Array.isArray(parsed.classes)) throw new Error('Formato inválido');
    state = parsed;
    dataSource = 'repo';
    render();
    updateSourceStatus();
    showToast('Datos recargados desde data.json del repositorio ✓', 'success');
  }catch(e){
    showToast('No se pudo leer data.json (¿abriste el archivo con file://?)', 'error');
  }
}

function saveState(){
  // No hay persistencia en el navegador: el estado vive en memoria
  // durante la sesión y se refleja en pantalla. Lo único que persiste
  // de verdad es el data.json que descargás y subís al repo.
  if(autoDownload){
    downloadDataJSON(true);
  }
  updateSourceStatus();
  return true;
}

function downloadDataJSON(silent){
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  if(!silent){
    showToast('data.json descargado. Reemplazalo en tu repo y subilo ✓', 'success');
  }
}

function updateSourceStatus(){
  const el = document.getElementById('fileStatus');
  if(!el) return;
  if(dataSource === 'sin-servidor'){
    el.innerHTML = `No se pudo leer <strong>data.json</strong> (necesitás abrir esto con un servidor local o GitHub Pages, no con doble clic). Los cambios solo viven en esta pestaña hasta que refresques.`;
  }else if(dataSource === 'repo'){
    el.innerHTML = `Datos tomados de <strong>data.json</strong>. Descargá el archivo y reemplazalo en el repo para que tus cambios persistan.`;
  }else{
    el.innerHTML = `data.json está vacío. Agregá tu primera clase.`;
  }
}

/* ---------- Acciones sobre clases y palabras ---------- */

function toastFromSave(ok, successMsg){
  if(ok){
    showToast(autoDownload ? `${successMsg} · data.json descargado, reemplazalo en el repo` : `${successMsg} (recordá descargar data.json)`, 'success');
  }else{
    showToast('No se pudo guardar. Probá de nuevo.', 'error');
  }
}

function addClass(number, title){
  if(state.classes.some(c => c.number === number)){
    showToast(`La clase ${number} ya existe`, 'error');
    return;
  }
  state.classes.push({
    id: 'c' + Date.now(),
    number: number,
    title: title || '',
    words: []
  });
  state.classes.sort((a,b)=> a.number - b.number);
  const ok = saveState();
  render();
  toastFromSave(ok, `Clase ${number} agregada`);
}

function removeClass(id){
  state.classes = state.classes.filter(c => c.id !== id);
  const ok = saveState();
  render();
  toastFromSave(ok, 'Clase eliminada');
}

function addWord(classId, en, es){
  const c = state.classes.find(c => c.id === classId);
  if(!c) return;
  c.words.push({ id: 'w'+Date.now()+Math.random().toString(16).slice(2), en, es });
  const ok = saveState();
  render();
  toastFromSave(ok, 'Palabra guardada');
}

function removeWord(classId, wordId){
  const c = state.classes.find(c => c.id === classId);
  if(!c) return;
  c.words = c.words.filter(w => w.id !== wordId);
  const ok = saveState();
  render();
  toastFromSave(ok, 'Palabra eliminada');
}

function renderStats(){
  const bar = document.getElementById('statsBar');
  const totalClasses = state.classes.length;
  const totalWords = state.classes.reduce((s,c)=>s+c.words.length,0);
  const complete = state.classes.filter(c=>c.words.length>=5).length;
  bar.innerHTML = `
    <div class="pill"><strong>${totalClasses}</strong> clases</div>
    <div class="pill"><strong>${totalWords}</strong> palabras totales</div>
    <div class="pill"><strong>${complete}/${totalClasses||0}</strong> clases completas (≥5)</div>
  `;
}

function render(){
  renderStats();
  const container = document.getElementById('classesContainer');
  const empty = document.getElementById('emptyState');
  container.innerHTML = '';

  if(state.classes.length === 0){
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  state.classes.forEach(c => {
    const card = document.createElement('div');
    card.className = 'class-card';

    const countClass = c.words.length >= 5 ? 'ok' : 'low';
    const countLabel = c.words.length >= 5
      ? `${c.words.length} palabras`
      : `${c.words.length}/5 palabras`;

    card.innerHTML = `
      <div class="class-head">
        <div class="class-head-left">
          <div class="class-num">${c.number}<small>clase</small></div>
          ${c.title ? `<div class="class-title">${escapeHtml(c.title)}</div>` : ''}
        </div>
        <div style="display:flex; align-items:center; gap:14px;">
          <div class="class-count ${countClass}">${countLabel}</div>
          <button class="delete-class" title="Eliminar clase" data-action="remove-class" data-id="${c.id}">✕</button>
        </div>
      </div>
      <div class="word-form">
        <input type="text" placeholder="Palabra en inglés" data-role="en-input" data-id="${c.id}">
        <input type="text" placeholder="Traducción" data-role="es-input" data-id="${c.id}">
        <button class="btn ghost" data-action="add-word" data-id="${c.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Agregar
        </button>
      </div>
      <div class="fretboard">
        ${c.words.length === 0
          ? `<div class="empty-words">Todavía no hay palabras en esta clase.</div>`
          : c.words.map(w => `
            <div class="word-row">
              ${pickSVG}
              <div class="word-en">${escapeHtml(w.en)}</div>
              <div class="word-es">${escapeHtml(w.es)}</div>
              <button class="remove-word" title="Eliminar palabra" data-action="remove-word" data-classid="${c.id}" data-wordid="${w.id}">✕</button>
            </div>
          `).join('')
        }
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('addClassBtn').addEventListener('click', () => {
  const numInput = document.getElementById('newClassNum');
  const titleInput = document.getElementById('newClassTitle');
  const num = parseInt(numInput.value, 10);
  if(!num || num < 1){
    showToast('Ingresá un número de clase válido', 'error');
    return;
  }
  addClass(num, titleInput.value.trim());
  numInput.value = '';
  titleInput.value = '';
  numInput.focus();
});

document.getElementById('newClassNum').addEventListener('keydown', e => {
  if(e.key === 'Enter') document.getElementById('addClassBtn').click();
});
document.getElementById('newClassTitle').addEventListener('keydown', e => {
  if(e.key === 'Enter') document.getElementById('addClassBtn').click();
});

document.getElementById('downloadBtn').addEventListener('click', () => downloadDataJSON(false));
document.getElementById('reloadBtn').addEventListener('click', reloadFromRepo);

document.getElementById('autoDownloadToggle').addEventListener('change', (e) => {
  autoDownload = e.target.checked;
  showToast(autoDownload ? 'Descarga automática activada' : 'Descarga automática desactivada', 'success');
});

document.getElementById('classesContainer').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if(!btn) return;

  if(btn.dataset.action === 'remove-class'){
    removeClass(btn.dataset.id);
  }

  if(btn.dataset.action === 'add-word'){
    const classId = btn.dataset.id;
    const enInput = document.querySelector(`[data-role="en-input"][data-id="${classId}"]`);
    const esInput = document.querySelector(`[data-role="es-input"][data-id="${classId}"]`);
    const en = enInput.value.trim();
    const es = esInput.value.trim();
    if(!en || !es){
      showToast('Completá palabra y traducción', 'error');
      return;
    }
    const dup = findDuplicate(en);
    if(dup){
      showDuplicateAlert(en, dup.classNumber);
      return;
    }
    addWord(classId, en, es);
    enInput.value = '';
    esInput.value = '';
    enInput.focus();
  }

  if(btn.dataset.action === 'remove-word'){
    removeWord(btn.dataset.classid, btn.dataset.wordid);
  }
});

document.getElementById('classesContainer').addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && e.target.matches('[data-role="en-input"], [data-role="es-input"]')){
    const classId = e.target.dataset.id;
    const btn = document.querySelector(`[data-action="add-word"][data-id="${classId}"]`);
    if(btn) btn.click();
  }
});

loadState();
