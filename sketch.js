/* 1. Helper Functions, Loops & Color Palette
   Original Code & Art Direction (Khanh Doan - s4135658): Written from scratch by the author. Coded the core array-generation loop (createList), random utility functions (getRandInt, chooseOne), and color palette and thematic text arrays. */

function getRandInt(minVal, maxVal) {
  return Math.floor(minVal + (maxVal - minVal) * Math.random());
}

function chooseOne(list) {
  return list[getRandInt(0, list.length)];
}

function createList(total, itemBuilder) {
  let arr = [];
  for (let i = 0; i < total; i++) {
    arr.push(itemBuilder(i));
  }
  return arr;
}

const BG_BASE = [205, 210, 218];
const LINE_COLOR = [18, 15, 28];
const WHITE_INK = [250, 252, 255];

const IRIDESCENT_CLOUDS = [
  [175, 255, 20],   // 1. Radioactive Acid Lime
  [245, 65, 205],   // 2. Holographic Magenta Pink
  [85, 235, 245],   // 3. Icy Cyan / Aqua
  [155, 95, 245],   // 4. Deep Violet Mist
  [255, 190, 95]    // 5. Warm Amber / Peach
];

const THREAD_PALETTE = [
  [255, 20, 175],   // Magenta Glow
  [135, 45, 255],   // Violet Glow
  [0, 215, 255],    // Cyan Glow
  [255, 95, 45]     // Orange-Coral Glow
];

const FLOW_WORDS = ["GRASP", "THE", "FLOW", "BE", "FLUID"];
const RING_CHARS = "WITHOUT LABOR // WITHOUT LABOR // ".split("");

/* 2. Data Initialization & Point Cloud Arrays
   Original Code & Parameter Design (Khanh Doan - s4135658): Structured and initialized all data arrays using the custom createList() loop to control spatial distribution, randomized coordinates, and visual hierarchy between the "WITHOUT LABOR" hardware layer and "BE FLUID" particles.
   Key Developments & Refinements:
   + Added custom wave frequencies (w1, w2, phase, rot) to bgClouds and bgGlows.
   + Tuned padList (26 banks) and glitchLaborList (12 clusters) to balance density.
   + Configured multi-scale typography (sz: [9, 15, 26, 42, 60]) and inkAlpha. */

const CHIP_SIZES = [50, 70, 95, 130, 165];
const PAD_SIZES = [6, 9, 12];
const TRACE_WEIGHTS = [0.35, 0.65];

let bgClouds = createList(32, i => ({
  x: getRandInt(50, 1850),
  y: getRandInt(50, 1020),
  r: getRandInt(140, 360),
  col: chooseOne(IRIDESCENT_CLOUDS),
  w1: getRandInt(2, 5),
  w2: getRandInt(3, 7),
  phase: Math.random() * 6.28,
  rot: Math.random() * 3.14
}));

let bgGlows = createList(10, i => ({
  x: getRandInt(150, 1750),
  y: getRandInt(150, 930),
  r: getRandInt(110, 240),
  col: chooseOne(IRIDESCENT_CLOUDS),
  w1: getRandInt(2, 4),
  w2: getRandInt(3, 6),
  phase: Math.random() * 6.28,
  rot: Math.random() * 3.14
}));

let hatchFeatures = createList(8, i => ({
  x: getRandInt(180, 1740),
  y: getRandInt(160, 920),
  size: getRandInt(90, 180)
}));

let traceList = createList(160, i => ({
  x: getRandInt(80, 1820),
  y: getRandInt(80, 1000),
  z1: getRandInt(0, 75),
  z2: getRandInt(20, 110),
  len1: getRandInt(20, 180),
  diag: getRandInt(20, 110) * (i % 2 === 0 ? 1 : -1),
  len2: getRandInt(20, 180),
  weight: chooseOne(TRACE_WEIGHTS)
}));

let padList = createList(70, i => ({
  x: getRandInt(80, 1820),
  y: getRandInt(80, 1000),
  z: getRandInt(15, 60),
  count: getRandInt(3, 7),
  boxW: chooseOne(PAD_SIZES),
  boxH: getRandInt(18, 45),
  isVertical: getRandInt(0, 2) === 0
}));

