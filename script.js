
// ==========================================
// CELESTIAL BLOOM — THE BLOOMING UNIVERSE
// ==========================================

// THAY ĐỔI 4 THÔNG ĐIỆP Ở ĐÂY
const messages = [
  {
    title: "Serenity",
    symbol: "✿",
    text: "Mong elm sẽ luôn chừa một khoảng trời bình yên của riêng mình.Tự do, tự tại, làm điều mình thích nhé. Nhó là thích nhưng phải đúng elm nhé"
  },
  {
    title: "Dreams",
    symbol: "✧",
    text: "Luôn gặp những giấc mơ tốt đẹp elm nhé. Dreamcatcher giữ hộ ác mộng rồi này."
  },
  {
    title: "Joy",
    symbol: "❀",
    text: "Vui buòn ai mà chẳng có. Nhưng mà tâm trí nếu vui thì mọi chuyện buồn cũng vơi đi dần đấy."
  },
  {
    title: "Love",
    symbol: "♡",
    text: "Yêuuu elm! Bật chế độ riêng tư tại mục này. "
  }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const rand = (min, max) => Math.random() * (max - min) + min;

let stage = "birth";
let collected = new Set();
let starProgress = 0;
let universeBorn = false;

// ==========================================
// CANVAS — THIÊN HÀ SỐNG
// ==========================================

const canvas = $("#universe");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;
let dpr = 1;

let stars = [];
let dust = [];
let trails = [];
let comets = [];

const pointer = {
  x: W / 2,
  y: H / 2,
  lastX: W / 2,
  lastY: H / 2,
  active: false
};

function resizeCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createStarfield();
}

window.addEventListener("resize", resizeCanvas);

function createStarfield() {
  const count = Math.min(330, Math.floor(W * H / 2600));

  stars = Array.from({ length: count }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(.3, 2),
    phase: rand(0, Math.PI * 2),
    speed: rand(.4, 1.8),
    depth: rand(.2, 1),
    hue: rand(260, 350)
  }));

  dust = Array.from({ length: 110 }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(1, 3),
    vx: rand(-.15, .15),
    vy: rand(-.2, .2),
    phase: rand(0, 7)
  }));
}

function drawNebula(time) {
  const cx = W * .5 + Math.sin(time * .00015) * 50;
  const cy = H * .45 + Math.cos(time * .0002) * 40;

  const blobs = [
    [cx, cy, W * .55, "151,80,220", .14],
    [W * .22, H * .7, W * .45, "255,95,175", .09],
    [W * .82, H * .2, W * .42, "102,105,255", .12]
  ];

  blobs.forEach(([x, y, radius, rgb, alpha]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(.4, `rgba(${rgb},${alpha * .35})`);
    g.addColorStop(1, `rgba(${rgb},0)`);

    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });
}

function drawStars(time) {
  stars.forEach(s => {
    const brightness = .35 + .65 *
      (Math.sin(time * .001 * s.speed + s.phase) + 1) / 2;

    const parallaxX = pointer.active ?
      (pointer.x - W / 2) * s.depth * -.012 : 0;

    const parallaxY = pointer.active ?
      (pointer.y - H / 2) * s.depth * -.012 : 0;

    ctx.beginPath();
    ctx.arc(s.x + parallaxX, s.y + parallaxY,
      s.r * brightness, 0, Math.PI * 2);

    ctx.fillStyle = `hsla(${s.hue},90%,90%,${brightness})`;
    ctx.fill();

    if (s.r > 1.55 && brightness > .8) {
      ctx.strokeStyle = `rgba(255,231,249,${brightness * .35})`;
      ctx.lineWidth = .6;
      ctx.beginPath();
      ctx.moveTo(s.x - 5, s.y);
      ctx.lineTo(s.x + 5, s.y);
      ctx.moveTo(s.x, s.y - 5);
      ctx.lineTo(s.x, s.y + 5);
      ctx.stroke();
    }
  });
}

function drawDust(time) {
  dust.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    const alpha = .2 + .35 *
      (1 + Math.sin(time * .001 + p.phase)) / 2;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,196,234,${alpha})`;
    ctx.fill();
  });
}

function spawnTrail(x, y, amount = 3) {
  for (let i = 0; i < amount; i++) {
    trails.push({
      x, y,
      vx: rand(-1.8, 1.8),
      vy: rand(-1.8, 1.8),
      life: 1,
      decay: rand(.012, .03),
      r: rand(1, 3.8),
      hue: rand(290, 360)
    });
  }

  if (trails.length > 500) {
    trails.splice(0, trails.length - 500);
  }
}

function drawTrails() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = trails.length - 1; i >= 0; i--) {
    const p = trails[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= .98;
    p.vy *= .98;
    p.life -= p.decay;

    if (p.life <= 0) {
      trails.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},100%,85%,${p.life})`;
    ctx.shadowColor = "#ff9fdf";
    ctx.shadowBlur = 15;
    ctx.fill();
  }

  ctx.restore();
}

