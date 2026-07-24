// @ts-nocheck
/* =============================================
   BODEGÓN LOS CUÑADOS — admin.js (panel del dueño)
   ============================================= */

/* ---------- CONFIGURACIÓN ---------- */
// Cambia esta contraseña por la que quieras usar.
 const ADMIN_PASSWORD = "cunados2025";

// Íconos disponibles para elegir en el formulario de categorías.
const ICON_OPTIONS = [
  { value: "fa-solid fa-cow",             label: "🐄 Vaca (lácteos)" },
  { value: "fa-solid fa-drumstick-bite",  label: "🍗 Muslo (embutidos/carnes)" },
  { value: "fa-solid fa-basket-shopping", label: "🛒 Canasta (víveres)" },
  { value: "fa-solid fa-wine-bottle",     label: "🍾 Botella (bebidas)" },
  { value: "fa-solid fa-bread-slice",     label: "🍞 Pan (panadería)" },
  { value: "fa-solid fa-apple-whole",     label: "🍎 Fruta (frutas/verduras)" },
  { value: "fa-solid fa-fish",            label: "🐟 Pescado" },
  { value: "fa-solid fa-egg",             label: "🥚 Huevo" },
  { value: "fa-solid fa-mug-hot",         label: "☕ Café/infusiones" },
  { value: "fa-solid fa-candy-cane",      label: "🍬 Dulces" },
  { value: "fa-solid fa-soap",            label: "🧼 Limpieza/aseo" },
  { value: "fa-solid fa-pump-soap",       label: "🧴 Higiene personal" },
  { value: "fa-solid fa-store",           label: "🏬 General" },
];

const DRAFT_KEY = "bc_admin_draft_v1";
const MAX_IMG_DIMENSION = 700;   // px, para fotos de producto
const MAX_LOGO_DIMENSION = 400;  // px, para el logo
const JPEG_QUALITY = 0.78;

let data = { logo: null, categories: [], products: [] };
let dirty = false; // true si hay cambios sin publicar (descargar data.json)

/* ---------- LOGIN ---------- */
function tryLogin() {
  const val = document.getElementById("loginPass").value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem("bc_admin_ok", "1");
    showPanel();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}
function logout() {
  sessionStorage.removeItem("bc_admin_ok");
  location.reload();
}
function showPanel() {
  document.getElementById("loginGate").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  initAdmin();
}

document.getElementById("loginPass").addEventListener("keydown", e => {
  if (e.key === "Enter") tryLogin();
});

if (sessionStorage.getItem("bc_admin_ok") === "1") {
  showPanel();
}

/* ---------- CARGA INICIAL DE DATOS ---------- */
async function initAdmin() {
  populateIconSelect();

  const draftRaw = localStorage.getItem(DRAFT_KEY);
  let draft = null;
  try { draft = draftRaw ? JSON.parse(draftRaw) : null; } catch (e) { draft = null; }

  let fetched = null;
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (res.ok) fetched = await res.json();
  } catch (e) {
    console.warn("No se pudo leer data.json (¿estás abriendo el archivo directamente sin subirlo a un hosting?)", e);
  }

  if (draft && confirm("Se encontró un borrador con cambios sin publicar de una sesión anterior. ¿Deseas continuarlo? (Cancelar = empezar desde el data.json publicado)")) {
    data = draft;
    setDirty(true);
  } else if (fetched) {
    data = fetched;
    setDirty(false);
  } else {
    data = { logo: null, categories: [], products: [] };
    showToast("No se encontró data.json. Empezando desde cero.");
  }

  renderAll();
}

function setDirty(val) {
  dirty = val;
  document.getElementById("unsavedIndicator").style.display = val ? "inline" : "none";
}
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  setDirty(true);
}

