// @ts-nocheck
/* =============================================
   BODEGÓN LOS CUÑADOS — script.js (vista cliente)
   Los productos, categorías y el logo YA NO están escritos
   aquí. Se cargan desde "data.json", el mismo archivo que
   edita el dueño desde admin.html.
   ============================================= */

   let CATEGORIES = [];
   let PRODUCTS = [];
   
   function productsByCat(catId) {
     return catId === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.cat === catId);
   }
   function categoryLabel(catId) {
     const c = CATEGORIES.find(c => c.id === catId);
     return c ? `${c.emojiTab} ${c.label}` : catId;
   }
   
   /* ---------- CARGA DE DATOS ---------- */
   async function loadSiteData() {
     try {
       const res = await fetch("data.json", { cache: "no-store" });
       if (!res.ok) throw new Error("No se pudo leer data.json");
       const data = await res.json();
       CATEGORIES = data.categories || [];
       PRODUCTS   = data.products || [];
       if (data.logo) {
         const logoImg = document.getElementById("logoImg");
         const logoFallback = document.getElementById("logoFallback");
         if (logoImg) {
           logoImg.onerror = () => {
             logoImg.style.display = "none";
             if (logoFallback) logoFallback.style.display = "flex";
           };
           logoImg.src = data.logo;
           logoImg.style.display = "block";
           if (logoFallback) logoFallback.style.display = "none";
         }
       }
     } catch (err) {
       console.warn("No se pudieron cargar los productos desde data.json:", err);
       CATEGORIES = [];
       PRODUCTS = [];
     }
   }
   
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
   
   /* ---------- CARRUSELES (uno por categoría, generado automáticamente) ---------- */
   const carousels = {};
   
   function getTrack(id){ return document.getElementById("track-"+id); }
   function getDots(id) { return document.getElementById("dots-"+id); }
   
   function buildCatalogSections() {
     const container = document.getElementById("catalogsContainer");
     if (!container) return;
     container.innerHTML = "";
   
     CATEGORIES.forEach(cat => {
       carousels[cat.id] = { current: 0 };
       const items = productsByCat(cat.id);
       if (items.length === 0) return;
   
       const section = document.createElement("div");
       section.className = "catalog";
       section.innerHTML = `
         <h2><i class="${cat.icon}"></i> ${cat.label}</h2>
         <div class="carousel">
           <div class="carousel-track" id="track-${cat.id}">
             ${items.map(p => `
               <div class="product">
                 <div class="product-img-box" onclick="openLightbox('${p.img ? escapeJs(p.img) : ""}','${escapeJs(p.name)}','${escapeJs(p.desc)}','${p.emoji}')">
                   <img src="${p.img || ""}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'">
                 </div>
                 <h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.desc)}</p>
               </div>`).join("")}
           </div>
         </div>
         <div class="carousel-buttons">
           <button onclick="prevSlide('${cat.id}')"><i class="fa-solid fa-arrow-left"></i></button>
           <div class="carousel-dots" id="dots-${cat.id}"></div>
           <button onclick="nextSlide('${cat.id}')"><i class="fa-solid fa-arrow-right"></i></button>
         </div>`;
       container.appendChild(section);
     });
   }
   
   function updateCarousel(id) {
     const track=getTrack(id); if(!track)return;
     track.style.transform=`translateX(-${carousels[id].current*100}%)`;
     const dots=getDots(id); if(!dots)return;
     dots.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===carousels[id].current));
   }
   
   function nextSlide(id) {
     const track=getTrack(id); if(!track)return;
     const slides=track.querySelectorAll(".product");
     carousels[id].current=(carousels[id].current+1)%slides.length;
     updateCarousel(id);
   }
   
   function prevSlide(id) {
     const track=getTrack(id); if(!track)return;
     const slides=track.querySelectorAll(".product");
     carousels[id].current=(carousels[id].current-1+slides.length)%slides.length;
     updateCarousel(id);
   }
   
   function buildDots(id) {
     const dotsEl=getDots(id); if(!dotsEl)return;
     const track=getTrack(id); if(!track)return;
     const slides=track.querySelectorAll(".product");
     dotsEl.innerHTML="";
     slides.forEach((_,i)=>{
       const d=document.createElement("div");
       d.className="dot"+(i===0?" active":"");
       d.onclick=()=>{ carousels[id].current=i; updateCarousel(id); };
       dotsEl.appendChild(d);
     });
   }
   
   /* ---------- PESTAÑAS DE CATEGORÍA (grid y tienda, generadas automáticamente) ---------- */
   function buildCategoryTabs() {
     const gridTabs = document.getElementById("gridTabs");
     if (gridTabs) {
       gridTabs.innerHTML = `<button class="grid-tab active" onclick="filterGrid('todos',this)">Todos</button>` +
         CATEGORIES.map(c => `<button class="grid-tab" onclick="filterGrid('${c.id}',this)">${c.emojiTab} ${c.label}</button>`).join("");
     }
     const shopTabs = document.getElementById("shopFilterTabs");
     if (shopTabs) {
       shopTabs.innerHTML = `<button class="shop-filter-tab active" onclick="setShopFilter('todos',this)">Todos</button>` +
         CATEGORIES.map(c => `<button class="shop-filter-tab" onclick="setShopFilter('${c.id}',this)">${c.emojiTab} ${c.label}</button>`).join("");
     }
   }
   
   /* ---------- GRID DE TODOS LOS PRODUCTOS ---------- */
   let currentGridFilter = "todos";
   
   function buildGrid(filter) {
     const container=document.getElementById("gridProducts");
     container.innerHTML="";
     const list = productsByCat(filter);
     list.forEach((p,i)=>{
       const card=document.createElement("div");
       card.className="grid-product-card";
       card.style.animationDelay=(i*0.04)+"s";
       card.onclick=()=>openLightbox(p.img,p.name,p.desc,p.emoji);
       card.innerHTML=`
         <img class="grid-product-img" src="${p.img || ""}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="grid-product-emoji" style="display:none">${p.emoji}</div>
         <div class="grid-product-info">
           <div class="grid-product-name">${escapeHtml(p.name)}</div>
           <div class="grid-product-desc">${escapeHtml(p.desc)}</div>
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
   
   let quantities = {};
   
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
     const modal = document.getElementById("shopModal");
     if (modal) modal.scrollTop = 0;
   }
   
   function renderShopProducts() {
     const container = document.getElementById("shopProducts");
     if (!container) return;
     container.innerHTML = "";
   
     const catsToShow = shopFilter === "todos" ? CATEGORIES : CATEGORIES.filter(c => c.id === shopFilter);
     const flatItems = [];
     catsToShow.forEach(c => {
       productsByCat(c.id).forEach((p, idx) => {
         flatItems.push({ id: p.id, groupLabel: idx === 0 ? categoryLabel(c.id) : null });
       });
     });
   
     const totalPages = Math.ceil(flatItems.length / SHOP_PER_PAGE);
     const start      = (shopPage - 1) * SHOP_PER_PAGE;
     const pageItems  = flatItems.slice(start, start + SHOP_PER_PAGE);
   
     let lastLabel = null;
     pageItems.forEach(({ id }) => {
       const p = PRODUCTS.find(x => x.id === id);
       const thisLabel = categoryLabel(p.cat);
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
       item.innerHTML = `<img class="shop-item-img" src="${p.img || ""}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="shop-item-emoji" style="display:none">${p.emoji}</div>
         <div class="shop-item-info"><div class="shop-item-name">${escapeHtml(p.name)}</div><div class="shop-item-desc">${escapeHtml(p.desc)}</div></div>
         <div class="qty-control">
           <button class="qty-btn minus" onclick="changeQty(${p.id},-1)">−</button>
           <span class="qty-num" id="qty-${p.id}">${quantities[p.id]}</span>
           <button class="qty-btn plus" onclick="changeQty(${p.id},1)">+</button>
         </div>`;
       container.appendChild(item);
     });
   
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
     const vcard=["BEGIN:VCARD","VERSION:3.0","FN:Bodegon Los Cunados","ORG:Bodegon Los Cunados","TITLE:Tu bodegon de confianza","TEL;TYPE=CELL,VOICE:+584247491899","NOTE:Tu bodegon de confianza","END:VCARD"].join("\r\n");
     const a=document.createElement("a");
     a.href="data:text/vcard;charset=utf-8,"+encodeURIComponent(vcard);
     a.download="BodegonLosCunados.vcf";
     document.body.appendChild(a); a.click(); document.body.removeChild(a);
   }
   
   document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeShop(); closeLightbox(); closeGrid(); } });
   
   /* ---------- UTILIDADES ---------- */
   function escapeHtml(str) {
     return String(str).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
   }
   function escapeJs(str) {
     return String(str).replace(/\\/g,"\\\\").replace(/'/g,"\\'");
   }
   
   /* ---------- ARRANQUE ---------- */
   document.addEventListener("DOMContentLoaded", async () => {
     createCows();
     quantities = {};
     await loadSiteData();
     PRODUCTS.forEach(p=>{ quantities[p.id]=0; });
   
     buildCatalogSections();
     CATEGORIES.forEach(cat=>{
       const track=getTrack(cat.id); if(!track) return;
       buildDots(cat.id); updateCarousel(cat.id);
       setInterval(()=>nextSlide(cat.id),4500+Math.random()*500);
     });
      buildCategoryTabs();
   });