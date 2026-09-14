"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface JewellCanvasProps {
  shipCount: number;
  skillCount: number;
}

/**
 * Full-page WebGPU background — a rotating server-blade / AI-core that JJ reads as
 * "the homelab, rendered." WebGPURenderer falls back to WebGL2 automatically, so the
 * same scene renders everywhere. GSAP ScrollTrigger scrubs a 0..1 timeline over the
 * whole page and the camera sweeps along keyframes; mouse parallax nudges the core.
 * Everything is disposed on unmount.
 */

const CAM_KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [0, 1.15, 9.4], look: [0, 0, 0] },
  { p: 0.26, pos: [6.6, 2.4, 6.0], look: [0, 0, 0] },
  { p: 0.5, pos: [-5.4, 5.0, 7.2], look: [0, 0, 0] },
  { p: 0.78, pos: [0, 6.2, -8.2], look: [0, -0.5, 0] },
  { p: 1.0, pos: [0, 1.7, 10.6], look: [0, 0.25, 0] },
];

const CYAN = 0x2fd4e0;
const AMBER = 0xffb454;

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function JewellCanvas({ shipCount, skillCount }: JewellCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const countsRef = useRef({ shipCount, skillCount });
  useEffect(() => {
    countsRef.current = { shipCount, skillCount };
  }, [shipCount, skillCount]);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current!;
    if (!mount) return;

    let disposed = false;
    let renderer: THREE.WebGPURenderer;
    let composer: EffectComposer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let clock: THREE.Clock;
    let scrollTL: gsap.core.Tween | undefined;
    let gridTL: gsap.core.Tween | undefined;
    const disposables: { dispose: () => void }[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = () => mount.clientWidth || window.innerWidth;
    const height = () => mount.clientHeight || window.innerHeight;

    // ---- scene state driven by scroll + mouse --------------------------------
    const bus = { scroll: 0, mouseX: 0, mouseY: 0 };
    const eased = { scroll: 0 };
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const pPos = new THREE.Vector3();
    const pLook = new THREE.Vector3();

    async function boot() {
      try {
        renderer = new THREE.WebGPURenderer({
          antialias: true,
          powerPreference: "high-performance",
        });
        await renderer.init();
      } catch (err) {
        console.error("[jewellcanvas] renderer init failed", err);
        hiddenRef.current = true;
        return;
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width(), height(), false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x05060c);
      scene.fog = new THREE.FogExp2(0x05060c, 0.028);

      camera = new THREE.PerspectiveCamera(50, width() / height(), 0.1, 220);
      camera.position.set(CAM_KEYS[0].pos[0], CAM_KEYS[0].pos[1], CAM_KEYS[0].pos[2]);
      camera.lookAt(0, 0, 0);

      clock = new THREE.Clock();
      camPos.copy(camera.position);
      camLook.set(0, 0, 0);

      // ---- lighting ----------------------------------------------------------
      scene.add(new THREE.AmbientLight(0x333a5c, 1.0));

      const key = new THREE.DirectionalLight(0xffffff, 2.3);
      key.position.set(6, 10, 5);
      scene.add(key);

      const rimCyan = new THREE.PointLight(CYAN, 80, 46);
      rimCyan.position.set(5, -3, 6);
      scene.add(rimCyan);

      const rimAmber = new THREE.PointLight(AMBER, 65, 46);
      rimAmber.position.set(-6, 2, 4);
      scene.add(rimAmber);

      const glowTex = makeGlowTexture();
      textures.push(glowTex);

      const root = new THREE.Group();
      scene.add(root);

      // ============================================================================
      // CORE: server blades stacked into an AI core
      // ============================================================================
      const core = new THREE.Group();
      core.position.y = 0;
      root.add(core);

      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x151a2e,
        metalness: 0.85,
        roughness: 0.42,
      });
      materials.push(bladeMat);

      const ledMats: THREE.MeshStandardMaterial[] = [];
      for (let i = 0; i < 6; i++) {
        const m = new THREE.MeshStandardMaterial({
          color: 0x0a0d18,
          emissive: i % 2 === 0 ? CYAN : AMBER,
          emissiveIntensity: 2.4,
          metalness: 0.4,
          roughness: 0.5,
        });
        materials.push(m);
        ledMats.push(m);
      }

      const blades = 12;
      for (let i = 0; i < blades; i++) {
        const geo = new THREE.BoxGeometry(3.4, 0.1, 1.5);
        geometries.push(geo);
        const mesh = new THREE.Mesh(geo, bladeMat);
        mesh.position.y = -1.5 + i * 0.26;
        core.add(mesh);

        if (i % 2 === 0) {
          const led = new THREE.BoxGeometry(0.03, 0.012, 1.1);
          geometries.push(led);
          const ledMesh = new THREE.Mesh(led, ledMats[i / 2]);
          ledMesh.position.set(1.55, mesh.position.y, 0);
          ledMesh.rotation.z = Math.PI / 2;
          core.add(ledMesh);
        }
      }

      // dark mounting platform
      const platGeo = new THREE.CylinderGeometry(5.2, 5.6, 0.22, 48);
      geometries.push(platGeo);
      const platMat = new THREE.MeshStandardMaterial({ color: 0x0b0d15, metalness: 0.7, roughness: 0.85 });
      materials.push(platMat);
      const plat = new THREE.Mesh(platGeo, platMat);
      plat.position.y = -1.95;
      core.add(plat);

      // hot inner core
      const coreGeo = new THREE.IcosahedronGeometry(0.5, 2);
      geometries.push(coreGeo);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0a1320,
        emissive: 0x9be8ff,
        emissiveIntensity: 3.6,
        metalness: 0.2,
        roughness: 0.25,
      });
      materials.push(coreMat);
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = -1.5 + blades * 0.26 / 2;
      core.add(coreMesh);

      const heartGeo = new THREE.SphereGeometry(0.17, 24, 16);
      geometries.push(heartGeo);
      const heartMat = new THREE.MeshBasicMaterial({ color: 0xf5fffb });
      materials.push(heartMat);
      const heart = new THREE.Mesh(heartGeo, heartMat);
      heart.position.copy(coreMesh.position);
      core.add(heart);

      // amber orbit ring around the core
      const ringGeo = new THREE.TorusGeometry(1.05, 0.035, 16, 64);
      geometries.push(ringGeo);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x0a0d18,
        emissive: AMBER,
        emissiveIntensity: 2.6,
        metalness: 0.3,
        roughness: 0.4,
      });
      materials.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(coreMesh.position);
      ring.rotation.x = Math.PI / 2.4;
      core.add(ring);

      // orbiting signal nodes + glow sprites
      const orbMat = new THREE.MeshBasicMaterial({ color: CYAN });
      materials.push(orbMat);
      const sprites: THREE.Sprite[] = [];
      for (let i = 0; i < 5; i++) {
        const oGeo = new THREE.IcosahedronGeometry(0.075, 0);
        geometries.push(oGeo);
        const o = new THREE.Mesh(oGeo, orbMat);
        const pivot = new THREE.Group();
        pivot.rotation.y = (i / 5) * Math.PI * 2;
        pivot.add(o);
        o.position.set(1.6, (i % 2 === 0 ? 1 : -1) * 0.5, 0);
        pivot.userData.speed = 0.4 + i * 0.15;
        core.add(pivot);

        const spr = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: CYAN,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        spr.position.copy(o.position).multiplyScalar(0.95);
        spr.scale.setScalar(0.9);
        pivot.add(spr);
        sprites.push(spr);
        materials.push(spr.material);
      }

      // core glow sprite
      const coreSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: CYAN,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      coreSprite.position.copy(coreMesh.position);
      coreSprite.scale.setScalar(4.6);
      core.add(coreSprite);
      sprites.push(coreSprite);
      materials.push(coreSprite.material);

      // volunteer: volumetric light shafts (cheap cones, additive)
      const shaftMatA = new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.045,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(shaftMatA);
      const shaftGeo = new THREE.ConeGeometry(1.7, 11, 24, 1, true);
      geometries.push(shaftGeo);
      const shaftA = new THREE.Mesh(shaftGeo, shaftMatA);
      shaftA.position.copy(coreMesh.position);
      shaftA.position.y += 4.2;
      shaftA.rotation.x = Math.PI;
      core.add(shaftA);

      const shaftMatB = shaftMatA.clone();
      shaftMatB.color.set(AMBER);
      shaftMatB.opacity = 0.03;
      materials.push(shaftMatB);
      const shaftB = new THREE.Mesh(new THREE.ConeGeometry(1.2, 9, 24, 1, true), shaftMatB);
      shaftB.position.copy(coreMesh.position);
      shaftB.position.x += 1.4;
      shaftB.position.y += 3.2;
      shaftB.rotation.x = Math.PI;
      shaftB.rotation.z = -0.5;
      core.add(shaftB);
      geometries.push(shaftB.geometry as THREE.BufferGeometry);

      // ============================================================================
      // ARSENAL: floating pillars in a ring (one group per skill)
      // ============================================================================
      const arsenal = new THREE.Group();
      root.add(arsenal);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x12172a,
        metalness: 0.8,
        roughness: 0.5,
      });
      materials.push(pillarMat);
      const tipMatA = new THREE.MeshBasicMaterial({ color: CYAN });
      const tipMatB = new THREE.MeshBasicMaterial({ color: AMBER });
      materials.push(tipMatA, tipMatB);

      const groups = Math.max(1, countsRef.current.skillCount || 4);
      for (let g = 0; g < groups; g++) {
        const group = new THREE.Group();
        const baseAngle = (g / groups) * Math.PI * 2 - Math.PI / 2;
        group.rotation.y = baseAngle;
        const height = 0.7 + (g % 3) * 0.35;
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.28, height, 1.7), pillarMat);
        pillar.position.set(4.6, -1.5 + height / 2, 0);
        group.add(pillar);
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 1.8), g % 2 === 0 ? tipMatA : tipMatB);
        tip.position.set(4.6, -1.5 + height, 0);
        group.add(tip);
        group.userData.tilt = (g % 3) - 1;
        arsenal.add(group);
        geometries.push(pillar.geometry as THREE.BufferGeometry, tip.geometry as THREE.BufferGeometry);
      }

      // ============================================================================
      // SHIPS: a ring of emissive markers (one per portfolio item) + faint orbit
      // ============================================================================
      const ships = new THREE.Group();
      root.add(ships);

      const orbitGeo = new THREE.TorusGeometry(6.6, 0.015, 8, 96);
      geometries.push(orbitGeo);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(orbitMat);
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2.6;
      orbit.position.y = -1.4;
      ships.add(orbit);

      const markerMats: THREE.MeshBasicMaterial[] = [];
      const n = Math.max(1, countsRef.current.shipCount || 8);
      for (let i = 0; i < n; i++) {
        const m = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? AMBER : CYAN, transparent: true, opacity: 0.85 });
        materials.push(m);
        markerMats.push(m);
        const marker = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.16), m);
        const a = (i / Math.min(n, 48)) * Math.PI * 2;
        marker.position.set(Math.cos(a) * 6.6, -0.6, Math.sin(a) * 6.6);
        marker.rotation.y = -a + Math.PI / 2;
        ships.add(marker);
        geometries.push(marker.geometry as THREE.BufferGeometry);
      }

      // ============================================================================
      // EMBERS: slow-drifting additive dust for atmosphere
      // ============================================================================
      const EMBER_COUNT = 260;
      const emberPos: number[] = [];
      for (let i = 0; i < EMBER_COUNT; i++) {
        emberPos.push((Math.random() - 0.5) * 16, Math.random() * 12 - 3, (Math.random() - 0.5) * 16);
      }
      const emberGeo = new THREE.BufferGeometry();
      emberGeo.setAttribute("position", new THREE.Float32BufferAttribute(emberPos, 3));
      geometries.push(emberGeo);
      const emberMat = new THREE.PointsMaterial({
        color: 0x9fd8ff,
        size: 0.05,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      materials.push(emberMat);
      const embers = new THREE.Points(emberGeo, emberMat);
      scene.add(embers);

      // ============================================================================
      // POST-PROCESSING: bloom + output
      // ============================================================================
      composer = new EffectComposer(renderer as unknown as import("three").WebGLRenderer);
      composer.setSize(width(), height());
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.85, 0.6, 0.85);
      composer.addPass(bloomPass);
      const outputPass = new OutputPass();
      composer.addPass(outputPass);
      disposables.push(bloomPass, outputPass, composer);

      // ---- camera path sampling ------------------------------------------------
      const tmpA = new THREE.Vector3();
      const tmpB = new THREE.Vector3();
      function samplePath(t: number) {
        let i = 0;
        for (; i < CAM_KEYS.length - 1; i++) if (t <= CAM_KEYS[i + 1].p) break;
        const a = CAM_KEYS[i];
        const b = CAM_KEYS[Math.min(i + 1, CAM_KEYS.length - 1)];
        const span = Math.max(b.p - a.p, 1e-4);
        let f = THREE.MathUtils.clamp((t - a.p) / span, 0, 1);
        f = f * f * (3 - 2 * f);
        tmpA.set(a.pos[0], a.pos[1], a.pos[2]).lerp(tmpB.set(b.pos[0], b.pos[1], b.pos[2]), f);
        pPos.copy(tmpA);
        tmpA.set(a.look[0], a.look[1], a.look[2]).lerp(tmpB.set(b.look[0], b.look[1], b.look[2]), f);
        pLook.copy(tmpA);
      }

      // ---- scroll timeline -----------------------------------------------------
      const track = document.getElementById("jj-track") ?? document.body;
      if (!reduced) {
        const target = { p: 0 };
        scrollTL = gsap.to(target, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            onUpdate: (self) => {
              bus.scroll = self.progress;
            },
          },
        });
        disposables.push({
          dispose: () => {
            scrollTL?.scrollTrigger?.kill();
            scrollTL?.kill();
          },
        });
      } else {
        bus.scroll = 0;
      }

      // subtle grid pulse on the hero so the canvas talks to the DOM
      const heroGrid = document.querySelector("[data-jj-grid]") as HTMLElement | null;
      if (heroGrid && !reduced) {
        gridTL = gsap.fromTo(
          heroGrid,
          { opacity: 0 },
          { opacity: 1, duration: 2.4, ease: "power1.inOut" }
        );
        disposables.push({ dispose: () => gridTL?.kill() });
      }

      // ---- interaction ---------------------------------------------------------
      const onPointer = (e: PointerEvent) => {
        bus.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        bus.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

      const onResize = () => {
        const w = width();
        const h = height();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        bloomPass.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const loop = () => {
        if (disposed || hiddenRef.current) return;
        const t = clock.getDelta();
        const now = clock.elapsedTime;

        eased.scroll = THREE.MathUtils.damp(eased.scroll, bus.scroll, 3.2, t);
        samplePath(eased.scroll);

        // camera: chase the sampled pose
        const k = 1 - Math.exp(-3.4 * t);
        camPos.lerp(pPos, k);
        camLook.lerp(pLook, k);
        camera.position.copy(camPos);
        camera.lookAt(camLook);

        // core: idle spin + mouse parallax
        core.rotation.y += (0.12 + eased.scroll * 0.9) * t;
        core.rotation.x = THREE.MathUtils.damp(core.rotation.x, bus.mouseY * 0.18 + eased.scroll * 0.12, 4, t);
        core.position.x = THREE.MathUtils.damp(core.position.x, bus.mouseX * 0.35, 3, t);
        core.position.y = 0.4 * Math.sin(now * 0.4);

        // orbiters
        core.traverse((o) => {
          if (o.userData.speed) o.rotation.y += o.userData.speed * t;
        });

        ring.rotation.z += 0.4 * t;
        heart.scale.setScalar(1 + 0.08 * Math.sin(now * 2));
        ledMats.forEach((m, idx) => {
          m.emissiveIntensity = 2.2 + 1.4 * Math.sin(now * 3 + idx * 1.3);
        });

        arsenal.rotation.y += 0.05 * t;
        arsenal.position.y = -0.15 * Math.sin(now * 0.5);
        ships.rotation.y += 0.03 * t;
        ships.position.y = 0.25 * Math.sin(now * 0.7);

        // ship markers pulse
        markerMats.forEach((m, idx) => {
          m.opacity = 0.6 + 0.35 * Math.sin(now * 2 + idx * 0.8);
        });

        // embers drift upward, wrapping
        const posAttr = emberGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 1; i < posAttr.count; i++) {
          let y = posAttr.getY(i) + 0.012;
          if (y > 8.5) y = -2.5;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
        emberMat.size = 0.05 * (1 + 0.25 * Math.sin(now * 2));
        emberMat.opacity = 0.55 + 0.2 * Math.sin(now * 1.6);

        shaftMatA.opacity = 0.045 * (1 + 0.4 * Math.sin(now * 1.2));
        shaftMatB.opacity = 0.03 * (1 + 0.4 * Math.sin(now * 1.5));

        sprites.forEach((s, idx) => {
          s.scale.setScalar(0.9 + 0.22 * Math.sin(now * 2.5 + idx));
        });

        composer.render();
      };

      const onVisibility = () => {
        const running = !document.hidden && !disposed;
        renderer.setAnimationLoop(running ? loop : null);
      };
      renderer.setAnimationLoop(loop);
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        renderer.setAnimationLoop(null);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        if (!reduced) window.removeEventListener("pointermove", onPointer);
        if (!disposed) {
          disposed = true;
          disposables.forEach((d) => d.dispose());
          geometries.forEach((g) => g.dispose());
          materials.forEach((m) => m.dispose());
          textures.forEach((tx) => tx.dispose());
          renderer.dispose();
          if (renderer.domElement.parentElement === mount) {
            mount.removeChild(renderer.domElement);
          }
        }
      };
    }

    let cleanupRef: (() => void) | undefined;
    boot().then((cleanup) => {
      cleanupRef = cleanup;
      return undefined;
    });

    return () => {
      hiddenRef.current = true;
      cleanupRef?.();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" role="img" aria-label="Animated homelab render" />;
}