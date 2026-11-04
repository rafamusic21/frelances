(function(){
  const L = '#1B1F3B';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Personajes en SVG (estilo cómic) ----------
  const SKIN_J = '#E9B98C', HAIR_J = '#6B3E26', HAIR_J_HI = '#9A6040';

  // Ojos grandes con brillo, cejas, nariz y sonrisa
  function faceParts(cx, ey, my, opts = {}){
    const dx = opts.dx || 8;
    return `
      <g fill="none" stroke="${L}" stroke-width="2.4" stroke-linecap="round">
        <path d="M${cx-dx-4} ${ey-7} Q${cx-dx} ${ey-10} ${cx-dx+4} ${ey-7.5}"/>
        <path d="M${cx+dx-4} ${ey-7.5} Q${cx+dx} ${ey-10} ${cx+dx+4} ${ey-7}"/>
        <path d="M${cx} ${ey+1} Q${cx+2.6} ${ey+5} ${cx-0.8} ${ey+6}" stroke-width="2"/>
      </g>
      <g class="blink">
        <ellipse cx="${cx-dx}" cy="${ey}" rx="2.9" ry="3.8" fill="${L}"/>
        <ellipse cx="${cx+dx}" cy="${ey}" rx="2.9" ry="3.8" fill="${L}"/>
        <circle cx="${cx-dx+1}" cy="${ey-1.4}" r="1.2" fill="#fff"/>
        <circle cx="${cx+dx+1}" cy="${ey-1.4}" r="1.2" fill="#fff"/>
      </g>
      <path d="M${cx-7} ${my} Q${cx} ${my+9} ${cx+7} ${my} Q${cx} ${my+2.5} ${cx-7} ${my}Z" fill="#fff" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="${cx-dx-4}" cy="${ey+7}" rx="4" ry="2.6" fill="#FF8FA3" opacity=".65"/>
      <ellipse cx="${cx+dx+4}" cy="${ey+7}" rx="4" ry="2.6" fill="#FF8FA3" opacity=".65"/>`;
  }

  function jesus(wave){
    const S = `stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
    const leftArm = `
      <path d="M32 90 Q18 106 24 126 L38 124 Q34 110 42 98 Z" fill="#fff" ${S}/>
      <path d="M24 122 L38 120" fill="none" stroke="#BFD9EE" stroke-width="3"/>
      <circle cx="31" cy="129" r="7" fill="${SKIN_J}" ${S}/>`;
    const rightArm = wave
      ? `<g class="arm-wave">
          <path d="M82 96 Q98 82 100 58 L112 60 Q112 86 92 104 Z" fill="#fff" ${S}/>
          <path d="M100 62 L111 63" fill="none" stroke="#BFD9EE" stroke-width="3"/>
          <ellipse cx="97" cy="50" rx="3.6" ry="6" transform="rotate(-35 97 50)" fill="${SKIN_J}" ${S}/>
          <ellipse cx="105.5" cy="46" rx="9" ry="10.5" fill="${SKIN_J}" ${S}/>
          <path d="M101 37.5 L101 43 M105.5 36 L105.5 42.5 M110 37.5 L110 43" fill="none" stroke="${L}" stroke-width="1.8" stroke-linecap="round"/>
        </g>`
      : `<path d="M88 90 Q102 106 96 126 L82 124 Q86 110 78 98 Z" fill="#fff" ${S}/>
         <path d="M82 120 L96 122" fill="none" stroke="#BFD9EE" stroke-width="3"/>
         <circle cx="89" cy="129" r="7" fill="${SKIN_J}" ${S}/>`;
    return `<svg class="char" viewBox="0 0 120 160" aria-hidden="true">
      <!-- cabello de atrás -->
      <path d="M35 48 Q30 14 60 13 Q90 14 85 48 Q86 68 94 84 Q80 84 75 68 L45 68 Q40 84 26 84 Q34 68 35 48 Z" fill="${HAIR_J}" ${S}/>
      <!-- túnica -->
      <path d="M22 160 L26 96 Q28 80 46 76 L74 76 Q92 80 94 96 L98 160 Z" fill="#fff" ${S}/>
      <path d="M78 78 Q92 82 94 96 L98 158 L80 158 Q86 120 78 78 Z" fill="#DCEBF7"/>
      <path d="M44 112 Q46 136 42 158 M70 120 Q68 140 72 158" fill="none" stroke="#9FBFDA" stroke-width="2.2" stroke-linecap="round"/>
      <!-- cuello -->
      <path d="M52 62 L68 62 L68 76 Q60 86 52 76 Z" fill="${SKIN_J}" ${S}/>
      <path d="M48 76 Q60 92 72 76" fill="none" ${S}/>
      <!-- banda azul -->
      <path d="M44 78 L56 76 L90 158 L76 158 Z" fill="#3BA4E8" ${S}/>
      <path d="M52 80 L82 154" fill="none" stroke="#8FD3FF" stroke-width="2.4" stroke-linecap="round"/>
      ${leftArm}
      ${rightArm}
      <!-- cabeza -->
      <ellipse cx="60" cy="44" rx="20" ry="22" fill="${SKIN_J}" ${S}/>
      <path d="M38 46 Q37 20 60 19 Q83 20 82 46 Q78 34 66 30 L60 35 L54 30 Q42 34 38 46 Z" fill="${HAIR_J}" ${S}/>
      <path d="M45 28 Q50 23 56 24 M66 24 Q72 25 75 30" fill="none" stroke="${HAIR_J_HI}" stroke-width="2.6" stroke-linecap="round"/>
      <!-- barba -->
      <path d="M40 50 Q41 74 60 78 Q79 74 80 50 Q76 60 70 61 Q65 56 60 57 Q55 56 50 61 Q44 60 40 50 Z" fill="${HAIR_J}" ${S}/>
      <path d="M52 70 Q60 74 68 70" fill="none" stroke="${HAIR_J_HI}" stroke-width="2" stroke-linecap="round"/>
      ${faceParts(60, 44, 61)}
    </svg>`;
  }

  function person({shirt='#3DDC97', skin='#C98B5E', hair='#2A1A12', style='short', beard=false, band='#FFD23F', cheer=false}={}){
    const S = `stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
    const shade = 'rgba(27,31,59,.14)';
    const back = style==='long'
      ? `<path d="M30 46 Q26 17 50 17 Q74 17 70 46 L75 72 Q63 72 61 58 L39 58 Q37 72 25 72 Z" fill="${hair}" ${S}/>` : '';
    const top = style==='long'
      ? `<path d="M31 44 Q31 21 50 21 Q69 21 69 44 Q62 31 52 33 Q42 30 31 44 Z" fill="${hair}" ${S}/>`
      : style==='wrap'
      ? `<path d="M29 42 Q27 15 50 14 Q73 15 71 42 Q63 30 50 30 Q37 30 29 42 Z" fill="${hair}" ${S}/>
         <path d="M30 37 Q50 26 70 37" fill="none" stroke="${band}" stroke-width="5" stroke-linecap="round"/>
         <circle cx="70" cy="30" r="5" fill="${hair}" ${S}/>`
      : `<path d="M30 44 Q27 19 50 19 Q73 19 70 44 Q68 33 61 30 Q56 36 47 32 Q41 35 37 33 Q32 37 30 44 Z" fill="${hair}" ${S}/>`;
    const hi = style==='wrap' ? '' : `<path d="M38 27 Q43 23 49 23" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.6" stroke-linecap="round"/>`;
    const b = beard ? `<path d="M31 48 Q33 66 50 68 Q67 66 69 48 Q64 57 58 57 Q54 54 50 55 Q46 54 42 57 Q36 57 31 48 Z" fill="${hair}" ${S}/>` : '';
    const arm = (m) => {
      // m = 1 izquierda, -1 derecha (reflejo sobre x = 50)
      const X = x => m===1 ? x : 100 - x;
      if (cheer) return `
        <path d="M${X(26)} 86 Q${X(16)} 80 ${X(14)} 70 L${X(24)} 66 Q${X(26)} 74 ${X(32)} 80 Z" fill="${shirt}" ${S}/>
        <path d="M${X(15)} 70 Q${X(10)} 58 ${X(14)} 46 L${X(22)} 48 Q${X(20)} 58 ${X(23)} 67 Z" fill="${skin}" ${S}/>
        <circle cx="${X(18)}" cy="${42}" r="6.5" fill="${skin}" ${S}/>`;
      return `
        <path d="M${X(24)} 84 Q${X(14)} 92 ${X(15)} 104 L${X(27)} 104 L${X(30)} 90 Z" fill="${shirt}" ${S}/>
        <path d="M${X(16)} 104 Q${X(14)} 116 ${X(19)} 124 L${X(27)} 122 Q${X(25)} 112 ${X(26)} 104 Z" fill="${skin}" ${S}/>
        <circle cx="${X(23)}" cy="127" r="6.5" fill="${skin}" ${S}/>`;
    };
    return `<svg class="char" viewBox="0 0 100 140" aria-hidden="true">
      ${back}
      <path d="M14 140 L18 96 Q20 80 36 76 L64 76 Q80 80 82 96 L86 140 Z" fill="${shirt}" ${S}/>
      <path d="M66 78 Q80 82 82 96 L86 138 L70 138 Q74 108 66 78 Z" fill="${shade}"/>
      <path d="M44 62 L56 62 L56 78 Q50 82 44 78 Z" fill="${skin}" ${S}/>
      <path d="M38 76 Q50 90 62 76" fill="none" ${S}/>
      ${arm(1)}${arm(-1)}
      <circle cx="31" cy="46" r="5" fill="${skin}" ${S}/>
      <circle cx="69" cy="46" r="5" fill="${skin}" ${S}/>
      <ellipse cx="50" cy="44" rx="19" ry="20" fill="${skin}" ${S}/>
      ${top}${hi}${b}
      ${faceParts(50, 44, 55, {dx:7.5})}
    </svg>`;
  }

  const dove = `<svg class="char" viewBox="0 0 80 50" aria-hidden="true">
    <g stroke="${L}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" fill="#fff">
      <path d="M14 30 Q30 19 52 23 Q63 15 72 22 Q67 28 60 30 Q48 42 26 38 L5 43 L12 35 Z"/>
      <path d="M26 36 Q40 38 52 30" fill="none" stroke="#BFD9EE" stroke-width="2"/>
      <path class="wing" d="M42 25 Q34 1 9 4 Q16 10 18 15 Q22 20 33 29 Z"/>
      <path d="M71 21 L79 24 L71 27 Z" fill="#FFB23F"/>
    </g>
    <circle cx="65" cy="21.5" r="2.2" fill="${L}"/><circle cx="65.7" cy="20.8" r=".7" fill="#fff"/>
    <ellipse cx="63" cy="26" rx="2.4" ry="1.5" fill="#FF8FA3" opacity=".7"/></svg>`;

  const wavePath = 'M0 10 Q12.5 0 25 10 T50 10 T75 10 T100 10 T125 10 T150 10 T175 10 T200 10 V20 H0Z';
  const waves = `<svg class="back" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="${wavePath}" fill="#8FD3FF"/></svg>
    <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="${wavePath}" fill="rgba(46,143,214,.9)"/></svg>
    <div class="body"></div>`;

  function crowd(){
    const looks = [
      {shirt:'#FF6FB5', skin:'#F1C9A5', hair:'#7A4A2A', style:'long'},
      {shirt:'#3BA4E8', skin:'#8D5A3B', hair:'#1B1310'},
      {shirt:'#FFD23F', skin:'#E9B98C', hair:'#3BA4E8', style:'wrap', band:'#FF6FB5'},
      {shirt:'#9B6BFF', skin:'#C98B5E', hair:'#2A1A12', beard:true},
      {shirt:'#3DDC97', skin:'#F1C9A5', hair:'#D9A441', style:'long'},
      {shirt:'#FF8A3D', skin:'#6E4630', hair:'#120C0A'}
    ];
    return looks.map((o,i)=>`<div class="clap" style="animation-delay:${i*0.12}s">${person(o)}</div>`).join('');
  }

  const ART = {
    jesus: () => jesus(true),
    jesusCalm: () => jesus(false),
    youth: () => person({shirt:'#3DDC97'}),
    youthWhite: () => person({shirt:'#FFFFFF', skin:'#C98B5E', hair:'#2A1A12'}),
    youthCheer: () => person({shirt:'#FFFFFF', skin:'#C98B5E', hair:'#2A1A12', cheer:true}),
    eunuco: () => person({shirt:'#9B6BFF', skin:'#6E4630', hair:'#9B6BFF', style:'wrap', band:'#FFD23F'}),
    felipe: () => person({shirt:'#FF8A3D', skin:'#E9B98C', hair:'#5A3A22', beard:true}),
    dove: () => dove,
    waves: () => waves,
    crowd: crowd
  };
  document.querySelectorAll('[data-art]').forEach(el => {
    const fn = ART[el.dataset.art]; if (fn) el.innerHTML = fn();
  });

  // ---------- Barra superior: logos ----------
  // Si todavía no subes un logo, se muestra un círculo de reemplazo.
  document.querySelectorAll('.topbar img').forEach(img => {
    const fallback = () => { const ph = document.createElement('span'); ph.className = 'logo-ph'; ph.textContent = 'Logo'; img.replaceWith(ph); };
    if (img.complete && img.naturalWidth === 0) fallback(); else img.addEventListener('error', fallback);
  });
  // El título "El bautismo" aparece en la barra al pasar la portada.
  const topbar = document.querySelector('.topbar');
  const cover = document.getElementById('inicio');
  if (topbar && cover && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => topbar.classList.toggle('scrolled', !e.isIntersecting), {threshold: .35}).observe(cover);
  }

  // ---------- Viñetas que aparecen al bajar ----------
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: .18, rootMargin: '0px 0px -6% 0px'});
    items.forEach(el => io.observe(el));
  }

  // ---------- Medidor de profundidad ----------
  const level = document.getElementById('level');
  let ticking = false;
  function updateLevel(){
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
    level.style.height = pct + '%';
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateLevel); } }, {passive:true});
  addEventListener('resize', updateLevel);
  updateLevel();

  // ---------- Escena interactiva: sumergir ----------
  const scene = document.getElementById('dunk');
  const btn = document.getElementById('dunkBtn');
  const say = document.getElementById('dunkSay');
  let busy = false;
  btn.addEventListener('click', () => {
    if (busy) return;
    scene.classList.remove('dunking','done');
    void scene.offsetWidth;
    if (reduce) {
      scene.classList.add('done');
      say.textContent = 'Sepultado con Cristo… ¡y resucitado a vida nueva!';
      btn.textContent = 'Repetir';
      return;
    }
    busy = true;
    btn.disabled = true;
    say.textContent = 'Sepultado con Cristo…';
    scene.classList.add('dunking');
    setTimeout(() => { say.textContent = '…y resucitado con él.'; }, 1400);
    setTimeout(() => {
      scene.classList.add('done');
      say.textContent = '¡Ahora soy una nueva criatura!';
      btn.textContent = 'Repetir';
      btn.disabled = false;
      busy = false;
    }, 2500);
  });
  
})();
