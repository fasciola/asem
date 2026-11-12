import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface SeaTurtleSectionProps {
    lang: UseLanguageReturn;
}

type MorphKey = 'gold' | 'obsidian' | 'bronze' | 'amber';

const MORPHS: Record<
    MorphKey,
    {
        shell: string;
        seam: string;
        skin: string;
        patch: string;
        belly: string;
        dotA: string;
        dotB: string;
        dotC: string;
        labelEn: string;
        labelAr: string;
    }
> = {
    gold: {
        shell: '#b98232',
        seam: '#f3c98b',
        skin: '#f6e7cb',
        patch: '#8f6427',
        belly: '#fff8e7',
        dotA: '#8f6427',
        dotB: '#d6a14f',
        dotC: '#f3c98b',
        labelEn: 'Royal Gold',
        labelAr: 'ذهبي ملكي',
    },
    obsidian: {
        shell: '#1f1912',
        seam: '#f3c98b',
        skin: '#e8d5b5',
        patch: '#332619',
        belly: '#f5ebd6',
        dotA: '#0d0a07',
        dotB: '#8f6427',
        dotC: '#f3c98b',
        labelEn: 'Obsidian Gold',
        labelAr: 'أسود وذهبي',
    },
    bronze: {
        shell: '#9a6232',
        seam: '#ffdca4',
        skin: '#f4dfc4',
        patch: '#754720',
        belly: '#fff2de',
        dotA: '#754720',
        dotB: '#c98a4b',
        dotC: '#ffdca4',
        labelEn: 'Warm Bronze',
        labelAr: 'برونزي دافئ',
    },
    amber: {
        shell: '#d6a14f',
        seam: '#fff6d6',
        skin: '#fff1d0',
        patch: '#b98232',
        belly: '#fffaf0',
        dotA: '#b98232',
        dotB: '#f3c98b',
        dotC: '#fffaf0',
        labelEn: 'Champagne',
        labelAr: 'شامبين',
    },
};

const COLOR_KEYS = ['shell', 'seam', 'skin', 'patch', 'belly'] as const;
type ColorChannel = (typeof COLOR_KEYS)[number];

