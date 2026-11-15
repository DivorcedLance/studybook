/* Studybook · motor de las páginas de unidad: tarjeta de teoría, gráficos SVG (SB.plot), temas, pestañas y tema claro/oscuro. */
(function(){
  /* teoría guardada antes de que MathJax la procese, para la tarjeta flotante */
  const TEO={};
  document.querySelectorAll('.panel[id$="-teoria"] .box[id^="t-"]').forEach(b=>{
    const c=b.cloneNode(true); c.querySelectorAll('.box-link').forEach(x=>x.remove()); TEO[b.id]=c.innerHTML;
  });

  /* ---------------- gráficos SVG ---------------- */
  let uid=0;
  const NS='http://www.w3.org/2000/svg';
  function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  const col=c=>'var(--'+(c||'ink')+')';
  function fmt(v){return (Math.round(v*100)/100).toString().replace('-','−')}
  function plot(id,o){
    const host=document.getElementById(id); if(!host) return;
    const narrow=window.innerWidth<560; const W=o.w||(narrow?400:500), pad=narrow?26:30, padL=o.padL||(narrow?40:46);
    const [x0,x1]=o.x,[y0,y1]=o.y;
    const iw=W-padL-pad;
    const H=o.h || (o.eq ? Math.round(2*pad+(y1-y0)/(x1-x0)*iw) : 340);
    const ih=H-2*pad;
    const sx=x=>padL+(x-x0)/(x1-x0)*iw, sy=y=>H-pad-(y-y0)/(y1-y0)*ih;
    const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':o.alt||'Gráfico','font-family':'Archivo, Arial, sans-serif','font-size':'13'});
    const cid='clip'+(uid++);
    const defs=el('defs',{},svg); const cp=el('clipPath',{id:cid},defs);
    el('rect',{x:padL,y:pad,width:iw,height:ih},cp);
    const g=el('g',{},svg);
    const gx=o.gx||1, gy=o.gy||1;
    for(let x=Math.ceil(x0/gx)*gx;x<=x1+1e-9;x+=gx) el('line',{x1:sx(x),x2:sx(x),y1:pad,y2:H-pad,style:'stroke:var(--grid)','stroke-width':1},g);
    for(let y=Math.ceil(y0/gy)*gy;y<=y1+1e-9;y+=gy) el('line',{y1:sy(y),y2:sy(y),x1:padL,x2:W-pad,style:'stroke:var(--grid)','stroke-width':1},g);
    const ax=el('g',{style:'stroke:var(--muted)','stroke-width':1.3},svg);
    const ay0=(y0<=0&&y1>=0)?sy(0):sy(y0), ax0=(x0<=0&&x1>=0)?sx(0):sx(x0);
    el('line',{x1:padL-6,x2:W-pad+8,y1:ay0,y2:ay0},ax);
    el('line',{x1:ax0,x2:ax0,y1:H-pad+6,y2:pad-8},ax);
    el('path',{d:`M${W-pad+8},${ay0} l-7,-4 v8 z`,style:'fill:var(--muted);stroke:none'},ax);
    el('path',{d:`M${ax0},${pad-8} l-4,7 h8 z`,style:'fill:var(--muted);stroke:none'},ax);
    const t=(x,y,s,a)=>{const at=Object.assign({x,y,style:'fill:var(--muted)'},a||{});at.style+=';paint-order:stroke;stroke:var(--sheet);stroke-width:4px;stroke-linejoin:round';const e=el('text',at,svg);e.textContent=s;return e};
    t(W-pad+6,ay0-8,o.lx||'x',{'text-anchor':'end','font-style':'italic'});
    t(ax0+8,pad-6,o.ly||'y',{'font-style':'italic'});
    (o.tx||[]).forEach(e=>{const v=Array.isArray(e)?e[0]:e, lab=Array.isArray(e)?e[1]:fmt(e);el('line',{x1:sx(v),x2:sx(v),y1:ay0-3,y2:ay0+3,style:'stroke:var(--muted)'},svg);t(sx(v),ay0+16,lab,{'text-anchor':'middle','font-size':'11'})});
    (o.ty||[]).forEach(e=>{const v=Array.isArray(e)?e[0]:e, lab=Array.isArray(e)?e[1]:fmt(e);el('line',{x1:ax0-3,x2:ax0+3,y1:sy(v),y2:sy(v),style:'stroke:var(--muted)'},svg);t(ax0-6,sy(v)+4,lab,{'text-anchor':'end','font-size':'11'})});
    const body=el('g',{'clip-path':`url(#${cid})`},svg);
    (o.polys||[]).forEach(p=>{el('polygon',{points:p.pts.map(q=>sx(q[0])+','+sy(q[1])).join(' '),style:`fill:${col(p.c)};fill-opacity:${p.op||0.22};stroke:${col(p.c)};stroke-opacity:.6`,'stroke-width':1},body)});
    (o.circs||[]).forEach(c=>{el('ellipse',{cx:sx(c.h),cy:sy(c.k),rx:c.r*iw/(x1-x0),ry:c.r*ih/(y1-y0),style:`fill:none;stroke:${col(c.c)}`,'stroke-width':c.wd||2,'stroke-dasharray':c.dash||''},body)});
    (o.segs||[]).forEach(s=>{el('line',{x1:sx(s.a[0]),y1:sy(s.a[1]),x2:sx(s.b[0]),y2:sy(s.b[1]),style:`stroke:${col(s.c||'muted')}`,'stroke-width':s.wd||1.3,'stroke-dasharray':s.dash===false?'':'4 4'},body)});
    (o.fns||[]).forEach(f=>{
      const a=f.from??x0, b=f.to??x1, n=300, span=(y1-y0);
      let d='';
      for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;let y=f.f(x);y=Math.max(y0-span,Math.min(y1+span,y));d+=(i?'L':'M')+sx(x).toFixed(2)+','+sy(y).toFixed(2)}
      el('path',{d,style:`fill:none;stroke:${col(f.c)}`,'stroke-width':f.wd||2.2,'stroke-dasharray':f.dash||''},body);
      if(f.t){const lx=f.tx??b, ly=f.ty??f.f(lx);t(sx(lx)+(f.dx||0),sy(ly)+(f.dy||-8),f.t,{style:`fill:${col(f.c)}`,'text-anchor':f.anchor||'end','font-weight':'700'})}
    });
    (o.pts||[]).forEach(p=>{
      el('circle',{cx:sx(p.x),cy:sy(p.y),r:p.r||4.5,style:`fill:${col(p.c)};stroke:var(--sheet)`,'stroke-width':1.5},svg);
      if(p.t){t(sx(p.x)+(p.dx??7),sy(p.y)+(p.dy??-7),p.t,{style:`fill:${col(p.c)}`,'text-anchor':p.anchor||'start','font-weight':'700'})}
    });
    host.appendChild(svg);
  }

  window.SB={plot};

  /* ---------------- tema + pestañas ---------------- */
  const TOPICS=[...document.querySelectorAll('.topic')].map(b=>b.dataset.topic);
  let topic=TOPICS[0], tab='teoria';
  const done=new Set(); let chain=Promise.resolve();
  /* evita que un signo (. , ; : ) quede solo al inicio de una línea después de una fórmula */
  function gluePunct(root){
    root.querySelectorAll('mjx-container:not([display="true"])').forEach(m=>{
      const n=m.nextSibling;
      if(!n||n.nodeType!==3) return;
      const k=n.textContent.match(/^[.,;:)]+/);
      if(!k) return;
      const w=document.createElement('span'); w.style.whiteSpace='nowrap';
      m.parentNode.insertBefore(w,m); w.appendChild(m);
      w.appendChild(document.createTextNode(k[0]));
      n.textContent=n.textContent.slice(k[0].length);
    });
  }
  /* achica las fórmulas que no entran (hasta 72 %); si aun así no entran, se desplazan */
  function fitMath(root){
    root.querySelectorAll('.math').forEach(m=>{
      if(!m.offsetParent) return;
      const c=m.querySelector('mjx-container'); if(!c) return;
      c.style.fontSize=''; m.classList.remove('scrolls');
      const w=m.clientWidth, sw=m.scrollWidth;
      if(sw<=w+1) return;
      const k=Math.max(0.72,w/sw*0.98);
      c.style.fontSize=(k*100).toFixed(1)+'%';
      if(m.scrollWidth>m.clientWidth+1) m.classList.add('scrolls');
    });
  }
  /* etiquetas para la tabla de errores en formato tarjeta */
  document.querySelectorAll('.tbl table').forEach(t=>{
    const hs=[...t.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    t.querySelectorAll('tbody tr').forEach(tr=>[...tr.children].forEach((td,i)=>{ if(hs[i]) td.dataset.label=hs[i] }));
  });
  function typeset(panel){
    if(!window.__mj||done.has(panel.id)) return;
    done.add(panel.id);
    chain=chain.then(()=>MathJax.typesetPromise([panel])).then(()=>{gluePunct(panel);fitMath(panel)}).catch(()=>{});
  }
  function render(){
    /* una pestaña sin panel en este tema (p. ej. aún sin solucionarios) se oculta */
    document.querySelectorAll('.tab').forEach(b=>{b.hidden=!document.getElementById('pn-'+topic+'-'+b.dataset.tab)});
    if(!document.getElementById('pn-'+topic+'-'+tab)) tab='teoria';
    document.querySelectorAll('.topic').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));
    document.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
    document.querySelectorAll('.panel').forEach(p=>{p.hidden=p.id!=='pn-'+topic+'-'+tab});
    const n=document.querySelectorAll('#pn-'+topic+'-ejercicios article.ej').length;
    document.getElementById('tab-ejercicios').innerHTML='Ejercicios<span class="tab-long"> resueltos</span> <span class="tab-n">('+n+')</span>';
    document.getElementById('tab-ejemplos').innerHTML='Ejemplos <span class="tab-n">('+document.querySelectorAll('#pn-'+topic+'-ejemplos article.ex').length+')</span>';
    document.getElementById('tab-ejemplos').setAttribute('aria-controls','pn-'+topic+'-ejemplos');
    document.getElementById('tab-solucionarios').innerHTML='<span class="tab-long">Solucionarios</span><span class="tab-short">Soluc.</span> <span class="tab-n">('+document.querySelectorAll('#pn-'+topic+'-solucionarios article.sl').length+')</span>';
    document.getElementById('tab-solucionarios').setAttribute('aria-controls','pn-'+topic+'-solucionarios');
    const panel=document.getElementById('pn-'+topic+'-'+tab);
    document.getElementById('tab-teoria').setAttribute('aria-controls','pn-'+topic+'-teoria');
    document.getElementById('tab-ejercicios').setAttribute('aria-controls','pn-'+topic+'-ejercicios');
    typeset(panel);
    if(done.has(panel.id)) chain.then(()=>requestAnimationFrame(()=>fitMath(panel)));
  }
  const TABS=['ejercicios','ejemplos','solucionarios'];
  function fromHash(){
    const h=(location.hash||'').slice(1);
    let t=h, tb='teoria';
    for(const x of TABS){ if(h.endsWith('-'+x)){ t=h.slice(0,-(x.length+1)); tb=x; } }
    if(TOPICS.includes(t)){topic=t;tab=tb}
    render();
  }
  function go(){const h=topic+(tab==='teoria'?'':'-'+tab);if(location.hash.slice(1)!==h)location.hash=h;else render()}
  /* ir a un ejercicio o ejemplo concreto (botones «Ver ejemplo similar» y «Parecido al ejercicio…») */
  function goTo(id){
    const el=document.getElementById(id); if(!el) return;
    const mt=el.closest('.panel').id.match(/^pn-(.+)-(teoria|ejercicios|ejemplos|solucionarios)$/); if(!mt) return;
    topic=mt[1]; tab=mt[2];
    const h=topic+(tab==='teoria'?'':'-'+tab);
    if(location.hash.slice(1)!==h) history.replaceState(null,'','#'+h);
    render();
    const smooth=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show=()=>{el.scrollIntoView({behavior:'auto',block:'start'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1600)};
    requestAnimationFrame(show);
    chain.then(()=>requestAnimationFrame(()=>el.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'})));
  }
  document.querySelectorAll('[data-goto]:not(.teo-go)').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.goto)));
  /* ---------- tarjeta flotante de teoría (se puede arrastrar y queda abierta) ---------- */
  const card=document.getElementById('teo-card'), cardBody=card.querySelector('.teo-body'), cardGo=card.querySelector('.teo-go'), cardTop=card.querySelector('.teo-top');
  const cache={}; let curBtn=null, pinned=false, moved=false, hideT=null;
  const canHover=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function clamp(x,y){
    const w=card.offsetWidth, h=card.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
    return [Math.max(8,Math.min(x,vw-w-8)), Math.max(8,Math.min(y,vh-Math.min(h,vh-16)-8))];
  }
  function setPos(x,y){ const [cx,cy]=clamp(x,y); card.style.left=cx+'px'; card.style.top=cy+'px'; }
  function place(){
    if(!curBtn||card.hidden||moved) return;
    const vw=window.innerWidth, vh=window.innerHeight, w=card.offsetWidth, h=card.offsetHeight;
    if(vw<=560){ setPos((vw-w)/2, vh-h-12); return }
    const r=curBtn.getBoundingClientRect();
    let top=r.bottom+8; if(top+h>vh-12) top=Math.max(12,r.top-h-8);
    setPos(r.right-w, top);
  }
  function fill(keys){
    if(cache[keys]){cardBody.innerHTML=cache[keys];return Promise.resolve()}
    cardBody.innerHTML=keys.split(' ').filter(k=>TEO[k]).map(k=>'<section>'+TEO[k]+'</section>').join('');
    if(!window.__mj) return Promise.resolve();
    const p=MathJax.typesetPromise([cardBody]).then(()=>{gluePunct(cardBody);fitMath(cardBody);cache[keys]=cardBody.innerHTML});
    chain=chain.then(()=>p).catch(()=>{});
    return p;
  }
  function openCard(btn,pin){
    clearTimeout(hideT);
    if(curBtn&&curBtn!==btn) curBtn.setAttribute('aria-expanded','false');
    curBtn=btn; btn.setAttribute('aria-expanded','true');
    if(pin){ pinned=true; card.classList.add('pinned') }
    cardGo.dataset.goto=btn.dataset.teo.split(' ')[0];
    const wasHidden=card.hidden; card.hidden=false; if(wasHidden) card.scrollTop=0;
    fill(btn.dataset.teo).then(()=>{ fitMath(cardBody); moved?setPos(card.offsetLeft,card.offsetTop):place() });
    moved?setPos(card.offsetLeft,card.offsetTop):place();
  }
  function closeCard(){
    clearTimeout(hideT); card.hidden=true; pinned=false; moved=false; card.classList.remove('pinned');
    if(curBtn){curBtn.setAttribute('aria-expanded','false'); curBtn=null}
  }
  function later(){ if(pinned) return; clearTimeout(hideT); hideT=setTimeout(closeCard,250) }
  document.querySelectorAll('.teo-btn').forEach(b=>{
    b.setAttribute('aria-controls','teo-card');
    if(canHover){ b.addEventListener('mouseenter',()=>{ if(!pinned) openCard(b,false) }); b.addEventListener('mouseleave',later); }
    b.addEventListener('click',e=>{ e.stopPropagation(); if(curBtn===b&&pinned) closeCard(); else openCard(b,true) });
  });
  card.addEventListener('mouseenter',()=>clearTimeout(hideT));
  card.addEventListener('mouseleave',later);
  card.querySelector('.teo-close').addEventListener('click',e=>{e.stopPropagation();closeCard()});
  cardGo.addEventListener('click',()=>{const id=cardGo.dataset.goto; goTo(id)});
  /* arrastrar desde la barra superior: al soltarla queda fija y abierta */
  let drag=null;
  cardTop.addEventListener('pointerdown',e=>{
    if(e.target.closest('.teo-close')) return;
    drag={dx:e.clientX-card.offsetLeft, dy:e.clientY-card.offsetTop, id:e.pointerId};
    try{cardTop.setPointerCapture(e.pointerId)}catch(_){} card.classList.add('dragging'); e.preventDefault();
  });
  cardTop.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id) return;
    moved=true; pinned=true; card.classList.add('pinned'); clearTimeout(hideT);
    setPos(e.clientX-drag.dx, e.clientY-drag.dy);
  });
  const endDrag=e=>{ if(!drag) return; drag=null; card.classList.remove('dragging'); };
  cardTop.addEventListener('pointerup',endDrag); cardTop.addEventListener('pointercancel',endDrag);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!card.hidden){ const b=curBtn; closeCard(); b&&b.focus() } });
  window.addEventListener('scroll',()=>{ if(!card.hidden&&!pinned) closeCard() },{passive:true});
  let rT=null;
  window.addEventListener('resize',()=>{ clearTimeout(rT); rT=setTimeout(()=>{
    const p=document.getElementById('pn-'+topic+'-'+tab); if(p) fitMath(p);
    if(!card.hidden){ fitMath(cardBody); moved?setPos(card.offsetLeft,card.offsetTop):place() }
  },150) });

  document.querySelectorAll('.topic').forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.topic;tab='teoria';go()}));
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;go()}));
  document.querySelector('.tabs').addEventListener('keydown',e=>{
    if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
    const order=[...document.querySelectorAll('.tab:not([hidden])')].map(b=>b.dataset.tab);const i=order.indexOf(tab),L=order.length;
    tab=order[(i+(e.key==='ArrowRight'?1:L-1))%L];go();document.getElementById('tab-'+tab).focus();
  });
  document.querySelectorAll('.jump button').forEach(b=>b.addEventListener('click',()=>{
    const t=document.getElementById(b.dataset.go); if(!t)return;
    const smooth=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'});
  }));
  /* modo claro / oscuro */
  const root=document.documentElement, mq=window.matchMedia('(prefers-color-scheme: dark)');
  const isDark=()=>{const t=root.getAttribute('data-theme');return t?t==='dark':mq.matches};
  const themeBtn=document.getElementById('theme-btn'), themeTxt=document.getElementById('theme-txt');
  function paintBtn(){const d=isDark();const mt=document.getElementById('meta-theme');if(mt)mt.setAttribute('content',d?'#11141b':'#f6f7fa');themeTxt.textContent=d?'Modo claro':'Modo oscuro';themeBtn.setAttribute('aria-label',d?'Cambiar a modo claro':'Cambiar a modo oscuro')}
  themeBtn.addEventListener('click',()=>{const next=isDark()?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('tema',next)}catch(e){}paintBtn()});
  mq.addEventListener&&mq.addEventListener('change',paintBtn);
  paintBtn();
  window.addEventListener('hashchange',fromHash);
  window.__onMJ=()=>{const p=document.getElementById('pn-'+topic+'-'+tab);typeset(p)};
  fromHash();
  if(window.__mj) window.__onMJ();
})();
