"use client";

import { useEffect, useRef, useState } from "react";
import { getDragonFlight, type DragonPoint as Point } from "./dragon-flight";

const TAU = Math.PI * 2;

/** A continuously articulated dragon: every scale follows the same flight path. */
export default function Dragon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    // Preserve the flight position when motion preferences change or the tab is hidden.
    let elapsed = Number(canvas.dataset.flightTime || 0);
    let scroll = window.scrollY;
    let smoothScroll = scroll;
    let pageVisible = !document.hidden;
    const still = reducedMotion;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) render(0);
    }

    function strokePath(points: number[][], color: string, lineWidth: number) {
      ctx!.beginPath();
      points.forEach(([x, y], i) => i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y));
      ctx!.strokeStyle = color;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }

    function drawLeg(point: Point, side: number, time: number, back: boolean) {
      ctx!.save();
      ctx!.translate(point.x, point.y);
      ctx!.rotate(point.angle);
      const s = point.radius / 16;
      ctx!.scale(s, s * side);
      const bend = Math.sin(time * 1.2 + (back ? 2 : 0)) * 5;
      ctx!.lineCap = "round";
      strokePath([[0, 8], [-17, 26], [-12 + bend, 41], [3 + bend, 47]], "#777e81", 9);
      strokePath([[0, 7], [-17, 25], [-12 + bend, 39], [3 + bend, 45]], "#e7e9e4", 5);
      for (let toe = 0; toe < 3; toe++) {
        strokePath([[bend, 44], [11 + bend, 41 + toe * 6], [17 + bend, 38 + toe * 7]], "#f5f3e9", 2);
      }
      ctx!.restore();
    }

    function drawHead(point: Point, time: number) {
      ctx!.save();
      ctx!.translate(point.x, point.y);
      ctx!.rotate(point.angle);
      const scale = point.radius / 16;
      ctx!.scale(scale, scale);
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";

      // Flowing mane, antlers, and branching tips give the head its Eastern silhouette.
      for (const side of [-1, 1]) {
        for (let i = 0; i < 8; i++) {
          const wave = Math.sin(time * 1.7 + i * 0.8) * 3;
          ctx!.beginPath();
          ctx!.moveTo(7 - i * 4, side * (13 + i * 0.6));
          ctx!.quadraticCurveTo(-12 - i * 4, side * (30 + wave), -36 - i * 4, side * (19 + i * 1.5));
          ctx!.quadraticCurveTo(-24 - i * 3, side * (13 + i), -6 - i * 3, side * 7);
          ctx!.fillStyle = i % 2 ? "#ced5d3" : "#f4f4e9";
          ctx!.fill();
        }
        strokePath([[-4, side * 12], [-20, side * 27], [-34, side * 42], [-39, side * 59]], "#d9dbd0", 4);
        strokePath([[-23, side * 31], [-38, side * 31], [-47, side * 39]], "#e8e9dd", 3);
        strokePath([[-33, side * 43], [-24, side * 47], [-22, side * 57]], "#e8e9dd", 2.5);
        strokePath([[-37, side * 51], [-49, side * 52], [-54, side * 60]], "#e8e9dd", 2);
      }

      // Jaw and elongated, softly shaded snout.
      ctx!.beginPath();
      ctx!.moveTo(0, -16);
      ctx!.bezierCurveTo(17, -25, 29, -16, 32, -11);
      ctx!.lineTo(48, -9);
      ctx!.quadraticCurveTo(58, -1, 48, 9);
      ctx!.lineTo(26, 12);
      ctx!.quadraticCurveTo(10, 25, -11, 15);
      ctx!.quadraticCurveTo(-21, 0, 0, -16);
      const face = ctx!.createLinearGradient(0, -22, 10, 24);
      face.addColorStop(0, "#fffef4");
      face.addColorStop(0.6, "#dce2de");
      face.addColorStop(1, "#909d9c");
      ctx!.fillStyle = face;
      ctx!.fill();
      ctx!.strokeStyle = "#f1f3e7";
      ctx!.lineWidth = 1;
      ctx!.stroke();
      strokePath([[17, 8], [31, 5], [49, 5]], "#687573", 1.5);
      strokePath([[29, 6], [31, 11], [34, 6]], "#fffdf0", 1.5);
      ctx!.fillStyle = "#354345";
      ctx!.beginPath();
      ctx!.ellipse(44, -4, 3, 2, -0.3, 0, TAU);
      ctx!.fill();
      // A dark eye under a sculpted brow remains legible against the white scales.
      ctx!.fillStyle = "#344549";
      ctx!.beginPath();
      ctx!.ellipse(19, -9, 5.5, 3.3, -0.2, 0, TAU);
      ctx!.fill();
      ctx!.fillStyle = "#f4f2d0";
      ctx!.beginPath();
      ctx!.ellipse(20, -9, 1.8, 2.5, 0, 0, TAU);
      ctx!.fill();
      strokePath([[9, -12], [18, -15], [26, -13]], "#fffef0", 3.5);

      for (const side of [-1, 1]) {
        ctx!.beginPath();
        ctx!.moveTo(39, side * 7);
        ctx!.bezierCurveTo(54, side * 21, 27, side * (39 + Math.sin(time) * 3), -4, side * 35);
        ctx!.bezierCurveTo(-29, side * 32, -48, side * (53 + Math.sin(time * 1.4) * 4), -65, side * 44);
        ctx!.strokeStyle = "#f2f0de";
        ctx!.lineWidth = 1.1;
        ctx!.stroke();
      }
      // Wispy beard.
      for (let i = 0; i < 5; i++) {
        ctx!.beginPath();
        ctx!.moveTo(29 - i * 4, 13);
        ctx!.quadraticCurveTo(13 - i * 6, 33 + i * 3, -14 - i * 5, 27 + Math.sin(time + i) * 4);
        ctx!.strokeStyle = "#e5e7db";
        ctx!.lineWidth = 1.7;
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function render(timestamp: number) {
      if (!ctx || !canvas) return;
      if (!still && lastTime) elapsed += Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      canvas.dataset.flightTime = String(elapsed);
      smoothScroll += (scroll - smoothScroll) * (still ? 1 : 0.045);
      if (Math.abs(scroll - smoothScroll) < 0.1) smoothScroll = scroll;
      ctx.clearRect(0, 0, width, height);
      const away = Math.min(Math.max(smoothScroll / (height * 0.65), 0), 1);
      ctx.globalAlpha = 1 - away * 0.48;
      const points = getDragonFlight(width, height, elapsed, away);

      // Draw from tail to head so each pearlescent scale overlaps the next.
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const r = p.radius;
        if (i > 3 && i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(-r * 0.45, -r * 0.65);
          ctx.quadraticCurveTo(-r * 1.35, -r * 1.8, -r * 0.8, -r * 1.9);
          ctx.lineTo(r * 0.6, -r * 0.55);
          ctx.fillStyle = "#dbe1db";
          ctx.fill();
        }
        const gradient = ctx.createLinearGradient(0, -r, 0, r);
        gradient.addColorStop(0, "#f5f6ed");
        gradient.addColorStop(0.35, "#e7ebe4");
        gradient.addColorStop(0.72, "#a8b7b4");
        gradient.addColorStop(1, "#6a7b7b");
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.68, r, 0, 0, TAU);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "rgba(239,245,230,0.38)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
        if (i % 2 === 0) {
          for (let row = -1; row <= 1; row++) {
            ctx.beginPath();
            ctx.arc(-r * 0.15, row * r * 0.51, r * 0.28, -1.1, 1.1);
            ctx.strokeStyle = "rgba(70,93,91,0.35)";
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      for (const index of [25, 69]) {
        drawLeg(points[index], -1, elapsed, index > 30);
        drawLeg(points[index + 3], 1, elapsed, index > 30);
      }
      drawHead(points[0], elapsed);
      ctx.globalAlpha = 1;
      if (!still && pageVisible) frame = requestAnimationFrame(render);
    }

    const onScroll = () => {
      scroll = window.scrollY;
      if (still) render(0);
    };
    const onVisibility = () => {
      pageVisible = !document.hidden;
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (pageVisible) render(0);
    };
    resize();
    if (!still) frame = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return (
    <div className="dragon-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="dragon-canvas" />
    </div>
  );
}

