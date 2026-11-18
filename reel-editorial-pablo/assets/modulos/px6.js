// Pixel art en VISTA DESDE ARRIBA (casillas de 8 px, lienzo 136x240 ampliado x8). Mundo y gráficos propios, paleta B2.
// El escalón de un solo sentido devuelve al personaje al inicio; el letrero apunta al lado equivocado hasta que se corrige.
(function(){
const C={ink:'#0A0A0F',paper:'#F5F4EF',blue:'#1D2DFF',orange:'#FF7A1A',slate:'#9AA3B2',rock:'#23252e',rock2:'#343846',dark:'#14151b',mid:'#5d6472',path:'#E6D29C',pd:'#C7AF74',grass:'#7CC96F',gd:'#5FB158',tg:'#2F8F45',tg2:'#3FA650',cliff:'#A77B52',cl2:'#86603E',edge:'#F0E0B4',tree:'#2F7D3B',tl:'#5DBB6A',trunk:'#6B4A2B',wat:'#3B8FE8',wv:'#CFE8FF',wood:'#6B4A2B',led:'#8D6B45',ledd:'#5A4226'};
let g; const W=136,H=240,T=8;
const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), lerp=(a,b,p)=>a+(b-a)*p, prog=(t,a,b)=>clamp((t-a)/(b-a));
const hash=(a,b)=>{const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s)};

// --- cangrejito: 11x9, origen en las patas ---
const CR={ idle:['..ooooooo..','..ooooooo..','..oiooioo..','..oiooioo..','ooooooooooo','ooooooooooo','..ooooooo..'],
           jump:['o.ooooooo.o','o.ooooooo.o','oooiooioooo','..oiooioo..','..ooooooo..','..ooooooo..','..ooooooo..'] };
const CL=[['..o.o.o.o..','..o.o.o.o..'],['..o.o.o.o..','.o..o.o..o.'],['..o.o.o.o..','..o..o.o.o.'],['.o..o.o..o.','o...o.o...o']];
function sprite(x,y,mode,ph){
  const rows=(mode=='jump'?CR.jump:CR.idle).slice(), lg=mode=='jump'?CL[3]:mode=='walk'?CL[1+(Math.floor(ph)%2)]:CL[0];
  rows.push(lg[0],lg[1]); const bob=mode=='walk'&&Math.floor(ph)%2?1:0, x0=Math.round(x)-5, y0=Math.round(y)-9;
  rows.forEach((row,j)=>{ const yy=y0+j-(j<7?bob:0); for(let i=0;i<11;i++){ const ch=row[i]; if(ch!='.') r(x0+i,yy,1,1,ch=='i'?C.ink:C.orange); } });
}
// --- recorrido [t, x, y(pies), modo] en tiempos del corte v1 ---
const SX=28, SY=144, UP=112, STX=96, JX=36, DX=108;
const PATH=[[8.06,SX,SY,'idle'],[8.45,SX,SY,'walk'],[9.2,STX,SY,'walk'],[9.7,STX,UP,'walk'],[10.6,JX,UP,'walk'],[10.78,JX,UP+2,'jump'],[11.42,SX,SY,'sit'],
  [14.3,SX,SY,'walk'],[14.85,STX,SY,'walk'],[15.25,STX,UP,'walk'],[16.05,JX,UP,'walk'],[16.2,JX,UP+2,'jump'],[16.75,SX,SY,'sit'],
  [17.0,SX,SY,'walk'],[17.3,STX,SY,'walk'],[17.55,STX,UP,'walk'],[17.95,JX,UP,'walk'],[18.05,JX,UP+2,'jump'],[18.5,SX,SY,'sit'],[20.6,SX,SY,'sit'],
  [36.2,SX,SY,'idle'],[36.75,SX,SY,'walk'],[37.3,STX,SY,'walk'],[37.7,STX,UP,'walk'],[37.95,DX,UP,'walk'],[38.35,DX,90,'hide'],[38.85,28,50,'walk'],[39.6,78,52,'hop'],[41,78,52,'hop']];