// Development
let chipList = createList(14, i => {
  let baseW = chooseOne(CHIP_SIZES);
  return {
    x: getRandInt(140, 1720),
    y: getRandInt(140, 900),
    z: getRandInt(20, 95),
    w: baseW,
    h: Math.floor(baseW * chooseOne([0.75, 1.0, 1.3])),
    depth: getRandInt(40, 105),
    cut: Math.floor(baseW * 0.28),
    shiftX: getRandInt(-22, 22),
    shiftY: getRandInt(-22, 22),
    slices: getRandInt(3, 6),
    pinStep: baseW > 80 ? 12 : 8,
    isWhiteBlueprint: i % 3 === 0
  };
});

let glitchLaborList = createList(12, i => ({
  x: getRandInt(140, 1720),
  y: getRandInt(140, 900),
  sz: chooseOne([9, 15, 26, 42, 60]),
  ringTextSz: chooseOne([7, 9, 12, 15]),
  style: i % 3,
  radius: getRandInt(55, 165),
  waveFreq: getRandInt(2, 5),
  waveAmp: getRandInt(18, 45),
  phase: Math.random() * 6.28,
  repeats: getRandInt(5, 11)
}));

let humanParticles = createList(85, i => ({
  x: getRandInt(50, 1870),
  y: getRandInt(50, 1030),
  size: chooseOne([4, 6, 9, 13]),
  swirl: getRandInt(-115, 115),
  col: chooseOne(THREAD_PALETTE),
  word: chooseOne(FLOW_WORDS),
  showWord: i % 2 === 0,
  textSize: chooseOne([10, 12, 14, 16]),
  inkAlpha: getRandInt(145, 205)
}));

/* 3. Organic Blob & Blueprint Background
   AI-Generated Code Citation: Base polar-to-Cartesian loop and sine/cosine wave formula generated with Google Gemini (2026) [Prompt: "Replace circle() with random wavy organic blob shapes in p5.js"].
   Original Idea & Art Direction (Khanh Doan - s4135658): Inspired by 1990s iridescent Xerox zine aesthetics, replacing rigid circles with organic shapes.
   Student Edits & Basic Developments:
   + Removed solid black circles (void orbs) and concentric ring banding.
   + Adjusted loop count (s = 6) and low alpha values (15, 20) with blendMode(ADD).
   + Tweaked elliptical ratios (1.25, 0.85), strokeWeight (0.45, 0.6), and border ticks. */

function drawOrganicBlob(b, scaleRatio, alphaVal) {
  fill(b.col[0], b.col[1], b.col[2], alphaVal);
  beginShape();
  for (let a = 0; a < Math.PI * 2; a += 0.22) {
    let wave = 1 + 0.28 * Math.sin(a * b.w1 + b.phase) + 0.16 * Math.cos(a * b.w2 - b.phase);
    let rad = b.r * scaleRatio * wave;
    let px = b.x + Math.cos(a + b.rot) * rad * 1.25;
    let py = b.y + Math.sin(a + b.rot) * rad * 0.85;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function drawSoftCloud(c) {
  noStroke();
  for (let s = 6; s >= 1; s--) {
    drawOrganicBlob(c, s * 0.2, 15);
  }
}

function drawBackgroundGlow(g) {
  noStroke();
  for (let s = 6; s >= 1; s--) {
    drawOrganicBlob(g, s * 0.18, 20);
  }
}

function drawHatchElement(f) {
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 85);
  strokeWeight(0.45);
  for (let k = 0; k < f.size; k += 7) {
    line(f.x + k, f.y, f.x, f.y + k);
  }
}

function drawBlueprintBorder() {
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 160);
  strokeWeight(0.6);
  noFill();
  rect(28, 28, width - 56, height - 56);
  for (let y = 40; y < height - 40; y += 12) {
    let tickLen = (y % 60 === 0) ? 15 : 6;
    line(28, y, 28 + tickLen, y);
    line(width - 28, y, width - 28 - tickLen, y);
  }
}

