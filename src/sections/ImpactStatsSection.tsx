import { useEffect, useRef, useState } from 'react';
import { aboutConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ImpactStatsSectionProps {
    lang: UseLanguageReturn;
}

function parseStat(value: string) {
    const match = value.match(/^(\d+)(.*)$/);
    return match ? { num: parseInt(match[1], 10), suffix: match[2] } : { num: 0, suffix: value };
}

function CountUp({ value, run }: { value: string; run: boolean }) {
    const { num, suffix } = parseStat(value);
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!run) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setN(num);
            return;
        }
        let raf = 0;
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setN(Math.round(num * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [run, num]);

    return (
        <span dir="ltr">
            {n}
            {suffix}
        </span>
    );
}

export default function ImpactStatsSection({ lang }: ImpactStatsSectionProps) {
    const { t, isRTL } = lang;
    const ref = useRef<HTMLElement>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { threshold: 0.25 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
    const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', serif";

    return (
        <section ref={ref} className={`is ${seen ? 'is-in' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} aria-labelledby="impact-title">
            <div className="is-wrap">
                <div className="is-art" aria-hidden="true">
                    <div className="is-halo" />
                    <img
                        className="is-sculpture"
                        src="/images/cine/stats-sculpture.webp"
                        alt=""
                        width={1254}
                        height={1254}
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="is-copy">
                    <p className="is-eyebrow" style={{ fontFamily: label }}>
                        {t('Impact in numbers', 'الأثر بالأرقام')}
                    </p>
                    <h2 id="impact-title" className="is-title" style={{ fontFamily: display }}>
                        {t('Strategic creativity', 'إبداع استراتيجي')}
                        <span style={{ fontStyle: isRTL ? 'normal' : 'italic' }}> {t('that moves markets.', 'يحرك الأسواق.')}</span>
                    </h2>

                    <ul className="is-stats">
                        {aboutConfig.stats.map((s, i) => (
                            <li key={s.label} style={{ ['--i' as string]: i }}>
                                <span className="is-num" style={{ fontFamily: display }}>
                                    <CountUp value={s.value} run={seen} />
                                </span>
                                <span className="is-label" style={{ fontFamily: body }}>
                                    {t(s.label, s.labelAr)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`
        .is { position: relative; overflow: hidden; padding: clamp(4rem, 9vw, 8rem) 0; }
        .is-wrap {
          position: relative; max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 4vw, 3rem);
          display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center;
        }
        @media (min-width: 900px) { .is-wrap { grid-template-columns: 1fr 1fr; gap: 4rem; } }

        .is-art { position: relative; display: grid; place-items: center; }
        .is-halo {
          position: absolute; width: 85%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle, rgba(243,201,139,.28) 0%, rgba(243,201,139,.08) 42%, transparent 70%);
          filter: blur(20px);
        }
        .is-sculpture {
          position: relative; width: min(520px, 100%); height: auto;
          /* shift the cyan in the artwork toward the site's gold */
          filter: hue-rotate(-140deg) saturate(.95) drop-shadow(0 30px 50px rgba(0,0,0,.55));
          animation: isFloat 9s ease-in-out infinite;
        }
        @keyframes isFloat {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50%      { transform: translateY(-16px) rotate(1.5deg); }
        }

        .is-eyebrow {
          margin: 0 0 1.2rem; font-size: 12px; letter-spacing: .3em; text-transform: uppercase;
          color: var(--gold-light, #f3c98b); font-weight: 600;
        }
        [dir='rtl'] .is-eyebrow { letter-spacing: .08em; text-transform: none; }
        .is-title {
          margin: 0 0 2.4rem; font-weight: 400; line-height: 1.02; letter-spacing: -.02em;
          font-size: clamp(2.2rem, 5vw, 4rem);
        }
        .is-stats { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
        .is-stats li {
          display: flex; align-items: baseline; justify-content: space-between; gap: 1.5rem;
          padding: 1.2rem 0; border-top: 1px solid rgba(243,201,139,.22);
          opacity: 0; transform: translateY(18px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
          transition-delay: calc(var(--i) * 140ms + 200ms);
        }
        .is-stats li:last-child { border-bottom: 1px solid rgba(243,201,139,.22); }
        .is-in .is-stats li { opacity: 1; transform: none; }
        .is-num { font-size: clamp(3rem, 7vw, 5.5rem); line-height: .95; color: var(--gold-light, #f3c98b); letter-spacing: -.03em; }
        .is-label { font-size: clamp(14px, 1.3vw, 17px); font-weight: 300; text-align: end; max-width: 14ch; }

        @media (prefers-reduced-motion: reduce) {
          .is-sculpture { animation: none; }
          .is-stats li { transition: none; opacity: 1; transform: none; }
        }
      `}</style>
        </section>
    );
}
