/* Elementos interactivos de la Unidad 4 (Mate Nive): parábolas, circunferencias, oferta y demanda. */
(function(){
  const U=SB.ui, num=U.num, M=U.MINUS;
  const pt=(x,y,d)=>'('+num(x,d)+', '+num(y,d)+')';
  const sgn=v=>v<0?M+' '+num(-v):'+ '+num(v);
  const par=v=>v<0?'('+num(v)+')':num(v);
  const negb=b=>b<0?M+'('+num(b)+')':M+num(b);

  /* ======================= PARÁBOLAS ======================= */
  SB.widget('par-coef',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'a',label:'<i>a</i>',min:-3,max:3,step:0.5,value:1},
      {k:'b',label:'<i>b</i>',min:-8,max:8,step:1,value:-4},
      {k:'c',label:'<i>c</i>',min:-8,max:8,step:1,value:3}],v=>{
      const {a,b,c}=v, eq='<i>y</i> = '+U.poly([[a,'<i>x</i>²'],[b,'<i>x</i>'],[c,'']]);
      if(a===0){
        SB.plot(g,{alt:'Recta',x:[-8,8],y:[-10,10],gx:2,gy:2,fns:[{f:x=>b*x+c,c:'muted'}],pts:[{x:0,y:c,c:'orange',t:pt(0,c)}],clipPts:true});
        out.innerHTML='<div class="big">'+eq+'</div><div class="msg warn">Con <i>a</i> = 0 no hay término en <i>x</i>²: es una recta, no una parábola.</div>'; return;
      }
      const h=-b/(2*a), k=c-b*b/(4*a), D=b*b-4*a*c;
      const roots=D>0?[(-b-Math.sqrt(D))/(2*a),(-b+Math.sqrt(D))/(2*a)].sort((p,q)=>p-q):D===0?[h]:[];
      const pts=[{x:h,y:k,c:'blue',r:6,t:'V'+pt(h,k),anchor:'middle',dx:0,dy:a>0?22:-12},{x:0,y:c,c:'orange',t:pt(0,c),dx:8,dy:a>0?-8:16}];
      if(D>0) roots.forEach(r=>{ if(Math.abs(r)>1e-9||c!==0) pts.push({x:r,y:0,c:'orange',t:num(r),anchor:'middle',dx:0,dy:a>0?-10:18}) });
      SB.plot(g,{alt:'Parábola '+eq.replace(/<[^>]+>/g,''),x:[-8,8],y:[-10,10],gx:2,gy:2,fns:[{f:x=>a*x*x+b*x+c}],pts,clipPts:true});
      const deltaMsg=D>0?'<span class="msg ok">Δ &gt; 0: corta al eje <i>x</i> en dos puntos, <span class="k-orange">'+roots.map(r=>'<i>x</i> = '+num(r)).join(' y ')+'</span>.</span>'
        :D===0?'<span class="msg ok">Δ = 0: toca al eje <i>x</i> en un solo punto, el vértice.</span>':'<span class="msg warn">Δ &lt; 0: no corta al eje <i>x</i>.</span>';
      out.innerHTML='<div class="big">'+eq+'</div>'+
        '<div>'+(a>0?'<i>a</i> &gt; 0: abre hacia <b>arriba</b>; el vértice es el punto más bajo (<b>mínimo</b>).':'<i>a</i> &lt; 0: abre hacia <b>abajo</b>; el vértice es el punto más alto (<b>máximo</b>).')+'</div>'+
        '<div class="k-blue"><i>h</i> = '+M+'<i>b</i>/(2<i>a</i>) = '+negb(b)+'/(2·'+par(a)+') = <b>'+num(h)+'</b> &nbsp; <i>k</i> = <i>y</i>('+num(h)+') = <b>'+num(k)+'</b></div>'+
        '<div>Forma con el vértice: <i>y</i> = '+(a===1?'':a===-1?M:num(a))+U.shift('x',h)+'²'+(k?' '+sgn(k):'')+'</div>'+
        '<div>Δ = <i>b</i>² '+M+' 4<i>ac</i> = '+num(b*b)+' '+M+' '+(4*a*c<0?'('+num(4*a*c)+')':num(4*a*c))+' = <b>'+num(D)+'</b></div>'+deltaMsg+
        '<div class="k-orange">Corte con el eje <i>y</i>: (0, '+num(c)+'), porque con <i>x</i> = 0 queda <i>y</i> = <i>c</i>.</div>';
    });
    body.append(g,out);
  });

  SB.widget('par-cerca',body=>{
    const row=U.h('div','iw-row'), g1=U.h('div','iw-plot'), g2=U.h('div','iw-plot'), out=U.h('div','iw-out');
    let ctl;
    const draw=v=>{
      const x=v.x, y=10-x, A=x*y;
      SB.plot(g1,{alt:'Corral de '+num(x)+' por '+num(y),eq:true,x:[-1,11],y:[-1,11],gx:1,gy:1,lx:' ',ly:' ',
        rects:[{x0:0,y0:0,x1:x,y1:y,c:'green',op:.22,stroke:'green'}],
        segs:[{a:[0,y],b:[x,y],c:'magenta',wd:2.5,dash:false},{a:[x,0],b:[x,y],c:'magenta',wd:2.5,dash:false},{a:[0,0],b:[x,0],c:'magenta',wd:2.5,dash:false},{a:[0,0],b:[0,y],c:'magenta',wd:2.5,dash:false}],
        pts:[{x:x/2,y:0,r:0.01,c:'magenta',t:'x = '+num(x),anchor:'middle',dx:0,dy:18},{x:x,y:y/2,r:0.01,c:'magenta',t:'10 − x = '+num(y),dx:6,dy:4},{x:x/2,y:y/2,r:0.01,c:'green',t:'A = '+num(A),anchor:'middle',dx:0,dy:4}]});
      SB.plot(g2,{alt:'Área en función de x',x:[-0.5,10.5],y:[-2,28],gx:1,gy:5,lx:'x',ly:'A',tx:[5,10],ty:[25],
        fns:[{f:t=>t*(10-t),from:0,to:10}],segs:[{a:[x,0],b:[x,A],c:'green'}],
        pts:[{x:5,y:25,c:'blue',r:5,t:'máximo (5, 25)',anchor:'middle',dx:0,dy:-12},{x,y:A,c:'green',r:6.5,t:num(A),dx:8,dy:-6}]});
      out.innerHTML='<div class="big">Área = <i>x</i>(10 '+M+' <i>x</i>) = '+num(x)+' · '+num(y)+' = <b class="k-green">'+num(A)+' m²</b></div>'+
        (x===5?'<div class="msg ok">¡Máximo! Con un cuadrado de 5 × 5 se encierran 25 m².</div>':'<div>Faltan <b>'+num(25-A)+' m²</b> para el máximo. Prueba con <i>x</i> más '+(x<5?'grande':'chico')+'.</div>')+
        '<div class="k-muted">Los 20 m de cerca dan 2<i>x</i> + 2(10 '+M+' <i>x</i>) = 20 para cualquier <i>x</i>: solo cambia la forma.</div>'+
        '<div><i>A</i>(<i>x</i>) = '+M+'<i>x</i>² + 10<i>x</i> es una parábola que abre hacia abajo: su vértice <span class="k-blue">(5, 25)</span> es el máximo. <i>x</i> y 10 '+M+' <i>x</i> dan la misma área: el gráfico es simétrico respecto a <i>x</i> = 5.</div>';
    };
    ctl=U.controls(body,[{k:'x',label:'ancho <i>x</i>',min:0,max:10,step:0.5,value:2,c:'magenta',fmt:v=>num(v)+' m'}],draw);
    const bar=U.h('div','iw-seg'); const play=U.h('button','','▶ Recorrer de 0 a 10'); play.type='button'; bar.appendChild(play);
    let timer=null;
    play.addEventListener('click',()=>{
      if(timer){clearInterval(timer);timer=null;play.textContent='▶ Recorrer de 0 a 10';return}
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ctl.set('x',5);return}
      let x=0; play.textContent='❚❚ Pausa';
      timer=setInterval(()=>{ctl.set('x',x);x+=0.5;if(x>10){clearInterval(timer);timer=null;play.textContent='▶ Recorrer de 0 a 10'}},260);
    });
    row.append(g1,g2); body.append(bar,row,out);
  });

  SB.widget('par-recta',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'m',label:'pendiente <i>m</i>',min:-4,max:4,step:0.5,value:1,c:'orange'},
      {k:'k',label:'corte <i>k</i>',min:-6,max:6,step:0.5,value:2,c:'orange'}],v=>{
      const {m,k}=v, D=m*m+4*k;
      const xs=D>0?[(m-Math.sqrt(D))/2,(m+Math.sqrt(D))/2]:D===0?[m/2]:[];
      const pts=xs.map(x=>({x,y:x*x,c:D===0?'magenta':'purple',r:6,t:pt(x,x*x),dx:8,dy:-8}));
      SB.plot(g,{alt:'Parábola y = x² y recta',x:[-5,5],y:[-4,14],gx:1,gy:2,fns:[{f:x=>x*x},{f:x=>m*x+k,c:'orange',wd:2}],pts,clipPts:true});
      const tang=-m*m/4;
      out.innerHTML='<div class="big"><i>x</i>² = '+U.poly([[m,'<i>x</i>'],[k,'']])+' &nbsp;→&nbsp; <i>x</i>² '+(m?(m>0?M+' ':'+ ')+(Math.abs(m)===1?'':num(Math.abs(m)))+'<i>x</i> ':'')+(k?(k>0?M+' ':'+ ')+num(Math.abs(k))+' ':'')+'= 0</div>'+
        '<div>Δ = <i>m</i>² + 4<i>k</i> = '+num(m*m)+' '+sgn(4*k)+' = <b>'+num(D)+'</b></div>'+
        (D>0?'<div class="msg ok">Δ &gt; 0: la recta corta a la parábola en <span class="k-purple">dos puntos</span>.</div>'
         :D===0?'<div class="msg ok">Δ = 0: un solo punto. La recta es <span class="k-magenta">tangente</span> a la parábola.</div>'
         :'<div class="msg warn">Δ &lt; 0: la recta no toca a la parábola.</div>')+
        '<div class="k-muted">Con esta pendiente, la recta es tangente cuando 4<i>k</i> = '+M+'<i>m</i>², es decir <i>k</i> = '+num(tang)+'.</div>';
    });
    body.append(g,out);
  });

  SB.widget('par-quiz',body=>{
    U.quiz(body,()=>{
      const a=U.pick([1,-1,2,-2]), h=U.rnd(-4,4), k=U.rnd(-6,6), b=-2*a*h, c=a*h*h+k;
      const right='('+num(h)+', '+num(k)+')';
      const cand=[right,'('+num(-h)+', '+num(k)+')','('+num(h)+', '+num(c)+')','('+num(k)+', '+num(h)+')','('+num(-h)+', '+num(-k)+')','('+num(h)+', '+num(-k)+')'];
      const ops=[...new Set(cand)].slice(0,4); while(ops.length<4) ops.push('('+num(h+ops.length)+', '+num(k)+')');
      const sh=U.shuffle(ops);
      return {q:'¿Cuál es el vértice de <i>y</i> = '+U.poly([[a,'<i>x</i>²'],[b,'<i>x</i>'],[c,'']])+'?',options:sh,answer:sh.indexOf(right),
        explain:'<i>h</i> = '+M+'<i>b</i>/(2<i>a</i>) = '+negb(b)+'/(2·'+par(a)+') = '+num(h)+'. Luego <i>k</i> = <i>y</i>('+num(h)+') = '+num(k)+'. El vértice es <b class="k-blue">'+right+'</b>.'};
    });
  });

  /* ======================= CIRCUNFERENCIAS ======================= */
  const genEq=(h,k,r)=>U.poly([[1,'<i>x</i>²'],[1,'<i>y</i>²'],[-2*h,'<i>x</i>'],[-2*k,'<i>y</i>'],[h*h+k*k-r*r,'']])+' = 0';
  const ordEq=(h,k,r)=>U.shift('x',h)+'² + '+U.shift('y',k)+'² = '+num(r*r);

  SB.widget('cir-centro',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'h',label:'<i>h</i>',min:-5,max:5,step:1,value:-2,c:'blue'},
      {k:'k',label:'<i>k</i>',min:-5,max:5,step:1,value:3,c:'blue'},
      {k:'r',label:'radio <i>r</i>',min:1,max:6,step:1,value:5,c:'blue'}],v=>{
      const {h,k,r}=v, D=-2*h, E=-2*k, F=h*h+k*k-r*r;
      SB.plot(g,{alt:'Circunferencia de centro '+pt(h,k)+' y radio '+r,eq:true,x:[-11,11],y:[-11,11],gx:2,gy:2,
        circs:[{h,k,r,c:'blue'}],segs:[{a:[h,k],b:[h+r,k],c:'blue',dash:false,wd:1.6}],
        pts:[{x:h,y:k,c:'blue',r:5.5,t:'C'+pt(h,k),dy:-8},{x:h+r/2,y:k,r:0.01,c:'blue',t:'r = '+r,anchor:'middle',dx:0,dy:16}]});
      out.innerHTML='<div class="lbl">Ecuación ordinaria</div><div class="big">'+ordEq(h,k,r)+'</div>'+
        '<div class="lbl">Ecuación general (desarrollando los cuadrados)</div><div class="big">'+genEq(h,k,r)+'</div>'+
        '<div class="k-blue">De la general se vuelve al centro con <i>h</i> = '+M+'<i>D</i>/2 = '+num(h)+' y <i>k</i> = '+M+'<i>E</i>/2 = '+num(k)+
        ', y al radio con <i>r</i>² = <i>h</i>² + <i>k</i>² '+M+' <i>F</i> = '+num(h*h)+' + '+num(k*k)+' '+M+' '+(F<0?'('+num(F)+')':num(F))+' = '+num(r*r)+'.</div>'+
        '<div class="k-muted">Aquí <i>D</i> = '+num(D)+', <i>E</i> = '+num(E)+', <i>F</i> = '+num(F)+'.</div>';
    });
    body.append(g,out);
  });

  SB.widget('cir-punto',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    const H=1,K=-1,R=5; let P=null, ctl;
    const draw=v=>{
      const {px,py}=v, d2=(px-H)**2+(py-K)**2, d=Math.sqrt(d2);
      P=SB.plot(g,{alt:'Punto P y circunferencia',eq:true,x:[-8,10],y:[-9,8],gx:1,gy:1,
        circs:[{h:H,k:K,r:R,c:'blue'}],segs:[{a:[H,K],b:[px,py],c:'magenta',dash:false,wd:1.8}],
        pts:[{x:H,y:K,c:'blue',r:5,t:'C(1, −1)',dx:8,dy:16},{x:px,y:py,c:'magenta',r:7,t:'P'+pt(px,py)}],clipPts:true});
      const cmp=Math.abs(d2-R*R)<1e-9?'=':d2<R*R?'&lt;':'&gt;';
      out.innerHTML='<div class="big"><i>d</i>² = ('+num(px)+' '+M+' 1)² + ('+num(py)+' + 1)² = <b class="k-magenta">'+num(d2)+'</b> '+cmp+(cmp==='='?' <i>r</i>²':' 25 = <i>r</i>²')+'</div>'+
        '<div>Distancia de P al centro: <i>d</i> = '+num(d)+'</div>'+
        (cmp==='='?'<div class="msg ok">P está <b>sobre</b> la circunferencia: cumple la ecuación.</div>'
         :cmp==='&lt;'?'<div class="msg ok">P está <b>dentro</b>: más cerca del centro que el radio.</div>'
         :'<div class="msg warn">P está <b>fuera</b>: más lejos del centro que el radio.</div>')+
        '<div class="k-muted">Para saberlo basta reemplazar P en (<i>x</i> '+M+' 1)² + (<i>y</i> + 1)² y comparar con 25. Prueba con (4, 3) o (−3, 2).</div>';
    };
    ctl=U.controls(body,[
      {k:'px',label:'<i>x</i> de P',min:-7,max:9,step:0.5,value:4,c:'magenta'},
      {k:'py',label:'<i>y</i> de P',min:-8,max:7,step:0.5,value:1,c:'magenta'}],draw);
    U.drag(g,()=>P,(x,y)=>{x=Math.max(-7,Math.min(9,Math.round(x*2)/2));y=Math.max(-8,Math.min(7,Math.round(y*2)/2));ctl.set('px',x);ctl.set('py',y)});
    if(window.matchMedia('(pointer: fine)').matches) body.append(U.h('p','iw-lead','También puedes arrastrar el punto P sobre el gráfico.'));
    body.append(g,out);
  });

  SB.widget('cir-tangente',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    const H=3,K=4, P=[[5,0],[4,3],[3,4],[0,5],[-3,4],[-4,3],[-5,0],[-4,-3],[-3,-4],[0,-5],[3,-4],[4,-3]];
    U.controls(body,[{k:'i',label:'punto <i>T</i>',min:0,max:11,step:1,value:1,c:'magenta',fmt:i=>pt(H+P[i][0],K+P[i][1])}],v=>{
      const [dx,dy]=P[v.i], x0=H+dx, y0=K+dy;
      const fns=[], segs=[{a:[H,K],b:[x0,y0],c:'blue'}];
      let line;
      if(dy===0){ segs.push({a:[x0,-3],b:[x0,11],c:'orange',dash:false,wd:2.2}); line='<i>x</i> = '+num(x0) }
      else{ const m=-dx/dy; fns.push({f:x=>y0+m*(x-x0),c:'orange'}); line=dx===0?'<i>y</i> = '+num(y0):'<i>y</i> '+sgn(-y0)+' = '+U.frac(-dx,dy)+'(<i>x</i> '+sgn(-x0)+')' }
      SB.plot(g,{alt:'Recta tangente en '+pt(x0,y0),eq:true,x:[-4,10],y:[-3,11],gx:1,gy:1,circs:[{h:H,k:K,r:5,c:'ink'}],fns,segs,
        pts:[{x:H,y:K,c:'blue',r:5,t:'C(3, 4)',dx:8,dy:16},{x:x0,y:y0,c:'magenta',r:6.5,t:'T'+pt(x0,y0),dx:dx<0?-8:8,anchor:dx<0?'end':'start'}]});
      const mr=dx===0?'no existe (radio vertical)':U.frac(dy,dx);
      out.innerHTML='<div>Pendiente del radio <span class="k-blue">CT</span>: '+(dx===0?'el radio es vertical':'('+num(y0)+' '+M+' 4)/('+num(x0)+' '+M+' 3) = <b>'+mr+'</b>')+'</div>'+
        '<div>La tangente es <b>perpendicular</b> al radio: '+(dy===0?'el radio es horizontal, así que la tangente es vertical.':dx===0?'el radio es vertical, así que la tangente es horizontal.':'su pendiente es '+M+'1/('+mr+') = <b class="k-orange">'+U.frac(-dx,dy)+'</b>.')+'</div>'+
        '<div class="big k-orange">'+line+'</div>'+
        '<div class="k-muted">Los 12 puntos del control tienen coordenadas enteras porque 3² + 4² = 5².</div>';
    });
    body.append(g,out);
  });

  SB.widget('cir-quiz',body=>{
    U.quiz(body,()=>{
      const h=U.rnd(-5,5), k=U.rnd(-5,5), r=U.rnd(1,6);
      const right='C'+pt(h,k)+', <i>r</i> = '+r;
      const cand=[right,'C'+pt(-h,-k)+', <i>r</i> = '+r,'C'+pt(h,k)+', <i>r</i> = '+r*r,'C'+pt(-2*h,-2*k)+', <i>r</i> = '+r,'C'+pt(k,h)+', <i>r</i> = '+r,'C'+pt(-h,-k)+', <i>r</i> = '+r*r];
      const ops=[...new Set(cand)].slice(0,4); let e=1; while(ops.length<4){ const o='C'+pt(h+e,k)+', <i>r</i> = '+r; if(!ops.includes(o)) ops.push(o); e++ }
      const sh=U.shuffle(ops);
      return {q:'¿Cuál es el centro y el radio de '+genEq(h,k,r)+'?',options:sh,answer:sh.indexOf(right),
        explain:'Se completan cuadrados: <i>h</i> = '+M+'<i>D</i>/2 = '+num(h)+', <i>k</i> = '+M+'<i>E</i>/2 = '+num(k)+', y <i>r</i>² = <i>h</i>² + <i>k</i>² '+M+' <i>F</i> = '+(r*r)+', así que <i>r</i> = '+r+'. Queda '+ordEq(h,k,r)+'.'};
    });
  });

  /* ======================= OFERTA Y DEMANDA ======================= */
  const nice=span=>{const raw=span/8, p=Math.pow(10,Math.floor(Math.log10(raw))), m=raw/p; return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p};
  SB.widget('od-equilibrio',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[
      {k:'a',label:'oferta: pendiente',min:0.5,max:5,step:0.5,value:2,c:'blue'},
      {k:'b',label:'oferta: corte',min:0,max:40,step:5,value:20,c:'blue'},
      {k:'c',label:'demanda: pendiente',min:0.5,max:8,step:0.5,value:5,c:'orange'},
      {k:'d',label:'demanda: corte',min:30,max:100,step:5,value:60,c:'orange'}],v=>{
      const {a,b,c,d}=v;
      const eqs='<div><span class="k-blue">O: <i>p</i> = '+U.poly([[a,'<i>q</i>'],[b,'']])+'</span> &nbsp; <span class="k-orange">D: <i>p</i> = '+U.poly([[-c,'<i>q</i>'],[d,'']])+'</span></div>';
      if(d<=b){
        SB.plot(g,{alt:'Oferta y demanda sin equilibrio',x:[0,20],y:[0,110],gx:2,gy:10,lx:'q',ly:'p',fns:[{f:q=>a*q+b,c:'blue'},{f:q=>-c*q+d,c:'orange'}]});
        out.innerHTML=eqs+'<div class="msg warn">La demanda empieza a la altura de la oferta o por debajo: no se cruzan con una cantidad positiva, no hay equilibrio.</div>'; return;
      }
      const q=(d-b)/(a+c), p=(a*d+b*c)/(a+c), EC=q*(d-p)/2, EP=q*(p-b)/2;
      const A=Math.round(2*a), C=Math.round(2*c), Dd=Math.round(d-b);
      const qf=U.frac(Math.round(2*(d-b)),Math.round(2*(a+c))), pf=U.frac(Math.round(2*(a*d+b*c)),Math.round(2*(a+c)));
      const xm=Math.max(2,Math.min(d/c,q*1.7)), ym=Math.max(d,p)*1.12;
      SB.plot(g,{alt:'Equilibrio en '+pt(q,p),x:[0,xm],y:[0,ym],gx:nice(xm),gy:nice(ym),lx:'q',ly:'p',
        polys:[{pts:[[0,d],[0,p],[q,p]],c:'orange',op:.3},{pts:[[0,b],[0,p],[q,p]],c:'blue',op:.25}],
        segs:[{a:[q,0],b:[q,p]},{a:[0,p],b:[q,p]}],
        fns:[{f:x=>a*x+b,c:'blue',t:'O',tx:xm*0.97,dy:-8},{f:x=>-c*x+d,c:'orange',t:'D',tx:Math.min(xm*0.97,d/c),dy:-8}],
        pts:[{x:q,y:p,c:'purple',r:6,t:pt(q,p),dx:8,dy:-8},{x:q*0.18,y:(d+2*p)/3,r:0.01,c:'orange',t:'EC',anchor:'start',dx:0,dy:4},{x:q*0.18,y:(b+2*p)/3,r:0.01,c:'blue',t:'EP',anchor:'start',dx:0,dy:4}]});
      out.innerHTML=eqs+
        '<div>Igualando: '+U.poly([[a,'<i>q</i>'],[b,'']])+' = '+U.poly([[-c,'<i>q</i>'],[d,'']])+' → '+num(a+c)+'<i>q</i> = '+num(d-b)+'</div>'+
        '<div class="big k-purple">Equilibrio: <i>q</i><sub>e</sub> = '+qf+(qf.includes('/')?' ≈ '+num(q):'')+', &nbsp;<i>p</i><sub>e</sub> = '+pf+(pf.includes('/')?' ≈ '+num(p):'')+'</div>'+
        '<div class="k-orange">EC = <i>q</i><sub>e</sub> · (<i>d</i> '+M+' <i>p</i><sub>e</sub>) / 2 = '+qf+' · '+U.frac(C*Dd,A+C)+' / 2 = <b>'+U.frac(C*Dd*Dd,(A+C)*(A+C))+'</b>'+(Number.isInteger(C*Dd*Dd/((A+C)*(A+C)))?'':' ≈ '+num(EC))+'</div>'+
        '<div class="k-blue">EP = <i>q</i><sub>e</sub> · (<i>p</i><sub>e</sub> '+M+' <i>b</i>) / 2 = '+qf+' · '+U.frac(A*Dd,A+C)+' / 2 = <b>'+U.frac(A*Dd*Dd,(A+C)*(A+C))+'</b>'+(Number.isInteger(A*Dd*Dd/((A+C)*(A+C)))?'':' ≈ '+num(EP))+'</div>'+
        '<div class="k-muted">Sube el corte de la demanda (más gente quiere comprar) y mira cómo suben el precio y la cantidad de equilibrio.</div>';
    });
    body.append(g,out);
  });

  SB.widget('od-precio',body=>{
    const g=U.h('div','iw-plot'), out=U.h('div','iw-out');
    U.controls(body,[{k:'p',label:'precio <i>p</i>',min:12,max:66,step:1,value:40,c:'magenta',fmt:v=>num(v)+' soles'}],v=>{
      const p=v.p, qo=p-10, qd=(70-p)/2;
      SB.plot(g,{alt:'Precio fijado en '+p,x:[0,32],y:[0,74],gx:2,gy:10,lx:'q',ly:'p',tx:[20],ty:[30],
        fns:[{f:q=>q+10,c:'blue',t:'O: p = q + 10',tx:31,dy:16},{f:q=>-2*q+70,c:'orange',from:0,to:35,t:'D: p = −2q + 70',tx:25,dy:-10}],
        segs:[{a:[0,p],b:[32,p],c:'magenta',dash:false,wd:1.6},{a:[Math.min(qo,qd),p],b:[Math.max(qo,qd),p],c:p>30?'blue':'orange',dash:false,wd:6}],
        pts:[{x:20,y:30,c:'purple',r:4.5},{x:qo,y:p,c:'blue',r:6.5},{x:qd,y:p,c:'orange',r:6.5}],clipPts:true});
      const diff=Math.abs(qo-qd);
      out.innerHTML='<div>A <b class="k-magenta">'+p+' soles</b>, los productores <span class="k-blue">ofrecen <i>q</i> = '+num(p)+' '+M+' 10 = '+num(qo)+'</span> y los compradores <span class="k-orange">piden <i>q</i> = (70 '+M+' '+num(p)+')/2 = '+num(qd)+'</span>.</div>'+
        (p===30?'<div class="msg ok">Es el precio de equilibrio: lo que se ofrece es justo lo que se pide (20 unidades).</div>'
         :p>30?'<div class="msg warn">Exceso de <span class="k-blue">oferta</span>: sobran '+num(diff)+' unidades. Con el precio tan alto, el precio tiende a bajar.</div>'
         :'<div class="msg warn">Exceso de <span class="k-orange">demanda</span>: faltan '+num(diff)+' unidades (escasez). El precio tiende a subir.</div>')+
        '<div class="k-muted">El equilibrio está en (20, 30): ahí se cruzan las dos rectas.</div>';
    });
    body.append(g,out);
  });

  SB.widget('od-quiz',body=>{
    U.quiz(body,()=>{
      const q=U.rnd(2,12), a=U.pick([1,2,3,4]), c=U.pick([1,2,3,5]), b=U.rnd(1,8)*5, p=b+a*q, d=p+c*q;
      const right=pt(q,p);
      const cand=[right,pt(p,q),pt(q,b),pt(q,d),pt(q+1,p+a),pt(q,p+c)];
      const ops=[...new Set(cand)].slice(0,4), sh=U.shuffle(ops);
      return {q:'Oferta <span class="k-blue"><i>p</i> = '+U.poly([[a,'<i>q</i>'],[b,'']])+'</span> y demanda <span class="k-orange"><i>p</i> = '+U.poly([[-c,'<i>q</i>'],[d,'']])+'</span>. ¿Cuál es el punto de equilibrio (<i>q</i>, <i>p</i>)?',
        options:sh,answer:sh.indexOf(right),
        explain:'Se igualan los precios: '+U.poly([[a,'<i>q</i>'],[b,'']])+' = '+U.poly([[-c,'<i>q</i>'],[d,'']])+', así que '+(a+c)+'<i>q</i> = '+(d-b)+' y <i>q</i> = '+q+'. Reemplazando, <i>p</i> = '+p+'. El punto es <b class="k-purple">'+right+'</b> (primero la cantidad, luego el precio).'};
    });
  });
})();
