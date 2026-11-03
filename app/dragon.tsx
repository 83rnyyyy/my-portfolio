"use client";

import { useEffect, useRef, useState } from "react";
import { getDragonFlight } from "./dragon-flight";
import { createDragonRenderer } from "./dragon-art";

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

    const drawDragon = createDragonRenderer(() => document.createElement("canvas"));
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let elapsed = Number(canvas.dataset.flightTime || 0);
    let scroll = window.scrollY;
    let smoothScroll = scroll;
    let pageVisible = !document.hidden;
    let paintedOpacity = -1;
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

    function render(timestamp: number) {
      if (!ctx || !canvas) return;
      if (!still && lastTime) elapsed += Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      canvas.dataset.flightTime = String(elapsed);
      smoothScroll += (scroll - smoothScroll) * (still ? 1 : 0.045);
      if (Math.abs(scroll - smoothScroll) < 0.1) smoothScroll = scroll;

      ctx.clearRect(0, 0, width, height);
      const away = Math.min(Math.max(smoothScroll / (height * 0.65), 0), 1);
      // Fade the completed illustration as one layer so overlapping scales
      // and hair keep the same opacity as the face.
      const opacity = 1 - away * 0.48;
      if (Math.abs(opacity - paintedOpacity) > 0.001) {
        canvas.style.opacity = String(opacity);
        paintedOpacity = opacity;
      }
      drawDragon(ctx, getDragonFlight(width, height, elapsed, away), elapsed);

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

