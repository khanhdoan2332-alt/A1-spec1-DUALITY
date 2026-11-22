/* 1. Helper Functions, Dynamic Golden Ratio Layouts & Color Palette
   Original Code & Art Direction (Khanh Doan - s4135658): Written from scratch by the author. Coded the core array-generation loop (createList), random utility functions (getRandInt, chooseOne), and color palette and thematic text array.
   AI-Generated Code Citation: Dynamic Golden Ratio composition presets (COMPOSITION_MODES, ACTIVE_LAYOUT), triangular focal bias (getBiasedPoint), and parametric cubic Bezier leading-line curve (getCurvePoint) generated with Google Gemini (2026) so each reload generates a distinct visual hierarchy and eye-flow structure. */

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

const PHI = 1.618;
const PHI_X_LEFT = Math.round(1920 * (1 - 1 / PHI));
const PHI_X_RIGHT = Math.round(1920 / PHI);
const PHI_Y_TOP = Math.round(1080 * (1 - 1 / PHI));
const PHI_Y_BOT = Math.round(1080 / PHI);

const COMPOSITION_MODES = [
  {
    splitX: PHI_X_LEFT,
    main: { x: PHI_X_RIGHT, y: PHI_Y_BOT },
    sec: { x: 470, y: 340 },
    tert: { x: 1620, y: 260 },
    curve: [
      { x: 160, y: 910 },
      { x: 560, y: 340 },
      { x: 1240, y: 760 },
      { x: 1760, y: 180 }
    ]
  },
  {
    splitX: PHI_X_RIGHT,
    main: { x: PHI_X_LEFT, y: PHI_Y_TOP },
    sec: { x: 1460, y: 760 },
    tert: { x: 320, y: 820 },
    curve: [
      { x: 1760, y: 170 },
      { x: 1280, y: 720 },
      { x: 680, y: 310 },
      { x: 160, y: 880 }
    ]
  },
  {
    splitX: PHI_X_LEFT,
    main: { x: PHI_X_RIGHT, y: PHI_Y_TOP },
    sec: { x: 520, y: 740 },
    tert: { x: 1600, y: 820 },
    curve: [
      { x: 180, y: 860 },
      { x: 640, y: 180 },
      { x: 1320, y: 220 },
      { x: 1760, y: 860 }
    ]
  },
  {
    splitX: PHI_X_RIGHT,
    main: { x: PHI_X_LEFT, y: PHI_Y_BOT },
    sec: { x: 1420, y: 320 },
    tert: { x: 340, y: 220 },
    curve: [
      { x: 1740, y: 890 },
      { x: 1580, y: 180 },
      { x: 360, y: 190 },
      { x: PHI_X_LEFT, y: PHI_Y_BOT }
    ]
  }
];

function buildActiveLayout() {
  let base = chooseOne(COMPOSITION_MODES);
  let jx = getRandInt(-45, 45);
  let jy = getRandInt(-35, 35);
  return {
    splitX: base.splitX,
    main: { x: base.main.x + jx, y: base.main.y + jy },
    sec: { x: base.sec.x - Math.round(jx * 0.6), y: base.sec.y - Math.round(jy * 0.6) },
    tert: { x: base.tert.x + getRandInt(-40, 40), y: base.tert.y + getRandInt(-30, 30) },
    curve: base.curve.map(pt => ({
      x: Math.max(90, Math.min(1830, pt.x + getRandInt(-55, 55))),
      y: Math.max(90, Math.min(990, pt.y + getRandInt(-45, 45)))
    }))
  };
}

const ACTIVE_LAYOUT = buildActiveLayout();
const FOCAL_MAIN = ACTIVE_LAYOUT.main;
const FOCAL_SEC = ACTIVE_LAYOUT.sec;
const FOCAL_TERT = ACTIVE_LAYOUT.tert;

function getBiasedPoint(cx, cy, spreadX, spreadY) {
  let bx = cx + (Math.random() + Math.random() - 1) * spreadX;
  let by = cy + (Math.random() + Math.random() - 1) * spreadY;
  return {
    x: Math.max(70, Math.min(1840, Math.round(bx))),
    y: Math.max(70, Math.min(1000, Math.round(by)))
  };
}

