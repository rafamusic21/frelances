// @ts-nocheck
/* =============================================
   BODEGÓN LOS CUÑADOS — script.js
   ============================================= */

/* ---------- ANIMACIÓN FLOTANTE ---------- */
const cowLayer = document.getElementById("cow-layer");

function randomPos() { return { x: Math.random()*88, y: Math.random()*88 }; }
function moveCow(cow) { const p=randomPos(); cow.style.left=p.x+"%"; cow.style.top=p.y+"%"; }

function fireworks(x,y) {
  const colors=["#D9AC84","#000E2B","#F4EDE1","#c49060","#e8c9a8"];
  for(let i=0;i<10;i++){
    const s=document.createElement("div");
    s.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:7px;height:7px;background:${colors[i%colors.length]};border-radius:50%;pointer-events:none;z-index:10001;`;
    const a=(i/10)*Math.PI*2,d=45+Math.random()*25;
    s.animate([{transform:"translate(0,0)",opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px)`,opacity:0}],{duration:700,easing:"ease-out"});
    document.body.appendChild(s); setTimeout(()=>s.remove(),700);
  }
}

function spawnPortalRing(x,y,dir) {
  const ring=document.createElement("div"),size=80;
  ring.style.cssText=`position:fixed;left:${x-size/2}px;top:${y-size/2}px;width:${size}px;height:${size}px;border-radius:50%;border:4px solid transparent;background:transparent;pointer-events:none;z-index:10002;box-shadow:0 0 18px 6px ${dir==="out"?"#D9AC84":"#F4EDE1"},inset 0 0 12px 4px ${dir==="out"?"#c49060":"#e8c9a8"};`;
  const s=dir==="out"?0.2:1.4,e=dir==="out"?1.4:0.2;
  ring.animate([{transform:`scale(${s})`,opacity:dir==="out"?0:1},{transform:"scale(1)",opacity:1,offset:.4},{transform:`scale(${e})`,opacity:0}],{duration:600,easing:"ease-out"});
  document.body.appendChild(ring); setTimeout(()=>ring.remove(),620);
}

function createCows() {
  for(let i=0;i<2;i++){
    const cow=document.createElement("div");
    cow.className="cow"; cow.innerHTML="🛒";
    moveCow(cow);
    setInterval(()=>moveCow(cow),7000+i*800);
    cow.addEventListener("click",()=>{
      if(cow.dataset.teleporting)return;
      cow.dataset.teleporting="1";
      const r=cow.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      fireworks(cx,cy); spawnPortalRing(cx,cy,"out");
      cow.style.animation="none"; cow.style.transition="none";
      cow.style.animationName="portalOut"; cow.style.animationDuration="500ms";
      cow.style.animationFillMode="forwards"; cow.style.animationTimingFunction="ease-in";
      setTimeout(()=>{
        moveCow(cow);
        setTimeout(()=>{
          const r2=cow.getBoundingClientRect();
          spawnPortalRing(r2.left+r2.width/2,r2.top+r2.height/2,"in");
          cow.style.animationName="portalIn"; cow.style.animationDuration="600ms";
          cow.style.animationFillMode="none"; cow.style.animationTimingFunction="cubic-bezier(.34,1.56,.64,1)";
          setTimeout(()=>{ cow.style.animation=""; cow.style.transition=""; delete cow.dataset.teleporting; },650);
        },80);
      },480);
    });
    cowLayer.appendChild(cow);
  }
}
document.addEventListener("DOMContentLoaded", createCows);

/* ---------- CARRUSELES ---------- */
const carousels = { lacteos:{current:0}, embutidos:{current:0}, viveres:{current:0} };

function getTrack(id){ return document.getElementById("track-"+id); }
function getDots(id) { return document.getElementById("dots-"+id); }

function updateCarousel(id) {
  const track=getTrack(id); if(!track)return;
  const slides=track.querySelectorAll(".product");
  track.style.transform=`translateX(-${carousels[id].current*100}%)`;
  getDots(id).querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===carousels[id].current));
}

function nextSlide(id) {
  const slides=getTrack(id).querySelectorAll(".product");
  carousels[id].current=(carousels[id].current+1)%slides.length;
  updateCarousel(id);
}

function prevSlide(id) {
  const slides=getTrack(id).querySelectorAll(".product");
  carousels[id].current=(carousels[id].current-1+slides.length)%slides.length;
  updateCarousel(id);
}

