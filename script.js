const burger = document.getElementById('burgerBtn');
const sideNav = document.getElementById('sideNav');
burger.addEventListener('click', () => sideNav.classList.toggle('show'));

const TOPBAR_OFFSET = 78;
document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click', (e)=>{
    const id = item.dataset.target;
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      sideNav.classList.remove('show');
      const doScroll = ()=>{
        const top = target.getBoundingClientRect().top + window.pageYOffset - TOPBAR_OFFSET;
        window.scrollTo({top, behavior:'smooth'});
      };
      requestAnimationFrame(()=> requestAnimationFrame(doScroll));
    }
  });
});

const navItems = document.querySelectorAll('.nav-item');
const sections = [...navItems].map(i => document.getElementById(i.dataset.target)).filter(Boolean);
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navItems.forEach(n=>n.classList.remove('active'));
      const match = document.querySelector(`.nav-item[data-target="${e.target.id}"]`);
      if(match) match.classList.add('active');
    }
  });
}, {rootMargin:'-20% 0px -70% 0px', threshold:0});
sections.forEach(s=>obs.observe(s));

const osiData = [
  {n:7, name:"Amaliy (Application)", ex:"HTTP · FTP · DNS", desc:"Foydalanuvchi ilovalari tarmoq xizmatlariga to'g'ridan-to'g'ri murojaat qiladigan qatlam — brauzer, elektron pochta, fayl uzatish shu yerda ishlaydi."},
  {n:6, name:"Taqdimot (Presentation)", ex:"SSL/TLS · JPEG", desc:"Ma'lumotni shifrlash, siqish va formatlarni moslashtirish orqali ikki tizim bir-birining ma'lumotini to'g'ri tushunishini ta'minlaydi."},
  {n:5, name:"Seans (Session)", ex:"NetBIOS · RPC", desc:"Ikki qurilma o'rtasida aloqa seansini ochish, boshqarish va yakunlashni nazorat qiladi."},
  {n:4, name:"Transport (Transport)", ex:"TCP · UDP", desc:"Ma'lumotni segmentlarga bo'lib, ishonchli (TCP) yoki tezkor (UDP) yetkazishni, xatolarni tekshirish va tartibni ta'minlaydi."},
  {n:3, name:"Tarmoq (Network)", ex:"IP · ICMP", desc:"Paketlarni manba va manzil IP manzillari asosida turli tarmoqlar orqali marshrutlashni belgilaydi."},
  {n:2, name:"Kanal (Data Link)", ex:"MAC · Ethernet", desc:"Bitlarni kadrlarga jamlaydi, MAC manzillar asosida bir segment ichida ma'lumot yetkazishni va xatolarni aniqlashni ta'minlaydi."},
  {n:1, name:"Fizik (Physical)", ex:"Kabel · Signal", desc:"Bitlarni elektr, yorug'lik yoki radiosignal ko'rinishida jismoniy muhit orqali uzatadi — kabellar, konnektorlar, signal darajalari."},
];
const osiList = document.getElementById('osiList');
osiData.forEach((l,idx)=>{
  const row = document.createElement('div');
  row.className = 'osi-row';
  row.innerHTML = `<div class="lnum">${l.n}</div><div class="lname">${l.name}</div><div class="lex mono">${l.ex}</div>`;
  const detail = document.createElement('div');
  detail.className = 'osi-detail';
  detail.textContent = l.desc;
  row.addEventListener('click', ()=>{
    const isOpen = detail.classList.contains('open');
    document.querySelectorAll('.osi-detail').forEach(d=>d.classList.remove('open'));
    document.querySelectorAll('.osi-row').forEach(r=>r.classList.remove('open'));
    if(!isOpen){ detail.classList.add('open'); row.classList.add('open'); }
  });
  osiList.appendChild(row);
  osiList.appendChild(detail);
});
osiList.querySelector('.osi-row').click();