function getCurvePoint(t) {
  let u = 1 - t;
  let p = ACTIVE_LAYOUT.curve;
  let x = u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x;
  let y = u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y;
  return { x: x, y: y };
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

const DOMINANT_THREAD_COL = chooseOne(THREAD_PALETTE);
const FLOW_WORDS = ["WORK", "WITH", "CHANGE", "NOT AGAINST", "IT"];

/* 2. Data Initialization & Composition-Driven Point Cloud Arrays
   Original Code & Parameter Design (Khanh Doan - s4135658): Structured and initialized all data arrays using the custom createList() loop to control spatial distribution, randomized coordinates, and visual hierarchy between the hardware layer and "WORK WITH CHANGE, NOT AGAINST IT" particles.
   Key Developments & Refinements:
   + Added custom wave frequencies (w1, w2, phase, rot) to bgClouds and bgGlows and aligned atmospheric layers across the active leading-line curve and focal anchors.
   + Applied focal gravity and power-law scale hierarchy to chipList and padList across the active Golden Ratio hubs, then generated traceList as an interconnected network of chip-anchored, bridge, and branching 45-degree traces with Golden Ratio bend proportions and breakthrough lengths.
   + Weighted humanParticles with a reload-specific dominant accent color (DOMINANT_THREAD_COL) along the active leading line so neural threads weave through the 3D hardware structures. */

const PAD_SIZES = [6, 9, 12];
const TRACE_WEIGHTS = [0.35, 0.65];

let bgClouds = createList(32, i => {
  let pt = i < 22
    ? (() => {
        let c = getCurvePoint((i + 0.5) / 22);
        return getBiasedPoint(c.x, c.y, 290, 240);
      })()
    : { x: getRandInt(90, 1830), y: getRandInt(90, 990) };
  return {
    x: pt.x,
    y: pt.y,
    r: getRandInt(145, 355),
    col: chooseOne(IRIDESCENT_CLOUDS),
    w1: getRandInt(2, 5),
    w2: getRandInt(3, 7),
    phase: Math.random() * 6.28,
    rot: Math.random() * 3.14
  };
});

let bgGlows = createList(12, i => {
  let anchor = i < 6 ? FOCAL_MAIN : (i < 9 ? FOCAL_SEC : FOCAL_TERT);
  let pt = getBiasedPoint(anchor.x, anchor.y, 290, 230);
  return {
    x: pt.x,
    y: pt.y,
    r: getRandInt(120, 250),
    col: chooseOne(IRIDESCENT_CLOUDS),
    w1: getRandInt(2, 4),
    w2: getRandInt(3, 6),
    phase: Math.random() * 6.28,
    rot: Math.random() * 3.14
  };
});

let hatchFeatures = createList(9, i => {
  let anchor = i < 4 ? FOCAL_MAIN : (i < 7 ? FOCAL_SEC : FOCAL_TERT);
  let pt = getBiasedPoint(anchor.x, anchor.y, 440, 320);
  return {
    x: pt.x,
    y: pt.y,
    size: getRandInt(85, 175)
  };
});

let padList = createList(70, i => {
  let pt;
  if (i < 35) pt = getBiasedPoint(FOCAL_MAIN.x, FOCAL_MAIN.y, 500, 360);
  else if (i < 55) pt = getBiasedPoint(FOCAL_SEC.x, FOCAL_SEC.y, 430, 320);
  else pt = getBiasedPoint(FOCAL_TERT.x, FOCAL_TERT.y, 380, 280);
  return {
    x: pt.x,
    y: pt.y,
    z: getRandInt(15, 60),
    count: getRandInt(3, 7),
    boxW: chooseOne(PAD_SIZES),
    boxH: getRandInt(18, 45),
    isVertical: getRandInt(0, 2) === 0
  };
});

let chipList = createList(16, i => {
  let baseW;
  let pt;
  if (i < 2) {
    baseW = chooseOne([155, 175]);
    pt = getBiasedPoint(FOCAL_MAIN.x, FOCAL_MAIN.y, 175, 125);
  } else if (i < 7) {
    baseW = chooseOne([90, 115, 130]);
    let c = getCurvePoint(0.18 + (i - 2) * 0.16);
    pt = getBiasedPoint(c.x, c.y, 200, 160);
  } else {
    baseW = chooseOne([48, 64, 78]);
    let anchor = i % 3 === 0 ? FOCAL_MAIN : (i % 3 === 1 ? FOCAL_SEC : FOCAL_TERT);
    pt = getBiasedPoint(anchor.x, anchor.y, 420, 310);
  }
  return {
    x: pt.x,
    y: pt.y,
    z: getRandInt(20, 95),
    w: baseW,
    h: Math.floor(baseW * chooseOne([0.75, 1.0, 1.25])),
    depth: getRandInt(40, 105),
    cut: Math.floor(baseW * 0.28),
    shiftX: getRandInt(-22, 22),
    shiftY: getRandInt(-22, 22),
    slices: getRandInt(3, 6),
    pinStep: baseW > 80 ? 12 : 8,
    isWhiteBlueprint: i % 3 === 0
  };
});

function buildTraceNetwork() {
  let list = [];

  for (let i = 0; i < 68; i++) {
    let c = i < 24 ? chipList[i % 7] : chooseOne(chipList);
    let dirX = Math.random() < 0.5 ? 1 : -1;
    let startX = dirX > 0 ? c.x + c.w : c.x;
    let startY = c.y + getRandInt(6, Math.max(10, c.h - 6));
    let isHero = i < 16;
    let len1 = isHero ? getRandInt(80, 240) : getRandInt(24, 130);
    let diag = isHero ? getRandInt(45, 135) : getRandInt(22, 90);
    let diagSign = Math.random() < 0.5 ? 1 : -1;
    let len2 = isHero ? getRandInt(120, 320) : getRandInt(35, 165);
    let x2 = startX + dirX * len1;
    let x3 = x2 + dirX * diag;
    let y3 = startY + diagSign * diag;
    let x4 = x3 + dirX * len2;
    list.push({
      x1: startX, y1: startY,
      x2: x2, y2: startY,
      x3: x3, y3: y3,
      x4: x4, y4: y3,
      z: c.z,
      weight: isHero ? 0.78 : chooseOne(TRACE_WEIGHTS),
      alpha: isHero ? 170 : 135
    });
  }

  for (let i = 0; i < chipList.length; i++) {
    let c = chipList[i];
    let ax = c.x + c.w * 0.5;
    let ay = c.y + c.h * 0.5;
    let links = 0;
    for (let j = 0; j < padList.length && links < 3; j++) {
      let p = padList[j];
      let dx = p.x - ax;
      let dy = p.y - ay;
      let absDx = Math.abs(dx);
      let absDy = Math.abs(dy);
      if (absDx > absDy + 24 && absDx < 520 && absDy < 260) {
        let dirX = dx >= 0 ? 1 : -1;
        let sx = dirX > 0 ? c.x + c.w : c.x;
        let sy = Math.max(c.y + 6, Math.min(c.y + c.h - 6, p.y - dy * 0.35));
        let ndx = p.x - sx;
        let ndy = p.y - sy;
        if (Math.abs(ndx) > Math.abs(ndy) + 12) {
          let remX = Math.abs(ndx) - Math.abs(ndy);
          let ratio = chooseOne([0.382, 0.618]);
          let x2 = sx + dirX * remX * ratio;
          let x3 = x2 + dirX * Math.abs(ndy);
          list.push({
            x1: sx, y1: sy,
            x2: x2, y2: sy,
            x3: x3, y3: p.y,
            x4: p.x, y4: p.y,
            z: c.z,
            weight: 0.52,
            alpha: 155
          });
          links++;
        }
      }
    }
  }

  let baseCount = list.length;
  for (let i = 0; i < 42; i++) {
    let parent = list[getRandInt(0, baseCount)];
    let fromEnd = Math.random() < 0.55;
    let sx = fromEnd ? parent.x3 : parent.x2;
    let sy = fromEnd ? parent.y3 : parent.y2;
    let dirX = parent.x4 >= parent.x1 ? 1 : -1;
    let diagSign = parent.y3 >= parent.y1 ? -1 : 1;
    let len1 = getRandInt(18, 95);
    let diag = getRandInt(24, 95);
    let len2 = getRandInt(40, 185);
    let x2 = sx + dirX * len1;
    let x3 = x2 + dirX * diag;
    let y3 = sy + diagSign * diag;
    let x4 = x3 + dirX * len2;
    list.push({
      x1: sx, y1: sy,
      x2: x2, y2: sy,
      x3: x3, y3: y3,
      x4: x4, y4: y3,
      z: parent.z,
      weight: 0.38,
      alpha: 125
    });
  }

  return list;
}

let traceList = buildTraceNetwork();

let humanParticles = createList(90, i => {
  let pt;
  if (i < 72) {
    let t = 0.02 + (i / 71) * 0.96;
    let c = getCurvePoint(t);
    let spread = 110 + Math.abs(t - 0.5) * 180;
    pt = getBiasedPoint(c.x, c.y, spread, spread * 0.8);
  } else {
    pt = { x: getRandInt(90, 1830), y: getRandInt(90, 990) };
  }
  return {
    x: pt.x,
    y: pt.y,
    size: chooseOne([4, 6, 9, 13]),
    swirl: getRandInt(-115, 115),
    col: Math.random() < 0.45 ? DOMINANT_THREAD_COL : chooseOne(THREAD_PALETTE),
    word: chooseOne(FLOW_WORDS),
    showWord: i % 2 === 0,
    textSize: chooseOne([10, 12, 14, 16]),
    inkAlpha: getRandInt(145, 205)
  };
});

/* 3. Organic Blob, Golden Ratio Guides & Blueprint Background
   AI-Generated Code Citation: Base polar-to-Cartesian loop and sine/cosine wave formula generated with Google Gemini (2026) [Prompt: "Replace circle() with random wavy organic blob shapes in p5.js"].
   Original Idea & Art Direction (Khanh Doan - s4135658): Inspired by 1990s iridescent Xerox zine aesthetics, replacing rigid circles with organic shapes.
   Student Edits & Basic Developments:
   + Removed solid black circles (void orbs) and concentric ring banding.
   + Adjusted loop count (s = 6) and low alpha values (15, 20) with blendMode(ADD).
   + Tweaked elliptical ratios (1.25, 0.85), strokeWeight (0.45, 0.6), border ticks, and dynamic Golden Ratio blueprint construction lines tied to ACTIVE_LAYOUT. */

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

function drawGoldenGuides() {
  noFill();
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 42);
  strokeWeight(0.45);
  line(ACTIVE_LAYOUT.splitX, 28, ACTIVE_LAYOUT.splitX, height - 28);
  line(28, FOCAL_MAIN.y, width - 28, FOCAL_MAIN.y);
  line(FOCAL_MAIN.x, 28, FOCAL_MAIN.x, height - 28);

  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], 55);
  circle(FOCAL_MAIN.x, FOCAL_MAIN.y, 46);
  line(FOCAL_MAIN.x - 14, FOCAL_MAIN.y, FOCAL_MAIN.x + 14, FOCAL_MAIN.y);
  line(FOCAL_MAIN.x, FOCAL_MAIN.y - 14, FOCAL_MAIN.x, FOCAL_MAIN.y + 14);

  circle(FOCAL_SEC.x, FOCAL_SEC.y, 30);
  line(FOCAL_SEC.x - 10, FOCAL_SEC.y, FOCAL_SEC.x + 10, FOCAL_SEC.y);
  line(FOCAL_SEC.x, FOCAL_SEC.y - 10, FOCAL_SEC.x, FOCAL_SEC.y + 10);
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
  drawGoldenGuides();
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
   AI-Generated Code Citation: 2D axonometric projection math (proj3D), 6-point polygon array, and interconnected 45-degree trace bridge routing (buildTraceNetwork) generated with Google Gemini (2026) [Prompt: "Fix WEBGL infinite loop error by projecting 3D boxes on 2D canvas and make the square boxes look like strange circuit monoliths"].
   Original Idea & Art Direction (Khanh Doan - s4135658): Conceptualized the mechanical layer as surreal, non-generic 3D PCB structures.
   Student Edits & Basic Developments:
   + Thinned all strokeWeight values (0.3, 0.4, 0.45, 0.85) for micro-etched lines.
   + Customized chamfer cut ratio (0.28), layer shifting (shiftX, shiftY), and secondary sub-die plates (pad = c.w * 0.22) inside drawGpuChip3D.
   + Updated drawTrace3D to render single-plane 0-degree and 45-degree connected PCB pathways with crisp via-ring terminals. */

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
  let p1 = proj3D(t.x1, t.y1, t.z);
  let p2 = proj3D(t.x2, t.y2, t.z);
  let p3 = proj3D(t.x3, t.y3, t.z);
  let p4 = proj3D(t.x4, t.y4, t.z);
  stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], t.alpha);
  strokeWeight(t.weight);
  noFill();
  beginShape();
  vertex(p1.px, p1.py);
  vertex(p2.px, p2.py);
  vertex(p3.px, p3.py);
  vertex(p4.px, p4.py);
  endShape();
  strokeWeight(0.5);
  circle(p1.px, p1.py, 2.8);
  circle(p4.px, p4.py, 3.4);
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

