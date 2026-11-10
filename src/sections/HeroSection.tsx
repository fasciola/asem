import { useEffect, useRef } from 'react';
import { heroConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface HeroSectionProps {
    lang: UseLanguageReturn;
}

const IMG = '/images/hero';

const glassCards = [
    {
        key: 'events',
        img: `${IMG}/card-events.webp`,
        title: 'Events',
        titleAr: 'الفعاليات',
        sub: 'Stages that move rooms',
        subAr: 'منصات تحرّك الحضور',
    },
    {
        key: 'launch',
        img: `${IMG}/card-launch.webp`,
        title: 'Launches',
        titleAr: 'الإطلاقات',
        sub: 'Debuts that drive adoption',
        subAr: 'إطلاقات تصنع الانتشار',
    },
    {
        key: 'activation',
        img: `${IMG}/card-activation.webp`,
        title: 'Activations',
        titleAr: 'التفعيلات',
        sub: 'Retail & mall brand moments',
        subAr: 'تجارب العلامة في المولات',
    },
    {
        key: 'crowd',
        img: `${IMG}/extra-1.webp`,
        title: 'Campaigns',
        titleAr: 'الحملات',
        sub: 'Field & public awareness',
        subAr: 'حملات ميدانية وتوعوية',
    },
];

const trustLogos = [
    { src: '/logos/samsung.png', alt: 'Samsung' },
    { src: '/logos/unilever.png', alt: 'Unilever' },
    { src: '/logos/WHO.png', alt: 'WHO' },
    { src: '/logos/unfpa.png', alt: 'UNFPA' },
];

export default function HeroSection({ lang }: HeroSectionProps) {
    const { t, isRTL } = lang;
    const sectionRef = useRef<HTMLElement>(null);
    // Subtle pointer parallax (skipped for reduced-motion users and touch devices)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = window.matchMedia('(pointer: fine)').matches;
        if (reduce || !fine) return;

        let raf = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('--px', x.toFixed(3));
                el.style.setProperty('--py', y.toFixed(3));
            });
        };
        const onLeave = () => {
            el.style.setProperty('--px', '0');
            el.style.setProperty('--py', '0');
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', 'Playfair Display', serif";
    const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";

    const scrollTo = (id: string) => (event: React.MouseEvent) => {
        event.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={sectionRef} id="home" className="hv" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background: vignette + soft glow over the site's fluid backdrop */}
            <div className="hv-vignette" aria-hidden="true" />
            <div className="hv-glow" aria-hidden="true" />

            {/* Text on the sides, head in the middle */}
            <div className="hv-layout">
                <div className="hv-left">
                    <p className="hv-eyebrow" style={{ fontFamily: label }}>
                        {t(heroConfig.eyebrow, heroConfig.eyebrowAr)}
                    </p>

                    <h1 className="hv-title" style={{ fontFamily: display }}>
                        <span className="hv-title-1">{t(heroConfig.titleLine1, heroConfig.titleLine1Ar)}</span>
                        <span className="hv-title-2" style={{ fontStyle: isRTL ? 'normal' : 'italic' }}>
                            {t(heroConfig.titleLine2, heroConfig.titleLine2Ar)}
                        </span>
                    </h1>

                </div>

                <div className="hv-right">
                    <p className="hv-sub" style={{ fontFamily: body }}>
                        {t(heroConfig.description, heroConfig.descriptionAr)}
                    </p>

                    <div className="hv-cta">
                        <a href="#contact" onClick={scrollTo('contact')} className="hv-btn hv-btn-solid" style={{ fontFamily: body }}>
                            {t(heroConfig.ctaSecondary, heroConfig.ctaSecondaryAr)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </a>
                        <a href="#services" onClick={scrollTo('services')} className="hv-btn hv-btn-ghost" style={{ fontFamily: body }}>
                            {t(heroConfig.ctaPrimary, heroConfig.ctaPrimaryAr)}
                        </a>
                    </div>

                </div>
            </div>

            {/* Stage: subject inside a real 3D cylinder of glass cards */}
            <div className="hv-stage">
                <div className="hv-scene">
                    <img
                        className="hv-subject"
                        src={`${IMG}/hero-subject.webp`}
                        alt={t('A visionary looking toward the future of brand experiences', 'رؤية مستقبلية لتجارب العلامات التجارية')}
                        width={1080}
                        height={1620}
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className="hv-ringwrap">
                        <div className="hv-ring">
                            <span className="hv-orbit" style={{ ['--oy' as string]: '-110px' }} aria-hidden="true" />
                            <span className="hv-orbit" style={{ ['--oy' as string]: '110px' }} aria-hidden="true" />
                            {glassCards.map((c, i) => (
                                <figure key={c.key} className={`hv-card hv-card-${i + 1}`}>
                                    <img src={c.img} alt="" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
                                    <figcaption>
                                        <strong style={{ fontFamily: label }}>{t(c.title, c.titleAr)}</strong>
                                        <span style={{ fontFamily: body }}>{t(c.sub, c.subAr)}</span>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust strip */}
            <div className="hv-trust">
                <p style={{ fontFamily: body }}>{t('Trusted by leading brands', 'موثوق من علامات رائدة')}</p>
                <div className="hv-trust-logos">
                    {trustLogos.map((l) => (
                        <img key={l.alt} src={l.src} alt={l.alt} loading="lazy" decoding="async" />
                    ))}
                </div>
            </div>

            <p className="hv-tagline" style={{ fontFamily: display }}>
                {t('Ideas into impact.', 'من الفكرة إلى الأثر.')}
            </p>

            <style>{`
        .hv {
          --px: 0; --py: 0;
          --gold: var(--gold-light, #f3c98b);
          position: relative; width: 100%;
          min-height: max(100svh, 640px);
          overflow: hidden; isolation: isolate;
          background: transparent;
          display: flex; flex-direction: column; align-items: center;
        }
        .hv-vignette {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 50% 70%, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.92) 100%),
            linear-gradient(to bottom, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 40%, rgba(0,0,0,.85) 100%);
        }
        .hv-glow {
          position: absolute; z-index: 1; pointer-events: none;
          left: 50%; bottom: -10%; width: min(1100px, 120vw); aspect-ratio: 1;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(243,201,139,.11) 0%, rgba(243,201,139,.03) 40%, transparent 68%);
          filter: blur(30px);
        }

        /* ---------- copy ---------- */
        .hv-layout {
          position: relative; z-index: 20; width: 100%; max-width: 1560px;
          padding: 5.5rem clamp(1.5rem, 4vw, 4rem) 0;
          margin-block: auto;
          display: grid; grid-template-columns: minmax(0, 1fr) clamp(300px, 34vw, 620px) minmax(0, 1fr);
          align-items: center;
        }
        .hv-left  { grid-column: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: start; }
        .hv-right { grid-column: 3; display: flex; flex-direction: column; align-items: flex-start; text-align: start; }
        .hv-eyebrow {
          font-size: clamp(10px, 1.1vw, 12px); letter-spacing: .28em; text-transform: uppercase;
          color: var(--gold); font-weight: 500; margin: 0 0 1rem;
        }
        .hv-title {
          margin: 0 0 1rem; font-weight: 400;
          font-size: clamp(2.4rem, min(4.5vw, 8.5vh), 4.8rem);
          line-height: .98; letter-spacing: -0.025em;
          text-wrap: balance;
        }
        .hv-title-2 { display: block; }
        .hv-sub {
          margin: 0 0 1.5rem; max-width: 420px;
          font-size: clamp(14px, 1.25vw, 17px); line-height: 1.7; font-weight: 300;
        }
        .hv-cta { display: flex; gap: .85rem; flex-wrap: wrap; justify-content: flex-start; }
        .hv-btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .85rem 1.6rem; border-radius: 999px;
          font-size: 14px; font-weight: 500; text-decoration: none;
          transition: transform .35s cubic-bezier(.16,1,.3,1), background .3s, border-color .3s, color .3s;
          cursor: pointer;
        }
        .hv-btn:hover { transform: translateY(-2px); }
        .hv-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
        .hv-btn-solid { background: var(--gold); color: #000000 !important; border: 1px solid var(--gold); }
        .hv-btn-solid:hover { background: #fff; border-color: #fff; }
        .hv-btn-ghost {
          background: rgba(255,255,255,.06); color: #fff !important;
          border: 1px solid rgba(255,255,255,.28);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .hv-btn-ghost:hover { border-color: var(--gold); background: rgba(243,201,139,.12); }

        /* ---------- stage: true 3D cylinder ---------- */
        .hv-stage {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 10;
          height: clamp(420px, 84svh, 760px);
          perspective: 1500px; perspective-origin: 50% 18%;
          pointer-events: none;
        }
        .hv-scene {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 0;
          transform-style: preserve-3d;
          --W: clamp(120px, 10vw, 170px);
          --R: clamp(180px, 16vw, 240px);
        }
        .hv-subject {
          position: absolute; left: 50%; bottom: 0; height: 100%; width: auto; max-width: none;
          filter: drop-shadow(0 30px 60px rgba(0,0,0,.6));
          transform: translate3d(calc(-50% + var(--px) * -8px), calc(var(--py) * -5px), 0);
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,.55) 80%, transparent 99%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,.55) 80%, transparent 99%);
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        /* ring centre sits at head height */
        .hv-ringwrap {
          position: absolute; left: 0; top: 32%; width: 0; height: 0;
          transform-style: preserve-3d;
          transform: rotateY(calc(var(--px) * 12deg));
          transition: transform .6s cubic-bezier(.16,1,.3,1);
        }
        .hv-ring {
          position: absolute; left: 0; top: 0; width: 0; height: 0;
          transform-style: preserve-3d;
          animation: hvOrbit 16s ease-in-out infinite alternate;
        }
        .hv-orbit {
          position: absolute; left: calc(-1 * var(--R)); top: calc(-1 * var(--R));
          width: calc(2 * var(--R)); height: calc(2 * var(--R));
          border-radius: 50%; border: 1px solid rgba(243,201,139,.32);
          transform: translateY(var(--oy, 0px)) rotateX(90deg);
          box-shadow: 0 0 24px rgba(243,201,139,.12), inset 0 0 24px rgba(243,201,139,.06);
        }
        .hv-card {
          position: absolute; left: 0; top: 0; margin: 0;
          width: var(--W); height: calc(var(--W) * .8);
          margin-left: calc(-0.5 * var(--W)); margin-top: calc(-0.4 * var(--W));
          overflow: hidden; border-radius: 18px;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(10,18,26,.85);
          box-shadow: 0 25px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.35);
          transform: translateY(var(--y, 0px)) rotateY(var(--a)) translateZ(var(--R)) rotateY(var(--flip, 0deg));
          filter: brightness(var(--b, 1));
          pointer-events: auto;
        }
        .hv-card img { display: block; width: 100%; height: 66%; object-fit: cover; opacity: .95; }
        .hv-card::after { /* glass sheen */
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(115deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 38%);
        }
        .hv-card figcaption { padding: .55rem .8rem .65rem; display: flex; flex-direction: column; gap: 2px; background: rgba(255,255,255,.06); }
        .hv-card strong { font-size: 13px; font-weight: 600; color: #fff; letter-spacing: .02em; }
        .hv-card span { font-size: 11px; color: rgba(255,255,255,.75); line-height: 1.3; }

        /* angle: 0 = directly in front of the face, 180 = behind the head. back cards flip so they face the viewer */
        .hv-card-1 { --a: -52deg;  --y: 10px;  --b: 1; }
        .hv-card-2 { --a: 52deg;   --y: 60px; --b: 1; }
        .hv-card-3 { --a: 125deg;  --y: -70px; --b: .6; --flip: 180deg; }
        .hv-card-4 { --a: -125deg; --y: -20px;  --b: .6; --flip: 180deg; }

        @keyframes hvOrbit {
          from { transform: rotateY(-9deg); }
          to   { transform: rotateY(9deg); }
        }



        /* ---------- badge / trust / tagline ---------- */

        .hv-trust { position: absolute; z-index: 25; left: clamp(1.5rem, 5vw, 5rem); bottom: 2.2rem; max-width: 260px; }
        .hv-trust p { margin: 0 0 .6rem; font-size: 12px; font-weight: 300; }
        .hv-trust-logos { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .hv-trust-logos img { height: 28px; width: auto; max-width: 78px; object-fit: contain; background: rgba(255,255,255,.92); padding: 4px 8px; border-radius: 8px; opacity: .9; }

        .hv-tagline {
          position: absolute; z-index: 25; right: calc(clamp(1.5rem, 5vw, 5rem) + 8rem); bottom: 2.2rem; margin: 0;
          font-size: 1.15rem; font-style: italic; color: var(--gold) !important;
        }

        /* ---------- responsive ---------- */
        @media (max-width: 1100px) {
          .hv-scene { --W: 150px; --R: 250px; }
          .hv-stage { height: clamp(400px, 52vh, 560px); }
          .hv-layout { display: flex; flex-direction: column; align-items: center; padding-top: 6.75rem; margin-block: 0; }
          .hv-left, .hv-right { align-items: center; text-align: center; padding-top: 0; }
          .hv-sub { margin-inline: auto; }
          .hv-cta { justify-content: center; }
        }
        @media (max-width: 760px) {
          .hv { min-height: max(100svh, 860px); }
          .hv-layout { padding-top: 6rem; }
          .hv-trust, .hv-tagline { display: none; }
          .hv-stage { height: 400px; }
          .hv-scene { --W: 112px; --R: 175px; }
          .hv-card figcaption span { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hv-ring { animation: none !important; }
          .hv-subject { transition: none; transform: none; }
        }
      `}</style>
        </section>
    );
}
