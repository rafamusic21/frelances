(function(){
  const L = '#1B1F3B';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Personajes en SVG ----------
  function jesus(wave){
    const arm = wave
      ? `<g class="arm-wave"><path d="M86 82 Q106 66 104 42" fill="none" stroke="${L}" stroke-width="16" stroke-linecap="round"/><path d="M86 82 Q106 66 104 42" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="104" cy="38" r="8" fill="#E9B98C" stroke="${L}" stroke-width="3"/></g>`
      : `<path d="M88 80 Q100 110 86 124" fill="none" stroke="${L}" stroke-width="16" stroke-linecap="round"/><path d="M88 80 Q100 110 86 124" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="85" cy="127" r="7" fill="#E9B98C" stroke="${L}" stroke-width="3"/>`;
    return `<svg class="char" viewBox="0 0 120 160" aria-hidden="true">
      <g stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
        <path d="M36 46 Q34 14 60 14 Q86 14 84 46 L92 80 Q78 74 76 52 L44 52 Q42 74 28 80 Z" fill="#6B3E26"/>
        <path d="M28 76 Q60 60 92 76 L104 160 L16 160 Z" fill="#FFFFFF"/>
        <path d="M52 72 L84 160" stroke="#3BA4E8" stroke-width="9" stroke-linecap="butt"/>
        <path d="M32 80 Q20 110 34 124" fill="none" stroke="${L}" stroke-width="16"/>
        <path d="M32 80 Q20 110 34 124" fill="none" stroke="#fff" stroke-width="9"/>
        <circle cx="35" cy="127" r="7" fill="#E9B98C"/>
        ${arm}
        <circle cx="60" cy="44" r="21" fill="#E9B98C"/>
        <path d="M39 40 Q43 20 60 20 Q77 20 81 40 Q70 29 60 31 Q50 29 39 40Z" fill="#6B3E26"/>
        <path d="M40 48 Q43 72 60 74 Q77 72 80 48 Q73 59 60 59 Q47 59 40 48Z" fill="#6B3E26"/>
        <path d="M52 61 Q60 68 68 61 Z" fill="#fff" stroke-width="2.5"/>
      </g>
      <g class="blink" fill="${L}"><circle cx="52" cy="44" r="2.8"/><circle cx="68" cy="44" r="2.8"/></g>
      <circle cx="46" cy="52" r="3.5" fill="#FF8FA3" opacity=".7"/><circle cx="74" cy="52" r="3.5" fill="#FF8FA3" opacity=".7"/>
    </svg>`;
  }

  function person({shirt='#3DDC97', skin='#C98B5E', hair='#2A1A12', style='short', beard=false}={}){
    const hairShape = style==='long'
      ? `<path d="M28 46 Q26 16 50 16 Q74 16 72 46 L76 66 Q66 62 64 46 L36 46 Q34 62 24 66Z" fill="${hair}"/>`
      : style==='wrap'
      ? `<path d="M28 40 Q28 14 50 14 Q72 14 72 40 Q64 30 50 30 Q36 30 28 40Z" fill="${hair}"/><path d="M27 38 Q50 24 73 38" fill="none" stroke="#FFD23F" stroke-width="7"/>`
      : `<path d="M30 40 Q30 18 50 18 Q72 18 70 40 Q64 30 50 32 Q38 30 30 40Z" fill="${hair}"/>`;
    const b = beard ? `<path d="M33 46 Q36 64 50 66 Q64 64 67 46 Q60 55 50 55 Q40 55 33 46Z" fill="${hair}"/>` : '';
    return `<svg class="char" viewBox="0 0 100 140" aria-hidden="true">
      <g stroke="${L}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
        <path d="M22 72 Q50 58 78 72 L84 140 L16 140 Z" fill="${shirt}"/>
        <circle cx="50" cy="44" r="20" fill="${skin}"/>
        ${hairShape}${b}
        <path d="M43 55 Q50 61 57 55" fill="none" stroke-width="2.5"/>
      </g>
      <g class="blink" fill="${L}"><circle cx="43" cy="44" r="2.6"/><circle cx="57" cy="44" r="2.6"/></g>
      <circle cx="37" cy="51" r="3.2" fill="#FF8FA3" opacity=".7"/><circle cx="63" cy="51" r="3.2" fill="#FF8FA3" opacity=".7"/>
    </svg>`;
  }

  const dove = `<svg class="char" viewBox="0 0 80 50" aria-hidden="true">
    <g stroke="${L}" stroke-width="2.5" stroke-linejoin="round" fill="#fff">
      <path d="M14 30 Q30 20 52 24 Q64 17 72 23 Q66 28 60 30 Q48 41 26 37 L6 42 Z"/>
      <path class="wing" d="M40 25 Q32 2 10 5 Q24 18 32 29Z"/>
      <path d="M71 22 L78 24 L71 26Z" fill="#FFB23F"/>
    </g><circle cx="65" cy="22" r="1.8" fill="${L}"/></svg>`;

  const wavePath = 'M0 10 Q12.5 0 25 10 T50 10 T75 10 T100 10 T125 10 T150 10 T175 10 T200 10 V20 H0Z';
  const waves = `<svg class="back" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="${wavePath}" fill="#8FD3FF"/></svg>
    <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="${wavePath}" fill="rgba(46,143,214,.9)"/></svg>
    <div class="body"></div>`;

  function crowd(){
    const looks = [
      {shirt:'#FF6FB5', skin:'#F1C9A5', hair:'#7A4A2A', style:'long'},
      {shirt:'#3BA4E8', skin:'#8D5A3B', hair:'#1B1310'},
      {shirt:'#FFD23F', skin:'#E9B98C', hair:'#3A2416', style:'wrap'},
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
    eunuco: () => person({shirt:'#9B6BFF', skin:'#6E4630', hair:'#120C0A', style:'wrap'}),
    felipe: () => person({shirt:'#FF8A3D', skin:'#E9B98C', hair:'#5A3A22', beard:true}),
    dove: () => dove,
    waves: () => waves,
    crowd: crowd
  };
  document.querySelectorAll('[data-art]').forEach(el => {
    const fn = ART[el.dataset.art]; if (fn) el.innerHTML = fn();
  });

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