function spawnComet() {
  comets.push({
    x: rand(-150, W * .7),
    y: rand(-50, H * .4),
    vx: rand(7, 12),
    vy: rand(3, 6),
    life: 1
  });
}

function drawComets() {
  for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];

    c.x += c.vx;
    c.y += c.vy;
    c.life -= .009;

    const gradient = ctx.createLinearGradient(
      c.x, c.y, c.x - c.vx * 15, c.y - c.vy * 15
    );

    gradient.addColorStop(0, `rgba(255,245,225,${c.life})`);
    gradient.addColorStop(1, "rgba(255,180,240,0)");

    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x - c.vx * 15, c.y - c.vy * 15);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (c.life <= 0 || c.x > W + 200 || c.y > H + 200) {
      comets.splice(i, 1);
    }
  }
}

let lastFrame = 0;
let cometTime = 0;

function animate(time) {
  requestAnimationFrame(animate);

  // Giới hạn tốc độ khung hình để tiết kiệm tài nguyên
  if (time - lastFrame < 16) return;
  lastFrame = time;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#080719";
  ctx.fillRect(0, 0, W, H);

  drawNebula(time);
  drawStars(time);
  drawDust(time);
  drawTrails();
  drawComets();

  if (time - cometTime > 5500 && Math.random() < .025) {
    spawnComet();
    cometTime = time;
  }
}

resizeCanvas();
requestAnimationFrame(animate);

// ==========================================
// CHẠM / DI CHUYỂN ĐỂ VẼ ÁNH SAO
// ==========================================

document.addEventListener("pointermove", event => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;

  $("#cursorGlow").style.left = pointer.x + "px";
  $("#cursorGlow").style.top = pointer.y + "px";

  const distance = Math.hypot(
    pointer.x - pointer.lastX,
    pointer.y - pointer.lastY
  );

  if (distance > 5 && stage !== "birth") {
    spawnTrail(pointer.x, pointer.y, 3);
  }

  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;
});

document.addEventListener("pointerdown", event => {
  if (stage !== "birth") {
    burst(event.clientX, event.clientY, 25);
  }
});

function burst(x, y, count = 60) {
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * i / count;
    const speed = rand(1.5, 8);

    trails.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: rand(.009, .02),
      r: rand(1.5, 4),
      hue: rand(290, 360)
    });
  }
}

// ==========================================
// HẠT MẦM: NHẤN GIỮ ĐỂ KÍCH HOẠT
// ==========================================

const seed = $("#seed");
const ring = $("#progressRing");

let holding = false;
let holdStart = 0;
let holdAnimation = null;
let holdValue = 0;

const HOLD_DURATION = 2000;
const CIRCUMFERENCE = 2 * Math.PI * 79;

function updateHold(value) {
  holdValue = value;
  ring.style.strokeDashoffset =
    CIRCUMFERENCE * (1 - value);

  $("#holdFill").style.width = (value * 100) + "%";
}

function startHold(event) {
  if (universeBorn || holding) return;

  event.preventDefault();
  holding = true;
  holdStart = performance.now();

  seed.classList.add("charging");

  if (event.pointerId !== undefined) {
    try { seed.setPointerCapture(event.pointerId); }
    catch (error) {}
  }

  function tick(now) {
    if (!holding) return;

    const progress = Math.min(
      (now - holdStart) / HOLD_DURATION, 1
    );

    updateHold(progress);

    if (Math.random() < .4) {
      const rect = seed.getBoundingClientRect();
      spawnTrail(
        rect.left + rect.width / 2 + rand(-35, 35),
        rect.top + rect.height / 2 + rand(-35, 35),
        5
      );
    }

    if (progress >= 1) {
      holding = false;
      universeBorn = true;
      birthUniverse();
      return;
    }

    holdAnimation = requestAnimationFrame(tick);
  }

  holdAnimation = requestAnimationFrame(tick);
}

function cancelHold() {
  if (!holding) return;

  holding = false;
  seed.classList.remove("charging");
  cancelAnimationFrame(holdAnimation);
  updateHold(0);
}

