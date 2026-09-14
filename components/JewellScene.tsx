"use client";

import dynamic from "next/dynamic";

const JewellCanvas = dynamic(() => import("./three/JewellCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Fixed full-screen layer behind all content: the WebGPU canvas plus a soft
 * cinematic vignette. Pointer-events are off so the HUD scrolls on top.
 */
export default function JewellScene({
  shipCount,
  skillCount,
}: {
  shipCount: number;
  skillCount: number;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      <JewellCanvas shipCount={shipCount} skillCount={skillCount} />
    </div>
  );
}