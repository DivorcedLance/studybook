/* Gráficos de la Unidad 5 (Mate nive). Usa SB.plot del motor (js/study.js). */
(function(){
  const plot=SB.plot;
  const S3=Math.sqrt(3), S10=Math.sqrt(10), PI=Math.PI;
  plot('g-mp8',{alt:'Producción por tramos',x:[0,38],y:[0,560],gx:4,gy:100,lx:'día',ly:'P',tx:[4,8,16,24,36],ty:[250,375,500],
    fns:[{f:d=>62.5*d,from:0,to:8,c:'blue',t:'DP',tx:6,anchor:'end',dx:-8,dy:-4},{f:d=>4000/d,from:8,to:16,c:'orange',t:'IP',tx:12,dx:4,dy:-10,anchor:'start'},
      {f:d=>250/16*d,from:16,to:24,c:'blue',t:'DP',tx:20,anchor:'end',dx:-8,dy:-6},{f:d=>9000/d,from:24,to:36,c:'orange',t:'IP',tx:30,anchor:'start',dx:4,dy:-10}],
    pts:[{x:4,y:250,c:'magenta',t:'día 4',anchor:'end',dx:-8,dy:-6},{x:8,y:500,c:'ink',t:'(8, 500)',dx:8,dy:-4},{x:16,y:250,c:'ink',t:'(16, 250)',dx:6,dy:18},{x:24,y:375,c:'ink',t:'(24, 375)',dx:6,dy:-8},{x:36,y:250,c:'magenta',t:'día 36',anchor:'end',dx:-8,dy:-8}]});
  plot('g-ex-mp8',{alt:'Producción en dos tramos',x:[0,22],y:[0,340],gx:2,gy:50,lx:'día',ly:'P',tx:[3,6,20],ty:[90,150,300],
    fns:[{f:d=>50*d,from:0,to:6,c:'blue',t:'DP',tx:4.5,anchor:'end',dx:-8,dy:-4},{f:d=>1800/d,from:6,to:21,c:'orange',t:'IP',tx:13,anchor:'start',dx:4,dy:-10}],
    pts:[{x:3,y:150,c:'magenta',t:'día 3',anchor:'end',dx:-8,dy:-4},{x:6,y:300,c:'ink',t:'(6, 300)',dx:8,dy:-4},{x:20,y:90,c:'magenta',t:'día 20',anchor:'end',dx:-6,dy:-10}]});
  plot('g-ex-mp8b',{alt:'Producción en tres tramos',x:[0,32],y:[0,450],gx:5,gy:50,lx:'día',ly:'P',tx:[5,10,20,30],ty:[200,300,400],
    fns:[{f:d=>40*d,from:0,to:10,c:'blue',t:'DP',tx:8,anchor:'end',dx:-8,dy:-4},{f:d=>4000/d,from:10,to:20,c:'orange',t:'IP',tx:15,anchor:'start',dx:4,dy:-8},{f:d=>10*d,from:20,to:31,c:'blue',t:'DP',tx:26,anchor:'end',dx:-6,dy:-8}],
    pts:[{x:5,y:200,c:'magenta',t:'día 5',anchor:'end',dx:-8,dy:-4},{x:10,y:400,c:'ink',t:'(10, 400)',dx:8,dy:-4},{x:20,y:200,c:'magenta',t:'día 20',dx:6,dy:18},{x:30,y:300,c:'magenta',t:'día 30',anchor:'end',dx:-8,dy:-6}]});
})();
/* progresiones: PA y PG como puntos (n, aₙ) */
(function(){
  const plot=SB.plot;
  plot('g-tpr1',{alt:'Puntos de la PA 2, 5, 8, 11, 14, 17 sobre una recta y de la PG 1, 2, 4, 8, 16, 32 sobre una curva',x:[0,6.6],y:[0,34],gx:1,gy:4,lx:'n',ly:'aₙ',tx:[1,2,3,4,5,6],ty:[4,8,16,32],
    fns:[{f:n=>3*n-1,from:0.6,to:6.4,c:'blue',wd:1.3,dash:'5 5'},{f:n=>Math.pow(2,n-1),from:0.6,to:6.05,c:'orange',wd:1.3,dash:'5 5'}],
    pts:[{x:6.5,y:10,c:'blue',r:0.01,t:'PA: aₙ = 3n − 1',anchor:'end',dx:0,dy:4},{x:4.7,y:27,c:'orange',r:0.01,t:'PG: aₙ = 2ⁿ⁻¹',anchor:'end',dx:0,dy:4}].concat([1,2,3,4,5,6].map(n=>({x:n,y:3*n-1,c:'blue',r:4.5}))).concat([1,2,3,4,5,6].map(n=>({x:n,y:Math.pow(2,n-1),c:'orange',r:4.5})))});
})();