const LAND=[11.42,16.75,18.5];
let Pm,Lm,Tm;
function init(R){ Pm=PATH.map(k=>[R(k[0]),k[1],k[2],k[3]]); Lm=LAND.map(R);
  Tm={zoom:[R(18.7),R(19.1)],flip:[R(36.35),R(36.6)],flag:[R(39.5),R(39.85)],s2:R(36.2)}; }
function who(t){ let i=0; while(i<Pm.length-2&&t>=Pm[i+1][0])i++; const a=Pm[i],b=Pm[i+1],p=prog(t,a[0],b[0]),m=a[3];
  let x=lerp(a[1],b[1],p), y=lerp(a[2],b[2],p), lift=0;
  if(m=='jump'){ lift=Math.sin(Math.PI*p)*12; }
  if(m=='sit'||m=='idle'){ x=a[1]; y=a[2]; }
  if(m=='hop'){ x=a[1]; y=a[2]; lift=Math.abs(Math.sin((t-a[0])*9))*5; }
  return {x,y,lift,m,ph:(t-a[0])*10,t0:a[0]}; }

// --- casillas ---
function door(c,row,t){ const x=c*T, y=row*T; r(x-1,y-2,10,10,C.ledd); r(x,y-1,8,9,'#1B1410'); const gl=Math.sin(t*5)>0?'#3a2a1c':'#2c2016'; r(x+2,y+3,4,5,gl); }
function tuft(x,y,t,k){ const s=Math.sin(t*3+k)>0?1:0; r(x,y+1,T,7,C.tg2); r(x+1+s,y+1,1,5,C.tg); r(x+4,y+2,1,5,C.tg); r(x+6-s,y,1,6,C.tg); }
function world(t,second){
  r(0,0,W,H,C.grass);
  for(let row=0;row<30;row++)for(let c=0;c<17;c++){ const x=c*T,y=row*T,h=hash(c,row);
    if(row<=4){ r(x,y,T,T,C.cliff); if(h>.5) r(x+2+(row%2)*3,y+3,2,1,C.cl2); if(row==4) r(x,y+7,T,1,C.ledd); }                      // pared alta
    else if(row<=6){ r(x,y,T,T,C.path); if(h>.7) r(x+3,y+4,1,1,C.pd); }                               // meseta
    else if(row<=10){ r(x,y,T,T,C.cliff); r(x+1+(c%2)*3,y+(row==7?2:0),1,T,C.cl2); if(row==7){ r(x,y,T,2,C.edge); } if(row==10) r(x,y+7,T,1,C.ledd); } // cara del risco
    else if(row==14){ if(c<=10){ r(x,y,T,5,C.led); r(x,y,T,1,C.edge); r(x,y+5,T,1,C.ledd); r(x+3,y+2,2,2,C.ledd); r(x,y+6,T,2,C.gd); }  // escalón de un solo sentido
                      else if(c<=12){ r(x,y,T,T,C.path); for(let k=1;k<T;k+=3) r(x,y+k,T,1,C.led); }                // escalera
                      else { r(x,y,T,T,C.cliff); r(x+1+(c%2)*3,y,1,T,C.cl2); } }
    else if(row>=20&&row<=21){ r(x,y,T,T,C.grass); r(x+1,y,6,6,C.tree); r(x+2,y-1,4,1,C.tree); r(x+2,y+1,2,2,C.tl); r(x+3,y+6,2,2,C.trunk); }   // árboles
    else if(row>=23&&row<=27&&c>=8){ r(x,y,T,T,C.wat); const s=Math.floor(t*2+c+row)%4; r(x+s,y+3,3,1,C.wv); if(h>.6) r(x+5-s,y+6,2,1,C.wv); } // agua
    else { if(h>.7) r(x+3,y+4,1,1,C.gd); if(h<.12) r(x+5,y+2,2,1,C.gd); }
  }
  // caminos
  const P=(c0,r0,c1,r1)=>{ for(let c=c0;c<=c1;c++)for(let q=r0;q<=r1;q++){ r(c*T,q*T,T,T,C.path); if(hash(c+9,q)>.6) r(c*T+2,q*T+5,1,1,C.pd); if(hash(c,q+5)>.7) r(c*T+5,q*T+2,1,1,C.pd); } };
  P(2,17,12,17); P(11,15,12,17); P(11,13,12,13); P(3,13,13,13); P(13,11,13,13);
  // hierba alta
  [[6,18],[7,18],[8,18],[7,19],[8,19],[0,11],[1,11],[1,12],[14,16],[15,16],[15,17],[5,15],[6,15]].forEach(([c,q],k)=>tuft(c*T,q*T,t,k));
  door(13,10,t); door(3,4,t);
  // letrero: flecha equivocada (izquierda) y luego corregida (derecha)
  const fl=second?prog(t,Tm.flip[0],Tm.flip[1]):0, right=fl>=.5, blink=!second&&t>=Tm.zoom[0]&&Math.sin(t*14)>0;
  const bc=(fl>0&&fl<1)||blink?C.orange:C.paper, sx=70, sy=104;
  r(sx+7,sy,1,5,C.wood); r(sx-1,sy-9,17,10,C.wood); r(sx,sy-8,15,8,bc);
  const d=right?1:-1, tip=right?sx+12:sx+2; r(sx+3,sy-4,9,1,C.ink); r(tip-d,sy-5,1,3,C.ink); r(tip-2*d,sy-6,1,5,C.ink); r(tip,sy-4,1,1,C.ink);
  // meta: asta y bandera en la meseta
  r(60,28,1,24,C.wood); r(58,52,5,1,C.wood); const fp=second?prog(t,Tm.flag[0],Tm.flag[1]):0;
  if(fp>0){ const fy=lerp(44,28,fp), wv=Math.sin(t*8)>0?1:0; r(61,fy,8,6,C.orange); r(69,fy+wv,2,5,C.orange); }
}
function draw(t){
  const cv=document.getElementById('pxc'); g=cv.getContext('2d'); const second=t>=Tm.s2-.5;
  world(t,second); const w=who(t);
  Lm.forEach(tl=>{ const d=t-tl; if(d>=0&&d<.35){ const k=d/.35; for(let i=-2;i<=2;i++) if(i) r(SX+i*(2+k*6),SY-1-k*3*(Math.abs(i)==1?1.4:.7),1,1,C.paper); } });
  if(w.m!='hide'){
    g.globalAlpha=.3; r(w.x-4,w.y-1,8,2,C.ink); g.globalAlpha=1;                               // sombra al saltar
    sprite(w.x,w.y-w.lift,w.m=='jump'?'jump':w.m=='walk'?'walk':'idle',w.ph);
    if(w.m=='sit'&&!second){ const d=t-w.t0; if(d>.25){ const by=w.y-15-(Math.sin(t*4)>0?1:0);
      [[1,0],[2,0],[3,0],[4,1],[3,2],[2,3],[2,5]].forEach(([i,j])=>r(w.x-2+i,by-4+j,1,1,C.paper)); } } }
  // cámara: sigue al personaje, se sacude al aterrizar y se acerca al letrero
  let sy=0; Lm.forEach(tl=>{ const d=t-tl; if(d>=0&&d<.22){ sy=Math.sin(d*90)*12*(1-d/.22); } });
  let cx=0, cy=0, n=0; for(let k=-3;k<=3;k++){ const q=who(t+k*.09); cx+=q.x; cy+=q.y-6; n++; } cx/=n; cy/=n;
  const z=second?0:prog(t,Tm.zoom[0],Tm.zoom[1]), e=z<.5?4*z*z*z:1-Math.pow(-2*z+2,3)/2;
  cx=lerp(cx,77,e); cy=lerp(cy,100,e);
  const sc=lerp(1.75,2.7,e)+(t-(second?Tm.s2:Pm[0][0]))*0.006, K=1080/W;
  const tx=clamp(540-cx*K*sc,1080-1080*sc,0), ty=clamp(1040-cy*K*sc,1920-1920*sc,0)+sy;
  cv.style.transformOrigin='0 0'; cv.style.transform=`translate(${tx}px,${ty}px) scale(${sc})`;
  return {flagX:tx+74*K*sc, flagY:ty+27*K*sc, n:second?3:Lm.filter(x=>t>=x).length};
}
window.PX={init,draw};
})();
