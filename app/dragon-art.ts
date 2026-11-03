import type { DragonPoint } from "./dragon-flight";

const TAU = Math.PI * 2;

type Context = CanvasRenderingContext2D;

function line(ctx: Context, coordinates: number[][], color: string, width: number) {
  ctx.beginPath();
  coordinates.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function scaleShape(ctx: Context, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x + size, y - size * 0.7);
  ctx.quadraticCurveTo(x - size * 0.2, y - size * 1.2, x - size * 1.25, y);
  ctx.quadraticCurveTo(x - size * 0.2, y + size * 1.2, x + size, y + size * 0.7);
  ctx.quadraticCurveTo(x + size * 1.35, y, x + size, y - size * 0.7);
}

function makeScaleSprites(createCanvas: () => HTMLCanvasElement) {
  return Array.from({ length: 3 }, (_, variant) => {
    const canvas = createCanvas();
    canvas.width = 128;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.translate(64, 80);
    ctx.scale(4, 4);
    const skin = ctx.createLinearGradient(0, -16, 0, 16);
    skin.addColorStop(0, "#fbfcf1");
    skin.addColorStop(0.27, "#e5eeea");
    skin.addColorStop(0.48, "#f8faf3");
    skin.addColorStop(0.77, "#a8c0b9");
    skin.addColorStop(1, "#587e7e");
    ctx.beginPath();
    ctx.ellipse(0, 0, 12.7, 16, 0, 0, TAU);
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.save();
    ctx.clip();
    for (let row = -2; row <= 2; row++) {
      for (let column = -2; column <= 2; column++) {
        const x = column * 6.8 + ((row + variant) % 2) * 3.4;
        const y = row * 5.5;
        scaleShape(ctx, x, y, 3.2 - Math.abs(row) * 0.3);
        ctx.fillStyle = row < 0 ? "#f7faf063" : "#d2dfd533";
        ctx.fill();
        ctx.strokeStyle = "#56767570";
        ctx.lineWidth = 0.34;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 2.4, y - 1.6);
        ctx.quadraticCurveTo(x - 0.5, y - 2.4, x - 2.1, y - 0.5);
        ctx.strokeStyle = "#ffffffa0";
        ctx.lineWidth = 0.42;
        ctx.stroke();
      }
    }
    // Separate ventral plates give the underside a warmer porcelain finish.
    for (let x = -10; x <= 10; x += 5) {
      ctx.beginPath();
      ctx.moveTo(x, 9.5);
      ctx.quadraticCurveTo(x - 3, 12, x - 0.4, 16);
      ctx.strokeStyle = "#687f7860";
      ctx.lineWidth = 0.45;
      ctx.stroke();
    }
    ctx.restore();
    return canvas;
  });
}

function drawTail(ctx: Context, point: DragonPoint, time: number) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(point.angle);
  ctx.scale(point.radius / 5, point.radius / 5);
  for (let strand = -3; strand <= 3; strand++) {
    const drift = Math.sin(time * 1.5 + strand * 0.7) * 3;
    ctx.beginPath();
    ctx.moveTo(8, strand * 0.7);
    ctx.bezierCurveTo(-10, strand * 4, -24, strand * 7 + drift, -47 - Math.abs(strand) * 2, strand * 3 + drift);
    ctx.quadraticCurveTo(-22, strand * 2, 8, strand * 0.7);
    ctx.fillStyle = strand % 2 ? "#dae6df" : "#f6f8ed";
    ctx.fill();
    ctx.strokeStyle = "#9bb1ab90";
    ctx.lineWidth = 0.45;
    ctx.stroke();
  }
  ctx.restore();
}

