/* Elementos interactivos de la Unidad 5 (Mate Nive): magnitudes, interés, progresiones y sumatorias. */
(function(){
  const U=SB.ui, num=U.num, M=U.MINUS;
  const pct=v=>num(v)+' %';
  const lcm=(a,b)=>a*b/U.gcd(a,b);
  const nice=span=>{const raw=span/8, p=Math.pow(10,Math.floor(Math.log10(raw))), m=raw/p; return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p};
  const range=(lo,hi)=>{lo=Math.min(0,lo);hi=Math.max(0,hi);if(hi-lo<1e-9)hi=lo+1;const pad=(hi-lo)*0.12;return [lo<0?lo-pad:0,hi+pad]};

  /* ======================= MAGNITUDES PROPORCIONALES ======================= */
  SB.widget('mp-dpip',body=>{
    const g=U.h('div','iw-plot'), tb=U.h('div','iw-scroll'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'m',type:'seg',label:'Relación:',options:[['dp','Directamente proporcional (DP)'],['ip','Inversamente proporcional (IP)']],value:'dp'},
      {k:'k',label:'constante <i>k</i>',min:1,max:12,step:1,value:6,c:'purple'}],v=>{
      const dp=v.m==='dp', k=v.k, xs=[1,2,3,4,5,6], ys=xs.map(x=>dp?k*x:k/x), c=dp?'blue':'orange';
      const ym=dp?6*k*1.1:k*1.15;
      SB.plot(g,{alt:(dp?'y = kx':'y = k/x')+' con k = '+k,x:[0,6.8],y:[0,ym],gx:1,gy:nice(ym),tx:xs,
        fns:[{f:x=>dp?k*x:k/x,from:dp?0:k/ym,to:6.6,c,wd:1.4,dash:'5 5'}],pts:xs.map((x,i)=>({x,y:ys[i],c,r:5.5}))});
      tb.innerHTML='<table class="iw-tbl"><tr><th><i>x</i></th>'+xs.map(x=>'<td>'+x+'</td>').join('')+'</tr><tr><th class="k-'+c+'"><i>y</i></th>'+ys.map(y=>'<td class="k-'+c+'">'+num(y)+'</td>').join('')+
        '</tr><tr><th class="k-purple">'+(dp?'<i>y</i> ÷ <i>x</i>':'<i>x</i> · <i>y</i>')+'</th>'+xs.map(()=>'<td class="k-purple"><b>'+k+'</b></td>').join('')+'</tr></table>';
      out.innerHTML=dp
        ?'<div class="big k-blue"><i>y</i> = '+k+'<i>x</i> &nbsp;⇔&nbsp; <i>y</i> ÷ <i>x</i> = '+k+'</div><div>Si <i>x</i> se duplica (de 2 a 4), <i>y</i> también se duplica (de '+num(2*k)+' a '+num(4*k)+'). El cociente se mantiene: siempre da <b class="k-purple">'+k+'</b>.</div><div class="k-muted">El gráfico es una recta que pasa por el origen.</div>'
        :'<div class="big k-orange"><i>y</i> = '+k+'/<i>x</i> &nbsp;⇔&nbsp; <i>x</i> · <i>y</i> = '+k+'</div><div>Si <i>x</i> se duplica (de 2 a 4), <i>y</i> se reduce a la mitad (de '+num(k/2)+' a '+num(k/4)+'). El producto se mantiene: siempre da <b class="k-purple">'+k+'</b>.</div><div class="k-muted">El gráfico es una curva (hipérbola) que nunca toca los ejes.</div>';
    });
    body.append(g,tb,out);
  });

  SB.widget('mp-reparto',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'m',type:'seg',label:'Repartir:',options:[['dp','DP a los números'],['ip','IP a los números']],value:'dp'},
      {k:'N',label:'total',min:120,max:3600,step:60,value:1200,c:'magenta'},
      {k:'a',label:'1.º',min:1,max:9,step:1,value:2,c:'blue'},
      {k:'b',label:'2.º',min:1,max:9,step:1,value:3,c:'blue'},
      {k:'c',label:'3.º',min:1,max:9,step:1,value:5,c:'blue'}],v=>{
      const {N,a,b,c}=v, dp=v.m==='dp';
      let w=[a,b,c], conv='';
      if(!dp){ const L=lcm(lcm(a,b),c); w=[L/a,L/b,L/c];
        conv='<div>IP a '+a+', '+b+', '+c+' es DP a 1/'+a+', 1/'+b+', 1/'+c+'. Multiplicando por '+L+' (el MCM): DP a <b>'+w.join(', ')+'</b>.</div>'; }
      const s=w[0]+w[1]+w[2], k=N/s, parts=w.map(x=>k*x);
      const ym=Math.max(...parts)*1.25;
      SB.plot(g,{alt:'Reparto de '+N,x:[0,4],y:[0,ym],gx:1,gy:nice(ym),tx:[[1,'1.º'],[2,'2.º'],[3,'3.º']],lx:' ',ly:' ',
        rects:parts.map((p,i)=>({x0:i+0.65,x1:i+1.35,y0:0,y1:p,c:'magenta',op:.75,rx:3})),
        pts:parts.map((p,i)=>({x:i+1,y:p,r:0.01,c:'magenta',t:num(p),anchor:'middle',dx:0,dy:-8}))});
      out.innerHTML=conv+'<div>Partes: '+w.map(x=>'<b class="k-blue">'+x+'</b><i>k</i>').join(' + ')+' = '+num(s)+'<i>k</i> = '+num(N)+'</div>'+
        '<div class="big"><i>k</i> = '+num(N)+' ÷ '+s+' = <b class="k-purple">'+num(k)+'</b></div>'+
        '<div class="k-magenta">'+w.map((x,i)=>x+' · '+num(k)+' = <b>'+num(parts[i])+'</b>').join(' &nbsp; ')+'</div>'+
        (dp?'<div class="k-muted">DP: al número más grande le toca más.</div>':'<div class="k-muted">IP: al número más grande le toca <b>menos</b>.</div>');
    });
    body.append(g,out);
  });

  SB.widget('mp-quiz',body=>{
    U.quiz(body,()=>{
      const tipo=U.pick(['dp','ip','no']); let xs, ys;
      if(tipo==='dp'){ const k=U.rnd(2,9); xs=U.shuffle([1,2,3,4,5,6,8]).slice(0,4).sort((p,q)=>p-q); ys=xs.map(x=>k*x) }
      else if(tipo==='ip'){ const k=U.pick([12,24,36,48,60]); const ds=[1,2,3,4,6,12].filter(d=>k%d===0); xs=U.shuffle(ds).slice(0,4).sort((p,q)=>p-q); ys=xs.map(x=>k/x) }
      else { const k=U.rnd(2,6), c=U.rnd(1,5); xs=[1,2,3,4]; ys=xs.map(x=>k*x+c) }
      const tbl='<table class="iw-tbl"><tr><th><i>x</i></th>'+xs.map(x=>'<td>'+x+'</td>').join('')+'</tr><tr><th><i>y</i></th>'+ys.map(y=>'<td>'+y+'</td>').join('')+'</tr></table>';
      const ops=['DP','IP','Ni DP ni IP'], ans={dp:0,ip:1,no:2}[tipo];
      const coc=xs.map((x,i)=>num(ys[i]/x)).join(', '), prod=xs.map((x,i)=>num(ys[i]*x)).join(', ');
      return {q:'¿Cómo son <i>x</i> e <i>y</i>?'+tbl,options:ops,answer:ans,
        explain:'Cocientes <i>y</i> ÷ <i>x</i>: '+coc+'. Productos <i>x</i> · <i>y</i>: '+prod+'. '+(tipo==='dp'?'El cociente es constante: son <b>DP</b>.':tipo==='ip'?'El producto es constante: son <b>IP</b>.':'Ni el cociente ni el producto son constantes: no son DP ni IP (aunque <i>y</i> crece con <i>x</i>).')};
    });
  });

  /* ======================= INTERÉS ======================= */
  SB.widget('in-carrera',body=>{
    const g=U.h('div','iw-plot'), tb=U.h('div','iw-scroll'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'K',label:'capital',min:1000,max:20000,step:1000,value:10000,c:'blue'},
      {k:'r',label:'tasa por periodo',min:1,max:30,step:1,value:10,c:'orange',fmt:pct},
      {k:'n',label:'periodos',min:1,max:12,step:1,value:4,c:'green'}],v=>{
      const {K,r,n}=v, i=r/100, ts=[...Array(n+1).keys()];
      const sim=ts.map(t=>K*(1+i*t)), com=ts.map(t=>K*Math.pow(1+i,t)), ym=com[n]*1.12;
      const y0=K*0.9; SB.plot(g,{alt:'Monto simple y compuesto',x:[-0.4,n+0.6],y:[y0,ym],gx:1,gy:nice(ym-y0),ty:[K],lx:'n',ly:'M',tx:ts.filter(t=>n<=8||t%2===0),
        segs:[{a:[-0.4,K],b:[n+0.6,K],c:'blue'}],
        fns:[],pts:ts.map(t=>({x:t,y:sim[t],c:'muted',r:4.5})).concat(ts.map(t=>({x:t,y:com[t],c:'purple',r:5.5})))
          .concat([{x:n,y:com[n],r:0.01,c:'purple',t:'compuesto',anchor:'end',dx:-10,dy:-4},{x:n,y:sim[n],r:0.01,c:'muted',t:'simple',anchor:'end',dx:-10,dy:16},{x:0,y:K,r:0.01,c:'blue',t:'capital',dx:6,dy:-8}])});
      tb.innerHTML='<table class="iw-tbl"><tr><th><i>n</i></th><th>Simple</th><th class="k-purple">Compuesto</th><th>Diferencia</th></tr>'+
        ts.map(t=>'<tr'+(t===n?' class="hl"':'')+'><td>'+t+'</td><td>'+num(sim[t])+'</td><td class="k-purple">'+num(com[t])+'</td><td>'+num(com[t]-sim[t])+'</td></tr>').join('')+'</table>';
      out.innerHTML='<div>Simple: <i>M</i> = <span class="k-blue">'+num(K)+'</span>(1 + <span class="k-orange">'+num(i,4)+'</span> · <span class="k-green">'+n+'</span>) = <b>'+num(sim[n])+'</b></div>'+
        '<div class="k-purple">Compuesto: <i>M</i> = <span class="k-blue">'+num(K)+'</span>(1 + <span class="k-orange">'+num(i,4)+'</span>)<sup class="k-green">'+n+'</sup> = <b>'+num(com[n])+'</b></div>'+
        '<div>En el simple se gana siempre lo mismo por periodo ('+num(K*i)+'); en el compuesto, cada periodo gana también sobre los intereses anteriores. La diferencia crece: <b>'+num(com[n]-sim[n])+'</b>.</div>';
    });
    body.append(g,tb,out);
  });

  SB.widget('in-frecuencia',body=>{
    const tb=U.h('div','iw-scroll'), out=U.h('div','iw-out');
    const F=[[1,'anual'],[2,'semestral'],[3,'cuatrimestral'],[4,'trimestral'],[6,'bimestral'],[12,'mensual'],[365,'diaria']];
    U.controls(body,[
      {k:'r',label:'tasa anual',min:4,max:48,step:4,value:20,c:'orange',fmt:pct},
      {k:'t',label:'años',min:1,max:5,step:1,value:2,c:'green'}],v=>{
      const K=10000, {r,t}=v;
      const rows=F.map(([m,nom])=>{const ip=r/m, n=m*t, Mo=K*Math.pow(1+ip/100,n);return {m,nom,ip,n,Mo}});
      tb.innerHTML='<table class="iw-tbl"><tr><th>Capitalizable</th><th class="k-orange">Tasa</th><th class="k-green">Periodos</th><th>Monto</th></tr>'+
        rows.map(o=>'<tr><td>'+o.nom+'</td><td class="k-orange">'+num(o.ip,3)+' %</td><td class="k-green">'+num(o.n)+'</td><td><b>'+num(o.Mo)+'</b></td></tr>').join('')+'</table>';
      out.innerHTML='<div>Capital: <span class="k-blue">10 000</span>. Para cada fila, la tasa anual se divide entre los periodos del año y el tiempo se cuenta en esos periodos: <i>M</i> = 10 000(1 + <span class="k-orange"><i>r</i>%/<i>m</i></span>)<sup class="k-green"><i>m</i>·<i>t</i></sup>.</div>'+
        '<div>Mientras más seguido se capitaliza, más se gana, pero cada vez menos: de anual a semestral se ganan '+num(rows[1].Mo-rows[0].Mo)+' más; de mensual a diaria, solo '+num(rows[6].Mo-rows[5].Mo)+'.</div>';
    });
    body.append(tb,out);
  });

  SB.widget('in-periodo',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'K',label:'capital',min:1000,max:20000,step:1000,value:8000,c:'blue'},
      {k:'r',label:'tasa por periodo',min:5,max:50,step:5,value:25,c:'orange',fmt:pct},
      {k:'k',label:'periodo',min:1,max:8,step:1,value:3,c:'green',fmt:v=>v+'.º'}],v=>{
      const {K,r,k}=v, i=r/100, N=8;
      const start=t=>K*Math.pow(1+i,t-1), I=t=>start(t)*i;
      const ym=K*Math.pow(1+i,N)*1.08;
      const rects=[];
      for(let t=1;t<=N;t++){ rects.push({x0:t-0.35,x1:t+0.35,y0:0,y1:start(t),c:'blue',op:t===k?.75:.25}); rects.push({x0:t-0.35,x1:t+0.35,y0:start(t),y1:start(t)+I(t),c:'purple',op:t===k?.9:.35}) }
      SB.plot(g,{alt:'Monto al empezar cada periodo e interés del periodo',x:[0.2,N+0.8],y:[0,ym],gx:1,gy:nice(ym),lx:'periodo',ly:' ',tx:[1,2,3,4,5,6,7,8],rects,
        pts:[{x:k,y:start(k)+I(k),r:0.01,c:'purple',t:'I = '+num(I(k)),anchor:'middle',dx:0,dy:-8}]});
      out.innerHTML='<div>Al empezar el periodo '+k+' ya pasaron '+(k-1)+' periodos: hay <span class="k-blue">'+num(K)+'(1 + '+num(i)+')<sup>'+(k-1)+'</sup> = '+num(start(k))+'</span>.</div>'+
        '<div class="big k-purple"><i>I</i><sub>'+k+'</sub> = '+num(start(k))+' · '+num(i)+' = <b>'+num(I(k))+'</b></div>'+
        '<div class="k-muted">Cada barra es lo que hay al empezar el periodo (azul) más el interés de ese periodo (morado). El interés de un periodo es el '+pct(r)+' de lo que hay <b>al empezarlo</b>, no del capital inicial.</div>';
    });
    body.append(g,out);
  });

  SB.widget('in-quiz',body=>{
    const P=[[2,'semestralmente','semestral','semestres'],[3,'cuatrimestralmente','cuatrimestral','cuatrimestres'],[4,'trimestralmente','trimestral','trimestres'],[6,'bimestralmente','bimestral','bimestres'],[12,'mensualmente','mensual','meses']];
    U.quiz(body,()=>{
      const [m,adv,adj,pl]=U.pick(P), T=U.pick([12,24,36,48].filter(x=>x%m===0)), t=U.rnd(1,4);
      const ok=num(T/m)+' % '+adj+', '+(m*t)+' '+pl;
      const cand=[ok,num(T)+' % '+adj+', '+(m*t)+' '+pl,num(T/m)+' % '+adj+', '+t+' '+pl,num(T)+' % anual, '+t+' años',num(T*m)+' % '+adj+', '+(m*t)+' '+pl];
      const ops=[...new Set(cand)].slice(0,4), sh=U.shuffle(ops);
      return {q:'Un capital se deposita al '+T+' % anual capitalizable '+adv+' durante '+t+' año'+(t>1?'s':'')+'. ¿Con qué tasa y cuántos periodos se usa <i>M</i> = <i>K</i>(1 + <i>r</i>%)<sup><i>n</i></sup>?',
        options:sh,answer:sh.indexOf(ok),
        explain:'"Capitalizable '+adv+'" manda: el año tiene '+m+' periodos, así que la tasa por periodo es '+T+' % ÷ '+m+' = <b class="k-orange">'+num(T/m)+' %</b> y en '+t+' año'+(t>1?'s':'')+' hay <b class="k-green">'+(m*t)+'</b> '+pl+'.'};
    });
  });

  /* ======================= PROGRESIONES ======================= */
  SB.widget('pr-constructor',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    let ctl;
    const draw=v=>{
      const pa=v.m==='pa', a1=v.a, d=v.d, r=v.r, n=v.n, N=10;
      const rows=body.querySelectorAll('.iw-sl'); if(rows.length>3){rows[1].hidden=!pa;rows[2].hidden=pa}
      if(!pa&&a1===0){ g.textContent=''; out.innerHTML='<div class="msg warn">Con primer término 0, todos los términos son 0: no se considera PG (no se puede calcular la razón).</div>'; return }
      if(!pa&&r===0){ g.textContent=''; out.innerHTML='<div class="msg warn">Con razón 0, desde el segundo término todo vale 0: no se considera PG (no se podría dividir entre los términos).</div>'; return }
      const term=k=>pa?a1+(k-1)*d:a1*Math.pow(r,k-1), ts=[...Array(N).keys()].map(k=>term(k+1));
      const [y0,y1]=range(Math.min(...ts),Math.max(...ts));
      SB.plot(g,{alt:(pa?'PA':'PG')+' de primer término '+a1,x:[0.2,N+0.8],y:[y0,y1],gx:1,gy:nice(y1-y0),lx:'n',ly:'aₙ',tx:[1,2,3,4,5,6,7,8,9,10],
        rects:ts.map((y,k)=>({x0:k+1-0.32,x1:k+1+0.32,y0:0,y1:y,c:k+1===n?'magenta':pa?'blue':'orange',op:k+1===n?.85:.4,rx:2})),
        pts:[{x:n,y:ts[n-1],r:0.01,c:'magenta',t:num(ts[n-1]),anchor:'middle',dx:0,dy:ts[n-1]<0?18:-8}]});
      const op=pa?(d<0?M+' '+num(-d):'+ '+num(d)):'× '+num(r);
      const lista=ts.slice(0,6).map(num).join(' <span class="k-muted">→</span> ');
      out.innerHTML='<div class="big">'+lista+' …</div><div class="k-'+(pa?'blue':'orange')+'">Cada término es el anterior <b>'+op+'</b>.</div>'+
        (pa?'<div class="big"><i>a<sub>n</sub></i> = <span class="k-blue">'+num(a1)+'</span> + (<i>n</i> '+M+' 1)·<span class="k-orange">'+(d<0?'('+num(d)+')':num(d))+'</span> &nbsp; → &nbsp; <i>a</i><sub class="k-green">'+n+'</sub> = '+num(a1)+' + '+(n-1)+'·'+(d<0?'('+num(d)+')':num(d))+' = <b class="k-magenta">'+num(ts[n-1])+'</b></div>'
            :'<div class="big"><i>a<sub>n</sub></i> = <span class="k-blue">'+num(a1)+'</span>·<span class="k-orange">'+(r<0?'('+num(r)+')':num(r))+'</span><sup><i>n</i> '+M+' 1</sup> &nbsp; → &nbsp; <i>a</i><sub class="k-green">'+n+'</sub> = '+num(a1)+'·'+(r<0?'('+num(r)+')':num(r))+'<sup>'+(n-1)+'</sup> = <b class="k-magenta">'+num(ts[n-1])+'</b></div>')+
        '<div class="k-muted">'+(pa?(d===0?'Con <i>d</i> = 0 la sucesión es constante.':'En una PA las barras suben (o bajan) siempre lo mismo: en línea recta.')
          :(r<0?'Con razón negativa los signos se alternan.':Math.abs(r)<1?'Con razón entre 0 y 1 los términos se achican hacia 0.':r===1?'Con razón 1 la sucesión es constante.':'Con razón mayor que 1 crece cada vez más rápido.'))+'</div>';
    };
    ctl=U.controls(body,[
      {k:'m',type:'seg',label:'Tipo:',options:[['pa','Progresión aritmética'],['pg','Progresión geométrica']],value:'pa'},
      {k:'a',label:'<i>a</i>₁',min:-5,max:10,step:1,value:2,c:'blue'},
      {k:'d',label:'diferencia <i>d</i> (PA)',min:-4,max:6,step:1,value:3,c:'orange'},
      {k:'r',label:'razón <i>r</i> (PG)',min:-3,max:3,step:0.5,value:2,c:'orange'},
      {k:'n',label:'término <i>n</i>',min:1,max:10,step:1,value:6,c:'green'}],draw);
    body.append(g,out);
  });

  SB.widget('pr-carrera',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'a',label:'<i>a</i>₁ (las dos)',min:1,max:5,step:1,value:1,c:'blue'},
      {k:'d',label:'PA: <i>d</i>',min:1,max:20,step:1,value:10,c:'blue'},
      {k:'r',label:'PG: <i>r</i>',min:1.1,max:3,step:0.1,value:1.5,c:'orange',fmt:v=>num(v,1)}],v=>{
      const {a,d,r}=v, N=14, ns=[...Array(N).keys()].map(k=>k+1);
      const A=n=>a+(n-1)*d, G=n=>a*Math.pow(r,n-1);
      const cross=ns.find(n=>n>1&&G(n)>A(n));
      const ym=Math.max(A(N),Math.min(G(N),A(N)*2.2))*1.08;
      SB.plot(g,{alt:'PA contra PG',x:[0,N+0.8],y:[0,ym],gx:1,gy:nice(ym),lx:'n',ly:'aₙ',tx:[1,5,10,14],clipPts:true,
        fns:[{f:n=>A(n),from:1,to:N,c:'blue',wd:1.2,dash:'5 5'},{f:n=>G(n),from:1,to:N,c:'orange',wd:1.2,dash:'5 5'}],
        pts:ns.map(n=>({x:n,y:A(n),c:'blue',r:4})).concat(ns.map(n=>({x:n,y:G(n),c:'orange',r:4}))).concat(cross?[{x:cross,y:G(cross),c:'magenta',r:7}]:[])});
      out.innerHTML='<div><span class="k-blue">PA: '+ns.slice(0,6).map(n=>num(A(n))).join(', ')+' …</span></div><div><span class="k-orange">PG: '+ns.slice(0,6).map(n=>num(G(n),2)).join(', ')+' …</span></div>'+
        (cross?'<div class="msg ok">Desde el término <b class="k-magenta">'+cross+'</b> la PG supera a la PA ('+num(G(cross))+' &gt; '+num(A(cross))+').</div>'
              :'<div class="msg warn">En los primeros '+N+' términos la PG no alcanza a la PA. Sube la razón o espera más términos: tarde o temprano la alcanza.</div>')+
        '<div class="k-muted">La PA suma siempre lo mismo; la PG multiplica. Aunque empiece lenta, una PG con <i>r</i> &gt; 1 siempre termina ganando.</div>';
    });
    body.append(g,out);
  });

  SB.widget('pr-quiz',body=>{
    U.quiz(body,()=>{
      const tipo=U.pick(['pa','pg','no']); let t;
      if(tipo==='pa'){ const a=U.rnd(-6,12), d=U.pick([-5,-4,-3,-2,2,3,4,5,6,7]); t=[0,1,2,3,4].map(k=>a+k*d) }
      else if(tipo==='pg'){ const a=U.pick([1,2,3,5,-2]), r=U.pick([2,3,-2,-3,4]); t=[0,1,2,3,4].map(k=>a*Math.pow(r,k)) }
      else { const f=U.pick([k=>(k+1)*(k+1),k=>[1,1,2,3,5,8][k],k=>(k+1)*(k+2),k=>2*(k+1)*(k+1)-1]); t=[0,1,2,3,4].map(f) }
      const dif=t.slice(1).map((x,k)=>num(x-t[k])).join(', '), raz=t.slice(1).map((x,k)=>t[k]?U.frac(x,t[k]):'—').join(', ');
      return {q:'¿Qué es la sucesión <b>'+t.map(x=>num(x)).join(', ')+', …</b>?',options:['PA','PG','Ninguna de las dos'],answer:{pa:0,pg:1,no:2}[tipo],
        explain:'Diferencias: '+dif+'. Razones: '+raz+'. '+(tipo==='pa'?'Las diferencias son iguales: es una <b>PA</b>.':tipo==='pg'?'Las razones son iguales: es una <b>PG</b>.':'Ni las diferencias ni las razones son iguales.')};
    });
  });

  SB.widget('pr-quiz-conteo',body=>{
    U.quiz(body,()=>{
      const d=U.pick([2,3,4,5,6,7,9]), a=U.rnd(1,20), n=U.rnd(12,60), l=a+(n-1)*d;
      const ok=String(n), cand=[ok,String(n-1),String(n+1),String(l-a),String(n+2)];
      const ops=[...new Set(cand)].slice(0,4), sh=U.shuffle(ops);
      return {q:'¿Cuántos términos tiene la PA <b>'+a+', '+(a+d)+', '+(a+2*d)+', …, '+l+'</b>?',options:sh,answer:sh.indexOf(ok),
        explain:'<i>n</i> = ('+l+' '+M+' '+a+') ÷ '+d+' + 1 = '+((l-a)/d)+' + 1 = <b>'+n+'</b>. El +1 es porque se cuentan los términos, no los saltos.'};
    });
  });

  /* ======================= SUMATORIAS ======================= */
  SB.widget('su-gauss',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[{k:'n',label:'<i>n</i>',min:1,max:12,step:1,value:6,c:'green'}],v=>{
      const n=v.n, rects=[];
      for(let i=1;i<=n;i++){ rects.push({x0:i-1,x1:i,y0:0,y1:i,c:'blue',op:.55,stroke:'sheet'}); rects.push({x0:i-1,x1:i,y0:i,y1:n+1,c:'orange',op:.45,stroke:'sheet'}) }
      SB.plot(g,{alt:'Dos escaleras de 1 a '+n+' forman un rectángulo',eq:true,x:[-0.6,n+3.4],y:[-0.6,n+1.8],gx:1,gy:1,lx:' ',ly:' ',w:Math.min(500,180+n*28),rects,
        segs:[{a:[0,0],b:[n,0],c:'ink',dash:false,wd:2},{a:[n,0],b:[n,n+1],c:'ink',dash:false,wd:2},{a:[0,n+1],b:[n,n+1],c:'ink',dash:false,wd:2},{a:[0,0],b:[0,n+1],c:'ink',dash:false,wd:2}],
        pts:[{x:n/2,y:0,r:0.01,c:'ink',t:'n = '+n,anchor:'middle',dx:0,dy:16},{x:n,y:(n+1)/2,r:0.01,c:'ink',t:'n + 1 = '+(n+1),dx:8,dy:4}]});
      const S=n*(n+1)/2;
      out.innerHTML='<div><span class="k-blue">Azul: 1 + 2 + … + '+n+'</span>. <span class="k-orange">Naranja: la misma escalera al revés</span>.</div>'+
        '<div>Juntas forman un rectángulo de <b>'+n+' × '+(n+1)+' = '+(n*(n+1))+'</b> cuadraditos, que es 2<i>S</i>.</div>'+
        '<div class="big k-purple"><i>S</i> = <i>n</i>(<i>n</i> + 1)/2 = '+n+'·'+(n+1)+'/2 = <b>'+S+'</b></div>';
    });
    body.append(g,out);
  });

  SB.widget('su-tele',body=>{
    const box=U.h('div','iw-tele'), out=U.h('div','iw-out');
    let shown=true;
    const bar=U.h('div','iw-seg'), tg=U.h('button','','Tachar lo que se cancela'); tg.type='button'; tg.setAttribute('aria-pressed','true'); bar.appendChild(tg);
    let last={n:5};
    const draw=v=>{
      last=v; const n=v.n, parts=[];
      for(let i=1;i<=n;i++){
        const a=i===1?'<span class="keep">1</span>':(shown?'<s>1/'+i+'</s>':'1/'+i);
        const b=i===n?'<span class="keep">1/'+(i+1)+'</span>':(shown?'<s>1/'+(i+1)+'</s>':'1/'+(i+1));
        parts.push('<span class="tt">('+a+' '+M+' '+b+')</span>');
      }
      box.innerHTML=parts.join(' + ')+' <span class="tt">= <span class="keep">1 '+M+' 1/'+(n+1)+'</span></span>';
      out.innerHTML='<div>Es <i>a</i><sub>1</sub> '+M+' <i>a</i><sub><i>n</i>+1</sub> con <i>a<sub>i</sub></i> = 1/<i>i</i>: todo lo del medio aparece una vez con + y otra con '+M+'.</div>'+
        '<div class="big k-purple">'+Array.from({length:n},(_,k)=>'1/'+((k+1)*(k+2))).slice(0,4).join(' + ')+(n>4?' + …':'')+' = 1 '+M+' 1/'+(n+1)+' = <b>'+n+'/'+(n+1)+'</b></div>'+
        '<div class="k-muted">Por eso la suma de 1/(<i>i</i>(<i>i</i> + 1)) desde 1 hasta 99 es 99/100.</div>';
    };
    tg.addEventListener('click',()=>{shown=!shown;tg.setAttribute('aria-pressed',String(shown));draw(last)});
    U.controls(body,[{k:'n',label:'número de términos <i>n</i>',min:2,max:9,step:1,value:5,c:'green'}],draw);
    body.append(bar,box,out);
  });

  SB.widget('su-cuadrado',body=>{
    const g=U.h('div','iw-plot iw-sq'), out=U.h('div','iw-out');
    U.controls(body,[{k:'n',label:'términos <i>n</i>',min:1,max:10,step:1,value:3,c:'green'}],v=>{
      const n=v.n, rects=[], cols=['blue','orange','purple','green','magenta'];
      let x0=0,y0=0,w=1,h=1;
      for(let i=1;i<=n;i++){
        if(i%2){ rects.push({x0,x1:x0+w/2,y0,y1:y0+h,c:cols[(i-1)%5],op:.6,stroke:'sheet'}); x0+=w/2; w/=2 }
        else   { rects.push({x0,x1:x0+w,y0,y1:y0+h/2,c:cols[(i-1)%5],op:.6,stroke:'sheet'}); y0+=h/2; h/=2 }
      }
      SB.plot(g,{alt:'Cuadrado de lado 1 llenado con mitades',eq:true,x:[-0.08,1.08],y:[-0.08,1.08],gx:0.5,gy:0.5,lx:' ',ly:' ',w:360,rects,
        segs:[{a:[0,0],b:[1,0],c:'ink',dash:false,wd:2},{a:[1,0],b:[1,1],c:'ink',dash:false,wd:2},{a:[0,1],b:[1,1],c:'ink',dash:false,wd:2},{a:[0,0],b:[0,1],c:'ink',dash:false,wd:2}]});
      const S=1-Math.pow(2,-n);
      out.innerHTML='<div class="big">'+Array.from({length:Math.min(n,5)},(_,k)=>'1/'+Math.pow(2,k+1)).join(' + ')+(n>5?' + … + 1/'+Math.pow(2,n):'')+'</div>'+
        '<div class="big k-purple"><i>S</i><sub>'+n+'</sub> = (1/2)·(1 '+M+' (1/2)<sup>'+n+'</sup>)/(1 '+M+' 1/2) = 1 '+M+' 1/'+Math.pow(2,n)+' = <b>'+num(S,6)+'</b></div>'+
        '<div>Falta llenar <b>1/'+Math.pow(2,n)+'</b> del cuadrado: cada término llena la mitad de lo que queda. La suma se acerca a 1 tanto como se quiera, pero con un número finito de términos nunca llega.</div>';
    });
    body.append(g,out);
  });

  SB.widget('su-quiz',body=>{
    U.quiz(body,()=>{
      const A=U.pick([1,2,3,1,2]), B=U.rnd(-3,6);
      const f=(p,q)=>U.poly([[p,'<i>n</i>'],[q,'']]);
      const ok=f(2*A,B-A), cand=[ok,f(2*A,B),f(A,B),f(2*A,A-B),f(A,B-A)];
      const ops=[...new Set(cand)].slice(0,4), sh=U.shuffle(ops);
      return {q:'Si <i>a</i><sub>1</sub> + <i>a</i><sub>2</sub> + … + <i>a<sub>n</sub></i> = '+U.poly([[A,'<i>n</i>²'],[B,'<i>n</i>']])+', ¿cuál es <i>a<sub>n</sub></i>?',options:sh.map(x=>'<i>a<sub>n</sub></i> = '+x),answer:sh.indexOf(ok),
        explain:'<i>a<sub>n</sub></i> = <i>S<sub>n</sub></i> '+M+' <i>S</i><sub><i>n</i>'+M+'1</sub> = '+(A===1?'':A)+'(<i>n</i>² '+M+' (<i>n</i> '+M+' 1)²) '+(B<0?M+' '+(-B):'+ '+B)+'(<i>n</i> '+M+' (<i>n</i> '+M+' 1)) = '+(A===1?'':A)+'(2<i>n</i> '+M+' 1) '+(B<0?M+' '+(-B):'+ '+B)+' = <b>'+ok+'</b>. Comprobación: <i>a</i><sub>1</sub> = <i>S</i><sub>1</sub> = '+num(A+B)+'.'};
    });
  });
})();
