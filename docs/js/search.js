/* Studybook · buscador de ejercicios, ejemplos, solucionarios, teoría e interactivos (usa window.SB_INDEX de search-index.js).
   Se monta en cada <div class="sb-search" data-root="../"> (data-root: ruta a la raíz del sitio desde la página). */
(function(){
  const I=window.SB_INDEX; if(!I) return;
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ²³√π∑σ%.\s/-]/g,' ');
  const docs=I.items.map(it=>({it,t:norm(it.t),n:norm(it.n),w:norm(it.w+' '+it.k+' '+it.s),x:norm(it.x)}));
  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function search(q){
    const words=norm(q).split(/\s+/).filter(w=>w.length>0); if(!words.length) return [];
    const res=[];
    docs.forEach(d=>{
      let sc=0;
      for(const w of words){
        const inT=d.t.includes(w), inW=d.w.includes(w), inX=d.x.includes(w), inN=d.n===w;
        if(!(inT||inW||inX||inN)) return;
        sc+=(inT?6:0)+(inN?4:0)+(inW?2:0)+(inX?1:0)+(d.t.startsWith(w)?2:0);
      }
      if(d.it.k==='Ejercicio') sc+=1;
      res.push([sc,d.it]);
    });
    return res.sort((a,b)=>b[0]-a[0]).slice(0,30).map(r=>r[1]);
  }
  function snippet(x,q){
    const w=norm(q).split(/\s+/).filter(Boolean)[0]; if(!x) return '';
    const i=w?norm(x).indexOf(w):-1; let a=Math.max(0,i-50); if(a>0){ const sp=x.lastIndexOf(' ',a); a=sp>=0?sp+1:0 }
    let s=(a>0?'…':'')+x.slice(a,a+150)+(a+150<x.length?'…':'');
    return esc(s);
  }
  document.querySelectorAll('.sb-search').forEach(box=>{
    const root=box.dataset.root||'';
    box.innerHTML='<label class="sr-only" for="sbq">Buscar</label><div class="sb-in"><span class="sb-ic" aria-hidden="true">⌕</span><input id="sbq" type="search" autocomplete="off" spellcheck="false" placeholder="Buscar: vértice, interés, PC5…" aria-controls="sbr" aria-expanded="false"></div><div class="sb-res" id="sbr" role="listbox" hidden></div>';
    const inp=box.querySelector('input'), out=box.querySelector('.sb-res');
    let sel=-1, cur=[];
    function paint(){
      const q=inp.value.trim();
      if(q.length<2){ out.hidden=true; inp.setAttribute('aria-expanded','false'); return }
      cur=search(q); sel=-1;
      out.innerHTML=cur.length?('<p class="sb-n">'+cur.length+(cur.length===30?'+':'')+' resultado'+(cur.length===1?'':'s')+'</p>'+cur.map((it,i)=>
        '<a class="sb-r" role="option" id="sbo'+i+'" href="'+root+it.u+'"><span class="sb-k sb-k-'+norm(it.k).replace(/[^a-z]/g,'')+'">'+esc(it.k)+(it.n?' '+esc(it.n):'')+'</span><span class="sb-t">'+esc(it.t)+'</span><span class="sb-w">'+esc(it.w)+(it.s?' · '+esc(it.s):'')+'</span>'+(it.x?'<span class="sb-x">'+snippet(it.x,q)+'</span>':'')+'</a>').join(''))
        :'<p class="sb-n">Nada con «'+esc(q)+'». Prueba con otra palabra.</p>';
      out.hidden=false; inp.setAttribute('aria-expanded','true');
    }
    function move(k){
      const rs=out.querySelectorAll('.sb-r'); if(!rs.length) return;
      sel=(sel+k+rs.length)%rs.length; rs.forEach((r,i)=>r.classList.toggle('on',i===sel));
      rs[sel].scrollIntoView({block:'nearest'}); inp.setAttribute('aria-activedescendant','sbo'+sel);
    }
    let t=null;
    inp.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(paint,90)});
    inp.addEventListener('keydown',e=>{
      if(e.key==='ArrowDown'){e.preventDefault();move(1)} else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
      else if(e.key==='Enter'){const r=out.querySelectorAll('.sb-r')[sel<0?0:sel]; if(r){e.preventDefault();location.href=r.href}}
      else if(e.key==='Escape'){out.hidden=true;inp.setAttribute('aria-expanded','false')}
    });
    inp.addEventListener('focus',()=>{ if(inp.value.trim().length>=2) paint() });
    document.addEventListener('click',e=>{ if(!box.contains(e.target)){out.hidden=true;inp.setAttribute('aria-expanded','false')} });
    /* en una página de unidad, un resultado de la misma página solo cambia el hash: se cierra la lista */
    out.addEventListener('click',e=>{ const a=e.target.closest('.sb-r'); if(a){ out.hidden=true; if(a.pathname===location.pathname&&a.hash){ e.preventDefault(); location.hash=a.hash } } });
  });
})();