/* ---------- RENDER GENERAL ---------- */
function renderAll() {
  renderLogo();
  renderCategoryList();
  renderCategorySelects();
  renderProductList();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- COMPRESIÓN DE IMÁGENES ---------- */
function fileToCompressedDataUrl(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo leer la imagen"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
          else { width = Math.round(width * (maxDim / height)); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- LOGO ---------- */
function renderLogo() {
  const box = document.getElementById("logoPreview");
  box.innerHTML = data.logo ? `<img src="${data.logo}" alt="Logo">` : "🛒";
}

async function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    data.logo = await fileToCompressedDataUrl(file, MAX_LOGO_DIMENSION, JPEG_QUALITY);
    renderLogo();
    saveDraft();
    showToast("Logo actualizado (recuerda publicar).");
  } catch (err) {
    alert("No se pudo procesar la imagen: " + err.message);
  }
  e.target.value = "";
}

function removeLogo() {
  data.logo = null;
  renderLogo();
  saveDraft();
  showToast("Logo eliminado (recuerda publicar).");
}

/* ---------- CATEGORÍAS ---------- */
function populateIconSelect() {
  const sel = document.getElementById("newCatIcon");
  sel.innerHTML = ICON_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
}

function slugify(text) {
  return text.toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || ("cat_" + Date.now());
}

function renderCategoryList() {
  const list = document.getElementById("categoryList");
  document.getElementById("catCount").textContent = data.categories.length;
  if (data.categories.length === 0) {
    list.innerHTML = `<div class="empty-msg">Todavía no hay categorías.</div>`;
    return;
  }
  list.innerHTML = data.categories.map((c, i) => `
    <div class="list-item">
      <div class="thumb"><i class="${c.icon}"></i></div>
      <div class="info">
        <div class="name">${c.emojiTab} ${escapeHtml(c.label)}</div>
        <div class="meta">${countProductsInCat(c.id)} producto(s)</div>
      </div>
      <div class="actions">
        <button title="Subir" onclick="moveCategory(${i},-1)" ${i===0?"disabled":""}><i class="fa-solid fa-arrow-up"></i></button>
        <button title="Bajar" onclick="moveCategory(${i},1)" ${i===data.categories.length-1?"disabled":""}><i class="fa-solid fa-arrow-down"></i></button>
        <button title="Editar" onclick="editCategory('${c.id}')"><i class="fa-solid fa-pen"></i></button>
        <button title="Eliminar" class="danger" onclick="deleteCategory('${c.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join("");
}

function countProductsInCat(catId) {
  return data.products.filter(p => p.cat === catId).length;
}

function addCategory() {
  const label = document.getElementById("newCatLabel").value.trim();
  const icon  = document.getElementById("newCatIcon").value;
  const emoji = document.getElementById("newCatEmoji").value.trim() || "🛒";
  if (!label) { alert("Escribe un nombre para la categoría."); return; }

  let id = slugify(label);
  let suffix = 2;
  while (data.categories.some(c => c.id === id)) { id = slugify(label) + "_" + suffix++; }

  data.categories.push({ id, label, icon, emojiTab: emoji });
  document.getElementById("newCatLabel").value = "";
  document.getElementById("newCatEmoji").value = "";
  renderCategoryList();
  renderCategorySelects();
  saveDraft();
  showToast("Categoría agregada (recuerda publicar).");
}

function editCategory(id) {
  const c = data.categories.find(c => c.id === id);
  if (!c) return;
  const newLabel = prompt("Nombre de la categoría:", c.label);
  if (newLabel === null) return;
  const newEmoji = prompt("Emoji para las pestañas:", c.emojiTab);
  if (newEmoji === null) return;
  c.label = newLabel.trim() || c.label;
  c.emojiTab = newEmoji.trim() || c.emojiTab;
  renderCategoryList();
  renderCategorySelects();
  renderProductList();
  saveDraft();
  showToast("Categoría actualizada (recuerda publicar).");
}

function deleteCategory(id) {
  const count = countProductsInCat(id);
  if (count > 0) {
    alert(`No puedes eliminar esta categoría porque tiene ${count} producto(s). Muévelos o elimínalos primero.`);
    return;
  }
  if (!confirm("¿Eliminar esta categoría?")) return;
  data.categories = data.categories.filter(c => c.id !== id);
  renderCategoryList();
  renderCategorySelects();
  saveDraft();
  showToast("Categoría eliminada (recuerda publicar).");
}

function moveCategory(index, dir) {
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= data.categories.length) return;
  const arr = data.categories;
  [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
  renderCategoryList();
  saveDraft();
}

function renderCategorySelects() {
  const sel = document.getElementById("newProdCat");
  if (data.categories.length === 0) {
    sel.innerHTML = `<option value="">Crea una categoría primero</option>`;
    return;
  }
  sel.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.emojiTab} ${escapeHtml(c.label)}</option>`).join("");
}

/* ---------- PRODUCTOS ---------- */
function nextProductId() {
  return data.products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function renderProductList() {
  const list = document.getElementById("productList");
  document.getElementById("prodCount").textContent = data.products.length;
  if (data.products.length === 0) {
    list.innerHTML = `<div class="empty-msg">Todavía no hay productos.</div>`;
    return;
  }
  list.innerHTML = data.products.map(p => {
    const cat = data.categories.find(c => c.id === p.cat);
    return `
    <div class="list-item">
      <div class="thumb">${p.img ? `<img src="${p.img}" alt="">` : p.emoji}</div>
      <div class="info">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="meta">${cat ? cat.emojiTab + " " + escapeHtml(cat.label) : "(sin categoría)"} · ${escapeHtml(p.desc)}</div>
      </div>
      <div class="actions">
        <button title="Editar" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i></button>
        <button title="Cambiar foto" onclick="document.getElementById('imgFor${p.id}').click()"><i class="fa-solid fa-camera"></i></button>
        <input type="file" accept="image/*" id="imgFor${p.id}" style="display:none" onchange="handleProductImgUpload(event, ${p.id})">
        <button title="Eliminar" class="danger" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

async function addProduct() {
  const name = document.getElementById("newProdName").value.trim();
  const cat  = document.getElementById("newProdCat").value;
  const desc = document.getElementById("newProdDesc").value.trim();
  const emoji = document.getElementById("newProdEmoji").value.trim() || "🛒";
  const fileInput = document.getElementById("newProdImg");

  if (!name)  { alert("Escribe el nombre del producto."); return; }
  if (!cat)   { alert("Elige una categoría (crea una primero si no hay ninguna)."); return; }

  let img = null;
  if (fileInput.files[0]) {
    try {
      img = await fileToCompressedDataUrl(fileInput.files[0], MAX_IMG_DIMENSION, JPEG_QUALITY);
    } catch (err) {
      alert("No se pudo procesar la foto: " + err.message);
    }
  }

  data.products.push({ id: nextProductId(), cat, name, desc, emoji, img });

  document.getElementById("newProdName").value = "";
  document.getElementById("newProdDesc").value = "";
  document.getElementById("newProdEmoji").value = "";
  fileInput.value = "";

  renderProductList();
  saveDraft();
  showToast("Producto agregado (recuerda publicar).");
}

function editProduct(id) {
  const p = data.products.find(p => p.id === id);
  if (!p) return;
  const newName = prompt("Nombre del producto:", p.name);
  if (newName === null) return;
  const newDesc = prompt("Descripción corta:", p.desc);
  if (newDesc === null) return;
  const newEmoji = prompt("Emoji (se usa si no hay foto):", p.emoji);
  if (newEmoji === null) return;

  const catOptions = data.categories.map(c => `${c.id} = ${c.label}`).join("\n");
  const newCat = prompt(`Categoría (escribe el id exacto):\n${catOptions}`, p.cat);
  if (newCat === null) return;
  if (!data.categories.some(c => c.id === newCat)) {
    alert("Ese id de categoría no existe. No se cambió la categoría.");
  } else {
    p.cat = newCat;
  }

  p.name = newName.trim() || p.name;
  p.desc = newDesc.trim() || p.desc;
  p.emoji = newEmoji.trim() || p.emoji;

  renderProductList();
  saveDraft();
  showToast("Producto actualizado (recuerda publicar).");
}

async function handleProductImgUpload(e, id) {
  const file = e.target.files[0];
  if (!file) return;
  const p = data.products.find(p => p.id === id);
  if (!p) return;
  try {
    p.img = await fileToCompressedDataUrl(file, MAX_IMG_DIMENSION, JPEG_QUALITY);
    renderProductList();
    saveDraft();
    showToast("Foto actualizada (recuerda publicar).");
  } catch (err) {
    alert("No se pudo procesar la foto: " + err.message);
  }
  e.target.value = "";
}

function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  data.products = data.products.filter(p => p.id !== id);
  renderProductList();
  saveDraft();
  showToast("Producto eliminado (recuerda publicar).");
}

/* ---------- PUBLICAR (descargar data.json) ---------- */
function downloadData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  setDirty(false);
  localStorage.removeItem(DRAFT_KEY);
  showToast("Descargado. Súbelo a tu hosting para publicar los cambios.");
}

/* ---------- UTILIDADES ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}