const topoSvg = document.getElementById('topoSvg');
const topoCaption = document.getElementById('topoCaption');
const W=400, H=260, CX=200, CY=130;
const nodeR = 9;
function nodeEl(x,y,color){ return `<circle cx="${x}" cy="${y}" r="${nodeR}" fill="${color}" stroke="#0A0F1A" stroke-width="2"/>`; }
function lineEl(x1,y1,x2,y2,color="#2A3652"){ return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.6"/>`; }

const colors = ["#49D6C4","#F2A65A","#7C8CFF","#8CF0DE","#F2685A","#49D6C4"];

const topologies = {
  star: {
    caption:"Yulduz topologiyasi: barcha tugunlar markaziy switch/hub orqali bog'lanadi. Bitta ulanish uzilishi qolgan tarmoqqa ta'sir qilmaydi.",
    build(){
      let s='';
      const pts=[];
      const n=6;
      for(let i=0;i<n;i++){
        const a = (Math.PI*2*i)/n - Math.PI/2;
        const x = CX + 95*Math.cos(a), y = CY + 90*Math.sin(a);
        pts.push([x,y]);
      }
      pts.forEach((p,i)=> s+=lineEl(CX,CY,p[0],p[1]));
      s+= `<rect x="${CX-14}" y="${CY-14}" width="28" height="28" rx="6" fill="#141D30" stroke="#49D6C4" stroke-width="2"/>`;
      pts.forEach((p,i)=> s+=nodeEl(p[0],p[1],colors[i%colors.length]));
      pts.forEach((p,i)=>{
        s += `<circle r="3.4" fill="${colors[i%colors.length]}"><animateMotion dur="${2.4+i*0.3}s" begin="${i*0.4}s" repeatCount="indefinite" path="M${CX},${CY} L${p[0]},${p[1]} L${CX},${CY}"/></circle>`;
      });
      return s;
    }
  },
  bus: {
    caption:"Shina topologiyasi: barcha tugunlar bitta umumiy magistral kabelga ulanadi.",
    build(){
      let s = lineEl(40,CY,360,CY,"#3A4763");
      const n=6;
      for(let i=0;i<n;i++){
        const x = 40 + (320/(n-1))*i;
        s += lineEl(x,CY,x,CY-40);
        s += nodeEl(x,CY-40,colors[i%colors.length]);
      }
      s += `<circle r="3.6" fill="#F2A65A"><animateMotion dur="3.2s" repeatCount="indefinite" path="M40,${CY} L360,${CY} L40,${CY}"/></circle>`;
      return s;
    }
  },
  ring: {
    caption:"Xalqa topologiyasi: tugunlar halqa shaklida ketma-ket ulanadi, ma'lumot bir yo'nalishda uzatiladi.",
    build(){
      let s='';
      const pts=[];
      const n=7;
      for(let i=0;i<n;i++){
        const a = (Math.PI*2*i)/n - Math.PI/2;
        const x = CX + 100*Math.cos(a), y = CY + 95*Math.sin(a);
        pts.push([x,y]);
      }
      for(let i=0;i<n;i++){
        const p1=pts[i], p2=pts[(i+1)%n];
        s+=lineEl(p1[0],p1[1],p2[0],p2[1]);
      }
      pts.forEach((p,i)=> s+=nodeEl(p[0],p[1],colors[i%colors.length]));
      let ringPath = 'M'+pts.map(p=>p[0]+','+p[1]).join(' L')+' Z';
      s += `<circle r="4" fill="#8CF0DE"><animateMotion dur="5s" repeatCount="indefinite" path="${ringPath}"/></circle>`;
      return s;
    }
  },
  tree: {
    caption:"Daraxt topologiyasi: yulduz segmentlarining ierarxik birlashuvi — yirik tarmoqlarni boshqarishga qulay.",
    build(){
      let s='';
      const root=[CX,50];
      const mid=[[CX-90,120],[CX+90,120]];
      s+=lineEl(root[0],root[1],mid[0][0],mid[0][1]);
      s+=lineEl(root[0],root[1],mid[1][0],mid[1][1]);
      const leaves=[];
      mid.forEach((m,mi)=>{
        for(let k=-1;k<=1;k++){
          const x = m[0]+k*45, y=200;
          s+=lineEl(m[0],m[1],x,y);
          leaves.push([x,y,mi]);
        }
      });
      s+=nodeEl(root[0],root[1],"#F2A65A");
      mid.forEach(m=> s+=nodeEl(m[0],m[1],"#7C8CFF"));
      leaves.forEach((l,i)=> s+=nodeEl(l[0],l[1],colors[i%colors.length]));
      s += `<circle r="3.6" fill="#49D6C4"><animateMotion dur="3s" repeatCount="indefinite" path="M${root[0]},${root[1]} L${mid[0][0]},${mid[0][1]} L${leaves[1][0]},${leaves[1][1]} L${mid[0][0]},${mid[0][1]} L${root[0]},${root[1]}"/></circle>`;
      return s;
    }
  },
  mesh: {
    caption:"To'liq bog'langan (Mesh) topologiya: har bir tugun barcha boshqa tugunlar bilan bevosita bog'lanadi — yuqori ishonchlilik, ko'p kabel talab qiladi.",
    build(){
      let s='';
      const pts=[];
      const n=5;
      for(let i=0;i<n;i++){
        const a = (Math.PI*2*i)/n - Math.PI/2;
        const x = CX + 95*Math.cos(a), y = CY + 90*Math.sin(a);
        pts.push([x,y]);
      }
      for(let i=0;i<n;i++){
        for(let j=i+1;j<n;j++){
          s+=lineEl(pts[i][0],pts[i][1],pts[j][0],pts[j][1]);
        }
      }
      pts.forEach((p,i)=> s+=nodeEl(p[0],p[1],colors[i%colors.length]));
      s += `<circle r="3.6" fill="#F2685A"><animateMotion dur="4s" repeatCount="indefinite" path="M${pts[0][0]},${pts[0][1]} L${pts[2][0]},${pts[2][1]} L${pts[4][0]},${pts[4][1]} L${pts[1][0]},${pts[1][1]} L${pts[3][0]},${pts[3][1]} L${pts[0][0]},${pts[0][1]}"/></circle>`;
      return s;
    }
  }
};

function renderTopo(key){
  const t = topologies[key];
  topoSvg.innerHTML = t.build();
  topoCaption.textContent = t.caption;
  document.querySelectorAll('.topo-btn').forEach(b=> b.classList.toggle('on', b.dataset.topo===key));
}
document.querySelectorAll('.topo-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> renderTopo(btn.dataset.topo));
});
renderTopo('star');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal, .reveal-stagger');
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
revealItems.forEach(el=> revealObs.observe(el));

