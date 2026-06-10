import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fluidVertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fluidFragmentShader = `
precision highp float;

uniform sampler2D uFluidTex;
uniform vec2 uResolution;
uniform vec4 iMouse;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;

varying vec2 v_uv;

vec3 encodeFluid(vec3 state) {
  return state / 0.8 + 0.5;
}

vec3 decodeFluid(vec3 raw) {
  return (raw - 0.5) * 0.8;
}

float lineDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - (a + t * ab));
}

void main() {
  vec2 pixel = v_uv * uResolution;
  vec2 texel = 1.0 / uResolution;

  vec3 prev = decodeFluid(texture2D(uFluidTex, v_uv).rgb);
  vec2 vel = prev.rg;
  float ink = prev.b;

  vec3 left = decodeFluid(texture2D(uFluidTex, v_uv + vec2(-texel.x, 0.0)).rgb);
  vec3 right = decodeFluid(texture2D(uFluidTex, v_uv + vec2(texel.x, 0.0)).rgb);
  vec3 up = decodeFluid(texture2D(uFluidTex, v_uv + vec2(0.0, texel.y)).rgb);
  vec3 down = decodeFluid(texture2D(uFluidTex, v_uv + vec2(0.0, -texel.y)).rgb);

  vec2 avgVel = (left.rg + right.rg + up.rg + down.rg) * 0.25;
  float avgInk = (left.b + right.b + up.b + down.b) * 0.25;
  vel = mix(vel, avgVel, 0.28);
  ink = mix(ink, avgInk, 0.28);

  vec2 advUV = v_uv - vel * texel * 1.2;
  vec3 advected = decodeFluid(texture2D(uFluidTex, advUV).rgb);
  vel = mix(vel, advected.rg, 0.45);
  ink = mix(ink, advected.b, 0.45);

  vec2 mousePos = iMouse.xy;
  vec2 mousePrev = iMouse.zw;
  vec2 motionVec = mousePos - mousePrev;
  float motionLen = length(motionVec);
  if (motionLen > 6.0) {
    motionVec = motionVec / motionLen * 6.0;
  }

  bool hasMotion = length(iMouse.xy) > 0.0;

  if (hasMotion) {
    float qLine = lineDistance(pixel, mousePos, mousePrev);
    float qPoint = distance(pixel, mousePos);
    float q = mix(qLine, qPoint, 0.4);

    float brushSizeFactor = 2.2e-4 / uBrushSize;
    float strengthFactor = 0.03 * uBrushStrength;
    float brushMask = exp(-q * q * brushSizeFactor);

    vel += motionVec * brushMask * strengthFactor;
    ink += brushMask * strengthFactor * 3.0;
  }

  vel *= uFluidDecay;
  ink *= uTrailLength;

  if (hasMotion && motionLen < 0.5) {
    float cursorDist = distance(pixel, mousePos);
    float nearCursor = exp(-cursorDist * cursorDist * 1e-5);
    vel *= mix(1.0, uStopDecay, nearCursor);
    ink *= mix(1.0, uStopDecay, nearCursor);
  }

  vel = clamp(vel, vec2(-0.4), vec2(0.4));
  ink = clamp(ink, -0.4, 0.4);

  gl_FragColor = vec4(encodeFluid(vec3(vel, ink)), 1.0);
}
`;

const displayVertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const displayFragmentShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_fluid;