function drawArtBackground() {
  background(BG_BASE);
  for (let i = 0; i < bgClouds.length; i++) drawSoftCloud(bgClouds[i]);
  blendMode(ADD);
  for (let i = 0; i < bgGlows.length; i++) drawBackgroundGlow(bgGlows[i]);
  blendMode(BLEND);
  for (let i = 0; i < hatchFeatures.length; i++) drawHatchElement(hatchFeatures[i]);
  drawBlueprintBorder();
}

/* 4. Custom Axonometric 3D Engine
   AI-Generated Code Citation: 2D axonometric projection math (proj3D) and 6-point polygon array generated with Google Gemini (2026) [Prompt: "Fix WEBGL infinite loop error by projecting 3D boxes on 2D canvas and make the square boxes look like strange circuit monoliths"].
   Original Idea & Art Direction (Khanh Doan - s4135658): Conceptualized the "WITHOUT LABOR" mechanical layer as surreal, non-generic 3D PCB structures.
   Student Edits & Basic Developments:
   + Thinned all strokeWeight values (0.3, 0.4, 0.45, 0.85) for micro-etched lines.
   + Customized chamfer cut ratio (0.28), layer shifting (shiftX, shiftY), and secondary sub-die plates (pad = c.w * 0.22) inside drawGpuChip3D. */

function proj3D(x, y, z) {
  return { px: x - z * 0.55, py: y - z * 0.75 };
}

function drawWireBox3D(x, y, z, w, h, d, strokeCol, fillTopAlpha) {
  let b1 = proj3D(x, y, z), b2 = proj3D(x + w, y, z);
  let b3 = proj3D(x + w, y + h, z), b4 = proj3D(x, y + h, z);
  let t1 = proj3D(x, y, z + d), t2 = proj3D(x + w, y, z + d);
  let t3 = proj3D(x + w, y + h, z + d), t4 = proj3D(x, y + h, z + d);
  stroke(strokeCol[0], strokeCol[1], strokeCol[2], 165);
  noFill();
  quad(b1.px, b1.py, b2.px, b2.py, b3.px, b3.py, b4.px, b4.py);
  line(b1.px, b1.py, t1.px, t1.py);
  line(b2.px, b2.py, t2.px, t2.py);
  line(b3.px, b3.py, t3.px, t3.py);
  line(b4.px, b4.py, t4.px, t4.py);
  if (fillTopAlpha > 0) fill(strokeCol[0], strokeCol[1], strokeCol[2], fillTopAlpha);
  quad(t1.px, t1.py, t2.px, t2.py, t3.px, t3.py, t4.px, t4.py);
}

function drawWaferPlate3D(x, y, z, w, h, cut, col, fillAlpha) {
  let pts = [
    proj3D(x + cut, y, z), proj3D(x + w, y, z),
    proj3D(x + w, y + h - cut, z), proj3D(x + w - cut, y + h, z),
    proj3D(x, y + h, z), proj3D(x, y + cut, z)
  ];
  stroke(col[0], col[1], col[2], 185);
  if (fillAlpha > 0) fill(col[0], col[1], col[2], fillAlpha);
  else noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) vertex(pts[i].px, pts[i].py);
  endShape(CLOSE);
}

function drawInternalCircuitry3D(c, col) {
  stroke(col[0], col[1], col[2], 150);
  strokeWeight(0.45);
  for (let off = c.cut; off < c.w - 6; off += c.pinStep) {
    let pTop = proj3D(c.x + off, c.y + off * 0.4, c.z + c.depth * 1.15);
    let pMid = proj3D(c.x + off, c.y + c.h * 0.5, c.z + c.depth * 0.5);
    let pBot = proj3D(c.x + off - 10, c.y - 12, 0);
    line(pTop.px, pTop.py, pMid.px, pMid.py);
    line(pMid.px, pMid.py, pBot.px, pBot.py);
    circle(pTop.px, pTop.py, 2.5);
  }
}

