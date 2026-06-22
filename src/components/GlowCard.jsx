import { useRef, useCallback } from "react";

/**
 * GlowCard — Premium cursor-reactive card component.
 *
 * Features:
 *   • Radial spotlight follows mouse inside the card (CSS variables --x, --y)
 *   • Border illuminates near cursor edges (border-gradient via ::before pseudo)
 *   • Subtle 3D parallax tilt on hover (perspective rotateX/rotateY)
 *
 * Usage:
 *   <GlowCard className="p-4 rounded-xl">…content…</GlowCard>
 *
 * Props:
 *   className   — additional Tailwind / CSS classes merged on the wrapper
 *   tilt        — enable 3D tilt effect (default: true)
 *   glowColor   — rgba string for spotlight color (default: green-tinted)
 *   borderGlow  — enable animated border spotlight (default: true)
 *   children    — card content
 */
export default function GlowCard({
  className = "",
  tilt = true,
  glowColor = "rgba(34,197,94,0.13)",
  borderGlow = true,
  children,
  style = {},
  ...rest
}) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        // Spotlight position (CSS gradient)
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);

        // 3D tilt — max ±9° horizontal, ±6° vertical
        if (tilt) {
          const rotateY = ((x - cx) / cx) * 9;
          const rotateX = -((y - cy) / cy) * 6;
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015,1.015,1.015)`;
        }
      });
    },
    [tilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    // Reset transform smoothly via CSS transition
    card.style.transform = "";
    card.style.setProperty("--x", "-999px");
    card.style.setProperty("--y", "-999px");
  }, []);

  const baseStyle = {
    "--glow-color": glowColor,
    "--x": "-999px",
    "--y": "-999px",
    ...style,
  };

  return (
    <div
      ref={cardRef}
      className={`glow-card${borderGlow ? " glow-card--border" : ""} ${className}`}
      style={baseStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