seed.addEventListener("pointerdown", startHold);
seed.addEventListener("pointerup", cancelHold);
seed.addEventListener("pointercancel", cancelHold);
seed.addEventListener("lostpointercapture", cancelHold);

seed.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") &&
      !event.repeat) {
    startHold(event);
  }
});

seed.addEventListener("keyup", event => {
  if (event.key === "Enter" || event.key === " ") {
    cancelHold();
  }
});

function birthUniverse() {
  const rect = seed.getBoundingClientRect();

  burst(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    220
  );

  $("#holdHint").textContent =
    "✦ Một vũ trụ mới vừa được sinh ra ✦";

  seed.style.transition = "transform 1s, opacity 1s";
  seed.style.transform = "scale(4)";
  seed.style.opacity = "0";

  playMagicChord();

  setTimeout(() => {
    $("#birth").classList.add("hidden");
    $("#cosmos").classList.remove("hidden");
    stage = "cosmos";
    window.scrollTo(0, 0);
    notify("Chào mừng em đến với vũ trụ của riêng mình ✨");
  }, 1100);
}

// ==========================================
// KHÁM PHÁ CÁC TINH CẦU
// ==========================================

$$(".planet").forEach(planet => {
  planet.addEventListener("click", () => {
    const index = Number(planet.dataset.planet);
    const data = messages[index];

    collected.add(index);
    planet.classList.add("collected");

    $("#planetSymbol").textContent = data.symbol;
    $("#planetTitle").textContent = data.title;
    $("#planetMessage").textContent = data.text;
    $("#planetNumber").textContent =
      String(index + 1).padStart(2, "0") + " / 04";

    $("#planetPanel").classList.remove("hidden");

    $("#starCounter").textContent =
      `✦ ${collected.size} / 4`;

    const rect = planet.getBoundingClientRect();

    burst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      80
    );

    playMagicChord();

    if (collected.size === 4) {
      $("#constellationBtn").disabled = false;
      $("#cosmosHint").textContent =
        "✦ Bốn tinh cầu đã thức giấc. Chòm sao đang chờ em! ✦";
    }
  });
});

function closePlanet() {
  $("#planetPanel").classList.add("hidden");
}

$("#closePlanet").addEventListener("click", closePlanet);
$("#panelBackdrop").addEventListener("click", closePlanet);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePlanet();
});

// ==========================================
// CHÒM SAO — NỐI THEO THỨ TỰ
// ==========================================

$("#constellationBtn").addEventListener("click", () => {
  if (collected.size < 4) return;

  $("#cosmos").classList.add("hidden");
  $("#constellation").classList.remove("hidden");
  stage = "constellation";
  window.scrollTo(0, 0);
});

$("#closeConstellation").addEventListener("click", () => {
  $("#constellation").classList.add("hidden");
  $("#cosmos").classList.remove("hidden");
  stage = "cosmos";
  window.scrollTo(0, 0);
});

// Tọa độ hình trái tim trên bản đồ sao
const starPoints = [
  [300, 344],
  [115, 205],
  [172, 87],
  [300, 153],
  [428, 87],
  [485, 205],
  [300, 344]
];

function updateStarPath() {
  if (starProgress === 0) {
    $("#drawnPath").setAttribute("d", "");
    return;
  }

  const points = starPoints.slice(0, starProgress);

  const d = points.map((point, i) =>
    `${i === 0 ? "M" : "L"} ${point[0]} ${point[1]}`
  ).join(" ");

  $("#drawnPath").setAttribute("d", d);
}

$$(".map-star").forEach(star => {
  star.addEventListener("click", () => {
    const index = Number(star.dataset.star);

    if (index < starProgress) return;

    if (index !== starProgress) {
      notify(`Hãy tìm ngôi sao số ${starProgress + 1} nhé ✧`);
      return;
    }

    star.classList.add("done");
    starProgress++;
    updateStarPath();

    const rect = star.getBoundingClientRect();

    burst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      35
    );

    playNote(440 * Math.pow(2, index / 12), .7);

    if (starProgress === 7) {
      $("#starHint").textContent =
        "♡ Những vì sao đã kết thành một trái tim ♡";

      $("#bloomBtn").classList.remove("hidden");

      setTimeout(() => {
        burst(window.innerWidth / 2,
          window.innerHeight / 2, 120);
      }, 300);
    } else {
      $("#starHint").textContent =
        `✧ Tuyệt lắm! Hãy chạm ngôi sao số ${starProgress + 1} ✧`;
    }
  });
});

