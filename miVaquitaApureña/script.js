// @ts-nocheck
/* =============================================
   MI VAQUITA APUREÑA — script.js
   ============================================= */

/* ---------- VACAS FLOTANTES ---------- */

const cowLayer = document.getElementById("cow-layer");

function randomPos() {
  return { x: Math.random() * 88, y: Math.random() * 88 };
}

function moveCow(cow) {
  const p = randomPos();
  cow.style.left = p.x + "%";
  cow.style.top  = p.y + "%";
}

function fireworks(x, y) {
  const colors = ["#3b82f6","#f59e0b","#16a34a","#ec4899","#8b5cf6"];
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:7px; height:7px;
      background:${colors[i % colors.length]};
      border-radius:50%;
      pointer-events:none; z-index:10001;
    `;
    const angle    = (i / 10) * Math.PI * 2;
    const distance = 45 + Math.random() * 25;
    spark.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px)`, opacity: 0 }
    ], { duration: 700, easing: "ease-out" });
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }
}

function spawnPortalRing(x, y, direction) {
  const ring = document.createElement("div");
  const size = 80;
  ring.style.cssText = `
    position: fixed;
    left: ${x - size/2}px;
    top:  ${y - size/2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    border: 4px solid transparent;
    background: transparent;
    pointer-events: none;
    z-index: 10002;
    box-shadow: 0 0 18px 6px ${direction === "out" ? "#a78bfa" : "#34d399"},
                inset 0 0 12px 4px ${direction === "out" ? "#7c3aed" : "#10b981"};
  `;
  const startScale = direction === "out" ? 0.2 : 1.4;
  const endScale   = direction === "out" ? 1.4 : 0.2;
  ring.animate([
    { transform: `scale(${startScale})`, opacity: direction === "out" ? 0 : 1 },
    { transform: "scale(1)",             opacity: 1,   offset: 0.4 },
    { transform: `scale(${endScale})`,   opacity: 0 }
  ], { duration: 600, easing: "ease-out" });
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 620);
}

function createCows() {
  for (let i = 0; i < 2; i++) {
    const cow = document.createElement("div");
    cow.className = "cow";
    cow.innerHTML = "🐮";
    moveCow(cow);
    setInterval(() => moveCow(cow), 7000 + i * 800);
    cow.addEventListener("click", () => {
      if (cow.dataset.teleporting) return;
      cow.dataset.teleporting = "1";
      const r = cow.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      fireworks(cx, cy);
      spawnPortalRing(cx, cy, "out");
      cow.style.animation = "none";
      cow.style.transition = "none";
      cow.style.animationName = "portalOut";
      cow.style.animationDuration = "500ms";
      cow.style.animationFillMode = "forwards";
      cow.style.animationTimingFunction = "ease-in";
      setTimeout(() => {
        moveCow(cow);
        setTimeout(() => {
          const r2 = cow.getBoundingClientRect();
          spawnPortalRing(r2.left + r2.width/2, r2.top + r2.height/2, "in");
          cow.style.animationName = "portalIn";
          cow.style.animationDuration = "600ms";
          cow.style.animationFillMode = "none";
          cow.style.animationTimingFunction = "cubic-bezier(.34,1.56,.64,1)";
          setTimeout(() => {
            cow.style.animation = "";
            cow.style.transition = "";
            delete cow.dataset.teleporting;
          }, 650);
        }, 80);
      }, 480);
    });
    cowLayer.appendChild(cow);
  }
}

document.addEventListener("DOMContentLoaded", createCows);

/* ---------- CARRUSEL ---------- */

let currentSlide = 0;
const track = document.getElementById("track");

function getSlides() {
  return track ? track.querySelectorAll(".product") : [];
}

function updateCarousel() {
  const slides = getSlides();
  if (!track || !slides.length) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) =>
    d.classList.toggle("active", i === currentSlide)
  );
}

function next() {
  const slides = getSlides();
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

function prev() {
  const slides = getSlides();
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
}

function buildDots() {
  const dotsEl = document.getElementById("dots");
  if (!dotsEl) return;
  const slides = getSlides();
  dotsEl.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.onclick = () => { currentSlide = i; updateCarousel(); };
    dotsEl.appendChild(d);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildDots();
  updateCarousel();
  setInterval(next, 4500);
});

/* ---------- TIENDA / MODAL ---------- */

const WHATSAPP_NUMBER = "584125478673";

