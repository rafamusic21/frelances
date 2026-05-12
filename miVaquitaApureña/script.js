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

/* portal visual ring */
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
      if (cow.dataset.teleporting) return; // evitar doble click
      cow.dataset.teleporting = "1";

      const r = cow.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;

      fireworks(cx, cy);
      spawnPortalRing(cx, cy, "out");

      /* animación salida */
      cow.style.animation = "none";
      cow.style.transition = "none";
      cow.style.animationName = "portalOut";
      cow.style.animationDuration = "500ms";
      cow.style.animationFillMode = "forwards";
      cow.style.animationTimingFunction = "ease-in";

      setTimeout(() => {
        /* mover a nueva posición (invisible aún) */
        moveCow(cow);

        /* pequeña pausa antes de aparecer */
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
  /* Auto-avance carrusel */
  setInterval(next, 4500);
});

/* ---------- TIENDA / MODAL ---------- */

const WHATSAPP_NUMBER = "584247491899"; // número destino

const PRODUCTS = [
  {
    id: 1,
    name: "Queso Llanero",
    desc: "Firme, salado y artesanal — el clásico del llano",
    price: 5.00,
    unit: "kg",
    emoji: "🧀",
    img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=120"
  },
  {
    id: 2,
    name: "Queso de Mano",
    desc: "Suave, fresco y derretido perfecto",
    price: 6.50,
    unit: "kg",
    emoji: "🫙",
    img: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=120"
  },
  {
    id: 3,
    name: "Queso Guayanés",
    desc: "Cremoso, ideal para tequeños y repostería",
    price: 7.00,
    unit: "kg",
    emoji: "🥛",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=120"
  },
  {
    id: 4,
    name: "Mantequilla de Leche",
    desc: "100% natural, directa del llano venezolano",
    price: 4.50,
    unit: "500g",
    emoji: "🧈",
    img: null
  }
];

/* Estado de cantidades */
const quantities = {};
PRODUCTS.forEach(p => { quantities[p.id] = 0; });

/* Renderizar productos en el modal */
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
        <div class="shop-item-price">$${p.price.toFixed(2)} / ${p.unit}</div>
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

/* Cambiar cantidad */
function changeQty(id, delta) {
  quantities[id] = Math.max(0, quantities[id] + delta);

  const numEl  = document.getElementById(`qty-${id}`);
  const itemEl = document.getElementById(`shop-item-${id}`);
  if (numEl)  numEl.textContent = quantities[id];
  if (itemEl) itemEl.classList.toggle("has-qty", quantities[id] > 0);

  updateSummary();
}

/* Actualizar resumen y botón */
function updateSummary() {
  let total = 0;
  PRODUCTS.forEach(p => { total += quantities[p.id] * p.price; });

  const totalEl  = document.getElementById("totalPrice");
  const sendBtn  = document.getElementById("sendBtn");
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  const hasItems = PRODUCTS.some(p => quantities[p.id] > 0);
  if (sendBtn) sendBtn.disabled = !hasItems;
}

/* Construir y enviar mensaje a WhatsApp */
function sendOrder() {
  const lines = ["🧀 *Pedido - Mi Vaquita Apureña*\n"];

  let total = 0;
  PRODUCTS.forEach(p => {
    if (quantities[p.id] > 0) {
      const subtotal = quantities[p.id] * p.price;
      total += subtotal;
      lines.push(`• ${p.name} × ${quantities[p.id]} ${p.unit}  →  $${subtotal.toFixed(2)}`);
    }
  });

  lines.push(`\n💰 *Total estimado: $${total.toFixed(2)}*`);
  lines.push("\nHola, me gustaría hacer este pedido. ¿Pueden confirmar disponibilidad? 🙏");

  const msg = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

/* Abrir / cerrar modal */
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
    "TEL;TYPE=CELL,VOICE:+584247491899",
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
  if (e.key === "Escape") closeShop();
});