function drawGpuChip3D(c) {
  let mainCol = c.isWhiteBlueprint ? WHITE_INK : LINE_COLOR;
  drawInternalCircuitry3D(c, mainCol);
  for (let s = 0; s < c.slices; s++) {
    let ratio = s / (c.slices - 1);
    let sx = c.x + ratio * c.shiftX, sy = c.y + ratio * c.shiftY;
    let sz = c.z + ratio * c.depth;
    strokeWeight(s === c.slices - 1 ? 0.85 : 0.45);
    drawWaferPlate3D(sx, sy, sz, c.w, c.h, c.cut, mainCol, s === 1 ? 45 : 8);
    let pad = c.w * 0.22;
    drawWaferPlate3D(sx + pad, sy + pad * 0.6, sz + 6, c.w * 0.5, c.h * 0.5, c.cut * 0.4, mainCol, s === c.slices - 1 ? 65 : 0);
  }
}

function drawTrace3D(t) {
  let p1 = proj3D(t.x, t.y, t.z1), p2 = proj3D(t.x + t.len1, t.y, t.z1);
  let midX = t.x + t.len1 + Math.abs(t.diag), endY = t.y + t.diag;
  let p3 = proj3D(midX, endY, t.z2), p4 = proj3D(midX + t.len2, endY, t.z2);
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 145);
  strokeWeight(t.weight);
  noFill();
  beginShape();
  vertex(p1.px, p1.py);
  vertex(p2.px, p2.py);
  vertex(p3.px, p3.py);
  vertex(p4.px, p4.py);
  endShape();
  strokeWeight(0.3);
  line(p1.px, p1.py, t.x, t.y);
  circle(p1.px, p1.py, 2.5);
}

function drawPadBank3D(p) {
  strokeWeight(0.4);
  let gap = p.boxW + 7;
  for (let i = 0; i < p.count; i++) {
    let px = p.isVertical ? p.x : p.x + i * gap;
    let py = p.isVertical ? p.y + i * gap : p.y;
    drawWireBox3D(px, py, p.z, p.boxW, p.boxW, p.boxH, LINE_COLOR, 18);
  }
}

/* 5. Algorithmic "WITHOUT LABOR" Typography & Additive Neural Threads
   Original Code & Art Direction (Khanh Doan - s4135658): Designed and coded
     the typographic styles (drawBarcodeStretch, drawMicroWaveText, drawAlgorithmicLabor),
     the multi-strand Bezier thread bundles (drawThreadBundle), the distance-based
     connection loops (connectPeerThreads, connectChipThreads), glowing particle
     nodes (drawGlowingDot), and foreground text labels (drawParticleWord).
   - Key Developments & Refinements by Author:
     + Removed the white text outline (noStroke) on particle words and softened
       the text fill to muted dark violet ([35, 30, 52, p.inkAlpha]).
     + Replaced black node centers with glowing white cores ([255, 255, 255, 220]).
   - AI-Generated Code Citation: Sine-modulated polar coordinate math (rWave,
     translate, and rotate) in drawOrbitalLabor() generated with Google Gemini (2026)
     to warp the circular text into an organic wavy contour. */

function drawOrbitalLabor(g) {
  noStroke();
  fill(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 140);
  textSize(g.ringTextSz);
  let stepAng = (Math.PI * 2) / RING_CHARS.length;
  for (let i = 0; i < RING_CHARS.length; i++) {
    let ang = i * stepAng;
    let rWave = g.radius + Math.sin(ang * g.waveFreq + g.phase) * g.waveAmp;
    push();
    translate(g.x + Math.cos(ang) * rWave * 1.2, g.y + Math.sin(ang) * rWave * 0.85);
    rotate(ang + Math.PI / 2 + Math.cos(ang * g.waveFreq) * 0.35);
    text(RING_CHARS[i], 0, 0);
    pop();
  }
}

function drawBarcodeStretch(g) {
  push();
  translate(g.x, g.y);
  scale(0.65, 5.2);
  noFill();
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 115);
  strokeWeight(0.4);
  text("WITHOUT LABOR", 0, 0);
  pop();
}

function drawMicroWaveText(g) {
  noFill();
  strokeWeight(0.4);
  let stepGap = Math.max(6, g.sz * 0.32);
  for (let r = 0; r < g.repeats; r++) {
    stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 140 - r * 11);
    let stepX = g.x + Math.sin(r * 0.6) * 22;
    let stepY = g.y + r * stepGap;
    text("WITHOUT LABOR", stepX, stepY);
  }
}