/* 5. Additive Neural Threads & Particle Typography
   Original Code & Art Direction (Khanh Doan - s4135658): Designed and coded the multi-strand Bezier thread bundles (drawThreadBundle), the distance-based connection loops (connectPeerThreads, connectChipThreads), glowing particle nodes (drawGlowingDot), and foreground text labels (drawParticleWord).
   Key Developments & Refinements:
   + Removed the white text outline (noStroke) on particle words and softened the text fill to muted dark violet ([35, 30, 52, p.inkAlpha]).
   + Replaced black node centers with glowing white cores ([255, 255, 255, 220]). */

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
    if (dist(p1.x, p1.y, p2.x, p2.y) < 320) {
      drawThreadBundle(p1.x, p1.y, p2.x, p2.y, p1.col, p1.swirl, 45);
    }
  }
}

function connectChipThreads(p) {
  for (let k = 0; k < chipList.length; k++) {
    let c = chipList[k];
    let topCenter = proj3D(c.x + c.w / 2, c.y + c.h / 2, c.z + c.depth);
    if (dist(p.x, p.y, topCenter.px, topCenter.py) < 310) {
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
   Original Code & Layering Architecture (Khanh Doan - s4135658): Coded the main setup() and draw() execution loops, structuring the rendering order so that blendMode(ADD) illuminates intersecting neural threads while keeping "WORK WITH CHANGE, NOT AGAINST IT" legible in blendMode(BLEND) on top. */

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
