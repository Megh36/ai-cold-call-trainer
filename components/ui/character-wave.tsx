import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const CHARACTER_WAVE_SOURCE_URL =
  "https://raw.githubusercontent.com/MengTo/threeui/02f9835e60ef8f0cac7907810aa223b7d414db1b/src/shaders/character-carousel/sources/character-wave.html";

export type CharacterWaveProps = {
  speed?: number;
  scale?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

export const CHARACTER_WAVE_DEFAULTS = {
  speed: 1,
  scale: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const satisfies Required<
  Pick<
    CharacterWaveProps,
    "speed" | "scale" | "opacity" | "hue" | "saturation" | "brightness"
  >
>;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildFocusedDocument(rawSource: string) {
  const focusStyles = `<style data-character-carousel-focus>
:root { --character-carousel-scale: 1; }
html, body, .stage { width: 100%; height: 100%; margin: 0; overflow: hidden; }
.stage { min-height: 0 !important; }
.deck { transform: scale(var(--character-carousel-scale)); transform-origin: 50% 50%; }
</style>`;
  const controls = `<script data-character-carousel-controls>
(function () {
  var nativeFrame = window.requestAnimationFrame.bind(window);
  var clock = { real: null, virtual: null };
  var controls = window.__CHARACTER_CAROUSEL_CONTROLS = { speed: 1, scale: 1, paused: false };
  window.__CHARACTER_CAROUSEL_NOW = function () {
    return clock.virtual === null ? performance.now() : clock.virtual;
  };
  window.requestAnimationFrame = function (callback) {
    function tick(realTime) {
      if (clock.real === null) {
        clock.real = realTime;
        clock.virtual = realTime;
      } else {
        if (!controls.paused) clock.virtual += (realTime - clock.real) * controls.speed;
        clock.real = realTime;
      }
      if (controls.paused) {
        return nativeFrame(tick);
      }
      callback(clock.virtual);
    }
    return nativeFrame(tick);
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'character-carousel-controls') return;
    var next = event.data.controls || {};
    if (Number.isFinite(next.speed)) controls.speed = Math.max(0, Math.min(2.5, next.speed));
    if (Number.isFinite(next.scale)) controls.scale = Math.max(0.7, Math.min(1.3, next.scale));
    controls.paused = Boolean(next.paused);
    document.documentElement.style.setProperty('--character-carousel-scale', String(controls.scale));
  });
})();
</script>`;

  const focusedSource = rawSource.replaceAll(
    "performance.now()",
    "window.__CHARACTER_CAROUSEL_NOW()",
  );

  return focusedSource
    .replace(/<script[^>]+cloudflareinsights\.com[^>]*><\/script>/gi, "")
    .replace("</head>", `${focusStyles}${controls}</head>`);
}

export function CharacterWave({
  speed = CHARACTER_WAVE_DEFAULTS.speed,
  scale = CHARACTER_WAVE_DEFAULTS.scale,
  opacity = CHARACTER_WAVE_DEFAULTS.opacity,
  hue = CHARACTER_WAVE_DEFAULTS.hue,
  saturation = CHARACTER_WAVE_DEFAULTS.saturation,
  brightness = CHARACTER_WAVE_DEFAULTS.brightness,
  className = "",
  style,
}: CharacterWaveProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [rawSource, setRawSource] = useState<string>("");
  const [hostVisible, setHostVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const safeSpeed = clamp(speed, 0, 2.5);
  const safeScale = clamp(scale, 0.7, 1.3);
  const paused = !hostVisible || !documentVisible || safeSpeed === 0;
  const source = useMemo(
    () => (rawSource ? buildFocusedDocument(rawSource) : ""),
    [rawSource],
  );

  useEffect(() => {
    let active = true;
    fetch(CHARACTER_WAVE_SOURCE_URL)
      .then((response) => response.text())
      .then((text) => {
        if (active) setRawSource(text);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const postControls = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "character-carousel-controls",
        controls: { speed: safeSpeed, scale: safeScale, paused },
      },
      "*",
    );
  }, [paused, safeScale, safeSpeed]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || typeof IntersectionObserver === "undefined")
      return undefined;
    const observer = new IntersectionObserver(([entry]) =>
      setHostVisible(entry?.isIntersecting ?? true),
    );
    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    postControls();
  }, [postControls, source]);

  return (
    <div
      className={`threeui-background character-carousel character-carousel--wave${className ? ` ${className}` : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "transparent",
        pointerEvents: "none",
        ...style,
      }}
    >
      <iframe
        ref={iframeRef}
        title="Interactive character wave"
        srcDoc={source}
        sandbox="allow-scripts"
        onLoad={postControls}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "transparent",
          opacity: clamp(opacity, 0.05, 1),
          filter: `hue-rotate(${clamp(hue, -180, 180)}deg) saturate(${clamp(saturation, 0, 2)}) brightness(${clamp(brightness, 0.35, 1.65)})`,
        }}
      />
    </div>
  );
}

export default CharacterWave;
