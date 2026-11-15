/* Studybook · piezas para los elementos interactivos (pestaña «Interactivo»).
   SB.ui.controls  deslizadores y selectores que llaman a update() en cada cambio
   SB.ui.num/frac/poly  números con punto decimal, espacio de miles y signo menos «−»
   SB.ui.quiz      práctica con alternativas, explicación y «Otro»
   SB.ui.drag      arrastrar un punto sobre un gráfico de SB.plot */
(function(){
  const MINUS='−', NB=' ';
  /* número: redondea a dec decimales, quita ceros sobrantes, separa miles con espacio */
  function num(v,dec){
    if(dec===undefined) dec=2;
    if(!isFinite(v)) return '—';
    let r=Math.round(v*Math.pow(10,dec))/Math.pow(10,dec); if(Object.is(r,-0)||Math.abs(r)<Math.pow(10,-dec)/2) r=0;
    let s=Math.abs(r).toFixed(dec); if(dec>0) s=s.replace(/\.?0+$/,'');
    let [i,d]=s.split('.'); i=i.replace(/\B(?=(\d{3})+(?!\d))/g,NB);
    return (r<0?MINUS:'')+i+(d?'.'+d:'');
  }
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1}
  /* fracción p/q simplificada (enteros); «40/7» o «6» */
  function frac(p,q){ if(q<0){p=-p;q=-q} const g=gcd(p,q); p/=g; q/=g; return q===1?num(p,0):(p<0?MINUS:'')+Math.abs(p)+'/'+q }
  /* polinomio con términos [coef, '<i>x</i>²'] (la variable ya en HTML) → «2x² − 3x + 1»; omite ceros y los 1 delante de la variable */
  function poly(terms,opt){
    opt=opt||{}; let out='';
    terms.forEach(([c,v])=>{
      if(!c) return;
      const neg=c<0, a=Math.abs(c);
      const coef=(a===1&&v)?'':num(a,opt.dec??2);
      const body=coef+(v||'');
      out+=out?(neg?' '+MINUS+' ':' + ')+body:(neg?MINUS:'')+body;
    });
    return out||'0';
  }
  /* «(x − 3)» o «(x + 2)» o «x» */
  function shift(v,h){ return h===0?'<i>'+v+'</i>':'(<i>'+v+'</i> '+(h>0?MINUS+' '+num(h):'+ '+num(-h))+')' }
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function h(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e}

  /* controles: defs = [{k:'a',label:'<i>a</i>',min,max,step,value,c:'blue',fmt:v=>...} | {k:'modo',type:'seg',options:[['pa','PA'],['pg','PG']],value}]
     update(valores) se llama al inicio y en cada cambio. Devuelve {values, set(k,v), el} */
  function controls(parent,defs,update){
    const box=h('div','iw-ctl'); parent.appendChild(box);
    const vals={}, setters={};
    let uid=controls.uid=(controls.uid||0)+1;
    defs.forEach(d=>{
      if(d.type==='seg'){
        const row=h('div','iw-seg'); row.setAttribute('role','group'); if(d.label) row.setAttribute('aria-label',d.label.replace(/<[^>]+>/g,''));
        if(d.label) row.appendChild(h('span','iw-seg-l',d.label));
        const btns=d.options.map(([v,t])=>{const b=h('button','',t);b.type='button';b.dataset.v=v;row.appendChild(b);return b});
        const set=v=>{vals[d.k]=v;btns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===String(v))))};
        btns.forEach(b=>b.addEventListener('click',()=>{set(b.dataset.v);update(vals)}));
        set(d.value); setters[d.k]=set; box.appendChild(row); return;
      }
      const id='iw-'+uid+'-'+d.k;
      const row=h('div','iw-sl'+(d.c?' c-'+d.c:''));
      const lab=h('label','iw-sl-l',d.label); lab.htmlFor=id;
      const inp=h('input'); inp.type='range'; inp.id=id; inp.min=d.min; inp.max=d.max; inp.step=d.step||1; inp.value=d.value;
      const out=h('output','iw-sl-v'); out.htmlFor=id;
      row.append(lab,inp,out);
      const fmt=d.fmt||(v=>num(v));
      const set=v=>{inp.value=v;vals[d.k]=+inp.value;out.innerHTML=fmt(vals[d.k]);inp.setAttribute('aria-valuetext',out.textContent)};
      inp.addEventListener('input',()=>{set(inp.value);update(vals)});
      set(d.value); setters[d.k]=set; box.appendChild(row);
    });
    update(vals);
    return {values:vals,set:(k,v)=>{setters[k](v);update(vals)},el:box};
  }

  /* arrastrar sobre el gráfico: host es el div del gráfico; getP() devuelve el último resultado de SB.plot; cb(x,y) en coordenadas de datos */
  function drag(host,getP,cb){
    /* solo con mouse o lápiz: en pantallas táctiles el gráfico debe dejar desplazar la página (se usan los deslizadores) */
    if(!window.matchMedia('(pointer: fine)').matches) return;
    host.classList.add('iw-drag');
    let on=false;
    const at=e=>{const p=getP(); if(!p) return; const r=p.svg.getBoundingClientRect(); const k=p.W/r.width; cb(p.ix((e.clientX-r.left)*k),p.iy((e.clientY-r.top)*k))};
    host.addEventListener('pointerdown',e=>{on=true;try{host.setPointerCapture(e.pointerId)}catch(_){}at(e);e.preventDefault()});
    host.addEventListener('pointermove',e=>{if(on)at(e)});
    const end=()=>{on=false}; host.addEventListener('pointerup',end); host.addEventListener('pointercancel',end);
  }

  /* práctica: gen() → {q:html, options:[html,...], answer:índice, explain:html}. Se puede pedir otra. */
  function quiz(parent,gen,opt){
    opt=opt||{};
    const box=h('div','iw-quiz'); parent.appendChild(box);
    const score={ok:0,n:0};
    const sc=h('p','iw-score');
    function next(){
      const g=gen(); box.textContent='';
      box.appendChild(h('div','iw-q',g.q));
      const ops=h('div','iw-ops'); box.appendChild(ops);
      const fb=h('div','iw-fb'); fb.hidden=true;
      let answered=false;
      g.options.forEach((t,i)=>{
        const b=h('button','iw-op',t); b.type='button';
        b.addEventListener('click',()=>{
          if(answered) return; answered=true; score.n++;
          const ok=i===g.answer; if(ok) score.ok++;
          ops.querySelectorAll('.iw-op').forEach((x,j)=>{x.disabled=true;if(j===g.answer)x.classList.add('ok');else if(j===i)x.classList.add('no')});
          fb.innerHTML='<b>'+(ok?'¡Bien!':'No es esa.')+'</b> '+g.explain; fb.className='iw-fb '+(ok?'ok':'no'); fb.hidden=false;
          sc.textContent='Aciertos: '+score.ok+' de '+score.n; nx.focus();
        });
        ops.appendChild(b);
      });
      box.appendChild(fb);
      const bar=h('div','iw-qbar');
      const nx=h('button','iw-next',opt.next||'Otro ejercicio →'); nx.type='button'; nx.addEventListener('click',next);
      bar.append(sc,nx); box.appendChild(bar);
    }
    next();
  }

  window.SB=window.SB||{};
  SB.ui={num,frac,poly,shift,gcd,rnd,pick,shuffle,h,controls,drag,quiz,MINUS};
})();
