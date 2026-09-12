"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type HopperPose = "idle" | "wave" | "point" | "talking";

const PALETTE = {
  paper: "#F7F5F2",
  ink: "#14172B",
  court: "#FF7A29",
  courtDeep: "#f2610f",
  electric: "#2FD4E0",
  slate: "#8a93a6",
};

export default function Hopper({
  pose = "idle",
  mirror = false,
  className = "",
}: {
  pose?: HopperPose;
  mirror?: boolean;
  className?: string;
}) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useRef(false);
  const poseRef = useRef<HopperPose>(pose);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    poseRef.current = pose;
    const svg = root.current;
    if (!svg) return;
    const q = gsap.utils.selector(svg);
    const ctx = gsap.context(() => {
      if (reduced.current) return;
      const tl = runPose(q, pose);
      return () => tl?.kill();
    }, svg);
    return () => {
      ctx.revert();
      gsap.set(svg, { clearProps: "all" });
    };
  }, [pose]);

  return (
    <svg
      ref={root}
      viewBox="0 0 220 300"
      className={className}
      role="img"
      aria-label="Hopper the rabbit"
      style={mirror ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* ground shadow */}
      <ellipse className="h-shadow" cx="110" cy="286" rx="62" ry="9" fill="rgba(20,23,43,0.25)" />

      {/* ---- legs + shoes ---- */}
      <g>
        <rect className="h-leg-l" x="66" y="218" width="34" height="58" rx="14" fill={PALETTE.slate} />
        <rect className="h-leg-r" x="120" y="218" width="34" height="58" rx="14" fill={PALETTE.slate} />
        <rect x="72" y="238" width="13" height="10" rx="3" fill="rgba(20,23,43,0.18)" />
        <rect x="135" y="238" width="13" height="10" rx="3" fill="rgba(20,23,43,0.18)" />
      </g>
      {/* sneakers: white chunky sole + court body */}
      <g>
        <rect x="58" y="262" width="48" height="16" rx="8" fill="#fff" />
        <rect x="56" y="268" width="52" height="14" rx="7" fill={PALETTE.court} />
        <rect x="114" y="262" width="48" height="16" rx="8" fill="#fff" />
        <rect x="112" y="268" width="52" height="14" rx="7" fill={PALETTE.court} />
      </g>

      {/* ---- jersey body (oversized) ---- */}
      <g>
        <rect className="h-body" x="52" y="96" width="116" height="132" rx="30" fill={PALETTE.paper} stroke="rgba(20,23,43,0.06)" />
        <path d="M92 108 L110 78 L128 108 Z" fill={PALETTE.court} />
        <rect x="52" y="206" width="116" height="22" rx="11" fill={PALETTE.court} />
        <rect x="60" y="118" width="20" height="10" rx="5" fill={PALETTE.electric} opacity="0.9" />
        <rect x="140" y="118" width="20" height="10" rx="5" fill={PALETTE.electric} opacity="0.9" />
      </g>

      {/* ---- arms (pivot groups) ---- */}
      <g transform="translate(66,124)" className="h-arm-pivot-l">
        <g className="h-arm-l">
          <rect x="-12" y="0" width="24" height="86" rx="12" fill={PALETTE.paper} stroke="rgba(20,23,43,0.06)" />
          <rect x="-12" y="70" width="24" height="16" rx="8" fill={PALETTE.electric} />
          <circle cx="0" cy="94" r="14" fill={PALETTE.paper} />
          <rect x="5" y="86" width="4" height="12" rx="2" fill="rgba(20,23,43,0.25)" />
        </g>
      </g>
      <g transform="translate(154,124)" className="h-arm-pivot-r">
        <g className="h-arm-r">
          <rect x="-12" y="0" width="24" height="86" rx="12" fill={PALETTE.paper} stroke="rgba(20,23,43,0.06)" />
          <rect x="-12" y="70" width="24" height="16" rx="8" fill={PALETTE.electric} />
          <circle cx="0" cy="94" r="14" fill={PALETTE.paper} />
          <rect x="-9" y="86" width="4" height="12" rx="2" fill="rgba(20,23,43,0.25)" />
        </g>
      </g>

      {/* ---- ears ---- */}
      <g className="h-ear-l" transform="rotate(10 78 60)">
        <path d="M78 62 C66 44 56 22 62 6 C66 -4 84 0 86 12 C90 34 84 52 80 62 Z" fill={PALETTE.paper} />
        <path d="M77 56 C69 42 63 26 67 14 C70 8 79 10 80 18 C83 34 79 47 76 56 Z" fill="#ffb7c9" opacity="0.8" />
      </g>
      <g className="h-ear-r" transform="rotate(-10 142 60)">
        <path d="M142 62 C154 44 164 22 158 6 C154 -4 136 0 134 12 C130 34 136 52 140 62 Z" fill={PALETTE.paper} />
        <path d="M143 56 C151 42 157 26 153 14 C150 8 141 10 140 18 C137 34 141 47 144 56 Z" fill="#ffb7c9" opacity="0.8" />
      </g>

      {/* ---- hat (backwards snapback) ---- */}
      <g>
        <path className="h-hat" d="M74 48 C76 20 144 20 146 48 C120 60 100 60 74 48 Z" fill={PALETTE.court} />
        <path className="h-hat-band" d="M74 48 C80 55 140 55 146 48 L146 56 C140 63 80 63 74 56 Z" fill={PALETTE.courtDeep} />
        {/* snap closure on top + strap */}
        <circle cx="110" cy="24" r="6" fill={PALETTE.courtDeep} />
        <rect x="105" y="14" width="10" height="6" rx="3" fill="#fff" />
        <rect x="44" y="52" width="6" height="14" rx="3" fill={PALETTE.courtDeep} />
      </g>

      {/* ---- head ---- */}
      <g>
        <path className="h-head" d="M60 84 C58 50 74 32 110 32 C146 32 162 50 160 84 C160 118 140 132 110 132 C80 132 60 118 60 84 Z" fill={PALETTE.paper} />
        {/* eyes */}
        <circle cx="92" cy="76" r="5.5" fill={PALETTE.ink} />
        <circle cx="128" cy="76" r="5.5" fill={PALETTE.ink} />
        <circle cx="94" cy="74" r="1.8" fill="#fff" />
        <circle cx="130" cy="74" r="1.8" fill="#fff" />
        {/* brows */}
        <path d="M84 64 Q92 60 100 65" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M120 65 Q128 60 136 64" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M104 88 L116 88 L110 95 Z" fill={PALETTE.ink} />
        {/* buck teeth (always visible under mouth) */}
        <g>
          <rect x="104.5" y="95" width="6.5" height="8" rx="1.5" fill="#fff" stroke="rgba(20,23,43,0.15)" />
          <rect x="112" y="95" width="6.5" height="8" rx="1.5" fill="#fff" stroke="rgba(20,23,43,0.15)" />
          <path d="M105 102 Q110 100 115 102 L115 103 L110 105 L105 103 Z" fill={PALETTE.court} />
        </g>
      </g>

      {/* mouth (animated for talking) */}
      <g className="h-mouth" transform="translate(110 100)">
        <path d="M-9 -1 Q0 6 9 -1" stroke={PALETTE.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Builds the pose timeline for the current pose. Returns a cleanup fn.
 * Uses the reduced-motion fallback (static state, no hops) via the caller.
 */
function runPose(q: ReturnType<typeof gsap.utils.selector>, pose: HopperPose): gsap.core.Timeline | null {
  const armL = q(".h-arm-l");
  const armR = q(".h-arm-r");
  const earL = q(".h-ear-l");
  const earR = q(".h-ear-r");
  const mouth = q(".h-mouth");
  const shadow = q(".h-shadow");

  gsap.set(armL, { svgOrigin: "66 124", rotation: 14 });
  gsap.set(armR, { svgOrigin: "154 124", rotation: -14 });

  if (pose === "idle") {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.6 });
    tl.to([earL, earR], { rotation: (i) => (i ? -12 : 12), duration: 0.5, ease: "sine.inOut" }, 0)
      .to(shadow, { scaleX: 0.96, opacity: 0.8, duration: 0.5, ease: "sine.inOut" }, 0);
    return tl;
  }

  if (pose === "wave") {
    gsap.set(earL, { rotation: 8 });
    gsap.set(earR, { rotation: -8 });
    const tl = gsap.timeline();
    tl.set(armL, { svgOrigin: "66 124", rotation: 0 })
      .to(armR, { svgOrigin: "154 124", rotation: -95, duration: 0.4, ease: "back.out(2.5)" })
      .to(armR, { rotation: -58, duration: 0.18, ease: "power2.inOut" })
      .to(armR, { rotation: -95, yoyo: true, repeat: 2, duration: 0.18, ease: "sine.inOut" })
      .to(armR, { rotation: -14, duration: 0.45, ease: "power3.inOut" });
    return tl;
  }

  if (pose === "point") {
    // anticipation -> extend pointing left -> settle
    const tl = gsap.timeline();
    tl.to(armL, { svgOrigin: "66 124", rotation: 20, duration: 0.12, ease: "power2.out" })
      .to(armL, { rotation: -52, duration: 0.5, ease: "back.out(1.6)" })
      .to(armL, { rotation: -46, duration: 0.35, ease: "sine.inOut" })
      .to([earL, earR], { rotation: (i) => (i ? -10 : 14), duration: 0.3, ease: "sine.out" }, "<")
      .to(shadow, { scaleX: 1.06, opacity: 0.85, duration: 0.4, ease: "sine.inOut" }, "<");
    return tl;
  }

  // talking: ears rocking + mouth pulsing = looping idle attention
  const tl = gsap.timeline({ repeat: -1 });
  tl.set(mouth, { transformOrigin: "50% 50%" })
    .to(mouth, { scaleY: 1.6, duration: 0.16, ease: "sine.inOut" })
    .to(mouth, { scaleY: 1, duration: 0.22, ease: "sine.inOut" })
    .to([earL, earR], { rotation: (i) => (i ? -14 : 14), duration: 0.28, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.1);
  return tl;
}