function drawLeg(ctx: Context, point: DragonPoint, side: number, time: number, rear: boolean) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(point.angle);
  const size = point.radius / 16;
  ctx.scale(size, size * side);
  const flex = Math.sin(time * 1.1 + (rear ? 2.1 : 0)) * 4;
  const elbowX = rear ? -20 : -12;
  const wristX = (rear ? -7 : 4) + flex;
  const limb = ctx.createLinearGradient(-20, 15, 8, 50);
  limb.addColorStop(0, "#f5f8ed");
  limb.addColorStop(0.6, "#c8d8d0");
  limb.addColorStop(1, "#7f9b99");
  ctx.beginPath();
  ctx.moveTo(6, 5);
  ctx.bezierCurveTo(-5, 16, elbowX - 10, 19, elbowX - 3, 32);
  ctx.lineTo(wristX - 6, 47);
  ctx.quadraticCurveTo(wristX + 9, 53, wristX + 14, 44);
  ctx.lineTo(elbowX + 6, 27);
  ctx.quadraticCurveTo(8, 22, 12, 10);
  ctx.closePath();
  ctx.fillStyle = limb;
  ctx.fill();
  ctx.strokeStyle = "#94aaa2";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  line(ctx, [[3, 13], [elbowX - 1, 26], [wristX + 2, 44]], "#fffef0a0", 1.6);
  for (let index = 0; index < 4; index++) {
    scaleShape(ctx, elbowX + 2 + index * 2.8, 30 + index * 3.8, 2.2);
    ctx.strokeStyle = "#6b878370";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  // Four articulated toes, each ending in a curved ivory talon.
  for (let toe = 0; toe < 4; toe++) {
    const spread = (toe - 1.5) * 6;
    const tipX = wristX + 20 - Math.abs(spread) * 0.3;
    const tipY = 46 + spread;
    ctx.beginPath();
    ctx.moveTo(wristX + 1, 43 + spread * 0.25);
    ctx.quadraticCurveTo(wristX + 14, 45 + spread * 0.8, tipX, tipY);
    ctx.strokeStyle = "#bdcec2";
    ctx.lineWidth = 3.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tipX - 2, tipY - 2);
    ctx.quadraticCurveTo(tipX + 9, tipY - 6, tipX + 10, tipY - 11);
    ctx.quadraticCurveTo(tipX + 10, tipY, tipX + 1, tipY + 2);
    ctx.fillStyle = "#f9f8e8";
    ctx.fill();
    ctx.strokeStyle = "#8b9d9190";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();
}

function drawMane(ctx: Context, time: number) {
  for (const side of [-1, 1]) {
    for (let layer = 16; layer >= 0; layer--) {
      const rootX = 7 - layer * 2.1;
      const rootY = side * (11 + layer * 0.5);
      const flutter = Math.sin(time * 1.5 + layer * 0.65 + side) * 4;
      const tipX = -48 - layer * 4;
      const tipY = side * (17 + layer * 1.25 + flutter);
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.bezierCurveTo(rootX - 25, side * (29 + flutter), tipX + 22, tipY + side * 6, tipX, tipY);
      ctx.quadraticCurveTo(tipX + 30, tipY - side * 4, rootX - 3, rootY - side * 2.5);
      ctx.fillStyle = ["#e8f1e3", "#a8c3b9", "#f9faed"][layer % 3];
      ctx.fill();
      ctx.strokeStyle = "#8da9a258";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rootX - 4, rootY);
      ctx.quadraticCurveTo(tipX + 28, tipY + side * 6, tipX + 4, tipY);
      ctx.strokeStyle = "#fffff4a0";
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
  }
}

function drawAntler(ctx: Context, side: number) {
  ctx.save();
  ctx.scale(1, side);
  // Branching deer-like antlers, rather than a single conical horn.
  ctx.beginPath();
  ctx.moveTo(-4, -15);
  ctx.bezierCurveTo(-12, -30, -31, -36, -32, -55);
  ctx.quadraticCurveTo(-33, -76, -48, -91);
  ctx.quadraticCurveTo(-41, -69, -39, -52);
  ctx.quadraticCurveTo(-28, -30, -14, -13);
  ctx.closePath();
  const horn = ctx.createLinearGradient(-41, -60, -25, -31);
  horn.addColorStop(0, "#f9f5e2");
  horn.addColorStop(0.5, "#c9ccbb");
  horn.addColorStop(1, "#feffed");
  ctx.fillStyle = horn;
  ctx.fill();
  ctx.strokeStyle = "#7e988b90";
  ctx.lineWidth = 0.65;
  ctx.stroke();
  for (const [x, y, tipX, tipY] of [[-25, -39, -53, -42], [-35, -58, -25, -80], [-39, -68, -62, -77]]) {
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 3);
    ctx.quadraticCurveTo((x + tipX) / 2, tipY + 8, tipX, tipY);
    ctx.quadraticCurveTo((x + tipX) / 2, y + 2, x - 3, y + 6);
    ctx.fillStyle = "#f1f2dd";
    ctx.fill();
    ctx.strokeStyle = "#96a99b80";
    ctx.lineWidth = 0.55;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-10, -19);
  ctx.quadraticCurveTo(-36, -45, -43, -76);
  ctx.strokeStyle = "#ffffefb0";
  ctx.lineWidth = 1.1;
  ctx.stroke();
  for (const [x, y] of [[-20, -31], [-30, -44], [-35, -56], [-39, -68]]) {
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 1);
    ctx.quadraticCurveTo(x, y - 3, x + 4, y - 2);
    ctx.strokeStyle = "#7c927a80";
    ctx.lineWidth = 0.55;
    ctx.stroke();
  }
  ctx.restore();
}