(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let w,h,dots=[];
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  function init(){
    resize();
    const count = Math.min(70, Math.floor((w*h)/45000));
    dots = Array.from({length:count}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx:(Math.random()-.5)*0.18, vy:(Math.random()-.5)*0.18,
      r: Math.random()*1.6+0.6
    }));
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<dots.length;i++){
      const d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if(d.x<0||d.x>w) d.vx*=-1;
      if(d.y<0||d.y>h) d.vy*=-1;
      for(let j=i+1;j<dots.length;j++){
        const d2 = dots[j];
        const dx=d.x-d2.x, dy=d.y-d2.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<130){
          ctx.strokeStyle = `rgba(73,214,196,${0.10*(1-dist/130)})`;
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d2.x,d2.y); ctx.stroke();
        }
      }
    }
    for(const d of dots){
      ctx.beginPath();
      ctx.fillStyle='rgba(73,214,196,0.55)';
      ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(step);
  }
  window.addEventListener('resize', ()=>{ resize(); });
  init();
  if(!reduceMotion){ requestAnimationFrame(step); } else { step(); }
})();

function animatedPacket(pathD, color, dur, delay, r=4){
  return `<circle r="${r}" fill="${color}"><animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="${pathD}"/></circle>`;
}

(function(){
  const svg = document.getElementById('netFabric');
  if(!svg) return;
  const W=800,H=220;
  const n=14;
  const pts = Array.from({length:n}, ()=>({x:40+Math.random()*(W-80), y:30+Math.random()*(H-60)}));
  let s='';
  for(let i=0;i<n;i++){
    for(let j=i+1;j<n;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      if(Math.sqrt(dx*dx+dy*dy) < 190){
        s += `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}" stroke="#26314A" stroke-width="1"/>`;
      }
    }
  }
  const palette=["#49D6C4","#F2A65A","#7C8CFF","#8CF0DE"];
  pts.forEach((p,i)=>{
    s += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${palette[i%palette.length]}" opacity="0.9"><animate attributeName="opacity" values="0.5;1;0.5" dur="${3+Math.random()*3}s" repeatCount="indefinite"/></circle>`;
  });
  for(let k=0;k<6;k++){
    const a = pts[Math.floor(Math.random()*n)], b = pts[Math.floor(Math.random()*n)];
    if(a===b) continue;
    s += animatedPacket(`M${a.x},${a.y} L${b.x},${b.y}`, palette[k%palette.length], 3+Math.random()*2, Math.random()*2, 3.2);
  }
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('osiStack');
  if(!svg) return;
  const layers = 7;
  const layerH = 32, gap=6, top=14, left=20, w=220;
  const labels = ['App','Present','Session','Transport','Network','DataLink','Physical'];
  const cols = ["#49D6C4","#5FD1C0","#78CBB5","#8CC5A9","#A9C09A","#C6BB8C","#E4B67E"];
  let s='';
  for(let i=0;i<layers;i++){
    const y = top + i*(layerH+gap);
    s += `<rect x="${left}" y="${y}" width="${w}" height="${layerH}" rx="7" fill="#0F1626" stroke="#26314A" stroke-width="1"/>`;
    s += `<text x="${left+12}" y="${y+layerH/2+4}" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">${7-i} · ${labels[i]}</text>`;
  }
  const bottomY = top + (layers-1)*(layerH+gap) + layerH/2;
  const topY = top + layerH/2;
  const px = left + w - 22;
  s += `<circle cx="${px}" cy="${topY}" r="6" fill="#F2A65A">
    <animate attributeName="cy" values="${topY};${bottomY};${bottomY};${topY};${topY}" keyTimes="0;0.45;0.55;1;1" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="fill" values="#F2A65A;#7C8CFF;#7C8CFF;#F2A65A;#F2A65A" keyTimes="0;0.45;0.55;1;1" dur="6s" repeatCount="indefinite"/>
  </circle>`;
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('ipBits');
  if(!svg) return;
  const octets = [192,168,1,10];
  const colors = ["#49D6C4","#F2A65A","#7C8CFF","#8CF0DE"];
  let s='';
  const groupW = 160, gapX=20, startX=10, y=20;
  octets.forEach((oct,gi)=>{
    const gx = startX + gi*(groupW+gapX);
    const bin = oct.toString(2).padStart(8,'0');
    s += `<text x="${gx}" y="${y-4}" font-family="JetBrains Mono, monospace" font-size="12" fill="${colors[gi]}">${oct}</text>`;
    for(let b=0;b<8;b++){
      const bx = gx + b*18;
      const bit = bin[b];
      s += `<rect x="${bx}" y="${y}" width="14" height="26" rx="4" fill="${bit==='1'?colors[gi]:'#141D30'}" stroke="${colors[gi]}" stroke-width="1" opacity="${bit==='1'?0.95:0.5}"/>`;
      s += `<text x="${bx+7}" y="${y+18}" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle" fill="${bit==='1'?'#06110F':'#5D6B85'}">${bit}</text>`;
    }
    s += `<text x="${gx}" y="${y+50}" font-family="JetBrains Mono, monospace" font-size="10" fill="#5D6B85">okted ${gi+1}${gi<3?' · nuqta':''}</text>`;
  });
  s += `<text x="10" y="110" font-family="IBM Plex Sans, sans-serif" font-size="12" fill="#93A0B8">192.168.1.10 — 4 × 8 bit = 32 bit manzil, C sinfiga tegishli (lokal tarmoq)</text>`;
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('archDiagram');
  if(!svg) return;
  const cpu=[130,90], ram=[350,50], disk=[350,130], io=[570,90];
  let s='';
  s += `<line x1="${cpu[0]+55}" y1="${cpu[1]}" x2="${ram[0]-55}" y2="${ram[1]}" stroke="#26314A" stroke-width="1.6"/>`;
  s += `<line x1="${cpu[0]+55}" y1="${cpu[1]}" x2="${disk[0]-55}" y2="${disk[1]}" stroke="#26314A" stroke-width="1.6"/>`;
  s += `<line x1="${ram[0]+55}" y1="${ram[1]}" x2="${io[0]-55}" y2="${io[1]}" stroke="#26314A" stroke-width="1.6"/>`;
  s += `<line x1="${disk[0]+55}" y1="${disk[1]}" x2="${io[0]-55}" y2="${io[1]}" stroke="#26314A" stroke-width="1.6"/>`;

  const blocks = [
    [cpu,"CPU","#49D6C4"], [ram,"RAM","#F2A65A"], [disk,"Disk","#7C8CFF"], [io,"I/O","#8CF0DE"]
  ];
  blocks.forEach(([p,label,color])=>{
    s += `<rect x="${p[0]-55}" y="${p[1]-24}" width="110" height="48" rx="10" fill="#141D30" stroke="${color}" stroke-width="1.8"/>`;
    s += `<text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" fill="${color}">${label}</text>`;
  });
  s += animatedPacket(`M${cpu[0]},${cpu[1]} L${ram[0]},${ram[1]} L${io[0]},${io[1]} L${disk[0]},${disk[1]} L${cpu[0]},${cpu[1]}`, "#F2685A", 4.5, 0, 3.6);
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('packetShape');
  if(!svg) return;
  const segs = [
    {w:130, label:"Header", sub:"manba/manzil IP", color:"#7C8CFF"},
    {w:400, label:"Data", sub:"asosiy ma'lumot", color:"#49D6C4"},
    {w:110, label:"Trailer", sub:"xato tekshiruv", color:"#F2A65A"}
  ];
  let x=10, s='';
  segs.forEach(seg=>{
    s += `<rect x="${x}" y="20" width="${seg.w}" height="60" rx="8" fill="${seg.color}22" stroke="${seg.color}" stroke-width="1.6"/>`;
    s += `<text x="${x+seg.w/2}" y="48" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="13" fill="#fff">${seg.label}</text>`;
    s += `<text x="${x+seg.w/2}" y="66" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#93A0B8">${seg.sub}</text>`;
    x += seg.w + 10;
  });
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('homeNet');
  if(!svg) return;
  const y=95;
  const inet=[50,y], router=[220,y], sw=[400,y], pc1=[580,40], pc2=[580,95], pc3=[580,150];
  let s='';
  s += `<line x1="${inet[0]}" y1="${y}" x2="${router[0]}" y2="${y}" stroke="#26314A" stroke-width="1.6"/>`;
  s += `<line x1="${router[0]}" y1="${y}" x2="${sw[0]}" y2="${y}" stroke="#26314A" stroke-width="1.6"/>`;
  [pc1,pc2,pc3].forEach(p=> s += `<line x1="${sw[0]}" y1="${y}" x2="${p[0]}" y2="${p[1]}" stroke="#26314A" stroke-width="1.6"/>`);

  s += `<circle cx="${inet[0]}" cy="${y}" r="16" fill="none" stroke="#5D6B85" stroke-width="1.6"/>`;
  s += `<text x="${inet[0]}" y="${y+4}" text-anchor="middle" font-size="14" fill="#93A0B8">🌐</text>`;
  s += `<text x="${inet[0]}" y="${y+38}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">Internet</text>`;

  s += `<rect x="${router[0]-20}" y="${y-16}" width="40" height="32" rx="8" fill="#141D30" stroke="#7C8CFF" stroke-width="1.8"/>`;
  s += `<text x="${router[0]}" y="${y+4}" text-anchor="middle" font-size="13" fill="#7C8CFF">R</text>`;
  s += `<text x="${router[0]}" y="${y+38}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">Router</text>`;

  s += `<rect x="${sw[0]-20}" y="${y-16}" width="40" height="32" rx="8" fill="#141D30" stroke="#F2A65A" stroke-width="1.8"/>`;
  s += `<text x="${sw[0]}" y="${y+4}" text-anchor="middle" font-size="13" fill="#F2A65A">S</text>`;
  s += `<text x="${sw[0]}" y="${y+38}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">Switch</text>`;

  [pc1,pc2,pc3].forEach((p,i)=>{
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="10" fill="#49D6C4"/>`;
    s += `<text x="${p[0]+26}" y="${p[1]+4}" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">PC ${i+1}</text>`;
  });

  s += animatedPacket(`M${inet[0]},${y} L${router[0]},${y} L${sw[0]},${y} L${pc2[0]},${pc2[1]} L${sw[0]},${y} L${router[0]},${y} L${inet[0]},${y}`, "#8CF0DE", 5, 0, 4);
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('dhcpFlow');
  if(!svg) return;
  const clientX=70, serverX=630, y0=30;
  const steps=[["DISCOVER",1,"#49D6C4"],["OFFER",-1,"#F2A65A"],["REQUEST",1,"#7C8CFF"],["ACK",-1,"#8CF0DE"]];
  let s='';
  s += `<line x1="${clientX}" y1="10" x2="${clientX}" y2="185" stroke="#26314A"/>`;
  s += `<line x1="${serverX}" y1="10" x2="${serverX}" y2="185" stroke="#26314A"/>`;
  s += `<text x="${clientX}" y="200" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#E9EEF6">Mijoz</text>`;
  s += `<text x="${serverX}" y="200" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#E9EEF6">DHCP server</text>`;
  steps.forEach((st,i)=>{
    const [label,dir,color]=st;
    const y = 40 + i*36;
    const x1 = dir===1?clientX:serverX, x2 = dir===1?serverX:clientX;
    s += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1.6" marker-end="url(#arrow-${i})"/>`;
    s += `<marker id="arrow-${i}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker>`;
    s += `<text x="${(x1+x2)/2}" y="${y-8}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="${color}">${label}</text>`;
    s += animatedPacket(`M${x1},${y} L${x2},${y}`, color, 2.4, i*0.6, 3.5);
  });
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('dnsFlow');
  if(!svg) return;
  const client=[70,110], resolver=[350,110], server=[630,60];
  let s='';
  s += `<line x1="${client[0]}" y1="${client[1]}" x2="${resolver[0]}" y2="${resolver[1]}" stroke="#26314A" stroke-width="1.4"/>`;
  s += `<line x1="${resolver[0]}" y1="${resolver[1]}" x2="${server[0]}" y2="${server[1]}" stroke="#26314A" stroke-width="1.4"/>`;
  const nodes=[[client,"#49D6C4","Mijoz\\n(brauzer)"],[resolver,"#F2A65A","DNS Resolver"],[server,"#7C8CFF","Nom serveri"]];
  nodes.forEach(([p,c,label])=>{
    s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${c}"/>`;
    label.split("\\n").forEach((line,li)=>{
      s += `<text x="${p[0]}" y="${p[1]+28+li*14}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">${line}</text>`;
    });
  });
  s += animatedPacket(`M${client[0]},${client[1]} L${resolver[0]},${resolver[1]} L${server[0]},${server[1]} L${resolver[0]},${resolver[1]} L${client[0]},${client[1]}`, "#8CF0DE", 4.5, 0, 4);
  svg.innerHTML = s;
})();

(function(){
  const svg = document.getElementById('ftpFlow');
  if(!svg) return;
  const client=[80,90], server=[620,90];
  let s='';
  s += `<line x1="${client[0]}" y1="${client[1]-18}" x2="${server[0]}" y2="${server[1]-18}" stroke="#26314A" stroke-width="1.4"/>`;
  s += `<line x1="${client[0]}" y1="${client[1]+18}" x2="${server[0]}" y2="${server[1]+18}" stroke="#26314A" stroke-width="1.4"/>`;
  s += `<text x="${(client[0]+server[0])/2}" y="${client[1]-26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#5D6B85">Port 21 — boshqaruv kanali</text>`;
  s += `<text x="${(client[0]+server[0])/2}" y="${client[1]+38}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#5D6B85">Port 20 — ma'lumot kanali</text>`;
  s += `<circle cx="${client[0]}" cy="${client[1]}" r="10" fill="#49D6C4"/>`;
  s += `<text x="${client[0]}" y="${client[1]+45}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">FTP mijoz</text>`;
  s += `<circle cx="${server[0]}" cy="${server[1]}" r="10" fill="#7C8CFF"/>`;
  s += `<text x="${server[0]}" y="${server[1]+45}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#93A0B8">FTP server</text>`;
  s += animatedPacket(`M${client[0]},${client[1]-18} L${server[0]},${server[1]-18}`, "#F2A65A", 2, 0, 3.5);
  s += animatedPacket(`M${server[0]},${server[1]+18} L${client[0]},${client[1]+18}`, "#8CF0DE", 2.6, 0.4, 3.5);
  svg.innerHTML = s;
})();