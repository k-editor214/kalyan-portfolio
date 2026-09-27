const VIDEO_LIBRARY = {
  "reels": {label:"Reels", path:"assets/videos/reels/", prefix:"reel-", count:4, ratio:"vertical"},
  "advertisements": {label:"Advertisements", path:"assets/videos/advertisements/", prefix:"advertisement-", count:4, ratio:"landscape"},
  "company-designs": {label:"Company Designs", path:"assets/videos/company-designs/", prefix:"company-design-", count:4, ratio:"landscape"},
  "short-films": {label:"Short Films", path:"assets/videos/short-films/", prefix:"short-film-", count:4, ratio:"landscape"},
  "wedding-videos": {label:"Wedding Videos", path:"assets/videos/wedding-videos/", prefix:"wedding-video-", count:4, ratio:"landscape"},
  "story": {label:"Story", path:"assets/videos/story/", prefix:"story-", count:4, ratio:"landscape"},
  "product-promotions": {label:"Product Promotions", path:"assets/videos/product-promotions/", prefix:"product-promotion-", count:4, ratio:"landscape"},
  "color-grading": {label:"Color Grading / DI", path:"assets/videos/color-grading/", prefix:"color-grading-", count:4, ratio:"landscape"}
};

const FEATURED_VIDEOS = [
  {title:"Reel 01",category:"Reels",key:"reels",file:"reel-1.mp4",ratio:"vertical"},
  {title:"Advertisement 01",category:"Advertisements",key:"advertisements",file:"advertisement-1.mp4",ratio:"landscape"},
  {title:"Wedding Video 01",category:"Wedding Videos",key:"wedding-videos",file:"wedding-video-1.mp4",ratio:"landscape"},
  {title:"Color Grading / DI 01",category:"Color Grading / DI",key:"color-grading",file:"color-grading-1.mp4",ratio:"landscape"},
  {title:"Short Film 01",category:"Short Films",key:"short-films",file:"short-film-1.mp4",ratio:"landscape"},
  {title:"Product Promotion 01",category:"Product Promotions",key:"product-promotions",file:"product-promotion-1.mp4",ratio:"landscape"}
];

const TEAM = [
  {name:"Kalyan Chitteti",role:"Video Editor • Colorist • DI Artist",image:"assets/images/profile/kalyan-profile.jpg",bio:"5+ years of experience and 100+ editing projects across reels, advertisements, wedding films, short films, promotional content and post-production."},
  {name:"Team Member 01",role:"Cinematographer / Director",image:"assets/images/team/team-1.jpg",bio:"Add your teammate's real name, role and profile description here."},
  {name:"Team Member 02",role:"Photographer / Editor",image:"assets/images/team/team-2.jpg",bio:"Add your teammate's real name, role and profile description here."},
  {name:"Team Member 03",role:"Creative / Production",image:"assets/images/team/team-3.jpg",bio:"Add your teammate's real name, role and profile description here."}
];

const TOOLS = [
  ["DR","DaVinci Resolve","Editing • Color Grading • DI"],
  ["PR","Adobe Premiere Pro","Professional video editing"],
  ["AE","After Effects","Motion graphics • VFX"],
  ["PS","Photoshop","Image • Poster • Creative design"],
  ["CA","Canva","Social creatives • Quick design"],
  ["FG","Figma","UI • Visual systems • Layout"],
  ["EX","Excel","Data • Reporting • Workflow"],
  ["PB","Power BI","Dashboards • Data visualization"]
];

function setupNav(){
  const toggle=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav");
  if(toggle&&nav) toggle.addEventListener("click",()=>nav.classList.toggle("open"));
}

function videoPath(item){return VIDEO_LIBRARY[item.key].path+item.file}

function initFeatured(){
  const grid=document.querySelector("[data-featured-work]");
  if(!grid)return;
  grid.innerHTML=FEATURED_VIDEOS.map((v,i)=>`
    <article class="featured-card ${v.ratio==="vertical"?"is-vertical":""}" data-index="${i}">
      <div class="featured-media">
        <video muted playsinline preload="metadata" src="${videoPath(v)}"></video>
        <div class="featured-fallback"><span>${v.category}</span><strong>${v.title}</strong><small>Upload the exact MP4 filename to activate this card.</small></div>
        <span class="video-status">OPEN</span>
      </div>
      <div class="featured-meta"><span>${v.category}</span><h3>${v.title}</h3></div>
    </article>`).join("");
  grid.querySelectorAll("video").forEach(v=>{
    v.addEventListener("loadeddata",()=>v.closest(".featured-media").classList.add("has-video"));
    v.addEventListener("mouseenter",()=>v.play().catch(()=>{}));
    v.addEventListener("mouseleave",()=>{v.pause();v.currentTime=0});
  });
  grid.querySelectorAll(".featured-card").forEach(card=>card.addEventListener("click",()=>{
    const v=FEATURED_VIDEOS[Number(card.dataset.index)];
    openVideo(v.title,v.category,videoPath(v),v.ratio);
  }));
}

function openVideo(title,category,src,ratio){
  let modal=document.getElementById("videoModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="videoModal";modal.className="modal";
    modal.innerHTML=`<div class="modal-backdrop"></div><div class="modal-panel video-modal-panel"><button class="modal-close">×</button><p class="eyebrow"></p><h2></h2><video controls playsinline></video></div>`;
    document.body.appendChild(modal);
    const close=()=>{modal.classList.remove("open");const p=modal.querySelector("video");p.pause();p.removeAttribute("src");p.load()};
    modal.querySelector(".modal-backdrop").onclick=close;modal.querySelector(".modal-close").onclick=close;
  }
  modal.querySelector(".eyebrow").textContent=category;
  modal.querySelector("h2").textContent=title;
  const player=modal.querySelector("video");player.src=src;modal.classList.add("open");
  player.play().catch(()=>{});
}