function drawHead(ctx: Context, point: DragonPoint, time: number) {
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(point.angle);
  ctx.scale(point.radius / 16, point.radius / 16);
  drawMane(ctx, time);
  drawAntler(ctx, -1);
  drawAntler(ctx, 1);

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-14, side * 12);
    ctx.quadraticCurveTo(-35, side * 17, -43, side * 27);
    ctx.quadraticCurveTo(-21, side * 30, -5, side * 18);
    ctx.fillStyle = "#e3ece0";
    ctx.fill();
    line(ctx, [[-36, side * 29], [-23, side * 25], [-15, side * 18]], "#809c9490", 1);
  }

  ctx.beginPath();
  ctx.moveTo(-26, -10);
  ctx.quadraticCurveTo(-25, -23, -10, -25);
  ctx.lineTo(4, -27);
  ctx.quadraticCurveTo(15, -24, 26, -17);
  ctx.quadraticCurveTo(38, -12, 48, -13);
  ctx.quadraticCurveTo(64, -19, 71, -7);
  ctx.quadraticCurveTo(81, 0, 69, 10);
  ctx.quadraticCurveTo(59, 17, 42, 13);
  ctx.quadraticCurveTo(28, 25, 12, 22);
  ctx.lineTo(-4, 24);
  ctx.quadraticCurveTo(-21, 19, -28, 9);
  ctx.quadraticCurveTo(-33, -3, -24, -15);
  const face = ctx.createLinearGradient(8, -27, 18, 27);
  face.addColorStop(0, "#fffff1");
  face.addColorStop(0.4, "#e6f0e7");
  face.addColorStop(0.65, "#f5f8eb");
  face.addColorStop(1, "#8ba6a1");
  ctx.fillStyle = face;
  ctx.fill();
  ctx.strokeStyle = "#cbdcc9";
  ctx.lineWidth = 0.9;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-8, -3);
  ctx.bezierCurveTo(9, -6, 21, 2, 42, -2);
  ctx.quadraticCurveTo(55, -5, 67, -2);
  ctx.strokeStyle = "#849e8f88";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-7, -5);
  ctx.quadraticCurveTo(17, -1, 39, -5);
  ctx.strokeStyle = "#ffffefb0";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Raised forehead scales and cheek plates.
  for (let row = -1; row <= 1; row++) {
    for (let index = 0; index < 4; index++) {
      scaleShape(ctx, -14 + index * 8 + (row % 2) * 3, row * 7, 3.7 - Math.abs(row) * 0.5);
      ctx.fillStyle = "#f7f9e847";
      ctx.fill();
      ctx.strokeStyle = "#77958b70";
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
  }
  // A long muzzle, open lower jaw, and distinct curved fangs.
  ctx.beginPath();
  ctx.moveTo(31, 9);
  ctx.quadraticCurveTo(53, 15, 71, 5);
  ctx.lineTo(65, 18);
  ctx.quadraticCurveTo(46, 22, 31, 9);
  ctx.fillStyle = "#293e3e";
  ctx.fill();
  for (const [x, y, depth] of [[43, 13, 9], [56, 13, 7], [65, 9, 6]]) {
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 1);
    ctx.quadraticCurveTo(x - 3, y + 7, x + 2, y + depth);
    ctx.quadraticCurveTo(x, y + 4, x + 3, y - 1);
    ctx.fillStyle = "#ffffed";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(33, 16);
  ctx.quadraticCurveTo(49, 27, 66, 18);
  ctx.strokeStyle = "#e6f1da";
  ctx.lineWidth = 3;
  ctx.stroke();

  for (const side of [-1, 1]) {
    const eyeX = side < 0 ? 23 : 19;
    const eyeY = side * 10;
    ctx.beginPath();
    ctx.moveTo(eyeX - 7, eyeY + side * 2);
    ctx.quadraticCurveTo(eyeX, eyeY - side * 6, eyeX + 7, eyeY - side * 2);
    ctx.quadraticCurveTo(eyeX + 1, eyeY + side * 5, eyeX - 7, eyeY + side * 2);
    ctx.fillStyle = "#233d3e";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(eyeX + 1, eyeY, 2.2, 3.1, -0.15 * side, 0, TAU);
    ctx.fillStyle = "#bacfd0";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(eyeX + 1.7, eyeY, 0.65, 2.7, 0, 0, TAU);
    ctx.fillStyle = "#13282d";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(eyeX - 10, eyeY + side * 5);
    ctx.quadraticCurveTo(eyeX - 1, eyeY - side * 10, eyeX + 10, eyeY - side * 3);
    ctx.strokeStyle = "#fffff0";
    ctx.lineWidth = 3.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(60, side * 4.5, 3.2, 1.7, side * 0.3, 0, TAU);
    ctx.fillStyle = "#577571";
    ctx.fill();

    // Long, independently moving whiskers and fine secondary filaments.
    for (let strand = 0; strand < 3; strand++) {
      const flutter = Math.sin(time * 1.3 + strand + side) * 5;
      ctx.beginPath();
      ctx.moveTo(61 - strand * 2, side * (8 + strand));
      ctx.bezierCurveTo(71, side * (34 + strand * 3), 12, side * (43 + flutter), -29, side * (32 + strand * 3));
      ctx.bezierCurveTo(-64, side * 26, -87, side * (57 + flutter), -116 + strand * 9, side * (41 + flutter));
      ctx.strokeStyle = strand === 0 ? "#faffeb" : "#d4e5d8a0";
      ctx.lineWidth = strand === 0 ? 1.25 : 0.55;
      ctx.stroke();
    }
  }

  for (let strand = 0; strand < 7; strand++) {
    ctx.beginPath();
    ctx.moveTo(31 - strand * 3.6, 19);
    ctx.bezierCurveTo(10 - strand * 7, 42 + strand * 1.2, -39 - strand * 5, 47, -68 - strand * 4, 27 + Math.sin(time + strand) * 4);
    ctx.strokeStyle = strand % 2 ? "#f8f9e6" : "#c9dfd0";
    ctx.lineWidth = strand % 2 ? 1.1 : 1.7;
    ctx.stroke();
  }
  ctx.restore();
}

