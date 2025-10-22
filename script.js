/* ----------------------------
  Birthday Wisher - interactive
  - gift open -> reveal modal
  - confetti burst + fireworks canvas
  - floating balloons
  - cursor sparkles
  - background music on interaction
-----------------------------*/

(() => {
  // DOM
  const giftBtn = document.getElementById('giftBtn');
  const reveal = document.getElementById('reveal');
  const wishBtn = document.getElementById('wishBtn');
  const closeBtn = document.getElementById('closeBtn');
  const bgMusic = document.getElementById('bgMusic');

  const confettiCanvas = document.getElementById('confetti');
  const fireworksCanvas = document.getElementById('fireworks');
  const cursorCanvas = document.getElementById('cursorSparkle');
  const balloonsContainer = document.querySelector('.balloons');

  // size canvases
  function resizeCanvases() {
    [confettiCanvas, fireworksCanvas, cursorCanvas].forEach((c) => {
      c.width = c.clientWidth = c.offsetWidth || window.innerWidth;
      c.height = c.clientHeight = c.offsetHeight || window.innerHeight;
    });
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  /* -------------------------
     Floating Balloons
  -------------------------*/
  const BALLOON_COUNT = 8;
  const colors = ['#FF6EB4','#FFD166','#6DD3FF','#B8FFB0','#C89BFF','#FFB3A7'];
  function makeBalloons(){
    balloonsContainer.innerHTML = '';
    for(let i=0;i<BALLOON_COUNT;i++){
      const b = document.createElement('div');
      b.className = 'balloon';
      const size = Math.random()*42 + 48;
      const left = Math.random()*90;
      b.style.cssText = `
        position:absolute;
        bottom:${-Math.random()*120 - 60}px;
        left:${left}%;
        width:${size}px;
        height:${size*1.28}px;
        background: linear-gradient(180deg, ${colors[i%colors.length]}, #fff0);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        transform: translateY(0) rotate(${Math.random()*30-15}deg);
        opacity:${0.88 - Math.random()*0.25};
        box-shadow: 0 8px 30px rgba(16,24,40,0.08);
        pointer-events:none;
        z-index:5;
        transition: transform 1.2s linear;
      `;
      // string for a thin string
      const string = document.createElement('span');
      string.style.cssText = `position:absolute; left:50%; top:100%; width:2px; height:120px; background:rgba(0,0,0,0.06); transform:translateX(-50%);`;
      b.appendChild(string);
      balloonsContainer.appendChild(b);

      // animate floating up with random duration & delay
      const dur = Math.random()*18 + 22;
      const delay = Math.random()*3;
      b.animate(
        [
          { transform:`translateY(0) rotate(${Math.random()*20-10}deg)` },
          { transform:`translateY(-${window.innerHeight + 220}px) rotate(${Math.random()*40-20}deg)` }
        ],
        { duration: dur*1000, iterations: Infinity, delay: delay*1000, direction:'normal', easing:'linear' }
      );
    }
  }
  makeBalloons();
  setInterval(makeBalloons, 25000); // refresh occasionally

  /* -------------------------
     Confetti System (burst)
  -------------------------*/
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParts = [];
  function ConfettiParticle(x,y){
    this.x = x; this.y = y;
    this.size = Math.random()*8 + 6;
    this.color = `hsl(${Math.random()*360}, 90%, 60%)`;
    this.velX = (Math.random()-0.5) * 8;
    this.velY = (Math.random()-1.5) * 6;
    this.gravity = 0.12 + Math.random()*0.14;
    this.rot = Math.random()*360;
    this.spin = (Math.random()-0.5)*0.2;
    this.life = 140 + Math.random()*60;
  }
  ConfettiParticle.prototype.update = function(){
    this.velY += this.gravity;
    this.x += this.velX;
    this.y += this.velY;
    this.rot += this.spin;
    this.life--;
  };
  ConfettiParticle.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*0.6);
    ctx.restore();
  };
  function fireConfetti(x,y,amount=80){
    for(let i=0;i<amount;i++) confettiParts.push(new ConfettiParticle(x + (Math.random()-0.5)*60, y + (Math.random()-0.5)*30));
  }
  function confettiAnim(){
    confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    for(let i=confettiParts.length-1;i>=0;i--){
      const p = confettiParts[i];
      p.update();
      p.draw(confettiCtx);
      if(p.life<=0 || p.y > confettiCanvas.height + 50) confettiParts.splice(i,1);
    }
    requestAnimationFrame(confettiAnim);
  }
  confettiAnim();

  /* -------------------------
     Fireworks (soft) in bg
  -------------------------*/
  const fwCtx = fireworksCanvas.getContext('2d');
  let fwParticles = [];
  function Firework(x,y,color){
    this.p = {x,y};
    this.particles = [];
    const count = 60 + Math.floor(Math.random()*50);
    for(let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = (Math.random()*3 + 1.5) * (Math.random()*1.4);
      this.particles.push({
        x,y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60 + Math.floor(Math.random()*50),
        color: `hsl(${Math.random()*360}, 95%, 60%)`,
        size: Math.random()*2.5 + 1
      });
    }
    fwParticles.push(...this.particles);
  }
  function fwAnim(){
    fwCtx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    for(let i=fwParticles.length-1;i>=0;i--){
      const p = fwParticles[i];
      p.vy += 0.04;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      fwCtx.beginPath();
      fwCtx.globalCompositeOperation = 'lighter';
      fwCtx.fillStyle = p.color;
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      fwCtx.fill();
      if(p.life <= 0 || p.y > fireworksCanvas.height + 80) fwParticles.splice(i,1);
    }
    requestAnimationFrame(fwAnim);
  }
  fwAnim();

  // occasionally pop random fireworks for ambience (but keep subtle)
  let fwInterval = setInterval(()=>{
    const x = Math.random()*fireworksCanvas.width;
    const y = Math.random()*fireworksCanvas.height*0.4;
    new Firework(x,y);
  }, 3000);

  /* -------------------------
     Cursor sparkles (follow mouse)
  -------------------------*/
  const cCtx = cursorCanvas.getContext('2d');
  let sparkles = [];
  function Spark(x,y){
    this.x = x; this.y = y;
    this.vx = (Math.random()-0.5)*1.6; this.vy = (Math.random()-1.6)*1.2;
    this.life = 50 + Math.random()*40;
    this.size = 1 + Math.random()*3;
    this.color = `rgba(255,255,255,${0.9 - Math.random()*0.4})`;
  }
  Spark.prototype.update = function(){
    this.vy += 0.03;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  };
  Spark.prototype.draw = function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalCompositeOperation = 'lighter';
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  };
  function sparkleLoop(){
    cCtx.clearRect(0,0,cursorCanvas.width,cursorCanvas.height);
    for(let i=sparkles.length-1;i>=0;i--){
      const s = sparkles[i];
      s.update();
      s.draw(cCtx);
      if(s.life<=0) sparkles.splice(i,1);
    }
    requestAnimationFrame(sparkleLoop);
  }
  sparkleLoop();

  // mouse events
  let mouseActive = false;
  window.addEventListener('mousemove', (e)=>{
    const rect = cursorCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // spawn small sparklers
    for(let i=0;i<2;i++){
      sparkles.push(new Spark(x + (Math.random()-0.5)*8, y + (Math.random()-0.5)*8));
    }
    mouseActive = true;
  });

  // also small random sparkles for charm
  setInterval(()=> {
    if(!mouseActive) {
      sparkles.push(new Spark(Math.random()*cursorCanvas.width, Math.random()*cursorCanvas.height));
    }
    mouseActive = false;
  }, 700);

  /* -------------------------
     Gift open interactions
  -------------------------*/
  function ensureMusicPlay(){
    try{
      bgMusic.volume = 0.85;
      bgMusic.play().catch(()=>{/* user gesture required: will play later */});
    } catch(e){}
  }

  giftBtn.addEventListener('click', (ev) => {
    // small pop animation on lid
    giftBtn.animate([{ transform:'translateY(0)' }, { transform:'translateY(-6px) scale(1.03)' }, { transform:'translateY(0)' }], { duration:420, easing:'cubic-bezier(.2,.9,.2,1)' });
    // reveal modal
    reveal.classList.remove('hidden');
    reveal.setAttribute('aria-hidden','false');

    // confetti burst around
    const rect = giftBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    const pageX = centerX, pageY = centerY;
    // convert to canvas coords (they share same page)
    fireConfettiToCoord(pageX, pageY, 140);
    // big fireworks around reveal
    new Firework(window.innerWidth*0.25, window.innerHeight*0.18);
    new Firework(window.innerWidth*0.72, window.innerHeight*0.12);
    // play bg music (requires user gesture sometimes; gift click counts)
    ensureMusicPlay();
  });

  // on wish button: big final burst + message animation
  wishBtn.addEventListener('click', ()=> {
    // big confetti
    fireConfettiToCoord(window.innerWidth/2, window.innerHeight/2, 260);
    // big fireworks
    new Firework(window.innerWidth*0.4, window.innerHeight*0.28);
    new Firework(window.innerWidth*0.6, window.innerHeight*0.22);
    // also animate reveal-name into sparkly large title
    const nameEl = document.querySelector('.reveal-name');
    if(nameEl){
      nameEl.style.transition = 'all 700ms cubic-bezier(.2,.9,.2,1)';
      nameEl.style.transform = 'scale(1.16)';
      setTimeout(()=> { nameEl.style.transform = ''; }, 900);
    }
    // play short repeated fireworks for 4 seconds
    const repeat = setInterval(()=> new Firework(Math.random()*fireworksCanvas.width, Math.random()*fireworksCanvas.height*0.35), 420);
    setTimeout(()=> clearInterval(repeat), 4200);

    // final text-to-sparkle banner via simple DOM overlay
    showFinalBanner();
  });

  closeBtn.addEventListener('click', ()=> {
    reveal.classList.add('hidden');
    reveal.setAttribute('aria-hidden','true');
    // small cooldown
    // optionally pause music
    try{ bgMusic.pause(); }catch(e){}
  });

  /* helper to fire confetti with page coords -> canvas coords */
  function fireConfettiToCoord(pageX, pageY, amount=120){
    // convert page coords to confetti canvas
    const rect = confettiCanvas.getBoundingClientRect();
    const x = pageX - rect.left;
    const y = pageY - rect.top;
    fireConfetti(x,y, amount);
  }

  /* -------------------------
     Final banner / fireworks + Happy Birthday text
  -------------------------*/
  function showFinalBanner(){
    // create banner DOM overlay
    const banner = document.createElement('div');
    banner.className = 'final-banner';
    banner.style.cssText = `
      position:fixed; left:50%; top:8vh; transform:translateX(-50%); z-index:9999;
      background:linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12));
      padding:14px 22px; border-radius:14px; box-shadow:0 18px 50px rgba(16,24,40,0.16);
      backdrop-filter: blur(6px);
      display:flex; flex-direction:column; align-items:center; gap:8px;
    `;
    const heading = document.createElement('div');
    heading.innerHTML = `<div style="font-weight:800; font-size:clamp(18px,2.8vw,32px); letter-spacing:0.6px; background: linear-gradient(90deg,#ff8cc6,#ffd166,#7ce7ff); -webkit-background-clip:text; color:transparent; text-shadow:0 8px 40px rgba(255,182,193,0.12);">🎆 Happy Birthday Priyadarshini 💖</div>`;
    banner.appendChild(heading);
    document.body.appendChild(banner);

    // fireworks + confetti cascade
    for(let i=0;i<6;i++){
      setTimeout(()=> {
        new Firework(Math.random()*fireworksCanvas.width, Math.random()*fireworksCanvas.height*0.3);
        fireConfettiToCoord(Math.random()*window.innerWidth, window.innerHeight*0.35 + Math.random()*80, 100);
      }, i*450);
    }

    // remove banner after 7 seconds
    setTimeout(()=> banner.remove(), 7500);
  }

  /* -------------------------
     Small utility: ensure canvases sized correctly on load
  -------------------------*/
  setTimeout(resizeCanvases, 120);
  // on load user gesture hint for autoplay: click gift will trigger

  /* -------------------------
     accessibility: keyboard open
  -------------------------*/
  giftBtn.addEventListener('keyup', (e) => {
    if(e.key === 'Enter' || e.key === ' ') giftBtn.click();
  });
  wishBtn?.addEventListener('keyup', (e)=>{ if(e.key==='Enter') wishBtn.click(); });

  // expose some functions globally for debugging (optional)
  window._Birthday = { fireConfettiToCoord, Firework };

})();
