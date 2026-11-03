export type DragonPoint = {
  x: number;
  y: number;
  angle: number;
  radius: number;
};

/** Blend the hero orbit into a rounded loop along the screen's perimeter. */
export function getDragonFlight(
  width: number,
  height: number,
  time: number,
  scrollProgress: number,
): DragonPoint[] {
  const mobile = width < 760;
  const scale = Math.min(width / 1440, height / 900, 1.25);
  const bodyScale = Math.max(scale, 0.68);
  const progress = Math.min(Math.max(scrollProgress, 0), 1);
  const roam = progress * progress * (3 - 2 * progress);
  const headTheta = time * 0.19 - 0.98;
  const epsilon = 0.006;

  // Leave room for the horns, whiskers, and claws at every viewport edge.
  const insetX = Math.min(width * 0.2, 104 * bodyScale + 10);
  const insetY = Math.min(height * 0.2, 104 * bodyScale + 10);
  const left = insetX;
  const right = width - insetX;
  const top = insetY;
  const bottom = height - insetY;
  const corner = Math.min(100 * bodyScale, (right - left) * 0.22, (bottom - top) * 0.22);
  const horizontal = right - left - 2 * corner;
  const vertical = bottom - top - 2 * corner;
  const quarterArc = corner * Math.PI / 2;
  const perimeter = 2 * horizontal + 2 * vertical + 4 * quarterArc;
  const perimeterSpeed = perimeter / (2 * Math.PI);
  const rightMidpoint = horizontal + quarterArc + vertical / 2;

  function heroPoint(theta: number) {
    const wave = Math.sin(theta * 3 + time * 0.65) * 22 * scale;
    return {
      x: width * (mobile ? 0.68 : 0.755)
        + Math.cos(theta) * ((mobile ? 175 : 245) * Math.max(scale, 0.65) + wave)
        + Math.sin(theta * 2) * 48 * scale,
      y: height * (mobile ? 0.7 : 0.48)
        + Math.sin(theta) * (mobile ? 210 : 285) * Math.max(scale, 0.65)
        + Math.cos(theta * 2) * 26 * scale,
    };
  }

  function perimeterPoint(theta: number) {
    // Arc-length coordinates keep both the head and every trailing scale on
    // the same border route, including the four rounded corners.
    let distance = ((theta * perimeterSpeed + rightMidpoint) % perimeter + perimeter) % perimeter;
    if (distance < horizontal) return { x: left + corner + distance, y: top };
    distance -= horizontal;
    if (distance < quarterArc) {
      const angle = -Math.PI / 2 + distance / corner;
      return { x: right - corner + Math.cos(angle) * corner, y: top + corner + Math.sin(angle) * corner };
    }
    distance -= quarterArc;
    if (distance < vertical) return { x: right, y: top + corner + distance };
    distance -= vertical;
    if (distance < quarterArc) {
      const angle = distance / corner;
      return { x: right - corner + Math.cos(angle) * corner, y: bottom - corner + Math.sin(angle) * corner };
    }
    distance -= quarterArc;
    if (distance < horizontal) return { x: right - corner - distance, y: bottom };
    distance -= horizontal;
    if (distance < quarterArc) {
      const angle = Math.PI / 2 + distance / corner;
      return { x: left + corner + Math.cos(angle) * corner, y: bottom - corner + Math.sin(angle) * corner };
    }
    distance -= quarterArc;
    if (distance < vertical) return { x: left, y: bottom - corner - distance };
    distance -= vertical;
    const angle = Math.PI + distance / corner;
    return { x: left + corner + Math.cos(angle) * corner, y: top + corner + Math.sin(angle) * corner };
  }

  function backgroundPoint(theta: number) {
    const point = perimeterPoint(theta);
    const next = perimeterPoint(theta + 0.001);
    const tangent = Math.atan2(next.y - point.y, next.x - point.x);
    const wave = Math.sin(theta * 5 - time * 1.15) * 6 * bodyScale;
    return {
      x: point.x + Math.sin(tangent) * wave,
      y: point.y - Math.cos(tangent) * wave,
    };
  }

  let backgroundTheta = headTheta;
  let previousRadius = 17 * bodyScale;

  return Array.from({ length: 115 }, (_, index) => {
    const bodyProgress = index / 114;
    const radius = (3 + 14 * Math.pow(1 - bodyProgress, 0.57)) * bodyScale;

    if (index > 0) {
      // Keep the body connected at the same physical spacing on every edge.
      const spacing = (previousRadius + radius) * 0.45;
      backgroundTheta -= spacing / perimeterSpeed;
    }
    previousRadius = radius;

    const heroTheta = headTheta - bodyProgress * 4.9;
    const hero = heroPoint(heroTheta);
    const heroNext = heroPoint(heroTheta + epsilon);
    const background = backgroundPoint(backgroundTheta);
    const backgroundNext = backgroundPoint(backgroundTheta + epsilon);
    const tangentX = (heroNext.x - hero.x) * (1 - roam)
      + (backgroundNext.x - background.x) * roam;
    const tangentY = (heroNext.y - hero.y) * (1 - roam)
      + (backgroundNext.y - background.y) * roam;

    return {
      x: hero.x + (background.x - hero.x) * roam,
      y: hero.y + (background.y - hero.y) * roam,
      angle: Math.atan2(tangentY, tangentX),
      radius,
    };
  });
}