/** Cache fine scales once; only the articulated silhouette and hair move per frame. */
export function createDragonRenderer(createCanvas: () => HTMLCanvasElement) {
  const sprites = makeScaleSprites(createCanvas);
  return (ctx: Context, points: DragonPoint[], time: number) => {
    if (points.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawTail(ctx, points[points.length - 1], time);
    for (const index of [25, 69]) drawLeg(ctx, points[index], -1, time, index > 30);

    // One continuous tapered body underneath the overlapping scale tiles.
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = point.x + Math.sin(point.angle) * point.radius;
      const y = point.y - Math.cos(point.angle) * point.radius;
      index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    for (let index = points.length - 1; index >= 0; index--) {
      const point = points[index];
      ctx.lineTo(point.x - Math.sin(point.angle) * point.radius, point.y + Math.cos(point.angle) * point.radius);
    }
    ctx.closePath();
    ctx.fillStyle = "#b9cdc4";
    ctx.fill();

    for (let index = points.length - 1; index >= 0; index--) {
      const point = points[index];
      const radius = point.radius;
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(point.angle);
      if (index > 4 && index % 3 === 0) {
        const flutter = Math.sin(time * 1.7 + index * 0.4) * radius * 0.09;
        ctx.beginPath();
        ctx.moveTo(radius * 0.55, -radius * 0.73);
        ctx.quadraticCurveTo(-radius * 0.8, -radius * 1.35, -radius * 1.9, -radius * 1.85 + flutter);
        ctx.quadraticCurveTo(-radius * 0.8, -radius * 1.7, -radius * 0.75, -radius * 0.65);
        ctx.fillStyle = index % 2 ? "#e3efe0" : "#f9fbed";
        ctx.fill();
        ctx.strokeStyle = "#7fa19770";
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }
      if (index > 8 && index < 95 && index % 10 === 0) {
        for (let strand = 0; strand < 3; strand++) {
          const flutter = Math.sin(time * 1.6 + index + strand) * radius * 0.13;
          ctx.beginPath();
          ctx.moveTo(radius * 0.1, -radius * 0.8);
          ctx.bezierCurveTo(-radius * 0.8, -radius * 1.65, -radius * 1.7, -radius * 1.45, -radius * (2 + strand * 0.3), -radius * (1.1 + strand * 0.15) + flutter);
          ctx.strokeStyle = "#e9f4dfb0";
          ctx.lineWidth = Math.max(radius * 0.035, 0.4);
          ctx.stroke();
        }
      }
      ctx.drawImage(sprites[index % 3], -radius, -radius * 1.25, radius * 2, radius * 2.5);
      ctx.restore();
    }
    for (const index of [28, 72]) drawLeg(ctx, points[index], 1, time, index > 30);
    drawHead(ctx, points[0], time);
    ctx.restore();
  };
}