function initWork(){
  const grid=document.getElementById("workGrid"), filters=document.getElementById("filters");
  if(!grid||!filters)return;
  const cats=[["all","All Work"],...Object.entries(VIDEO_LIBRARY).map(([k,v])=>[k,v.label])];
  filters.innerHTML=cats.map(([k,l],i)=>`<button class="filter-btn ${i===0?"active":""}" data-filter="${k}">${l}</button>`).join("");
  function render(filter="all"){
    const items=[];
    Object.entries(VIDEO_LIBRARY).forEach(([key,c])=>{
      if(filter!=="all"&&filter!==key)return;
      for(let i=1;i<=c.count;i++)items.push({key,file:`${c.prefix}${i}.mp4`,title:`${c.label} ${String(i).padStart(2,"0")}`,category:c.label,ratio:c.ratio});
    });
    grid.innerHTML=items.map((v,i)=>`
      <article class="work-card ${v.ratio==="vertical"?"vertical":""}" data-work="${i}">
        <div class="work-media"><video muted playsinline preload="metadata" src="${VIDEO_LIBRARY[v.key].path}${v.file}"></video></div>
        <div class="work-meta"><span>${v.category}</span><h3>${v.title}</h3></div>
      </article>`).join("");
    grid.querySelectorAll("video").forEach(v=>v.addEventListener("loadeddata",()=>v.closest(".work-media").classList.add("has-video")));
    grid.querySelectorAll(".work-card").forEach((card,i)=>card.onclick=()=>openVideo(items[i].title,items[i].category,VIDEO_LIBRARY[items[i].key].path+items[i].file,items[i].ratio));
  }
  filters.addEventListener("click",e=>{if(!e.target.matches(".filter-btn"))return;filters.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");render(e.target.dataset.filter)});
  const query=new URLSearchParams(location.search).get("category");render(query&&VIDEO_LIBRARY[query]?query:"all");
}

function initTeam(){
  const grid=document.getElementById("teamGrid");if(!grid)return;
  grid.innerHTML=TEAM.map((m,i)=>`<article class="team-card" data-team="${i}"><div class="team-photo"><img src="${m.image}" alt="${m.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="image-placeholder"><span>TEAM PHOTO ${String(i+1).padStart(2,"0")}</span><small>Upload the image shown in the README.</small></div></div><div class="team-info"><span>${m.role}</span><h3>${m.name}</h3></div></article>`).join("");
  const modal=document.getElementById("teamModal");if(!modal)return;
  grid.querySelectorAll(".team-card").forEach(card=>card.onclick=()=>{
    const m=TEAM[Number(card.dataset.team)];
    modal.querySelector("#modalTeamImage").src=m.image;modal.querySelector("#modalTeamRole").textContent=m.role;modal.querySelector("#modalTeamName").textContent=m.name;modal.querySelector("#modalTeamBio").textContent=m.bio;modal.classList.add("open");
  });
  modal.querySelectorAll("[data-close-modal]").forEach(x=>x.onclick=()=>modal.classList.remove("open"));
}

function initTools(){
  const grid=document.getElementById("toolsGrid");if(!grid)return;
  grid.innerHTML=TOOLS.map(t=>`<article class="tool-card"><div class="tool-icon">${t[0]}</div><h3>${t[1]}</h3><p>${t[2]}</p></article>`).join("");
}

function drawShowreel(canvas){
  if(!canvas)return;
  const ctx=canvas.getContext("2d");let t=0;
  function frame(){
    t+=.012;const w=canvas.width,h=canvas.height;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#171412");g.addColorStop(.48,"#6b4033");g.addColorStop(1,"#e18c6d");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<16;i++){let x=(Math.sin(t*.65+i*1.7)*.5+.5)*w,y=(Math.cos(t*.42+i)*.5+.5)*h,r=25+22*Math.sin(t+i);ctx.fillStyle=`rgba(255,235,215,${.025+.025*Math.sin(t+i)})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle="rgba(0,0,0,.48)";ctx.fillRect(0,h*.69,w,h*.31);
    ctx.fillStyle="#fff8f1";ctx.font="500 78px 'Cormorant Garamond', serif";ctx.fillText("KALYAN CHITTETI",55,h*.84);
    ctx.font="600 20px 'DM Sans', sans-serif";ctx.fillStyle="#f3b19a";ctx.fillText("EDIT  •  COLOR  •  DI  •  MOTION",60,h*.91);
    requestAnimationFrame(frame);
  }frame();
}

function handleContact(e){e.preventDefault();const m=document.getElementById("contactMessage");if(m)m.textContent="Thanks — your enquiry is ready. Connect this form to your email/backend before launch.";return false}
function demoAdmin(e){e.preventDefault();document.querySelector(".admin-login").style.display="none";document.getElementById("adminPanel").style.display="block";return false}

document.addEventListener("DOMContentLoaded",()=>{
  setupNav();initFeatured();initWork();initTeam();initTools();
  drawShowreel(document.getElementById("homeShowreel"));
  drawShowreel(document.getElementById("fullShowreel"));
});
