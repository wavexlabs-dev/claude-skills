// Altavoz de Anthropic en isométrico (motor Hairline): se arma con las palabras Piezas · Placa · Carcasa · Código.
// Tiempos en la línea del primer corte (los mismos que usa index.html). Línea Ink sobre naranja; un solo acento en Paper.
(function(){
const {Cam, fit, proj, facing, circ, rrect, ringAt, run, hull, poly, open, clamp, lerp} = HL;
const INK='#0A0A0F', ORA='#FF7A1A', PAP='#F5F4EF';
const prog=(t,a,b)=>clamp((t-a)/(b-a),0,1), eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2, eo=p=>1-Math.pow(1-p,3);
const T={piezas:66.62, placa:67.4, carcasa:68.1, codigo:69.6, funciono:72.1};
const R_OUT=78, R_IN=72, R_PCB=68, H_BASE=18, H_CAP=6;
const C=Cam(45,0.5,2.85);
const ext=[]; [-50,140].forEach(z=>circ(R_OUT,24).forEach(q=>ext.push([q.u,q.v,z])));
fit(C,ext,200,310);
const P=proj(C), front=facing(C);
const ring=(R,x=0,y=0,n=64)=>circ(R,n).map(q=>({...q,u:q.u+x,v:q.v+y}));
const box=(x,y,w,h)=>rrect(x-w/2,y-h/2,x+w/2,y+h/2,2,3);
let svg, g;
function mk(tag,a,par){ const e=document.createElementNS('http://www.w3.org/2000/svg',tag); for(const k in a) e.setAttribute(k,a[k]); (par||g).appendChild(e); return e; }
const W1={stroke:INK,'stroke-width':5,fill:ORA,'stroke-linejoin':'round','stroke-linecap':'round','vector-effect':'non-scaling-stroke'};
const W2={stroke:INK,'stroke-width':2.5,fill:'none','stroke-opacity':.6,'stroke-linejoin':'round','stroke-linecap':'round','vector-effect':'non-scaling-stroke'};
const WA={stroke:PAP,'stroke-width':6,fill:'none','stroke-linecap':'round','vector-effect':'non-scaling-stroke'};
function solido(rg,z0,z1,op,par){ if(op<=0) return; const s=mk('g',{opacity:op},par);
  mk('path',{...W1,d:poly(hull(ringAt(P,rg,z1).concat(ringAt(P,rg,z0))))},s); mk('path',{...W1,fill:'none',d:poly(ringAt(P,rg,z1))},s); return s; }
function init(el){ svg=el; }
function draw(t){
  if(!svg) return; svg.replaceChildren(); const raiz=mk('g',{},svg); g=raiz;
  const flo=Math.sin(t*2.1)*2.5;
  // posiciones: explotado -> armado
  const aP=eo(prog(t,T.piezas,T.piezas+.35)), aPl=eo(prog(t,T.placa,T.placa+.3)), drop=eio(prog(t,T.placa+.15,T.placa+.6));
  const cs=eio(prog(t,T.carcasa,T.carcasa+.8)), cap=eio(prog(t,T.carcasa+.35,T.carcasa+1.25));
  const zb=lerp(-50,0,cs), aB=prog(t,T.carcasa,T.carcasa+.25);
  const zp=lerp(40+flo*(1-cs),10,cs);                      // placa
  const zc0=lerp(lerp(118,64+3,drop)+flo,0,0);             // piezas: flotan, luego se asientan en la placa
  const zk=drop>=1?zp+3:lerp(82+flo,zp+3,drop);
  const zcap=lerp(zp+58,H_BASE,cap), aCap=prog(t,T.carcasa+.3,T.carcasa+.55);
  // 1 · base (abajo)
  if(aB>0){ const s=solido(ring(R_OUT),zb,zb+H_BASE,aB); mk('path',{...W2,'stroke-opacity':.6*aB,d:poly(ringAt(P,ring(R_IN),zb+H_BASE))}); }
  // 2 · placa y piezas; dentro de la base solo se ven por la boca
  let par=g;
  if(aB>0&&zp<zb+H_BASE+2){ const id='bocaAlt'; const cp=mk('clipPath',{id},raiz);
    mk('path',{d:poly(hull(ringAt(P,ring(R_IN),zb+H_BASE).concat(ringAt(P,ring(R_IN),zb+400))))},cp); par=mk('g',{'clip-path':`url(#${id})`},raiz); }
  if(aPl>0){ const s=solido(ring(R_PCB),zp,zp+3,aPl,par);
    const pistas=[[[-40,-10],[-10,-10],[0,-24],[30,-24]],[[-30,30],[0,30],[14,16],[40,16]],[[10,-50],[10,-30],[30,-10]]];
    pistas.forEach(p=>mk('path',{...W2,'stroke-opacity':.5*aPl,d:open(p.map(([u,v])=>P(u,v,zp+3)))},par)); }
  if(aP>0){ const k=aP;
    solido(ring(26,0,0,48),zk,zk+9,k,par); mk('path',{...W2,'stroke-opacity':.6*k,d:poly(ringAt(P,ring(14,0,0,40),zk+9))},par);   // bocina
    solido(box(38,24,18,18),zk,zk+5,k,par);                                                                                       // chip
    solido(ring(5,-44,16,20),zk,zk+4,k,par); solido(ring(5,18,-46,20),zk,zk+4,k,par); }                                           // micrófonos
  // 3 · tapa (arriba), con rejilla y anillo de luz
  if(aCap>0){ solido(ring(R_OUT),zcap,zcap+H_CAP,aCap);
    [18,32,46].forEach(r=>mk('path',{...W2,'stroke-opacity':.6*aCap,d:poly(ringAt(P,ring(r),zcap+H_CAP))}));
    const led=prog(t,T.codigo,T.codigo+.3);
    if(led>0) mk('path',{...WA,opacity:led*(.75+.25*Math.sin(t*6)),d:poly(ringAt(P,ring(62),zcap+H_CAP))}); }
  // 4 · y funcionó: ondas de sonido saliendo de la tapa
  const f=t-T.codigo-.5, fuerza=lerp(.35,1,prog(t,T.funciono,T.funciono+.2));
  if(f>0) for(let i=0;i<3;i++){ const ph=(f*1.2+i/3)%1, r=84+ph*28;
    for(const c of [-45,135]){ const arc=[]; for(let a=c-28;a<=c+28;a+=4){ const rd=a*Math.PI/180; arc.push(P(r*Math.cos(rd),r*Math.sin(rd),H_BASE+H_CAP)); }
      mk('path',{...WA,'stroke-width':7,opacity:(1-ph*.8)*prog(f,0,.3)*fuerza,d:open(arc)}); } }
  // la figura se mantiene pegada arriba (al titular) mientras se arma: se mide su borde superior visible
  const top=(R,z)=>Math.min(...ringAt(P,ring(R,0,0,24),z).map(p=>p[1]));
  let y=1e9; if(aP>0) y=Math.min(y,top(26,zk+9)); if(aPl>0) y=Math.min(y,top(R_PCB,zp+3)); if(aB>0) y=Math.min(y,top(R_OUT,zb+H_BASE));
  if(aCap>0) y=lerp(y,Math.min(y,top(R_OUT,zcap+H_CAP)),Math.min(1,aCap*3));
  // bloque centrado: la figura se queda pegada arriba y devuelve su borde inferior para colocar la palabra debajo
  const bot=(R,z)=>Math.max(...ringAt(P,ring(R,0,0,24),z).map(p=>p[1]));
  let b=-1e9; if(aP>0) b=Math.max(b,bot(52,zk)); if(aPl>0) b=Math.max(b,bot(R_PCB,zp)); if(aB>0) b=Math.max(b,bot(R_OUT,zb)); if(aCap>0) b=Math.max(b,bot(R_OUT,zcap));
  const bob=prog(t,T.carcasa+1.2,T.carcasa+1.6)*Math.sin((t-T.carcasa)*2.6)*4;   // ya armado, flota un poco
  if(y<1e8) raiz.setAttribute('transform',`translate(0 ${(12-y+bob).toFixed(2)})`);
  return y<1e8&&b>-1e8 ? b+(12-y) : null;
}
window.ALT={init,draw,T};
})();
