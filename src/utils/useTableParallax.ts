import { useState, useEffect, useRef, CSSProperties } from "react";

/**
 * Custom hook that creates smooth mouse-move and device-tilt parallax
 * variables for multi-layered 3D casino table physical surfaces.
 */
export function useTableParallax() {
  const [parallaxVars, setParallaxVars] = useState<CSSProperties>({
    "--tbl-parallax-x": "0px",
    "--tbl-parallax-y": "0px",
    "--tbl-tilt-x": "0deg",
    "--tbl-tilt-y": "0deg",
  } as CSSProperties);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animFrame: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 800;
      const normX = (e.clientX - w / 2) / (w / 2);
      const normY = (e.clientY - h / 2) / (h / 2);

      targetX = Math.max(-1, Math.min(1, normX));
      targetY = Math.max(-1, Math.min(1, normY));
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetX = Math.max(-1, Math.min(1, e.gamma / 25));
        targetY = Math.max(-1, Math.min(1, (e.beta - 40) / 25));
      }
    };

    const updateLoop = () => {
      // Smooth lerp damping for realistic physical weight
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;

      const pxX = currentX * 12; // -12px to 12px
      const pxY = currentY * 8;  // -8px to 8px
      const tiltX = -currentY * 3.5; // -3.5deg to 3.5deg pitch
      const tiltY = currentX * 5.0;  // -5deg to 5deg yaw

      setParallaxVars({
        "--tbl-parallax-x": `${pxX.toFixed(2)}px`,
        "--tbl-parallax-y": `${pxY.toFixed(2)}px`,
        "--tbl-tilt-x": `${tiltX.toFixed(2)}deg`,
        "--tbl-tilt-y": `${tiltY.toFixed(2)}deg`,
      } as CSSProperties);

      animFrame = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    }

    animFrame = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return { parallaxVars, tableRef };
}
