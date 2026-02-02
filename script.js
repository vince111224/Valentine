// Scenes array: edit messages, background colors, and subtitles here.
const scenes = [
  { bg: 'linear-gradient(135deg,#fff0f6,#fff8f0)', subtitle: 'A sweet pink cloud...' },
  { bg: 'linear-gradient(135deg,#e8fff7,#e6f7ff)', subtitle: 'You landed in the mint lagoon.' },
  { bg: 'linear-gradient(135deg,#fff6e6,#fff0d6)', subtitle: 'Warm caramel sands.' },
  { bg: 'linear-gradient(135deg,#f0f6ff,#eef7ff)', subtitle: 'A starry little corner.' },
  { bg: 'linear-gradient(135deg,#f9f0ff,#fbe8ff)', subtitle: 'Cotton candy skies!' }
];

const app = document.getElementById('app');
const questionEl = document.getElementById('question');
const subtitleEl = document.getElementById('subtitle');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlayContent');
const card = document.getElementById('card');

let currentScene = 0;
let teleporting = false;

function showScene(i) {
  const s = scenes[i];
  app.style.background = s.bg;
  subtitleEl.textContent = s.subtitle;
  // small playful scale animation on card
  card.style.transform = 'translateY(-6px) scale(1.01)';
  setTimeout(()=> card.style.transform = '', 420);
  currentScene = i;
}

// picks a random scene index not equal to current
function pickRandomSceneIndex() {
  if (scenes.length <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * scenes.length); } while (idx === currentScene);
  return idx;
}

function showOverlay(text) {
  overlayContent.textContent = text;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
}

function hideOverlay() {
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
}

// teleport flow when No is pressed
async function teleport() {
  if (teleporting) return;
  teleporting = true;
  showOverlay('Teleporting...');
  // playful delay to simulate "warp"
  await new Promise(r => setTimeout(r, 800));
  const next = pickRandomSceneIndex();
  showScene(next);
  // small random reposition of the card so it "feels" like teleporting
  const x = (Math.random() - 0.5) * 40; // px
  const y = (Math.random() - 0.5) * 20;
  card.style.transform = `translate(${x}px, ${y}px)`;
  setTimeout(()=> { card.style.transform = ''; hideOverlay(); teleporting = false; }, 420);
}

// celebration for Yes
function celebrate() {
  // disable buttons to avoid further teleports
  yesBtn.disabled = true;
  noBtn.disabled = true;
  showOverlay('Yes! 💖');
  overlayContent.style.padding = '36px';
  overlayContent.style.fontSize = '20px';

  // simple hearts animation
  const hearts = document.createElement('div');
  hearts.className = 'hearts';
  document.body.appendChild(hearts);

  const colors = ['#ff4d88','#ff85a3','#ffd166','#ff7ab6'];
  for (let i=0;i<18;i++){
    const h = document.createElement('div');
    h.style.position='absolute';
    h.style.left = `${50 + (Math.random()-0.5)*60}%`;
    h.style.top = `${60 + Math.random()*30}%`;
    h.style.width = `${8 + Math.random()*18}px`;
    h.style.height = h.style.width;
    h.style.background = colors[Math.floor(Math.random()*colors.length)];
    h.style.opacity = .95;
    h.style.borderRadius = '50% 50% 45% 50% / 60% 60% 40% 40%';
    h.style.transform = `translate(-50%,-50%) scale(${0.1 + Math.random()*0.8})`;
    h.style.transition = 'transform 1100ms cubic-bezier(.2,.9,.3,1), top 1100ms linear, opacity 1100ms linear';
    hearts.appendChild(h);
    // animate upward
    requestAnimationFrame(()=>{
      h.style.top = `${20 + Math.random()*40}%`;
      h.style.transform = `translate(-50%,-50%) scale(${1.1 + Math.random()})`;
      h.style.opacity = '0';
    });
  }

  // after a bit, replace overlay with a full message
  setTimeout(()=>{
    overlayContent.innerHTML = `<strong>She said YES!</strong><div style="font-size:14px;margin-top:8px">You're officially adorable.</div>`;
  }, 1100);
}

// make No move on hover sometimes (playful)
noBtn.addEventListener('mouseenter', ()=>{
  if (teleporting) return;

  const rect = noBtn.getBoundingClientRect();
  const parentRect = card.getBoundingClientRect();
  const maxX = parentRect.width - rect.width - 16;
  const maxY = parentRect.height - rect.height - 16;

  const nx = Math.max(8, Math.random() * maxX);
  const ny = Math.max(8, Math.random() * maxY);

  noBtn.style.transform = `translate(${nx - rect.left + parentRect.left}px, ${ny - rect.top + parentRect.top}px)`;
});

// clicks
noBtn.addEventListener('click', (e)=>{
  teleport();
});

yesBtn.addEventListener('click', (e)=>{
  celebrate();
});

// allow keyboard accessibility: left/right to choose
document.addEventListener('keydown', (e)=>{
  if (e.key === 'y' || e.key === 'Y') yesBtn.click();
  if (e.key === 'n' || e.key === 'N') noBtn.click();
});

// init
showScene(0);
