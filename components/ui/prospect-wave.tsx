import React, { useEffect, useRef, useState } from "react";
import { PORTRAITS } from "./portraits";

const MALE_FACES = ["marcus", "julian"];
const FEMALE_FACES = ["sophie", "elena"];
function getFace(name, gender) {
  const hash = Array.from(name || "").reduce((a, b) => a + b.charCodeAt(0), 0);
  if (gender === "female") return PORTRAITS[FEMALE_FACES[hash % FEMALE_FACES.length]];
  return PORTRAITS[MALE_FACES[hash % MALE_FACES.length]];
}

const AVC = [
  {bg:"rgba(129,140,248,.2)",t:"#818CF8"},{bg:"rgba(52,211,153,.2)",t:"#34D399"},
  {bg:"rgba(251,191,36,.2)",t:"#FBBF24"},{bg:"rgba(249,115,22,.2)",t:"#F97316"},
  {bg:"rgba(236,72,153,.2)",t:"#EC4899"},{bg:"rgba(20,184,166,.2)",t:"#14B8A6"},
];
const getAVC = (n) => AVC[(n||"A").charCodeAt(0) % AVC.length];
const getInitials = (n) => (n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

const DC = {Easy:{c:"#22C55E",r:"34,197,94"},Medium:{c:"#F59E0B",r:"245,158,11"},Hard:{c:"#EF4444",r:"239,68,68"}};
function DBadge({diff}) {
  const d=DC[diff]||DC.Medium;
  return <span style={{background:`rgba(${d.r},.1)`,border:`1px solid rgba(${d.r},.25)`,color:d.c,borderRadius:"6px",padding:"3px 7px",fontSize:"12px",fontWeight:"700", whiteSpace: "nowrap", marginLeft: "6px", verticalAlign: "middle"}}>{diff}</span>;
}

export default function ProspectWave({ prospects = [], onSelect }) {
  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const stateRef = useRef({
    phase: 0,
    targetPhase: 0,
    basePhase: 0,
    orientation: typeof window !== "undefined" && window.innerWidth < 680 ? 1 : 0,
    targetOrientation: typeof window !== "undefined" && window.innerWidth < 680 ? 1 : 0,
    pointerX: 0,
    pointerY: 0,
    tiltX: 0,
    tiltY: 0,
    active: false,
    manualOrientation: false,
    lastInput: typeof performance !== "undefined" ? performance.now() : 0,
    previousTime: typeof performance !== "undefined" ? performance.now() : 0,
  });

  const count = prospects.length;

  useEffect(() => {
    if (count === 0) return;

    function wrappedDelta(index, phase) {
      let delta = index - phase;
      while (delta > count / 2) delta -= count;
      while (delta < -count / 2) delta += count;
      return delta;
    }

    function nearestIndex(phase) {
      return (Math.round(phase) % count + count) % count;
    }

    let rafId;

    const render = (time) => {
      const state = stateRef.current;
      const deltaTime = Math.min(32, time - state.previousTime);
      state.previousTime = time;

      const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ease = reducedMotion ? 1 : 1 - Math.pow(0.0007, deltaTime / 1000);

      if (!state.active && !state.manualOrientation && time - state.lastInput > 4200) {
        const idle = time - state.lastInput - 4200;
        state.targetPhase = state.basePhase + Math.sin(idle * 0.00034) * 1.9;
        state.targetOrientation = (Math.sin(idle * 0.00019 - Math.PI / 2) + 1) / 2;
      }

      state.phase += (state.targetPhase - state.phase) * ease;
      state.orientation += (state.targetOrientation - state.orientation) * ease * 0.72;
      state.tiltX += ((state.active ? state.pointerX : 0) - state.tiltX) * ease * 0.72;
      state.tiltY += ((state.active ? state.pointerY : 0) - state.tiltY) * ease * 0.72;

      const horizontalSpacing = Math.min(220, Math.max(160, window.innerWidth * 0.15));
      const verticalSpacing = Math.min(250, Math.max(190, window.innerHeight * 0.25));
      const currentActiveIndex = nearestIndex(state.phase);
      
      if (currentActiveIndex !== activeIndex) {
        setActiveIndex(currentActiveIndex);
      }

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        const delta = wrappedDelta(index, state.phase);
        const distance = Math.abs(delta);
        const focus = Math.exp(-Math.pow(distance, 2) * 1.05);
        const side = Math.max(0, 1 - distance / 5);
        const direction = Math.sign(delta);

        const horizontalX = delta * horizontalSpacing;
        const horizontalY = -Math.pow(distance, 1.45) * 6 + Math.sin(delta * 0.8) * 5;
        const verticalX = Math.sin(delta * 0.82) * Math.min(78, window.innerWidth * 0.06)
          + direction * Math.pow(distance, 1.25) * 8;
        const verticalY = delta * verticalSpacing;

        const x = horizontalX * (1 - state.orientation) + verticalX * state.orientation;
        const y = horizontalY * (1 - state.orientation) + verticalY * state.orientation;
        const z = focus * 95 - distance * 78;
        const scale = 0.57 + side * 0.16 + focus * 0.38;
        const rotateX = (
          -state.tiltY * focus * 5
          + delta * 2.2 * state.orientation
        );
        const rotateY = (
          state.tiltX * focus * 7
          - delta * 8.5 * (1 - state.orientation)
        );
        const rotateZ = (
          delta * 2.25 * (1 - state.orientation)
          - delta * 1.4 * state.orientation
        );

        card.style.setProperty("--focus", focus.toFixed(4));
        card.style.zIndex = String(Math.round(1000 - distance * 100));
        card.style.opacity = String(Math.max(0.14, side * 0.82 + focus * 0.18));
        card.style.filter = `blur(${Math.max(0, distance - 1.35) * 0.45}px) saturate(${0.72 + focus * 0.28})`;
        card.style.transform = [
          "translate(-50%, -50%)",
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`,
          `rotateX(${rotateX.toFixed(2)}deg)`,
          `rotateY(${rotateY.toFixed(2)}deg)`,
          `rotateZ(${rotateZ.toFixed(2)}deg)`,
          `scale(${scale.toFixed(4)})`
        ].join(" ");
        card.setAttribute("aria-current", index === currentActiveIndex ? "true" : "false");
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [count, activeIndex]);

  const handlePointer = (event) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));

    const state = stateRef.current;
    state.pointerX = nx;
    state.pointerY = ny;
    state.tiltX = nx;
    state.tiltY = ny;
    state.active = true;
    state.lastInput = performance.now();

    const axis = state.targetOrientation > 0.5 ? ny : nx;
    state.targetPhase = state.basePhase + axis * (window.innerWidth < 680 ? 1.55 : 2.45);
    stageRef.current.style.setProperty("--pointer-x", `${((nx + 1) / 2) * 100}%`);
    stageRef.current.style.setProperty("--pointer-y", `${((ny + 1) / 2) * 100}%`);
  };

  const handlePointerLeave = () => {
    const state = stateRef.current;
    state.active = false;
    state.targetPhase = state.basePhase;
    state.pointerX = 0;
    state.pointerY = 0;
    if (stageRef.current) {
      stageRef.current.style.setProperty("--pointer-x", "50%");
      stageRef.current.style.setProperty("--pointer-y", "50%");
    }
  };

  const toggleOrientation = () => {
    const state = stateRef.current;
    state.manualOrientation = true;
    state.targetOrientation = state.targetOrientation > 0.5 ? 0 : 1;
    state.targetPhase = state.basePhase;
    state.lastInput = performance.now();
  };

  useEffect(() => {
    const stage = stageRef.current;
    const handleWheel = (event) => {
      event.preventDefault();
      const direction = Math.sign(Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX);
      if (!direction) return;
      
      const state = stateRef.current;
      state.basePhase += direction * 0.75; 
      state.targetPhase = state.basePhase;
      state.active = false;
      state.lastInput = performance.now();
    };

    if (stage) {
      stage.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (stage) stage.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", " "].includes(event.key)) {
        event.preventDefault();
      }
      const state = stateRef.current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        state.basePhase += 1;
        state.targetPhase = state.basePhase;
        state.lastInput = performance.now();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        state.basePhase -= 1;
        state.targetPhase = state.basePhase;
        state.lastInput = performance.now();
      }
      if (event.key === " ") toggleOrientation();
    };

    const handleResize = () => {
      const state = stateRef.current;
      if (!state.manualOrientation) {
        state.targetOrientation = window.innerWidth < 680 ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectCard = (index, p) => {
    const state = stateRef.current;
    const current = (Math.round(state.phase) % count + count) % count;
    let delta = index - current;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    
    if (delta === 0) {
      onSelect(p);
    } else {
      state.basePhase += delta;
      state.targetPhase = state.basePhase;
      state.lastInput = performance.now();
    }
  };

  return (
    <div 
      className="wave-stage" 
      ref={stageRef}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerLeave={handlePointerLeave}
      onDoubleClick={toggleOrientation}
    >
      <div className="wave-deck" ref={deckRef}>
        {prospects.map((p, i) => {
          const { bg, t } = getAVC(p.name);
          return (
            <button
              key={p.id || i}
              type="button"
              className="wave-card"
              data-index={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => selectCard(i, p)}
              style={{
                "--card-color": bg,
              }}
            >
              <span className="wave-portrait">
                <img src={getFace(p.name, p.gender)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.88) contrast(1.02)" }} />
              </span>
              <span className="wave-identity">
                <span className="wave-name">{p.name} <DBadge diff={p.diff || p.difficulty} /></span>
                <span className="wave-role">{p.spec || p.title}</span>
                {p.ctx && <span className="wave-desc">{p.ctx}</span>}
                <span className="wave-follow" aria-hidden="true">Call Prospect</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