// ==========================================
// FINAL BLOOM — HOA THIÊN HÀ NỞ
// ==========================================

function createCosmicFlower() {
  const container = $("#petalContainer");
  container.innerHTML = "";

  const layers = [
    { count: 12, scale: 1, delay: 0 },
    { count: 10, scale: .78, delay: .45 },
    { count: 8, scale: .58, delay: .9 }
  ];

  layers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      const petal = document.createElement("div");
      petal.className = "cosmic-petal";

      const angle = i * (360 / layer.count);
      petal.style.setProperty("--angle", angle + "deg");
      petal.style.setProperty(
        "--delay",
        (layer.delay + i * .065) + "s"
      );

      petal.style.width = (26 * layer.scale) + "%";
      petal.style.height = (43 * layer.scale) + "%";

      container.appendChild(petal);
    }
  });
}

$("#bloomBtn").addEventListener("click", () => {
  $("#constellation").classList.add("hidden");
  $("#finalBloom").classList.remove("hidden");

  stage = "final";
  window.scrollTo(0, 0);

  createCosmicFlower();
  playMagicChord();

  let waves = 0;

  const celebration = setInterval(() => {
    burst(
      rand(W * .2, W * .8),
      rand(H * .15, H * .75),
      90
    );

    waves++;

    if (waves >= 12 || stage !== "final") {
      clearInterval(celebration);
    }
  }, 600);
});

// ==========================================
// CHƠI LẠI
// ==========================================

$("#restartBtn").addEventListener("click", () => {
  $("#finalBloom").classList.add("hidden");
  $("#cosmos").classList.remove("hidden");

  stage = "cosmos";
  window.scrollTo(0, 0);

  notify("Vũ trụ này vẫn luôn nở hoa dành cho em ♡");
});

// ==========================================
// ÂM THANH — GIAI ĐIỆU THIÊN HÀ
// Không cần file nhạc bên ngoài
// ==========================================

let audio = null;
let soundEnabled = false;
let musicInterval = null;
let melodyIndex = 0;

const melody = [
  523.25, 659.25, 783.99, 1046.5,
  880, 783.99, 659.25, 587.33,
  698.46, 880, 783.99, 659.25,
  523.25, 587.33, 659.25, 0
];

function getAudio() {
  if (!audio) {
    const AudioClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) return null;
    audio = new AudioClass();
  }

  return audio;
}

function playNote(freq, duration = .6) {
  if (!soundEnabled || !freq) return;

  const ac = getAudio();
  if (!ac || ac.state !== "running") return;

  const oscillator = ac.createOscillator();
  const gain = ac.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;

  gain.gain.setValueAtTime(.0001, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    .035, ac.currentTime + .04
  );
  gain.gain.exponentialRampToValueAtTime(
    .0001, ac.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(ac.destination);

  oscillator.start();
  oscillator.stop(ac.currentTime + duration + .02);
}

function playMagicChord() {
  if (!soundEnabled) return;

  [523.25, 659.25, 783.99, 1046.5].forEach(
    (freq, i) => {
      setTimeout(() => playNote(freq, 1.4), i * 120);
    }
  );
}

$("#soundBtn").addEventListener("click", async () => {
  const ac = getAudio();

  if (!ac) {
    notify("Trình duyệt chưa hỗ trợ âm thanh.");
    return;
  }

  if (soundEnabled) {
    soundEnabled = false;
    clearInterval(musicInterval);
    musicInterval = null;
    $("#soundBtn").classList.remove("active");
    await ac.suspend();
    return;
  }

  try {
    await ac.resume();
    soundEnabled = true;
    $("#soundBtn").classList.add("active");

    playMagicChord();

    musicInterval = setInterval(() => {
      playNote(melody[melodyIndex], .85);
      melodyIndex = (melodyIndex + 1) % melody.length;
    }, 650);
  } catch (error) {
    notify("Không thể bật âm thanh lúc này.");
  }
});

// ==========================================
// THÔNG BÁO
// ==========================================

let notificationTimer;

function notify(message) {
  const box = $("#notification");
  box.textContent = message;
  box.classList.add("show");

  clearTimeout(notificationTimer);

  notificationTimer = setTimeout(() => {
    box.classList.remove("show");
  }, 2600);
}

// ==========================================
// KHỞI TẠO
// ==========================================

console.log("✦ CELESTIAL BLOOM ✦");
console.log("A little universe, made just for you ♡");
