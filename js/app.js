const REPO_API = 'https://api.github.com/repos/k-editor214/kalyan-portfolio/contents/assets/videos';

const CATEGORIES = {
  reels: {label:'Reels', folder:'reels', ratio:'9:16'},
  advertisements: {label:'Advertisements', folder:'advertisements', ratio:'16:9'},
  companyDesigns: {label:'Company Designs', folder:'company-designs', ratio:'16:9'},
  shortFilms: {label:'Short Films', folder:'short-films', ratio:'16:9'},
  weddingVideos: {label:'Wedding Videos', folder:'wedding-videos', ratio:'16:9'},
  story: {label:'Story', folder:'story', ratio:'16:9'},
  productPromotions: {label:'Product Promotions', folder:'product-promotions', ratio:'16:9'},
  colorGrading: {label:'Color Grading / DI', folder:'color-grading', ratio:'16:9'}
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function initNav(){
  const toggle = $('.menu-toggle');
  const nav = $('.main-nav');
  toggle?.addEventListener('click', () => nav?.classList.toggle('open'));
  const file = location.pathname.split('/').pop() || 'index.html';
  const page = file === 'index.html' || file === '' ? 'home' : file.replace('.html','');
  $$('.main-nav a[data-page]').forEach(a => {
    if(a.dataset.page === page) a.classList.add('active');
  });
}

function setYear(){
  $$('.year').forEach(el => el.textContent = new Date().getFullYear());
}

function initImages(){
  $$('img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('image-load-error'));
  });
}

async function listVideos(folder){
  try{
    const res = await fetch(`${REPO_API}/${folder}?ref=main&ts=${Date.now()}`, {
      cache:'no-store',
      headers:{'Accept':'application/vnd.github+json'}
    });
    if(!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    const files = Array.isArray(data)
      ? data.filter(x => x.type === 'file' && /\.(mp4|webm|mov)$/i.test(x.name))
      : [];
    files.sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric:true}));
    return files;
  }catch(err){
    console.warn(`Could not load ${folder}:`, err);
    return [];
  }
}

function prettyName(filename, category){
  const stem = filename.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');
  const cleanCategory = category.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const withoutPrefix = stem.replace(new RegExp(`^${cleanCategory}\\s*`, 'i'),'');
  return `${category}${withoutPrefix ? ' ' + withoutPrefix : ''}`.trim()
    .replace(/\b\w/g,m=>m.toUpperCase());
}

