/* Studybook · portada y páginas de curso: solo el botón de modo claro / oscuro. */
(function(){
  const root=document.documentElement, mq=window.matchMedia('(prefers-color-scheme: dark)');
  const isDark=()=>{const t=root.getAttribute('data-theme');return t?t==='dark':mq.matches};
  const btn=document.getElementById('theme-btn'), txt=document.getElementById('theme-txt');
  if(!btn) return;
  function paint(){const d=isDark();const mt=document.getElementById('meta-theme');if(mt)mt.setAttribute('content',d?'#11141b':'#f6f7fa');txt.textContent=d?'Modo claro':'Modo oscuro';btn.setAttribute('aria-label',d?'Cambiar a modo claro':'Cambiar a modo oscuro')}
  btn.addEventListener('click',()=>{const next=isDark()?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('tema',next)}catch(e){}paint()});
  mq.addEventListener&&mq.addEventListener('change',paint);
  paint();
})();
