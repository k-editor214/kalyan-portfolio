const intro=document.getElementById("intro");
const progress=document.getElementById("introProgress");
const time=document.getElementById("introTime");
const pause=document.getElementById("pauseIntro");
const skip=document.getElementById("skipIntro");
const started=performance.now();
let paused=false, pauseAt=0, elapsed=0, finished=false;

function finishIntro(){
 if(finished)return;
 finished=true;
 intro.classList.add("leave");
 intro.style.transition="opacity .8s ease,transform .8s ease";
 intro.style.opacity="0";
 intro.style.transform="scale(1.03)";
 setTimeout(()=>intro.remove(),800);
 sessionStorage.setItem("kalyan_intro_seen_v5","1");
}
function tick(now){
 if(!finished && !paused){
   elapsed=Math.min(9,(now-started)/1000);
   progress.style.width=(elapsed/9*100)+"%";
   time.textContent="00:"+String(Math.max(0,Math.ceil(9-elapsed))).padStart(2,"0");
   if(elapsed>=9) finishIntro();
 }
 if(!finished) requestAnimationFrame(tick);
}
if(sessionStorage.getItem("kalyan_intro_seen_v5")==="1"){intro.remove();}
else requestAnimationFrame(tick);

pause.onclick=()=>{
 paused=!paused;
 if(paused){pause.textContent="PLAY";pauseAt=performance.now();}
 else {pause.textContent="PAUSE";requestAnimationFrame(tick);}
};
skip.onclick=finishIntro;

document.querySelectorAll(".team-card").forEach(card=>{
 card.addEventListener("click",()=>{
   document.querySelectorAll(".team-card").forEach(c=>c!==card&&c.classList.remove("open"));
   card.classList.toggle("open");
 });
});

const sr=document.getElementById("codedShowreel"), counter=document.getElementById("srCounter");
let srStart=null,srRun=true;
function showTick(t){
 if(!srRun)return;
 if(srStart===null)srStart=t;
 const sec=Math.floor(((t-srStart)/1000)%18);
 counter.textContent=String(sec).padStart(2,"0");
 requestAnimationFrame(showTick);
}
requestAnimationFrame(showTick);
document.getElementById("replayShow").onclick=()=>{
 srStart=null; srRun=true; requestAnimationFrame(showTick);
};