varying vec2 v_uv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) { // Reduced from 6 for performance
    sum += noise(p * freq) * amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

vec3 sampleFluidState(vec2 uv) {
  vec3 raw = texture2D(u_fluid, uv).rgb;
  return (raw - 0.5) * 0.8;
}

void main() {
  vec2 uv = v_uv;

  vec3 fluidState = sampleFluidState(v_uv);
  vec2 fluidVel = fluidState.rg;
  float fluidInk = fluidState.b;

  uv += fluidVel * (0.038 + 0.18 * fluidInk);

  uv = uv * 2.0 - 1.0;

  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  uv *= aspect;

  float t = u_time * 0.2;

  vec2 movement;
  movement.x = fbm(uv * 0.5 + t);
  movement.y = fbm(uv * 0.5 + t + 2.0);

  float pattern = fbm(uv + movement);
  pattern = smoothstep(0.0, 1.0, pattern);

  vec3 color1 = vec3(0.02, 0.04, 0.06);
  vec3 color2 = vec3(0.05, 0.15, 0.25);
  vec3 color3 = vec3(0.18, 0.69, 0.81);

  vec3 finalColor = mix(mix(color1, color2, pattern), color3, pattern * pattern);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface FluidBackgroundProps {
  isActive?: boolean;
}

export default function FluidBackground({ isActive = true }: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const mouseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(isActive);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    rendererRef.current = renderer;

    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Cap pixel ratio for performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setSize(w, h);
    renderer.setPixelRatio(pixelRatio);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Lower resolution fluid sim for performance
    const simScale = 0.35;
    const simW = Math.floor(w * simScale);
    const simH = Math.floor(h * simScale);

    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType, // Use half float for better performance
    };

    let fluidA = new THREE.WebGLRenderTarget(simW, simH, rtOptions);
    let fluidB = new THREE.WebGLRenderTarget(simW, simH, rtOptions);

    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const fluidMat = new THREE.ShaderMaterial({
      vertexShader: fluidVertexShader,
      fragmentShader: fluidFragmentShader,
      uniforms: {
        uFluidTex: { value: fluidA.texture },
        uResolution: { value: new THREE.Vector2(simW, simH) },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uBrushSize: { value: 1.0 },
        uBrushStrength: { value: 1.0 },
        uFluidDecay: { value: 0.985 },
        uTrailLength: { value: 0.97 },
        uStopDecay: { value: 0.92 },
      },
    });

    const displayMat = new THREE.ShaderMaterial({
      vertexShader: displayVertexShader,
      fragmentShader: displayFragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(-10, -10) },
        u_resolution: { value: new THREE.Vector2(w, h) },
        u_fluid: { value: fluidA.texture },
      },
    });

    const fluidScene = new THREE.Scene();
    const fluidQuad = new THREE.Mesh(quadGeo, fluidMat);
    fluidScene.add(fluidQuad);

    const displayScene = new THREE.Scene();
    const displayQuad = new THREE.Mesh(quadGeo, displayMat);
    displayScene.add(displayQuad);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const startTime = performance.now();

    // Frame skipping for performance - render at 30fps when inactive
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isActiveRef.current) {
        // Render at reduced rate when inactive (every 2nd frame)
        if (time - lastFrameTime.current < 66) return; // ~15fps when inactive
      }

      lastFrameTime.current = time;

      const elapsed = (performance.now() - startTime) / 1000;

      // Fluid pass: read A -> write B
      fluidMat.uniforms.uFluidTex.value = fluidA.texture;
      const mx = mouseRef.current;
      fluidMat.uniforms.iMouse.value.set(
        mx.x * simW / w,
        (1 - mx.y / h) * simH,
        mx.px * simW / w,
        (1 - mx.py / h) * simH
      );

      renderer.setRenderTarget(fluidB);
      renderer.render(fluidScene, camera);

      // Swap
      const tmp = fluidA;
      fluidA = fluidB;
      fluidB = tmp;

      // Display pass
      displayMat.uniforms.u_time.value = elapsed;
      displayMat.uniforms.u_fluid.value = fluidA.texture;

      renderer.setRenderTarget(null);
      renderer.render(displayScene, camera);
    };

    animate(0);

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      mouseTimerRef.current = setTimeout(() => {
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
        mouseRef.current.px = 0;
        mouseRef.current.py = 0;
      }, 100);
    };

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      displayMat.uniforms.u_resolution.value.set(nw, nh);

      const nsw = Math.floor(nw * simScale);
      const nsh = Math.floor(nh * simScale);
      fluidA.setSize(nsw, nsh);
      fluidB.setSize(nsw, nsh);
      fluidMat.uniforms.uResolution.value.set(nsw, nsh);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      fluidA.dispose();
      fluidB.dispose();
      fluidMat.dispose();
      displayMat.dispose();
      quadGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