function buildDots(id) {
  const dotsEl=getDots(id); if(!dotsEl)return;
  const slides=getTrack(id).querySelectorAll(".product");
  dotsEl.innerHTML="";
  slides.forEach((_,i)=>{
    const d=document.createElement("div");
    d.className="dot"+(i===0?" active":"");
    d.onclick=()=>{ carousels[id].current=i; updateCarousel(id); };
    dotsEl.appendChild(d);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  ["lacteos","embutidos","viveres"].forEach(id=>{
    buildDots(id); updateCarousel(id);
    setInterval(()=>nextSlide(id),4500+Math.random()*500);
  });
});

/* ---------- GRID DE TODOS LOS PRODUCTOS ---------- */
const ALL_PRODUCTS_GRID = [
  { name:"Queso Mozzarela",    desc:"Suave y elástico, ideal para fundir",          emoji:"🧀", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Queso Cheddar",      desc:"Intenso y cremoso, lleno de sabor",             emoji:"🧀", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Mantequilla",        desc:"Cremosa y natural, hecha con leche fresca",     emoji:"🧈", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Yogurt Natural",     desc:"Fresco y nutritivo, sin azúcar añadida",        emoji:"🥛", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Leche Pasteurizada", desc:"Fresca y nutritiva, directo del campo",         emoji:"🥛", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Queso Blanco",       desc:"Artesanal, firme y con sabor tradicional",      emoji:"🧀", img:"images/queso-mozzarela.png", cat:"lacteos"   },
  { name:"Mortadela",          desc:"Clásica y sabrosa, perfecta para sándwiches",   emoji:"🥩", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Jamón de Pierna",    desc:"Jugoso y tierno, de calidad premium",           emoji:"🍖", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Salchichón",         desc:"Firme y aromático, con especias selectas",      emoji:"🌭", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Salchicha de Res",   desc:"Tierna y jugosa, ideal para la parrilla",       emoji:"🌭", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Pepperoni",          desc:"Picante y sabroso, perfecto para pizzas",       emoji:"🍕", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Tocineta",           desc:"Ahumada y crujiente, irresistible",             emoji:"🥓", img:"images/queso-mozzarela.png", cat:"embutidos" },
  { name:"Harina de Maíz",     desc:"Harina precocida, lista para tus arepas",       emoji:"🌽", img:"images/queso-mozzarela.png", cat:"viveres"   },
  { name:"Arroz",              desc:"Grano largo, suelto y de primera calidad",      emoji:"🍚", img:"images/queso-mozzarela.png", cat:"viveres"   },
  { name:"Pasta",              desc:"Variedad de cortes, al dente perfecta",         emoji:"🍝", img:"images/queso-mozzarela.png", cat:"viveres"   },
  { name:"Aceite Vegetal",     desc:"Suave y ligero para todas tus recetas",         emoji:"🫙", img:"images/queso-mozzarela.png", cat:"viveres"   },
  { name:"Caraotas Negras",    desc:"Selectas y tiernas, sabor venezolano",          emoji:"🫘", img:"images/queso-mozzarela.png", cat:"viveres"   },
  { name:"Azúcar",             desc:"Refinada y blanca, para tus dulces",            emoji:"🍬", img:"images/queso-mozzarela.png", cat:"viveres"   },
];

let currentGridFilter = "todos";

function buildGrid(filter) {
  const container=document.getElementById("gridProducts");
  container.innerHTML="";
  const list=filter==="todos"?ALL_PRODUCTS_GRID:ALL_PRODUCTS_GRID.filter(p=>p.cat===filter);
  list.forEach((p,i)=>{
    const card=document.createElement("div");
    card.className="grid-product-card";
    card.style.animationDelay=(i*0.04)+"s";
    card.onclick=()=>openLightbox(p.img,p.name,p.desc,p.emoji);
    card.innerHTML=`
      <img class="grid-product-img" src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="grid-product-emoji" style="display:none">${p.emoji}</div>
      <div class="grid-product-info">
        <div class="grid-product-name">${p.name}</div>
        <div class="grid-product-desc">${p.desc}</div>
      </div>`;
    container.appendChild(card);
  });
}

function filterGrid(cat,tabEl) {
  currentGridFilter=cat;
  document.querySelectorAll(".grid-tab").forEach(t=>t.classList.remove("active"));
  tabEl.classList.add("active");
  buildGrid(cat);
}

function openGrid() {
  buildGrid(currentGridFilter);
  document.getElementById("gridOverlay").classList.add("open");
  document.body.style.overflow="hidden";
}

function closeGrid() {
  document.getElementById("gridOverlay").classList.remove("open");
  document.body.style.overflow="";
}

/* ---------- TIENDA / MODAL ---------- */
const WHATSAPP_NUMBER = "584247491899";

const PRODUCTS = [
  { id:1,  name:"Queso Mozzarela",    desc:"Suave y elástico, ideal para fundir",         emoji:"🧀", img:"images/queso-mozzarela.png" },
  { id:2,  name:"Queso Cheddar",      desc:"Intenso y cremoso, lleno de sabor",            emoji:"🧀", img:"images/queso-mozzarela.png" },
  { id:3,  name:"Mantequilla",        desc:"Cremosa y natural, hecha con leche fresca",    emoji:"🧈", img:"images/queso-mozzarela.png" },
  { id:4,  name:"Yogurt Natural",     desc:"Fresco y nutritivo, sin azúcar añadida",       emoji:"🥛", img:"images/queso-mozzarela.png" },
  { id:5,  name:"Leche Pasteurizada", desc:"Fresca y nutritiva, directo del campo",        emoji:"🥛", img:"images/queso-mozzarela.png" },
  { id:6,  name:"Queso Blanco",       desc:"Artesanal, firme y con sabor tradicional",     emoji:"🧀", img:"images/queso-mozzarela.png" },
  { id:7,  name:"Mortadela",          desc:"Clásica y sabrosa, perfecta para sándwiches",  emoji:"🥩", img:"images/queso-mozzarela.png" },
  { id:8,  name:"Jamón de Pierna",    desc:"Jugoso y tierno, de calidad premium",          emoji:"🍖", img:"images/queso-mozzarela.png" },
  { id:9,  name:"Salchichón",         desc:"Firme y aromático, con especias selectas",     emoji:"🌭", img:"images/queso-mozzarela.png" },
  { id:10, name:"Salchicha de Res",   desc:"Tierna y jugosa, ideal para la parrilla",      emoji:"🌭", img:"images/queso-mozzarela.png" },
  { id:11, name:"Pepperoni",          desc:"Picante y sabroso, perfecto para pizzas",      emoji:"🍕", img:"images/queso-mozzarela.png" },
  { id:12, name:"Tocineta",           desc:"Ahumada y crujiente, irresistible",            emoji:"🥓", img:"images/queso-mozzarela.png" },
  { id:13, name:"Harina de Maíz",     desc:"Harina precocida, lista para tus arepas",      emoji:"🌽", img:"images/queso-mozzarela.png" },
  { id:14, name:"Arroz",              desc:"Grano largo, suelto y de primera calidad",     emoji:"🍚", img:"images/queso-mozzarela.png" },
  { id:15, name:"Pasta",              desc:"Variedad de cortes, al dente perfecta",        emoji:"🍝", img:"images/queso-mozzarela.png" },
  { id:16, name:"Aceite Vegetal",     desc:"Suave y ligero para todas tus recetas",        emoji:"🫙", img:"images/queso-mozzarela.png" },
  { id:17, name:"Caraotas Negras",    desc:"Selectas y tiernas, sabor venezolano",         emoji:"🫘", img:"images/queso-mozzarela.png" },
  { id:18, name:"Azúcar",             desc:"Refinada y blanca, para tus dulces",           emoji:"🍬", img:"images/queso-mozzarela.png" },
];

const quantities={};
PRODUCTS.forEach(p=>{ quantities[p.id]=0; });

let shopFilter = "todos";
let shopPage   = 1;
const SHOP_PER_PAGE = 4;

function setShopFilter(cat, el) {
  shopFilter = cat;
  shopPage   = 1;
  document.querySelectorAll(".shop-filter-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  renderShopProducts();
}

function buildShopProducts() {
  const container = document.getElementById("shopProducts");
  if (!container) return;
  shopPage = 1;
  renderShopProducts();
}

function shopGoToPage(p) {
  shopPage = p;
  renderShopProducts();
  // scroll modal to top
  const modal = document.getElementById("shopModal");
  if (modal) modal.scrollTop = 0;
}

function renderShopProducts() {
  const container = document.getElementById("shopProducts");
  if (!container) return;
  container.innerHTML = "";

  const grupos = [
    { label:"🧀 Lácteos",   cat:"lacteos",   ids:[1,2,3,4,5,6]   },
    { label:"🥩 Embutidos", cat:"embutidos", ids:[7,8,9,10,11,12] },
    { label:"🛒 Víveres",   cat:"viveres",   ids:[13,14,15,16,17,18] },
  ];

  // Flatten filtered products keeping category label info
  const flatItems = [];
  const toShow = shopFilter === "todos" ? grupos : grupos.filter(g => g.cat === shopFilter);
  toShow.forEach(g => {
    g.ids.forEach((id, idx) => {
      flatItems.push({ id, groupLabel: idx === 0 ? g.label : null });
    });
  });

  const totalPages = Math.ceil(flatItems.length / SHOP_PER_PAGE);
  const start      = (shopPage - 1) * SHOP_PER_PAGE;
  const pageItems  = flatItems.slice(start, start + SHOP_PER_PAGE);

  // Render items
  let lastLabel = null;
  pageItems.forEach(({ id, groupLabel }) => {
    // Show category header when group changes
    const p = PRODUCTS.find(x => x.id === id);
    // find group label for this id
    let thisLabel = null;
    toShow.forEach(g => { if (g.ids.includes(id)) thisLabel = g.label; });
    if (thisLabel !== lastLabel) {
      const header = document.createElement("div");
      header.className = "shop-category-label";
      header.textContent = thisLabel;
      container.appendChild(header);
      lastLabel = thisLabel;
    }

    const item = document.createElement("div");
    item.className = "shop-item" + (quantities[p.id] > 0 ? " has-qty" : "");
    item.id = `shop-item-${p.id}`;
    item.innerHTML = `<img class="shop-item-img" src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="shop-item-emoji" style="display:none">${p.emoji}</div>
      <div class="shop-item-info"><div class="shop-item-name">${p.name}</div><div class="shop-item-desc">${p.desc}</div></div>
      <div class="qty-control">
        <button class="qty-btn minus" onclick="changeQty(${p.id},-1)">−</button>
        <span class="qty-num" id="qty-${p.id}">${quantities[p.id]}</span>
        <button class="qty-btn plus" onclick="changeQty(${p.id},1)">+</button>
      </div>`;
    container.appendChild(item);
  });

  // Pagination — rendered in fixed footer, not inside scroll area
  const pagFooter = document.getElementById("shopPagination");
  if (pagFooter) {
    pagFooter.innerHTML = "";
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "shop-page-btn" + (i === shopPage ? " active" : "");
        btn.textContent = i;
        btn.onclick = () => shopGoToPage(i);
        pagFooter.appendChild(btn);
      }
      pagFooter.style.display = "flex";
    } else {
      pagFooter.style.display = "none";
    }
  }
}

function changeQty(id,delta) {
  quantities[id]=Math.max(0,quantities[id]+delta);
  const n=document.getElementById(`qty-${id}`);
  const it=document.getElementById(`shop-item-${id}`);
  if(n) n.textContent=quantities[id];
  if(it) it.classList.toggle("has-qty",quantities[id]>0);
  updateSummary();
}

function updateSummary() {
  const btn=document.getElementById("sendBtn");
  if(btn) btn.disabled=!PRODUCTS.some(p=>quantities[p.id]>0);
}

function sendOrder() {
  const lines=["*Consulta de productos - Bodegón Los Cuñados*\n","Hola, me interesan:\n"];
  PRODUCTS.forEach(p=>{ if(quantities[p.id]>0) lines.push(`- ${p.name} x ${quantities[p.id]}`); });
  lines.push("\n¿Podrían indicarme disponibilidad y precios?");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

function openShop() {
  buildShopProducts(); updateSummary();
  const o=document.getElementById("shopOverlay");
  if(o){ o.classList.add("open"); document.body.style.overflow="hidden"; }
}
function closeShop() {
  const o=document.getElementById("shopOverlay");
  if(o){ o.classList.remove("open"); document.body.style.overflow=""; }
}
function closeShopOutside(e){ if(e.target.id==="shopOverlay") closeShop(); }

/* ---------- LIGHTBOX ---------- */
function openLightbox(src,name,desc,emoji) {
  const overlay=document.getElementById("lightboxOverlay");
  const img=document.getElementById("lbImg");
  const emojiEl=document.getElementById("lbEmoji");
  document.getElementById("lbName").textContent=name;
  document.getElementById("lbDesc").textContent=desc;
  const wrap=overlay.querySelector(".lightbox-img-wrap");
  wrap.style.animation="none"; wrap.offsetHeight; wrap.style.animation="";
  if(src){ img.src=src; img.alt=name; img.style.display="block"; emojiEl.style.display="none";
    img.onerror=()=>{ img.style.display="none"; emojiEl.textContent=emoji; emojiEl.style.display="block"; };
  } else { img.style.display="none"; emojiEl.textContent=emoji; emojiEl.style.display="block"; }
  overlay.classList.add("open"); document.body.style.overflow="hidden";
}
function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
  document.body.style.overflow="";
}
function closeLightboxOutside(e){ if(e.target.id==="lightboxOverlay") closeLightbox(); }

/* ---------- GUARDAR CONTACTO ---------- */
function saveContact(e) {
  e.preventDefault();
  const vcard=["BEGIN:VCARD","VERSION:3.0","FN:Bodegon Los Cunados","ORG:Bodegon Los Cunados","TITLE:Tu bodegon de confianza","TEL;TYPE=CELL,VOICE:+58XXXXXXXXXX","NOTE:Tu bodegon de confianza","END:VCARD"].join("\r\n");
  const a=document.createElement("a");
  a.href="data:text/vcard;charset=utf-8,"+encodeURIComponent(vcard);
  a.download="BodegonLosCunados.vcf";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeShop(); closeLightbox(); closeGrid(); } });