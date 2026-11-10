import { useEffect, useRef, useState } from 'react';
import { servicesConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface LaunchSceneProps {
    lang: UseLanguageReturn;
}

const IMG = '/images/cine';

const steps = [
    { n: '01', en: 'Teaser & anticipation', ar: 'التشويق والترقّب', sub: 'Build the buzz before the reveal', subAr: 'اصنع الحماس قبل الكشف' },
    { n: '02', en: 'The reveal', ar: 'لحظة الكشف', sub: 'One stage, one unforgettable moment', subAr: 'منصة واحدة، لحظة لا تُنسى' },
    { n: '03', en: 'Launch amplification', ar: 'تضخيم الإطلاق', sub: 'Across retail, field and digital', subAr: 'عبر التجزئة والميدان والرقمي' },
];

export default function LaunchScene({ lang }: LaunchSceneProps) {
    const { t, isRTL } = lang;
    const ref = useRef<HTMLElement>(null);
    const [seen, setSeen] = useState(false);

    const service = servicesConfig.items.find((item) => /launch/i.test(item.title));

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setSeen(true);
            },
            { threshold: 0.15 }
        );
        io.observe(el);

        // --p: 0 -> 1 as the stage rises from the bottom of the viewport to its centre
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        const update = () => {
            raf = 0;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const p = (vh - r.top) / (vh * 0.5 + r.height * 0.55);
            el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        if (reduce) {
            el.style.setProperty('--p', '1');
        } else {
            update();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
        }
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
    const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', serif";

    return (
        <section ref={ref} className={`ln ${seen ? 'ln-in' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} aria-labelledby="launch-title">
            <div className="ln-copy">
                <p className="ln-eyebrow" style={{ fontFamily: label }}>
                    {t('Product Launches', 'إطلاق المنتجات')}
                </p>
                <h2 id="launch-title" className="ln-title" style={{ fontFamily: display }}>
                    {t('Debuts that', 'إطلاقات')}
                    <span style={{ fontStyle: isRTL ? 'normal' : 'italic' }}> {t('capture attention.', 'تخطف الأنظار.')}</span>
                </h2>
                <p className="ln-body" style={{ fontFamily: body }}>
                    {service
                        ? t(service.desc, service.descAr)
                        : t('Strategic debuts that capture attention and drive adoption', 'إطلاقات استراتيجية تجذب الانتباه وتدفع نحو التبنّي')}
                </p>
            </div>

            <div className="ln-stage">
                <div className="ln-beam" aria-hidden="true" />
                <img className="ln-pedestal" src={`${IMG}/launch-pedestal-glow.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" aria-hidden="true" />
                <img className="ln-product" src={`${IMG}/launch-glass-product.webp`} alt="" width={1254} height={1254} loading="lazy" decoding="async" aria-hidden="true" />

                <ol className="ln-steps">
                    {steps.map((s, i) => (
                        <li key={s.n} className={`ln-step ln-step-${i + 1}`}>
                            <span className="ln-step-n" style={{ fontFamily: display }}>{s.n}</span>
                            <span className="ln-step-body">
                                <strong style={{ fontFamily: label }}>{t(s.en, s.ar)}</strong>
                                <span style={{ fontFamily: body }}>{t(s.sub, s.subAr)}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="ln-cta">
                <a
                    href="#contact"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary"
                    style={{ textDecoration: 'none' }}
                >
                    {t('Plan Your Launch', 'خطّط لإطلاقك')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </a>
            </div>

            <style>{`
        .ln { --p: 0; position: relative; overflow: hidden; isolation: isolate; padding: clamp(4rem, 8vw, 7rem) 0 clamp(3rem, 6vw, 5rem); }

        .ln-copy { position: relative; z-index: 5; max-width: 760px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); text-align: center; }
        .ln-eyebrow { margin: 0 0 1.2rem; font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--gold-light, #f3c98b); font-weight: 600; }
        [dir='rtl'] .ln-eyebrow { letter-spacing: .08em; text-transform: none; }
        .ln-title { margin: 0 0 1.1rem; font-weight: 400; line-height: 1.02; letter-spacing: -.02em; font-size: clamp(2.3rem, 5.4vw, 4.4rem); text-wrap: balance; }
        .ln-body { margin: 0 auto; max-width: 520px; font-size: clamp(14px, 1.25vw, 17px); line-height: 1.75; font-weight: 300; }
        .ln-copy > * { opacity: 0; transform: translateY(18px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .ln-in .ln-copy > * { opacity: 1; transform: none; }
        .ln-in .ln-copy > *:nth-child(2) { transition-delay: .12s; }
        .ln-in .ln-copy > *:nth-child(3) { transition-delay: .24s; }

        /* ---- stage ---- */
        .ln-stage { position: relative; width: min(1100px, 100%); aspect-ratio: 16 / 10; margin: clamp(-1rem, -2vw, 0px) auto 0; }
        .ln-stage img { position: absolute; display: block; max-width: none; filter: hue-rotate(-140deg) saturate(1.05); pointer-events: none; }

        .ln-pedestal {
          left: 0; bottom: 0; width: 100%; height: auto;
          mix-blend-mode: screen;
          opacity: calc(.35 + var(--p) * .65);
        }
        .ln-beam {
          position: absolute; left: 50%; bottom: 14%; width: 34%; height: 70%; transform: translateX(-50%);
          background: linear-gradient(to top, rgba(243,201,139,.38) 0%, rgba(243,201,139,.10) 55%, transparent 100%);
          clip-path: polygon(14% 100%, 86% 100%, 100% 0, 0 0);
          filter: blur(18px); opacity: calc(var(--p) * .9); pointer-events: none;
        }
        .ln-product {
          left: 31%; top: 20%; width: 38%; height: auto;
          transform: translateY(calc((1 - var(--p)) * 110px));
          opacity: calc(.25 + var(--p) * .75);
          filter: hue-rotate(-140deg) saturate(1.05) drop-shadow(0 24px 40px rgba(243,201,139,.25));
          animation: lnFloat 6s ease-in-out infinite;
        }
        @keyframes lnFloat { 0%, 100% { translate: 0 0; rotate: -1deg; } 50% { translate: 0 -16px; rotate: 1.2deg; } }

        /* ---- callouts ---- */
        .ln-steps { list-style: none; margin: 0; padding: 0; }
        .ln-step {
          position: absolute; display: flex; gap: .9rem; align-items: flex-start; max-width: 230px;
          padding: .9rem 1.1rem; border-radius: 18px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(243,201,139,.25);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 40px rgba(0,0,0,.4);
          opacity: 0; transform: translateY(16px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .ln-in .ln-step { opacity: 1; transform: none; }
        .ln-step-n { font-size: 1.9rem; line-height: 1; color: var(--gold-light, #f3c98b); }
        .ln-step-body { display: flex; flex-direction: column; gap: 3px; }
        .ln-step strong { font-size: 13px; font-weight: 600; color: #fff; }
        .ln-step-body > span { font-size: 12px; line-height: 1.45; font-weight: 300; color: rgba(255,255,255,.78); }
        .ln-step-1 { left: 4%;  top: 22%; transition-delay: .3s; }
        .ln-step-2 { right: 4%; top: 38%; transition-delay: .45s; }
        .ln-step-3 { left: 10%; top: 58%; transition-delay: .6s; }

        .ln-cta { display: flex; justify-content: center; margin-top: clamp(-1rem, -2vw, 0px); position: relative; z-index: 5; }

        @media (max-width: 899px) {
          .ln-stage { aspect-ratio: 4 / 4.4; }
          .ln-product { left: 18%; top: 8%; width: 64%; }
          .ln-beam { width: 60%; height: 62%; }
          .ln-steps { position: absolute; left: 0; right: 0; bottom: -1rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; padding: 0 1rem; }
          .ln-step { position: static; flex-direction: column; gap: .3rem; padding: .7rem .75rem; max-width: none; border-radius: 14px; }
          .ln-step-n { font-size: 1.4rem; }
          .ln-step-body > span { display: none; }
          .ln-cta { margin-top: 3.5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ln-product { animation: none; }
          .ln-copy > *, .ln-step { transition: none; opacity: 1; transform: none; }
        }
      `}</style>
        </section>
    );
}
