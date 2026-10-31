export type DragonPoint = {
  x: number;
  y: number;
  angle: number;
  radius: number;
};

/** Blend the original hero orbit into a viewport-wide, figure-eight flight. */
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
  const insetX = Math.min(width * 0.2, 90 * bodyScale + 12);
  const insetY = Math.min(height * 0.2, 90 * bodyScale + 12);
  const roamRadiusX = Math.max(width / 2 - insetX, 1);
  const roamRadiusY = Math.max(height / 2 - insetY, 1);

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

  function backgroundPoint(theta: number) {
    return {
      x: width / 2 + Math.cos(theta) * roamRadiusX,
      y: height / 2 + Math.sin(theta * 2) * roamRadiusY,
    };
  }

  function backgroundSpeed(theta: number) {
    return Math.hypot(
      -Math.sin(theta) * roamRadiusX,
      2 * Math.cos(theta * 2) * roamRadiusY,
    );
  }

  let backgroundTheta = headTheta;
  let previousRadius = 17 * bodyScale;

  return Array.from({ length: 115 }, (_, index) => {
    const bodyProgress = index / 114;
    const radius = (3 + 14 * Math.pow(1 - bodyProgress, 0.57)) * bodyScale;

    if (index > 0) {
      // Space scales by physical distance, so the wider route never stretches
      // the dragon into disconnected segments. The midpoint improves turns.
      const spacing = (previousRadius + radius) * 0.45;
      const midpoint = backgroundTheta - spacing / (2 * backgroundSpeed(backgroundTheta));
      backgroundTheta -= spacing / backgroundSpeed(midpoint);
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