function drawAlgorithmicLabor(g) {
  textFont("monospace");
  textStyle(NORMAL);
  textSize(g.sz);
  if (g.style === 0) drawOrbitalLabor(g);
  else if (g.style === 1) drawBarcodeStretch(g);
  else drawMicroWaveText(g);
}

function drawThreadBundle(x1, y1, x2, y2, col, swirl, alphaVal) {
  noFill();
  for (let s = -3; s <= 3; s++) {
    strokeWeight(s === 0 ? 1.1 : 0.4);
    stroke(col[0], col[1], col[2], s === 0 ? alphaVal * 1.6 : alphaVal * 0.65);
    let spread = s * 14;
    let cx1 = x1 + (x2 - x1) * 0.3 + swirl + spread;
    let cy1 = y1 + (y2 - y1) * 0.3 - swirl + spread;
    let cx2 = x1 + (x2 - x1) * 0.7 - swirl + spread;
    let cy2 = y1 + (y2 - y1) * 0.7 + swirl - spread;
    bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
  }
}

function connectPeerThreads(idx) {
  let p1 = humanParticles[idx];
  for (let j = idx + 1; j < humanParticles.length; j++) {
    let p2 = humanParticles[j];
    if (dist(p1.x, p1.y, p2.x, p2.y) < 330) {
      drawThreadBundle(p1.x, p1.y, p2.x, p2.y, p1.col, p1.swirl, 45);
    }
  }
}

function connectChipThreads(p) {
  for (let k = 0; k < chipList.length; k++) {
    let c = chipList[k];
    let topCenter = proj3D(c.x + c.w / 2, c.y + c.h / 2, c.z + c.depth);
    if (dist(p.x, p.y, topCenter.px, topCenter.py) < 320) {
      drawThreadBundle(p.x, p.y, topCenter.px, topCenter.py, p.col, p.swirl, 65);
    }
  }
}

function drawGlowingDot(p) {
  noFill();
  stroke(p.col[0], p.col[1], p.col[2], 180);
  strokeWeight(0.9);
  circle(p.x, p.y, p.size * 2.2);
  noStroke();
  fill(255, 255, 255, 220);
  circle(p.x, p.y, p.size * 0.9);
}

function drawParticleWord(p) {
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 120);
  strokeWeight(0.5);
  line(p.x + 6, p.y - 6, p.x + 16, p.y - 14);
  noStroke();
  fill(35, 30, 52, p.inkAlpha);
  textFont("monospace");
  textStyle(NORMAL);
  textSize(p.textSize);
  text(p.word, p.x + 19, p.y - 11);
}

/* 6. Main p5.js Execution Loop (Setup, Draw & Full-Screen Controls)
   - Original Code & Layering Architecture (Khanh Doan - s4135658): Coded the main setup() and draw() execution loops, structuring the rendering order so that blendMode(ADD) illuminates intersecting neural threads while keeping "GRASP THE FLOW, BE FLUID" legible in blendMode(BLEND) on top. */

function setup() {
  pixelDensity(1);
  smooth();
  createCanvas(1920, 1080);
  noLoop();
}

function draw() {
  drawArtBackground();

  for (let i = 0; i < traceList.length; i++) drawTrace3D(traceList[i]);
  for (let i = 0; i < padList.length; i++) drawPadBank3D(padList[i]);
  for (let i = 0; i < chipList.length; i++) drawGpuChip3D(chipList[i]);

  for (let i = 0; i < glitchLaborList.length; i++) {
    drawAlgorithmicLabor(glitchLaborList[i]);
  }

  blendMode(ADD);
  for (let i = 0; i < humanParticles.length; i++) {
    connectPeerThreads(i);
    connectChipThreads(humanParticles[i]);
    drawGlowingDot(humanParticles[i]);
  }
  blendMode(BLEND);

  for (let i = 0; i < humanParticles.length; i++) {
    if (humanParticles[i].showWord) drawParticleWord(humanParticles[i]);
  }
}

function doubleClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
}
