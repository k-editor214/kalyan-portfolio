
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

function setupNav(){
  const toggle=$(".mobile-toggle"), nav=$(".nav");
  if(toggle && nav) toggle.addEventListener("click",()=>nav.classList.toggle("open"));
}
function setupReveal(){
  const items=$$(".reveal");
  if(!("IntersectionObserver" in window)){items.forEach(x=>x.classList.add("visible"));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
  items.forEach(x=>io.observe(x));
}
function setupIntro(){
  const intro=$("#intro");
  if(!intro) return;
  const seen=sessionStorage.getItem("kalyan_intro_seen_v4");
  if(seen==="1"){intro.classList.add("hidden");return;}
  const first=$("#introFirst"), second=$("#introVideo"), third=$("#introTransition");
  const play=$("#playIntro"), skip=$("#skipIntro"), skip2=$("#skipIntro2");
  const vid=$("#introVid"), progress=$("#introProgress");
  let timer;
  function enterHome(){
    sessionStorage.setItem("kalyan_intro_seen_v4","1");
    clearInterval(timer);
    if(vid) {vid.pause();vid.currentTime=0}
    third.classList.add("active");
    setTimeout(()=>{intro.classList.add("hidden");window.scrollTo(0,0)},1200);
  }
  function startVideo(){
    first.classList.remove("active");second.classList.add("active");
    if(vid){
      vid.currentTime=0;
      const p=vid.play();
      if(p) p.catch(()=>{});
      timer=setInterval(()=>{
        const d=vid.duration||9;
        progress.style.width=Math.min(100,(vid.currentTime/d)*100)+"%";
      },80);
      vid.onended=enterHome;
      // Hard 9 second ceiling if the supplied file is longer.
      setTimeout(()=>{if(!intro.classList.contains("hidden") && second.classList.contains("active")) enterHome()},9300);
    } else setTimeout(enterHome,9000);
  }
  play?.addEventListener("click",startVideo);
  skip?.addEventListener("click",enterHome);
  skip2?.addEventListener("click",enterHome);
}
document.addEventListener("DOMContentLoaded",()=>{setupNav();setupReveal();setupIntro()});

// Expand team cards in place on tap/click.
document.querySelectorAll('.team-card').forEach(card => {
  const toggle = () => {
    document.querySelectorAll('.team-card.open').forEach(other => { if (other !== card) other.classList.remove('open'); });
    card.classList.toggle('open');
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