export default function SeaTurtleSection({ lang }: SeaTurtleSectionProps) {
    const { t, isRTL } = lang;
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeMorph, setActiveMorph] = useState<MorphKey>('gold');
    const [webglFailed, setWebglFailed] = useState(false);

    const targetColorsRef = useRef<Record<ColorChannel, THREE.Color> | null>(null);

    const handleMorphChange = (morphKey: MorphKey) => {
        setActiveMorph(morphKey);
        const targets = targetColorsRef.current;
        if (!targets) return;
        const m = MORPHS[morphKey];
        COLOR_KEYS.forEach((k) => {
            targets[k].copy(new THREE.Color(m[k]).convertSRGBToLinear());
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const hero = sectionRef.current;
        if (!canvas || !hero) return;

        let rafId = 0;
        let resizeObserver: ResizeObserver | null = null;
        let intersectionObserver: IntersectionObserver | null = null;
        let renderer: THREE.WebGLRenderer | null = null;
        const disposables: Array<{ dispose: () => void }> = [];

        const lin = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();

        let onPointerMove: ((e: PointerEvent) => void) | null = null;
        let onVisibilityChange: (() => void) | null = null;
        let onContextLost: ((e: Event) => void) | null = null;
        let onContextRestored: (() => void) | null = null;
        let onWindowResize: (() => void) | null = null;

        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                stencil: false,
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0);
            renderer.outputColorSpace = THREE.SRGBColorSpace;

            const FOV = 35;
            const CAM_Z = 7;
            const PI = Math.PI;
            const deg = PI / 180;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
            camera.position.set(0, 0, CAM_Z);

            // Warm Asem Vision Gold & Ivory lighting
            scene.add(new THREE.HemisphereLight(0xfff3db, 0x261a0a, 0.85 * PI));
            const key = new THREE.DirectionalLight(0xfffaf0, 0.9 * PI);
            key.position.set(2, 4, 3.5);
            scene.add(key);

            const rim = new THREE.DirectionalLight(0xf3c98b, 0.78 * PI);
            rim.position.set(-3, 1.5, -2.5);
            scene.add(rim);

            /* ---------- seeded random + painted textures ---------- */
            let seed = 7;
            const rnd = () => {
                seed = (seed * 1664525 + 1013904223) % 4294967296;
                return seed / 4294967296;
            };
            const smooth = (a: number, b: number, x: number) => {
                const u = Math.min(Math.max((x - a) / (b - a), 0), 1);
                return u * u * (3 - 2 * u);
            };

            const paint = (w: number, h: number, fn: (u: number, v: number) => [number, number]) => {
                const a = document.createElement('canvas');
                const b = document.createElement('canvas');
                a.width = b.width = w;
                a.height = b.height = h;
                const ca = a.getContext('2d')!;
                const cb = b.getContext('2d')!;
                const ia = ca.createImageData(w, h);
                const ib = cb.createImageData(w, h);

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const r = fn((x + 0.5) / w, (y + 0.5) / h);
                        const o = (y * w + x) * 4;
                        const c = Math.round(r[0] * 255);
                        const m = Math.round(r[1] * 255);
                        ia.data[o] = ia.data[o + 1] = ia.data[o + 2] = c;
                        ia.data[o + 3] = 255;
                        ib.data[o] = ib.data[o + 1] = ib.data[o + 2] = m;
                        ib.data[o + 3] = 255;
                    }
                }
                ca.putImageData(ia, 0, 0);
                cb.putImageData(ib, 0, 0);

                const map = new THREE.CanvasTexture(a);
                const mask = new THREE.CanvasTexture(b);
                map.colorSpace = THREE.SRGBColorSpace;
                mask.colorSpace = THREE.SRGBColorSpace;
                map.anisotropy = 4;
                mask.anisotropy = 4;
                disposables.push(map, mask);
                return { map, mask };
            };

            const nearest = (pts: number[][], x: number, y: number) => {
                let d1 = 9;
                let d2 = 9;
                let k = 0;
                for (let i = 0; i < pts.length; i++) {
                    const dx = x - pts[i][0];
                    const dy = y - pts[i][1];
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < d1) {
                        d2 = d1;
                        d1 = d;
                        k = i;
                    } else if (d < d2) {
                        d2 = d;
                    }
                }
                return { k, d: d1, e: d2 - d1, dx: x - pts[k][0], dy: y - pts[k][1] };
            };

            // Shell scutes
            const inner: number[][] = [];
            const RM = 0.8;
            const NM = 26;
            const shades: number[] = [];
            [-0.6, -0.3, 0, 0.3, 0.6].forEach((x) => inner.push([x, 0]));
            [-0.46, -0.155, 0.155, 0.46].forEach((x) => {
                inner.push([x, 0.43]);
                inner.push([x, -0.43]);
            });
            for (let i = 0; i < inner.length + NM; i++) {
                shades.push(0.62 + rnd() * 0.3);
            }

            const shellTex = paint(768, 768, (u, v) => {
                const x = (u - 0.5) * 2;
                const y = (v - 0.5) * 2;
                const r = Math.sqrt(x * x + y * y);
                let e: number;
                let k: number;
                let ang: number;
                let d: number;
                const sw = 0.03;

                if (r > RM) {
                    const a = ((Math.atan2(y, x) + PI) / (PI * 2)) * NM;
                    const fa = a - Math.floor(a);
                    k = inner.length + (Math.floor(a) % NM);
                    e = 2 * Math.min(Math.min(fa, 1 - fa) * ((PI * 2) / NM) * r, r - RM);
                    ang = (fa - 0.5) * 3;
                    d = (r - RM) * 0.6;
                } else {
                    const n = nearest(inner, x, y);
                    k = n.k;
                    e = Math.min(n.e, 2 * (RM - r));
                    ang = Math.atan2(n.dy, n.dx);
                    d = n.d;
                }
                const seam = 1 - smooth(sw * 0.45, sw, e);
                let st =
                    0.5 +
                    0.5 *
                        Math.sin(
                            ang * 12 + k * 2.1 + Math.sin(ang * 4 + k) * 2.4 + Math.sin(d * 38 + k) * 0.9
                        );
                st = st * st * st * smooth(0.03, 0.16, d) * (1 - seam);
                const g = shades[k] * (0.74 + 0.26 * smooth(sw, sw * 5, e)) * (1 - 0.18 * st);
                return [g * (1 - seam) + 0.2 * seam, st * 0.85];
            });

            // Skin scales
            const scaleTex = (
                w: number,
                h: number,
                rows: Array<{ n: number; v: number; j: number; jv: number }>,
                aspect: number
            ) => {
                const pts: number[][] = [];
                rows.forEach((row) => {
                    for (let i = 0; i < row.n; i++) {
                        pts.push([
                            ((i + 0.5 + (rnd() - 0.5) * row.j) / row.n) * aspect,
                            row.v + (rnd() - 0.5) * row.jv,
                        ]);
                    }
                });
                const sh = pts.map(() => 0.6 + rnd() * 0.35);
                return paint(w, h, (u, v) => {
                    const n = nearest(pts, u * aspect, v);
                    const sw = 0.022;
                    const seam = 1 - smooth(sw * 0.4, sw, n.e);
                    const g = sh[n.k] * (0.8 + 0.2 * smooth(sw, sw * 4, n.e));
                    return [g * (1 - seam) + 0.75 * seam, seam];
                });
            };

            const flipTex = scaleTex(
                768,
                256,
                [
                    { n: 11, v: 0.93, j: 0.3, jv: 0.03 },
                    { n: 13, v: 0.76, j: 0.5, jv: 0.05 },
                    { n: 17, v: 0.58, j: 0.7, jv: 0.06 },
                    { n: 21, v: 0.42, j: 0.8, jv: 0.06 },
                    { n: 24, v: 0.27, j: 0.8, jv: 0.06 },
                    { n: 26, v: 0.12, j: 0.8, jv: 0.05 },
                ],
                3
            );

            const headTex = scaleTex(
                384,
                384,
                [
                    { n: 3, v: 0.5, j: 0.2, jv: 0.02 },
                    { n: 6, v: 0.36, j: 0.5, jv: 0.05 },
                    { n: 6, v: 0.64, j: 0.5, jv: 0.05 },
                    { n: 8, v: 0.2, j: 0.7, jv: 0.06 },
                    { n: 8, v: 0.8, j: 0.7, jv: 0.06 },
                    { n: 9, v: 0.06, j: 0.7, jv: 0.04 },
                    { n: 9, v: 0.94, j: 0.7, jv: 0.04 },
                ],
                1
            );

            /* ---------- palettes ---------- */
            const cur = {
                shell: lin(MORPHS.gold.shell),
                seam: lin(MORPHS.gold.seam),
                skin: lin(MORPHS.gold.skin),
                patch: lin(MORPHS.gold.patch),
                belly: lin(MORPHS.gold.belly),
            };
            const target = {
                shell: lin(MORPHS.gold.shell),
                seam: lin(MORPHS.gold.seam),
                skin: lin(MORPHS.gold.skin),
                patch: lin(MORPHS.gold.patch),
                belly: lin(MORPHS.gold.belly),
            };
            targetColorsRef.current = target;

            const shellMat = new THREE.MeshStandardMaterial({
                map: shellTex.map,
                bumpMap: shellTex.map,
                bumpScale: 0.03,
                emissiveMap: shellTex.mask,
                emissiveIntensity: 0.38,
                roughness: 0.26,
                metalness: 0.14,
            });
            const skinMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });
            const bellyMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });

            const scaleMat = (tex: { map: THREE.CanvasTexture; mask: THREE.CanvasTexture }) => {
                const m = new THREE.MeshStandardMaterial({
                    map: tex.map,
                    bumpMap: tex.map,
                    bumpScale: 0.012,
                    emissiveMap: tex.mask,
                    emissiveIntensity: 0.5,
                    roughness: 0.45,
                    side: THREE.DoubleSide,
                });
                m.color = cur.patch;
                m.emissive = cur.skin;
                disposables.push(m);
                return m;
            };

            const flipMat = scaleMat(flipTex);
            const headMat = scaleMat(headTex);
            shellMat.color = cur.shell;
            shellMat.emissive = cur.seam;
            skinMat.color = cur.skin;
            bellyMat.color = cur.belly;
            disposables.push(shellMat, skinMat, bellyMat);

            const domeUV = (geo: THREE.BufferGeometry, thetaMax: number) => {
                const p = geo.attributes.position;
                const uv = geo.attributes.uv;
                for (let i = 0; i < p.count; i++) {
                    const x = p.getX(i);
                    const y = p.getY(i);
                    const z = p.getZ(i);
                    const len = Math.sqrt(x * x + y * y + z * z) || 1;
                    const h = Math.sqrt(x * x + z * z) || 1;
                    const r = Math.acos(Math.max(-1, Math.min(1, y / len))) / thetaMax;
                    uv.setXY(i, 0.5 + (0.5 * r * x) / h, 0.5 + (0.5 * r * z) / h);
                }
            };

            const ball = (
                r: number,
                mat: THREE.Material,
                sx: number,
                sy: number,
                sz: number,
                x: number,
                y: number,
                z: number
            ) => {
                const g = new THREE.SphereGeometry(r, 40, 28);
                disposables.push(g);
                const m = new THREE.Mesh(g, mat);
                m.scale.set(sx, sy, sz);
                m.position.set(x, y, z);
                return m;
            };

            const turtle = new THREE.Group();

            /* ---------- shell ---------- */
            const ST = PI * 0.57;
            const sg = new THREE.SphereGeometry(1, 72, 44, 0, PI * 2, 0, ST);
            disposables.push(sg);
            domeUV(sg, ST);
            const spz = sg.attributes.position;
            for (let i = 0; i < spz.count; i++) {
                const x0 = spz.getX(i);
                spz.setZ(i, spz.getZ(i) * (x0 < 0 ? 1 - 0.3 * x0 * x0 : 1 - 0.08 * x0 * x0));
            }
            sg.computeVertexNormals();
            const shell = new THREE.Mesh(sg, shellMat);
            shell.scale.set(1.08, 0.5, 0.92);
            turtle.add(shell);
            turtle.add(ball(1, bellyMat, 1.0, 0.27, 0.84, 0, -0.1, 0));

            /* ---------- head ---------- */
            const HC = new THREE.Vector3(1.33, 0.1, 0);
            const HS = new THREE.Vector3(0.5, 0.33, 0.35);
            const beak = (v: THREE.Vector3) => {
                const x = v.x;
                if (x > 0) {
                    const k = 1 - 0.45 * x * x;
                    v.y = v.y * k - 0.13 * x * x * x;
                    v.z *= k * (1 - 0.12 * x);
                } else {
                    const b = 1 - 0.18 * x * x;
                    v.y *= b;
                    v.z *= b;
                }
                if (v.y > 0) v.y *= 0.92;
                return v;
            };

            const headGeo = (r: number, thetaLen: number) => {
                const g = new THREE.SphereGeometry(r, 56, 36, 0, PI * 2, 0, thetaLen);
                disposables.push(g);
                const p = g.attributes.position;
                const v = new THREE.Vector3();
                if (thetaLen < PI) domeUV(g, thetaLen);
                for (let i = 0; i < p.count; i++) {
                    v.fromBufferAttribute(p, i).divideScalar(r);
                    beak(v).multiplyScalar(r);
                    p.setXYZ(i, v.x * HS.x, v.y * HS.y, v.z * HS.z);
                }
                g.computeVertexNormals();
                return g;
            };

            const onHead = (az: number, el: number, k = 1) => {
                const v = beak(
                    new THREE.Vector3(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az))
                );
                return v.multiply(HS).multiplyScalar(k).add(HC);
            };

            turtle.add(ball(0.3, skinMat, 1.35, 0.78, 0.9, 0.95, 0.0, 0));
            const head = new THREE.Mesh(headGeo(1, PI), skinMat);
            head.position.copy(HC);
            turtle.add(head);

            const crown = new THREE.Mesh(headGeo(1.014, 1.78), headMat);
            crown.position.copy(HC);
            turtle.add(crown);

            const eyeMat = new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.04, metalness: 0.2 });
            const lidMat = new THREE.MeshStandardMaterial({ color: 0x241a0e, roughness: 0.6 });
            const whiteMat = new THREE.MeshBasicMaterial({ color: 0xfffaf0 });
            const darkMat = new THREE.MeshBasicMaterial({ color: 0x1c140b });
            disposables.push(eyeMat, lidMat, whiteMat, darkMat);

            [1, -1].forEach((s) => {
                const surf = onHead(s * 0.92, 0.2, 1);
                const out = surf.clone().sub(HC).normalize();
                const lidGeo = new THREE.SphereGeometry(0.105, 28, 20);
                const eyeGeo = new THREE.SphereGeometry(0.09, 28, 20);
                const glintGeo = new THREE.SphereGeometry(0.015, 10, 8);
                const noseGeo = new THREE.SphereGeometry(0.012, 8, 8);
                disposables.push(lidGeo, eyeGeo, glintGeo, noseGeo);

                const lid = new THREE.Mesh(lidGeo, lidMat);
                lid.position.copy(surf).addScaledVector(out, -0.06);
                const eye = new THREE.Mesh(eyeGeo, eyeMat);
                eye.position.copy(surf).addScaledVector(out, -0.035);
                const glint = new THREE.Mesh(glintGeo, whiteMat);
                glint.position
                    .copy(eye.position)
                    .addScaledVector(out, 0.078)
                    .add(new THREE.Vector3(0.012, 0.032, 0));
                const nose = new THREE.Mesh(noseGeo, darkMat);
                nose.position.copy(onHead(s * 0.2, 0.42, 1.0));
                turtle.add(lid, eye, glint, nose);
            });

            const mp: THREE.Vector3[] = [];
            for (let i = 0; i <= 28; i++) {
                const az = -1.2 + (2.4 * i) / 28;
                const q = az / 1.2;
                mp.push(onHead(az, -0.34 + 0.12 * q * q * q * q, 1.016));
            }
            const mouthGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mp), 56, 0.009, 8);
            disposables.push(mouthGeo);
            turtle.add(new THREE.Mesh(mouthGeo, darkMat));

            /* ---------- flippers ---------- */
            const NU = 30;
            const NV = 14;
            interface FlipperRig {
                group: THREE.Group;
                geo: THREE.BufferGeometry;
                base: Float32Array;
                s: number;
            }

            const makeFlipper = (o: {
                s: number;
                len: number;
                fwd: number;
                sweep: number;
                width: number;
                thick: number;
                root: number;
            }): FlipperRig => {
                const n = (NU + 1) * (NV + 1);
                const pos = new Float32Array(n * 3);
                const uv = new Float32Array(n * 2);
                const idx: number[] = [];
                let q = 0;
                const centre = (u: number) => [
                    o.fwd * u - o.sweep * Math.pow(u, 2.3),
                    o.len * (u - 0.1 * u * u),
                ];

                for (let i = 0; i <= NU; i++) {
                    const u = i / NU;
                    const c = centre(u);
                    const c2 = centre(u + 0.01);
                    const tx = c2[0] - c[0];
                    const tz = c2[1] - c[1];
                    const tl = Math.sqrt(tx * tx + tz * tz);
                    const chx = tz / tl;
                    const chz = -tx / tl;
                    const w =
                        o.width *
                        Math.pow(Math.max(0, Math.sin(PI * Math.min(1, o.root + (1 - o.root) * u))), 0.75) *
                        (1 - 0.4 * u);
                    const th = o.thick * (1 - 0.72 * u) + 0.008;

                    for (let j = 0; j <= NV; j++) {
                        const a = PI + (j / NV) * PI * 2;
                        const ca = Math.cos(a);
                        const lead = (ca + 1) / 2;
                        pos[q * 3] = c[0] + chx * w * 0.5 * ca;
                        pos[q * 3 + 1] = th * Math.sin(a) * (0.45 + 0.55 * lead);
                        pos[q * 3 + 2] = (c[1] + chz * w * 0.5 * ca) * o.s;
                        uv[q * 2] = u;
                        uv[q * 2 + 1] = lead;
                        q++;
                    }
                }

                for (let i = 0; i < NU; i++) {
                    for (let j = 0; j < NV; j++) {
                        const A = i * (NV + 1) + j;
                        const B = A + NV + 1;
                        idx.push(A, B, A + 1, B, B + 1, A + 1);
                    }
                }

                const g = new THREE.BufferGeometry();
                disposables.push(g);
                g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
                g.setIndex(idx);
                g.computeVertexNormals();
                const grp = new THREE.Group();
                grp.add(new THREE.Mesh(g, flipMat));
                return { group: grp, geo: g, base: pos.slice(), s: o.s };
            };

            const bend = (f: FlipperRig, angleAt: (u: number) => number) => {
                const p = f.geo.attributes.position.array as Float32Array;
                const b = f.base;
                let q = 0;
                for (let i = 0; i <= NU; i++) {
                    const th = angleAt(i / NU) * f.s;
                    const c = Math.cos(th);
                    const s = Math.sin(th);
                    for (let j = 0; j <= NV; j++) {
                        const y = b[q * 3 + 1];
                        const z = b[q * 3 + 2];
                        p[q * 3 + 1] = y * c + z * s;
                        p[q * 3 + 2] = z * c - y * s;
                        q++;
                    }
                }
                f.geo.attributes.position.needsUpdate = true;
                f.geo.computeVertexNormals();
            };

            const flippers: Array<{ front: FlipperRig; rear: FlipperRig; s: number }> = [];
            [1, -1].forEach((s) => {
                const front = makeFlipper({
                    s,
                    len: 1.55,
                    fwd: 0.34,
                    sweep: 1.0,
                    width: 0.5,
                    thick: 0.075,
                    root: 0.16,
                });
                front.group.position.set(0.56, -0.1, s * 0.5);
                const rear = makeFlipper({
                    s,
                    len: 0.66,
                    fwd: 0.05,
                    sweep: 0.12,
                    width: 0.36,
                    thick: 0.05,
                    root: 0.2,
                });
                rear.group.position.set(-0.76, -0.1, s * 0.36);
                turtle.add(
                    front.group,
                    rear.group,
                    ball(0.2, skinMat, 1.2, 0.7, 1, 0.55, -0.1, s * 0.5),
                    ball(0.15, skinMat, 1.2, 0.7, 1, -0.74, -0.1, s * 0.36)
                );
                flippers.push({ front, rear, s });
            });

            const tailGeo = new THREE.ConeGeometry(0.08, 0.3, 16);
            disposables.push(tailGeo);
            const tail = new THREE.Mesh(tailGeo, skinMat);
            tail.rotation.z = PI / 2;
            tail.position.set(-1.12, -0.1, 0);
            turtle.add(tail);

            const rig = new THREE.Group();
            rig.add(turtle);
            scene.add(rig);

            /* ---------- drifting golden particles ---------- */
            const PN = 260;
            const pp = new Float32Array(PN * 3);
            for (let i = 0; i < PN; i++) {
                pp[i * 3] = (Math.random() - 0.5) * 14;
                pp[i * 3 + 1] = (Math.random() - 0.5) * 8;
                pp[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
            }
            const pg = new THREE.BufferGeometry();
            pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
            const pm = new THREE.PointsMaterial({
                color: 0xf3c98b,
                size: 0.04,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
            });
            disposables.push(pg, pm);
            scene.add(new THREE.Points(pg, pm));

            /* ---------- layout ---------- */
            const home = new THREE.Vector3();
            let baseScale = 1;
            let lastW = 0;
            let lastH = 0;

            const layout = () => {
                const w = hero.clientWidth;
                const h = hero.clientHeight;
                if (!w || !h || (w === lastW && h === lastH)) return;
                lastW = w;
                lastH = h;
                renderer!.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                const visH = 2 * CAM_Z * Math.tan((FOV * deg) / 2);
                const visW = visH * camera.aspect;
                if (camera.aspect > 1.15) {
                    baseScale = Math.min(1.06, (visW * 0.5) / 3.4);
                    home.set(visW * 0.06, 0.04, 0);
                } else {
                    baseScale = Math.min(0.88, (visW * 0.98) / 3.4);
                    home.set(0, 0.02, 0);
                }
                rig.scale.setScalar(baseScale);
            };

            layout();
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(layout);
                resizeObserver.observe(hero);
            } else {
                onWindowResize = layout;
                window.addEventListener('resize', onWindowResize);
            }

            /* ---------- interaction ---------- */
            let px = 0;
            let py = 0;
            let sx = 0;
            let sy = 0;
            let pcx = 0;
            let pcy = 0;
            let pDirty = false;

            onPointerMove = (e: PointerEvent) => {
                pcx = e.clientX;
                pcy = e.clientY;
                pDirty = true;
            };
            window.addEventListener('pointermove', onPointerMove, { passive: true });

            const calm =
                window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const rate = calm ? 0.3 : 1;
            let last = performance.now();
            let tClock = 0;

            const frame = (now: number) => {
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;
                tClock += dt * rate;
                if (pDirty) {
                    const r = hero.getBoundingClientRect();
                    px = ((pcx - r.left) / r.width) * 2 - 1;
                    py = ((pcy - r.top) / r.height) * 2 - 1;
                    pDirty = false;
                }
                COLOR_KEYS.forEach((k) => {
                    cur[k].lerp(target[k], Math.min(1, dt * 3));
                });
                sx += (px - sx) * Math.min(1, dt * 2.5);
                sy += (py - sy) * Math.min(1, dt * 2.5);

                const stroke = Math.sin(tClock * 1.7);
                rig.position.set(
                    home.x + Math.sin(tClock * 0.38) * 0.28 * baseScale,
                    home.y + (Math.sin(tClock * 0.7) * 0.08 - stroke * 0.04) * baseScale,
                    0
                );
                rig.rotation.y = -0.92 + sx * 0.7 + Math.sin(tClock * 0.45) * 0.1;
                rig.rotation.x = 0.4 + sy * 0.3;
                rig.rotation.z = 0.12 + Math.sin(tClock * 0.7 + 1) * 0.04;
                turtle.rotation.z = Math.cos(tClock * 1.7) * 0.035;

                for (let i = 0; i < flippers.length; i++) {
                    const f = flippers[i];
                    bend(
                        f.front,
                        (u) => (-0.16 + 0.5 * Math.sin(tClock * 1.7 - 1.1 * u)) * (0.25 + 0.75 * u)
                    );
                    bend(f.rear, (u) => (-0.1 + 0.16 * Math.sin(tClock * 1.1 + 1.3 - u)) * u);
                    f.front.group.rotation.y = -f.s * (0.1 - Math.cos(tClock * 1.7) * 0.16);
                    f.front.group.rotation.x = Math.cos(tClock * 1.7) * 0.14;
                    f.rear.group.rotation.y = -f.s * (1.2 + Math.sin(tClock * 1.1 + f.s) * 0.14);
                }

                const a = pg.attributes.position.array as Float32Array;
                for (let i = 0; i < PN; i++) {
                    a[i * 3 + 1] += dt * rate * (0.05 + (i % 7) * 0.012);
                    a[i * 3] += Math.sin(tClock * 0.6 + i) * dt * 0.02;
                    if (a[i * 3 + 1] > 4) a[i * 3 + 1] = -4;
                }
                pg.attributes.position.needsUpdate = true;

                renderer!.render(scene, camera);
                rafId = requestAnimationFrame(frame);
            };

            let inView = true;
            let ctxOK = true;
            const sync = () => {
                const run = inView && !document.hidden && ctxOK;
                if (run && !rafId) {
                    last = performance.now();
                    rafId = requestAnimationFrame(frame);
                } else if (!run && rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = 0;
                }
            };

            if (typeof IntersectionObserver !== 'undefined') {
                intersectionObserver = new IntersectionObserver((entries) => {
                    inView = entries[entries.length - 1].isIntersecting;
                    sync();
                });
                intersectionObserver.observe(canvas);
            }

            onVisibilityChange = sync;
            onContextLost = (e: Event) => {
                e.preventDefault();
                ctxOK = false;
                sync();
            };
            onContextRestored = () => {
                ctxOK = true;
                sync();
            };

            document.addEventListener('visibilitychange', onVisibilityChange);
            canvas.addEventListener('webglcontextlost', onContextLost);
            canvas.addEventListener('webglcontextrestored', onContextRestored);
            sync();
        } catch {
            setWebglFailed(true);
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            resizeObserver?.disconnect();
            intersectionObserver?.disconnect();
            if (onWindowResize) window.removeEventListener('resize', onWindowResize);
            if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
            if (onVisibilityChange) document.removeEventListener('visibilitychange', onVisibilityChange);
            if (onContextLost) canvas.removeEventListener('webglcontextlost', onContextLost);
            if (onContextRestored) canvas.removeEventListener('webglcontextrestored', onContextRestored);
            disposables.forEach((d) => d.dispose());
            renderer?.dispose();
        };
    }, []);

    const labelFont = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
    const bodyFont = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const displayFont = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', Georgia, serif";

    return (
        <section
            ref={sectionRef}
            id="web-design"
            className="st-section"
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-labelledby="sea-turtle-design-title"
        >
            {/* Golden light shafts */}
            <div className="st-shafts" aria-hidden="true" />

            {/* Ambient golden caustic glow */}
            <div className="st-caustic-glow" aria-hidden="true" />

            {/* 3D Sea Turtle WebGL Canvas (behind the transparent glass) */}
            <canvas
                ref={canvasRef}
                id="sea"
                className="st-canvas"
                aria-label={t(
                    'Animated 3D baby sea turtle swimming behind transparent glass',
                    'سلحفاة بحرية ثلاثية الأبعاد تسبح خلف لوح زجاجي شفاف'
                )}
            />

            {/* Content Container */}
            <div className="st-wrap">
                {/* Top status bar in Asem Vision Black & Gold brand palette */}
                <div className="st-bar" style={{ fontFamily: labelFont }}>
                    <strong>{t('ASEM VISION DIGITAL CRAFT', 'إبداع عاصم فيجن الرقمي')}</strong>
                    <span className="st-showcase-pill">
                        <span className="st-showcase-dot" aria-hidden="true" />
                        {t('INTERACTIVE 3D WEBGL SHOWCASE', 'عرض تفاعلي ثلاثي الأبعاد')}
                    </span>
                </div>

                {/* Transparent Glass Panel in front of the 3D Sea Turtle */}
                <div className="st-stage-center">
                    <div className="st-glass-panel">
                        {/* Specular glass reflection sweep */}
                        <div className="st-glass-sheen" aria-hidden="true" />

                        {/* Logo on top of the glass */}
                        <div className="st-logo-crest">
                            <div className="st-logo-halo" aria-hidden="true" />
                            <div className="st-logo-badge">
                                <img
                                    src="/asem-vision-logo.png"
                                    alt="Asem Vision Logo"
                                    className="st-logo-img"
                                />
                            </div>
                            <span className="st-logo-caption" style={{ fontFamily: labelFont }}>
                                {t('ASEM VISION', 'عاصم فيجن')}
                            </span>
                        </div>

                        {/* Text about the website design by Asem Vision */}
                        <div className="st-copy">
                            <div className="st-eyebrow" style={{ fontFamily: labelFont }}>
                                {t(
                                    'BESPOKE WEBSITE DESIGN & 3D EXPERIENCE',
                                    'تصميم المواقع والتجارب الرقمية ثلاثية الأبعاد'
                                )}
                            </div>

                            <h2
                                id="sea-turtle-design-title"
                                className="st-title"
                                style={{ fontFamily: displayFont }}
                            >
                                {t('Website Design by ', 'تصميم وتطوير الموقع بواسطة ')}
                                <em style={{ fontStyle: isRTL ? 'normal' : 'italic' }}>
                                    {t('Asem Vision', 'عاصم فيجن')}
                                </em>
                            </h2>

                            <p className="st-description" style={{ fontFamily: bodyFont }}>
                                {t(
                                    'Crafted with living 3D WebGL artistry, crystal glassmorphism, and fluid motion choreography. At Asem Vision, we design and engineer immersive digital flagships that merge aesthetic depth with effortless performance—turning every scroll into an unforgettable brand experience.',
                                    'صُمّم هذا الموقع بتقنيات ثلاثية الأبعاد حيّة (WebGL)، وواجهات زجاجية شفافة، وحركة انسيابية متقنة. في عاصم فيجن، نبتكر ونطوّر مواقع وتجارب رقمية غامرة تجمع بين العمق البصري والأداء الفائق لتحويل حضور علامتك التجارية إلى تجربة لا تُنسى.'
                                )}
                            </p>

                            {/* Design specs / facts row */}
                            <dl className="st-facts">
                                <div>
                                    <dt style={{ fontFamily: labelFont }}>
                                        {t('Architecture', 'الهندسة الرقمية')}
                                    </dt>
                                    <dd style={{ fontFamily: bodyFont }}>
                                        {t('Real-Time 3D & Glass UI', 'واجهات زجاجية و 3D فوري')}
                                    </dd>
                                </div>
                                <div>
                                    <dt style={{ fontFamily: labelFont }}>
                                        {t('Crafted By', 'بتوقيع')}
                                    </dt>
                                    <dd style={{ fontFamily: bodyFont }}>
                                        {t('Asem Vision Studio', 'استوديو عاصم فيجن')}
                                    </dd>
                                </div>
                                <div>
                                    <dt style={{ fontFamily: labelFont }}>
                                        {t('Standard', 'المعيار')}
                                    </dt>
                                    <dd style={{ fontFamily: bodyFont }}>
                                        {t('GCC Luxury Digital', 'الفخامة الرقمية في الخليج')}
                                    </dd>
                                </div>
                            </dl>

                            {/* Interactive 3D Turtle Morph Controls + CTA */}
                            <div className="st-controls-row">
                                <div
                                    className="st-morphs"
                                    role="group"
                                    aria-label={t('3D Turtle Palette', 'ألوان السلحفاة ثلاثية الأبعاد')}
                                >
                                    {(Object.keys(MORPHS) as MorphKey[]).map((key) => {
                                        const m = MORPHS[key];
                                        const isPressed = activeMorph === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                aria-pressed={isPressed}
                                                onClick={() => handleMorphChange(key)}
                                                className="st-morph-btn"
                                                style={{ fontFamily: bodyFont }}
                                            >
                                                <span
                                                    className="st-dot"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${m.dotA}, ${m.dotB} 60%, ${m.dotC})`,
                                                    }}
                                                />
                                                {t(m.labelEn, m.labelAr)}
                                            </button>
                                        );
                                    })}
                                </div>

                                <a
                                    href="#contact"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document
                                            .getElementById('contact')
                                            ?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="btn-primary st-cta-btn"
                                    style={{ fontFamily: labelFont, textDecoration: 'none' }}
                                >
                                    {t('Design Your Website', 'صمّم موقعك معنا')}
                                </a>
                            </div>

                            {!webglFailed ? (
                                <div className="st-hint" style={{ fontFamily: bodyFont }}>
                                    {t(
                                        'Move your pointer—or drag on touch—to guide the 3D sea turtle swimming behind the glass.',
                                        'حرّك المؤشر أو اسحب باللمس لتوجيه السلحفاة ثلاثية الأبعاد التي تسبح خلف الزجاج الشفاف.'
                                    )}
                                </div>
                            ) : (
                                <div className="st-fallback" style={{ fontFamily: bodyFont }}>
                                    {t(
                                        'This browser could not start WebGL, so the 3D turtle cannot be shown here.',
                                        'تعذّر تشغيل WebGL في هذا المتصفح لعرض المجسم ثلاثي الأبعاد.'
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .st-section {
                    /* Asem Vision Black & Gold Brand Palette */
                    --abyss: #030201;
                    --deep: #140e06;
                    --shallows: #3b2910;
                    --foam: #fffaf0;
                    --mist: rgba(243, 201, 139, 0.82);
                    --line: rgba(214, 161, 79, 0.32);
                    --glow: #f3c98b;
                    --gold-primary: #d6a14f;
                    --gold-dark: #8f6427;
                    position: relative;
                    min-height: clamp(46rem, 94vh, 62rem);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    isolation: isolate;
                    border-top: 1px solid rgba(243, 201, 139, 0.22);
                    border-bottom: 1px solid rgba(243, 201, 139, 0.22);
                    background:
                        radial-gradient(120% 85% at 72% -12%, var(--shallows) 0%, var(--deep) 46%, var(--abyss) 100%) !important;
                }

                .st-shafts {
                    position: absolute;
                    inset: -20% -10% 0 -10%;
                    z-index: 0;
                    background: repeating-linear-gradient(
                        104deg,
                        rgba(243, 201, 139, 0) 0 7%,
                        rgba(243, 201, 139, 0.085) 9% 11%,
                        rgba(243, 201, 139, 0) 14% 21%
                    ) !important;
                    -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 74%);
                    mask-image: linear-gradient(to bottom, #000 0%, transparent 74%);
                    pointer-events: none;
                }

                .st-caustic-glow {
                    position: absolute;
                    width: min(68vw, 760px);
                    height: min(68vw, 760px);
                    left: 54%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    background: radial-gradient(
                        circle,
                        rgba(214, 161, 79, 0.24) 0%,
                        rgba(243, 201, 139, 0.10) 42%,
                        transparent 70%
                    ) !important;
                    filter: blur(42px);
                    z-index: 0;
                    pointer-events: none;
                }

                /* Override global index.css canvas grayscale filter so the 3D Sea Turtle shines in brand gold */
                canvas.st-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    z-index: 1;
                    touch-action: pan-y;
                    filter: none !important;
                    opacity: 1 !important;
                }

                .st-wrap {
                    position: relative;
                    z-index: 3;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 2rem;
                    padding: clamp(2rem, 4vw, 3.25rem) clamp(1.25rem, 4vw, 3rem);
                    width: 100%;
                    max-width: 78rem;
                    margin-inline: auto;
                    box-sizing: border-box;
                    pointer-events: none;
                }

                .st-wrap > * {
                    pointer-events: auto;
                }

                .st-bar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.75rem 1.5rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--mist);
                }

                [dir="rtl"] .st-bar {
                    letter-spacing: 0.06em;
                }

                .st-bar strong {
                    color: var(--glow);
                    font-weight: 700;
                    text-shadow: 0 0 18px rgba(214, 161, 79, 0.35);
                }

                .st-showcase-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    padding: 0.45rem 1rem;
                    border-radius: 999px;
                    color: var(--glow) !important;
                    font-weight: 600;
                    background: linear-gradient(
                        135deg,
                        rgba(214, 161, 79, 0.16) 0%,
                        rgba(185, 130, 50, 0.06) 100%
                    ) !important;
                    border: 1px solid rgba(243, 201, 139, 0.42) !important;
                    box-shadow:
                        0 4px 20px rgba(0, 0, 0, 0.45),
                        inset 0 1px 1px rgba(255, 250, 240, 0.25);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                }

                .st-showcase-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f3c98b, #d6a14f);
                    box-shadow: 0 0 10px #f3c98b;
                }

                .st-stage-center {
                    margin-block: auto;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    padding-top: 1.5rem;
                }

                /* Transparent Glass Card in front of the 3D Turtle (Brand Black & Gold Glass) */
                .st-glass-panel {
                    position: relative;
                    width: 100%;
                    max-width: 36rem;
                    padding: clamp(2.75rem, 4.5vw, 3.5rem) clamp(1.5rem, 3.8vw, 2.75rem) clamp(1.75rem, 3.2vw, 2.5rem);
                    border-radius: 28px;
                    background: linear-gradient(
                        145deg,
                        rgba(255, 250, 240, 0.09) 0%,
                        rgba(16, 12, 6, 0.28) 52%,
                        rgba(214, 161, 79, 0.10) 100%
                    ) !important;
                    -webkit-backdrop-filter: blur(8px) saturate(145%);
                    backdrop-filter: blur(8px) saturate(145%);
                    border: 1px solid rgba(243, 201, 139, 0.34) !important;
                    box-shadow:
                        0 28px 64px -12px rgba(0, 0, 0, 0.65),
                        inset 0 1px 1px rgba(255, 250, 240, 0.38),
                        inset 0 -1px 1px rgba(214, 161, 79, 0.22);
                    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease, box-shadow 0.45s ease;
                }

                .st-glass-panel:hover {
                    border-color: rgba(243, 201, 139, 0.62) !important;
                    box-shadow:
                        0 32px 72px -12px rgba(0, 0, 0, 0.75),
                        inset 0 1px 2px rgba(255, 250, 240, 0.5),
                        0 0 38px rgba(214, 161, 79, 0.16);
                }

                .st-glass-sheen {
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: linear-gradient(
                        125deg,
                        rgba(243, 201, 139, 0.16) 0%,
                        rgba(255, 250, 240, 0.04) 32%,
                        transparent 55%
                    ) !important;
                    pointer-events: none;
                }

                /* Logo mounted on top of the glass */
                .st-logo-crest {
                    position: relative;
                    margin-top: clamp(-4.25rem, -5.5vw, -3.5rem);
                    margin-bottom: 1.25rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.55rem 1.2rem 0.55rem 0.65rem;
                    border-radius: 999px;
                    background: rgba(12, 9, 5, 0.68) !important;
                    -webkit-backdrop-filter: blur(16px) saturate(160%);
                    backdrop-filter: blur(16px) saturate(160%);
                    border: 1px solid rgba(243, 201, 139, 0.52) !important;
                    box-shadow:
                        0 14px 32px rgba(0, 0, 0, 0.55),
                        0 0 24px rgba(214, 161, 79, 0.24),
                        inset 0 1px 1px rgba(255, 250, 240, 0.35);
                }

                [dir="rtl"] .st-logo-crest {
                    padding: 0.55rem 0.65rem 0.55rem 1.2rem;
                }

                .st-logo-halo {
                    position: absolute;
                    inset: -6px;
                    border-radius: 999px;
                    background: radial-gradient(circle, rgba(243, 201, 139, 0.28), transparent 70%) !important;
                    filter: blur(8px);
                    z-index: -1;
                    pointer-events: none;
                }

                .st-logo-badge {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 30% 30%, rgba(243, 201, 139, 0.22), rgba(8, 6, 3, 0.78)) !important;
                    border: 1px solid rgba(243, 201, 139, 0.48) !important;
                    box-shadow: inset 0 1px 2px rgba(255, 250, 240, 0.35);
                }

                .st-logo-img {
                    width: 38px;
                    height: 38px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 10px rgba(243, 201, 139, 0.5));
                }

                .st-logo-caption {
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 0.26em;
                    text-transform: uppercase;
                    color: var(--glow);
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
                }

                [dir="rtl"] .st-logo-caption {
                    letter-spacing: 0.06em;
                }

                .st-copy {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 1.05rem;
                }

                .st-eyebrow {
                    font-size: 0.72rem;
                    letter-spacing: 0.32em;
                    text-transform: uppercase;
                    color: var(--glow) !important;
                    font-weight: 600;
                }

                [dir="rtl"] .st-eyebrow {
                    letter-spacing: 0.06em;
                }

                .st-title {
                    margin: 0;
                    font-weight: 500;
                    font-size: clamp(2.15rem, 4.6vw, 3.6rem);
                    line-height: 1.02;
                    letter-spacing: -0.01em;
                    text-wrap: balance;
                    color: var(--foam) !important;
                    text-shadow: 0 4px 24px rgba(0, 0, 0, 0.7);
                }

                .st-title em {
                    color: var(--glow) !important;
                }

                .st-description {
                    margin: 0;
                    color: rgba(255, 250, 240, 0.92) !important;
                    font-size: clamp(0.92rem, 1.15vw, 1.04rem);
                    line-height: 1.7;
                    font-weight: 400;
                    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
                }

                .st-facts {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.65rem 1.6rem;
                    margin: 0.2rem 0 0;
                    padding: 0.95rem 0 0;
                    border-top: 1px solid rgba(243, 201, 139, 0.26);
                    font-size: 0.82rem;
                }

                .st-facts div {
                    display: flex;
                    flex-direction: column;
                    gap: 0.15rem;
                }

                .st-facts dt {
                    font-size: 0.6rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--glow);
                }

                [dir="rtl"] .st-facts dt {
                    letter-spacing: 0.04em;
                }

                .st-facts dd {
                    margin: 0;
                    color: var(--foam);
                    font-weight: 500;
                    font-variant-numeric: tabular-nums;
                }

                .st-controls-row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.85rem;
                    padding-top: 0.35rem;
                }

                .st-morphs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.45rem;
                    align-items: center;
                }

                .st-morph-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--foam);
                    background: rgba(10, 7, 3, 0.48) !important;
                    border: 1px solid rgba(243, 201, 139, 0.28) !important;
                    border-radius: 999px;
                    padding: 0.4rem 0.85rem 0.4rem 0.5rem;
                    cursor: pointer;
                    -webkit-backdrop-filter: blur(8px);
                    backdrop-filter: blur(8px);
                    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
                }

                [dir="rtl"] .st-morph-btn {
                    padding: 0.4rem 0.5rem 0.4rem 0.85rem;
                }

                .st-morph-btn:hover {
                    border-color: var(--glow) !important;
                    transform: translateY(-1px);
                }

                .st-morph-btn:active {
                    transform: scale(0.97);
                }

                .st-morph-btn[aria-pressed="true"] {
                    border-color: var(--glow) !important;
                    background: rgba(214, 161, 79, 0.22) !important;
                    box-shadow: 0 0 16px rgba(214, 161, 79, 0.28);
                }

                .st-morph-btn:focus-visible {
                    outline: 2px solid var(--glow);
                    outline-offset: 2px;
                }

                .st-dot {
                    width: 0.95rem;
                    height: 0.95rem;
                    border-radius: 50%;
                    flex-shrink: 0;
                    box-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
                }

                .st-cta-btn {
                    padding: 0.65rem 1.35rem !important;
                    font-size: 0.7rem !important;
                }

                .st-hint {
                    font-size: 0.78rem;
                    color: rgba(243, 201, 139, 0.78);
                }

                .st-fallback {
                    padding: 0.85rem 1rem;
                    border: 1px solid var(--line);
                    border-radius: 0.75rem;
                    color: var(--foam);
                }

                @media (max-width: 760px) {
                    .st-section {
                        min-height: 48rem;
                    }
                    .st-stage-center {
                        margin-block: 1rem auto;
                    }
                    .st-glass-panel {
                        max-width: 100%;
                        padding: 2.5rem 1.25rem 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
}
