/* Studybook · portada y páginas de curso: modo claro / oscuro, «Continuar donde te quedaste» y progreso de «Hecho». */
(function(){
  const root=document.documentElement, mq=window.matchMedia('(prefers-color-scheme: dark)');
  const isDark=()=>{const t=root.getAttribute('data-theme');return t?t==='dark':mq.matches};
  const btn=document.getElementById('theme-btn'), txt=document.getElementById('theme-txt');
  if(btn){
    const paint=()=>{const d=isDark();const mt=document.getElementById('meta-theme');if(mt)mt.setAttribute('content',d?'#11141b':'#f6f7fa');txt.textContent=d?'Modo claro':'Modo oscuro';btn.setAttribute('aria-label',d?'Cambiar a modo claro':'Cambiar a modo oscuro')};
    btn.addEventListener('click',()=>{const next=isDark()?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('tema',next)}catch(e){}paint()});
    mq.addEventListener&&mq.addEventListener('change',paint);
    paint();
  }
  const get=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
  const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const base=document.body.dataset.root||'';

  /* continuar donde te quedaste */
  const cont=document.getElementById('continuar'), u=get('sb-ultimo',null);
  if(cont&&u&&u.page&&/^[a-z0-9-]+\/[a-z0-9-]+\.html$/.test(u.page)&&(!cont.dataset.course||u.page.startsWith(cont.dataset.course+'/'))){
    const hace=Date.now()-(u.t||0), cuando=hace<36e5?'hace un rato':hace<864e5?'hoy':hace<1728e5?'ayer':'hace '+Math.round(hace/864e5)+' días';
    const hash=/^[a-z0-9-]+$/.test(u.hash||'')?'#'+u.hash:'';
    cont.innerHTML='<a class="cont" href="'+base+u.page+hash+'"><span class="label">Continuar donde te quedaste · '+cuando+'</span>'+
      '<span class="cont-t">'+esc(u.unidad)+(u.tema?' · '+esc(u.tema):'')+'</span><span class="cont-s">'+esc(u.curso)+(u.pestana?' · '+esc(u.pestana):'')+'</span><span class="cont-go" aria-hidden="true">→</span></a>';
    cont.hidden=false;
  }

  /* progreso: cuántos ejercicios, ejemplos y problemas se marcaron como «Hecho» */
  const I=window.SB_INDEX, hecho=get('sb-hecho',{});
  if(I){
    const bar=(k,n)=>'<span class="prog-bar"><span style="width:'+(n?Math.round(100*k/n):0)+'%"></span></span><span class="prog-t">'+k+' de '+n+' marcados como hechos</span>';
    document.querySelectorAll('.prog[data-unit]').forEach(el=>{
      const un=I.units[el.dataset.unit]; if(!un) return;
      const k=(hecho[el.dataset.unit]||[]).length; if(!k) return;
      el.innerHTML=bar(Math.min(k,un.total),un.total); el.hidden=false;
    });
    document.querySelectorAll('.prog[data-course]').forEach(el=>{
      let k=0,n=0; Object.entries(I.units).forEach(([key,un])=>{ if(un.course===el.dataset.course){ n+=un.total; k+=Math.min((hecho[key]||[]).length,un.total) } });
      if(!k) return; el.innerHTML=bar(k,n); el.hidden=false;
    });
  }
})();
