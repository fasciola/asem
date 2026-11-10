import { useEffect, useRef, useState } from 'react';
import { servicesConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface EventsBandProps {
    lang: UseLanguageReturn;
}

const IMG = '/images/cine';

const chips = [
    { en: 'Festivals', ar: 'المهرجانات' },
    { en: 'Conferences', ar: 'المؤتمرات' },
    { en: 'Corporate events', ar: 'فعاليات الشركات' },
];

export default function EventsBand({ lang }: EventsBandProps) {
    const { t, isRTL } = lang;
    const ref = useRef<HTMLElement>(null);
    const [seen, setSeen] = useState(false);

    const eventsService = servicesConfig.items.find((item) => /event/i.test(item.title));

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setSeen(true);
            },
            { threshold: 0.2 }
        );
        io.observe(el);

        // pointer parallax (fine pointers, no reduced motion)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = window.matchMedia('(pointer: fine)').matches;
        let raf = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
                el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
            });
        };
        const onLeave = () => {
            el.style.setProperty('--px', '0');
            el.style.setProperty('--py', '0');
        };
        if (!reduce && fine) {
            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerleave', onLeave);
        }
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
    const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', serif";

    return (
        <section ref={ref} className={`ev ${seen ? 'ev-in' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} aria-labelledby="events-title">
            <div className="ev-word" aria-hidden="true" style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif" }}>
                {t('EVENTS', 'الفعاليات')}
            </div>

            <div className="ev-wrap">
                <div className="ev-copy">
                    <p className="ev-eyebrow" style={{ fontFamily: label }}>
                        {t('Event Management', 'إدارة الفعاليات')}
                    </p>
                    <h2 id="events-title" className="ev-title" style={{ fontFamily: display }}>
                        {t('Stages that', 'منصات')}
                        <span style={{ fontStyle: isRTL ? 'normal' : 'italic' }}> {t('move rooms.', 'تُحرّك الحضور.')}</span>
                    </h2>
                    <p className="ev-body" style={{ fontFamily: body }}>
                        {eventsService
                            ? t(eventsService.desc, eventsService.descAr)
                            : t('Full-service festival, conference & corporate event execution', 'تنفيذ متكامل للمهرجانات والمؤتمرات وفعاليات الشركات')}
                    </p>

                    <ul className="ev-chips">
                        {chips.map((c) => (
                            <li key={c.en} style={{ fontFamily: body }}>
                                {t(c.en, c.ar)}
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary"
                        style={{ textDecoration: 'none' }}
                    >
                        {t('Plan Your Event', 'خطّط لفعاليتك')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </a>
                </div>

                <div className="ev-stage" aria-hidden="true">
                    <img className="ev-ring" src={`${IMG}/events-glowing-ring.webp`} alt="" width={1254} height={1254} loading="lazy" decoding="async" />
                    <img className="ev-figure" src={`${IMG}/events-figure.webp`} alt="" width={1024} height={1536} loading="lazy" decoding="async" />
                </div>
            </div>

            <style>{`
        .ev { --px: 0; --py: 0; position: relative; overflow: hidden; isolation: isolate; padding: clamp(4rem, 8vw, 7rem) 0; }

        /* giant outlined wordmark */
        .ev-word {
          position: absolute; left: 50%; top: 74%; z-index: 0; white-space: nowrap; pointer-events: none; user-select: none;
          transform: translate(-50%, -50%);
          font-weight: 700; font-size: clamp(5rem, 19vw, 19rem); letter-spacing: .06em; line-height: 1;
          color: transparent; -webkit-text-stroke: 1.5px rgba(243,201,139,.32);
          opacity: 0; transition: opacity 1.4s ease, letter-spacing 2.2s cubic-bezier(.16,1,.3,1);
        }
        [dir='rtl'] .ev-word { letter-spacing: 0; color: rgba(243,201,139,.10); -webkit-text-stroke: 0; font-weight: 800; }
        .ev-in .ev-word { opacity: 1; letter-spacing: .1em; }
        [dir='rtl'] .ev-in .ev-word { letter-spacing: 0; }

        .ev-wrap {
          position: relative; z-index: 2; max-width: 1200px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 4vw, 3rem);
          display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: center;
        }
        @media (min-width: 900px) { .ev-wrap { grid-template-columns: 1fr 1.1fr; gap: 3rem; } }

        .ev-eyebrow { margin: 0 0 1.2rem; font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--gold-light, #f3c98b); font-weight: 600; }
        [dir='rtl'] .ev-eyebrow { letter-spacing: .08em; text-transform: none; }
        .ev-title { margin: 0 0 1.2rem; font-weight: 400; line-height: 1.02; letter-spacing: -.02em; font-size: clamp(2.3rem, 5vw, 4.2rem); }
        .ev-body { margin: 0 0 1.5rem; max-width: 460px; font-size: clamp(14px, 1.25vw, 17px); line-height: 1.75; font-weight: 300; }
        .ev-chips { list-style: none; margin: 0 0 2rem; padding: 0; display: flex; flex-wrap: wrap; gap: .6rem; }
        .ev-chips li {
          padding: .45rem 1rem; border-radius: 999px; font-size: 13px;
          border: 1px solid rgba(243,201,139,.3); background: rgba(243,201,139,.06); color: rgba(255,255,255,.9);
        }

        .ev-copy > * { opacity: 0; transform: translateY(18px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .ev-in .ev-copy > * { opacity: 1; transform: none; }
        .ev-in .ev-copy > *:nth-child(2) { transition-delay: .12s; }
        .ev-in .ev-copy > *:nth-child(3) { transition-delay: .24s; }
        .ev-in .ev-copy > *:nth-child(4) { transition-delay: .36s; }
        .ev-in .ev-copy > *:nth-child(5) { transition-delay: .48s; }

        /* ring + figure */
        .ev-stage { position: relative; width: min(100%, 620px); aspect-ratio: 1; margin-inline: auto; }
        .ev-ring, .ev-figure { position: absolute; display: block; max-width: none; filter: hue-rotate(-140deg) saturate(1.05); }
        .ev-ring {
          inset: 0; width: 100%; height: 100%;
          mix-blend-mode: screen;
          transform: translate3d(calc(var(--px) * -8px), calc(var(--py) * -6px), 0);
          opacity: 0; transition: opacity 1.2s ease .2s;
          animation: evPulse 6s ease-in-out infinite;
        }
        .ev-figure {
          height: 104%; width: auto; left: 10%; top: -2%;
          transform: translate3d(calc(var(--px) * 16px), calc(var(--py) * 8px), 0);
          opacity: 0; transition: opacity 1s ease .5s;
          animation: evWalk 7s ease-in-out infinite;
        }
        .ev-in .ev-ring, .ev-in .ev-figure { opacity: 1; }
        @keyframes evPulse { 0%, 100% { scale: 1; filter: hue-rotate(-140deg) saturate(1.05) brightness(1); } 50% { scale: 1.03; filter: hue-rotate(-140deg) saturate(1.05) brightness(1.2); } }
        @keyframes evWalk { 0%, 100% { translate: 0 0; } 50% { translate: 14px -6px; } }
        [dir='rtl'] .ev-figure { left: auto; right: 10%; scale: -1 1; }

        @media (max-width: 899px) {
          .ev-stage { width: min(88%, 460px); }
          .ev-word { top: 62%; font-size: clamp(4rem, 22vw, 9rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ev-ring, .ev-figure { animation: none; }
          .ev-word, .ev-copy > *, .ev-ring, .ev-figure { transition: none; opacity: 1; transform: none; }
          .ev-ring, .ev-figure { transform: none; }
        }
      `}</style>
        </section>
    );
}