const PRODUCTS = [
  { id: 1, name: "Queso Mozzarela",     desc: "Suave, elástico y perfecto para fundir",     emoji: "🧀", img: "images/queso-mozzarela.png" },
  { id: 2, name: "Queso Cheddar",       desc: "Intenso, cremoso y lleno de sabor",           emoji: "🧀", img: "images/quese-cheddar.png" },
  { id: 3, name: "Facilitas Mozzarela", desc: "Práctica y deliciosa en cada porción",        emoji: "🫙", img: "images/facil-mozzarella.png" },
  { id: 4, name: "Facilitas Cheddar",   desc: "El sabor cheddar en formato fácil",           emoji: "🫙", img: "images/cheddar.png" },
  { id: 5, name: "GR Yogurt de Fresa",  desc: "Fresco, natural y con sabor a fresa",         emoji: "🍓", img: "images/fresa.png" },
  { id: 6, name: "GR Yogurt de Durazno",desc: "Cremoso y aromático con durazno natural",     emoji: "🍑", img: "images/durazno.png" }
];

const quantities = {};
PRODUCTS.forEach(p => { quantities[p.id] = 0; });

function buildShopProducts() {
  const container = document.getElementById("shopProducts");
  if (!container) return;
  container.innerHTML = "";
  PRODUCTS.forEach(p => {
    const item = document.createElement("div");
    item.className = "shop-item";
    item.id = `shop-item-${p.id}`;
    const imgHtml = p.img
      ? `<img class="shop-item-img" src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="shop-item-emoji" style="display:none">${p.emoji}</div>`
      : `<div class="shop-item-emoji">${p.emoji}</div>`;
    item.innerHTML = `
      ${imgHtml}
      <div class="shop-item-info">
        <div class="shop-item-name">${p.name}</div>
        <div class="shop-item-desc">${p.desc}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn minus" onclick="changeQty(${p.id}, -1)">−</button>
        <span class="qty-num" id="qty-${p.id}">0</span>
        <button class="qty-btn plus" onclick="changeQty(${p.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function changeQty(id, delta) {
  quantities[id] = Math.max(0, quantities[id] + delta);
  const numEl  = document.getElementById(`qty-${id}`);
  const itemEl = document.getElementById(`shop-item-${id}`);
  if (numEl)  numEl.textContent = quantities[id];
  if (itemEl) itemEl.classList.toggle("has-qty", quantities[id] > 0);
  updateSummary();
}

function updateSummary() {
  const sendBtn = document.getElementById("sendBtn");
  const hasItems = PRODUCTS.some(p => quantities[p.id] > 0);
  if (sendBtn) sendBtn.disabled = !hasItems;
}

function sendOrder() {
  const lines = ["*Consulta de productos - Mi Vaquita Apurena*\n"];
  lines.push("Hola, me interesan los siguientes productos:\n");
  PRODUCTS.forEach(p => {
    if (quantities[p.id] > 0) {
      lines.push(`- ${p.name} x ${quantities[p.id]}`);
    }
  });
  lines.push("\nPodrian indicarme disponibilidad y precios?");
  const msg = lines.join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

function openShop() {
  buildShopProducts();
  updateSummary();
  const overlay = document.getElementById("shopOverlay");
  if (overlay) {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeShop() {
  const overlay = document.getElementById("shopOverlay");
  if (overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function closeShopOutside(e) {
  if (e.target.id === "shopOverlay") closeShop();
}

/* ---------- LIGHTBOX ---------- */

function openLightbox(src, name, desc, emoji) {
  const overlay = document.getElementById("lightboxOverlay");
  const img     = document.getElementById("lbImg");
  const emojiEl = document.getElementById("lbEmoji");

  document.getElementById("lbName").textContent = name;
  document.getElementById("lbDesc").textContent = desc;

  // Resetear animación cada vez que se abre
  const wrap = overlay.querySelector(".lightbox-img-wrap");
  wrap.style.animation = "none";
  wrap.offsetHeight; // reflow para reiniciar
  wrap.style.animation = "";

  if (src) {
    img.src = src;
    img.alt = name;
    img.style.display = "block";
    emojiEl.style.display = "none";
    img.onerror = () => {
      img.style.display = "none";
      emojiEl.textContent = emoji;
      emojiEl.style.display = "block";
    };
  } else {
    img.style.display = "none";
    emojiEl.textContent = emoji;
    emojiEl.style.display = "block";
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function closeLightboxOutside(e) {
  if (e.target.id === "lightboxOverlay") closeLightbox();
}

/* ---------- GUARDAR CONTACTO ---------- */

function saveContact(e) {
  e.preventDefault();
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Mi Vaquita Apurena",
    "ORG:Mi Vaquita Apurena",
    "TITLE:Quesos artesanales del llano",
    "TEL;TYPE=CELL,VOICE:+584125478673",
    "URL:https://www.instagram.com/mivaquitaapurena2021",
    "NOTE:Quesos artesanales del llano venezolano",
    "END:VCARD"
  ].join("\r\n");
  const encoded = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcard);
  const a = document.createElement("a");
  a.href = encoded;
  a.download = "MiVaquitaApurena.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* Cerrar con Escape */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeShop();
    closeLightbox();
  }
});