function openVideoModal(src,title,category,vertical=false){
  let modal = $('#siteVideoModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id='siteVideoModal';
    modal.className='modal-backdrop';
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" type="button" aria-label="Close">×</button>
        <div class="eyebrow" data-modal-category></div>
        <h2 data-modal-title></h2>
        <video class="video-modal-player" controls playsinline preload="metadata"></video>
      </div>`;
    document.body.appendChild(modal);

    const close = ()=>{
      const p=$('video',modal);
      p.pause();
      p.removeAttribute('src');
      p.load();
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    };
    $('.modal-close',modal).addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  const player = $('video',modal);
  $('[data-modal-category]',modal).textContent = `${category} · ${vertical?'9:16':'16:9'}`;
  $('[data-modal-title]',modal).textContent = title;
  player.style.aspectRatio = vertical ? '9 / 16' : '16 / 9';
  player.style.objectFit='contain';
  player.src=src;
  player.load();
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function makeVideoCard(file, meta){
  const src = `assets/videos/${meta.folder}/${encodeURIComponent(file.name)}`;
  const vertical = meta.ratio === '9:16';
  const title = prettyName(file.name, meta.label);

  const card = document.createElement('article');
  card.className='video-card';
  card.dataset.category=meta.folder;
  card.innerHTML=`
    <div class="video-thumb ${vertical?'vertical':''}">
      <video preload="metadata" muted playsinline src="${src}"></video>
      <div class="video-overlay">
        <button class="video-play" type="button" aria-label="Play ${title}">▶</button>
      </div>
    </div>
    <div class="video-info">
      <div class="meta"><span>${meta.label}</span><span>${meta.ratio}</span></div>
      <h3>${title}</h3>
    </div>`;

  const video = $('video',card);
  video.addEventListener('error',()=>card.classList.add('video-error'));
  $('.video-play',card).addEventListener('click',()=>openVideoModal(src,title,meta.label,vertical));
  return card;
}

async function getAllVideoGroups(){
  const groups=[];
  for(const meta of Object.values(CATEGORIES)){
    const files=await listVideos(meta.folder);
    if(files.length) groups.push({meta,files});
  }
  return groups;
}

async function initWorkLibrary(){
  const container = $('#videoLibrary');
  if(!container) return;

  const filterBar = $('.video-filters');
  const groups = await getAllVideoGroups();

  container.innerHTML='';
  if(!groups.length){
    container.closest('.section')?.classList.add('is-empty');
    return;
  }

  groups.forEach(({meta,files})=>{
    const label=document.createElement('div');
    label.className='video-section-label';
    label.dataset.section=meta.folder;
    label.textContent=meta.label;
    container.appendChild(label);
    files.forEach(file=>container.appendChild(makeVideoCard(file,meta)));
  });

  // Only show category filters that currently contain work.
  const available = new Set(groups.map(({meta}) => meta.folder));
  $$('.filter',filterBar).forEach(btn=>{
    if(btn.dataset.videoFilter !== 'all' && !available.has(btn.dataset.videoFilter)) btn.hidden = true;
    btn.addEventListener('click',()=>{
      $$('.filter',filterBar).forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter=btn.dataset.videoFilter;
      $$('.video-card',container).forEach(card=>{
        card.style.display=(filter==='all'||card.dataset.category===filter)?'':'none';
      });
      $$('.video-section-label',container).forEach(label=>{
        label.style.display=(filter==='all'||label.dataset.section===filter)?'':'none';
      });
    });
  });
}

async function initFeaturedWork(){
  const grid=$('[data-featured-work]');
  if(!grid) return;

  const wanted=['reels','advertisements','wedding-videos','color-grading','short-films','product-promotions'];
  const found=[];
  for(const folder of wanted){
    const meta=Object.values(CATEGORIES).find(x=>x.folder===folder);
    const files=await listVideos(folder);
    if(files.length) found.push({meta,file:files[0]});
  }

  grid.innerHTML='';
  if(!found.length){
    grid.closest('section')?.classList.add('is-empty');
    return;
  }

  found.forEach(({meta,file})=>{
    const src=`assets/videos/${meta.folder}/${encodeURIComponent(file.name)}`;
    const vertical=meta.ratio==='9:16';
    const title=prettyName(file.name,meta.label);
    const card=document.createElement('article');
    card.className=`featured-card ${vertical?'is-vertical':''}`;
    card.innerHTML=`
      <div class="featured-media">
        <video src="${src}" muted playsinline preload="metadata"></video>
        <div class="featured-fallback"><div><strong>${title}</strong><small>${meta.ratio}</small></div></div>
        <button class="featured-play" type="button">▶</button>
      </div>
      <div class="featured-meta"><span>${meta.label}</span><h3>${title}</h3></div>`;
    const v=$('video',card);
    v.addEventListener('loadeddata',()=>$('.featured-media',card).classList.add('has-video'));
    v.addEventListener('error',()=>$('.featured-media',card).classList.remove('has-video'));
    $('.featured-play',card).addEventListener('click',()=>openVideoModal(src,title,meta.label,vertical));
    grid.appendChild(card);
  });
}

function initTeam(){
  const modal=$('#teamModal');
  if(!modal) return;
  $$('[data-team]').forEach(card=>{
    card.addEventListener('click',()=>{
      try{
        const data=JSON.parse(card.dataset.team);
        $('[data-modal-img]',modal).src=data.image;
        $('[data-modal-name]',modal).textContent=data.name;
        $('[data-modal-role]',modal).textContent=data.role;
        $('[data-modal-bio]',modal).textContent=data.bio;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
      }catch(e){console.warn('Invalid team data',e)}
    });
  });
  const close=()=>{
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };
  $('[data-close]',modal)?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

function initContactForm(){
  const form=$('#contactForm');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#contactName')?.value.trim();
    const email=$('#contactEmail')?.value.trim();
    const message=$('#contactMessage')?.value.trim();
    if(!name||!email||!message){alert('Please complete your name, email and message.');return;}
    window.location.href=`mailto:kalyanjpc84@gmail.com?subject=${encodeURIComponent('Portfolio enquiry from '+name)}&body=${encodeURIComponent(message+'\\n\\nReply to: '+email)}`;
  });
}

function init(){
  initNav();
  setYear();
  initImages();
  initTeam();
  initContactForm();
  initWorkLibrary();
  initFeaturedWork();
}

document.addEventListener('DOMContentLoaded',init);


document.addEventListener('DOMContentLoaded', () => {
  const player = document.querySelector('.showreel-player');
  const missing = document.querySelector('.showreel-missing');
  if (!player || !missing) return;
  player.addEventListener('error', () => {
    player.hidden = true;
    missing.hidden = false;
  });
});
