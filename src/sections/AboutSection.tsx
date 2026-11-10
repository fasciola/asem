import { useEffect, useRef } from 'react';
import { aboutConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface AboutSectionProps {
    lang: UseLanguageReturn;
}

const IMG = '/images/cine';

export default function AboutSection({ lang }: AboutSectionProps) {
    const { t, isRTL } = lang;
    const sectionRef = useRef<HTMLElement>(null);

    // --t: 0 = light "idea" state, 1 = dark "impact" state, driven by scroll position
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            el.style.setProperty('--t', '1');
            return;
        }

        let raf = 0;
        const update = () => {
            raf = 0;
            const vh = window.innerHeight;
            const top = el.getBoundingClientRect().top;
            // starts light as the section enters, fully dark once its top reaches ~15% of the viewport
            const p = (vh * 0.7 - top) / (vh * 0.35);
            el.style.setProperty('--t', Math.max(0, Math.min(1, p)).toFixed(3));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const translatedTitle = t(aboutConfig.title, aboutConfig.titleAr);
    const titleParts = translatedTitle.split('2012');

    const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
    const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
    const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', serif";

    return (
        <section ref={sectionRef} id="about" className="ab" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Portrait pair: light underneath, dark fades in on top */}
            <div className="ab-bg" aria-hidden="true">
                <img className="ab-img ab-img-light" src={`${IMG}/about-light.webp`} alt="" width={1536} height={1024} loading="lazy" decoding="async" />
                <img className="ab-img ab-img-dark" src={`${IMG}/about-dark.webp`} alt="" width={1536} height={1024} loading="lazy" decoding="async" />
                <div className="ab-fade" />
            </div>

            {/* Idea → Impact state label */}
            <div className="ab-state" aria-hidden="true" style={{ fontFamily: label }}>
                <span className="ab-state-a">{t('Idea', 'فكرة')}</span>
                <span className="ab-state-line" />
                <span className="ab-state-b">{t('Impact', 'أثر')}</span>
            </div>

            <div className="ab-wrap">
                <div className="ab-copy">
                    <p className="ab-eyebrow" style={{ fontFamily: label }}>
                        {t(aboutConfig.tagline, aboutConfig.taglineAr)}
                    </p>

                    <h2 className="ab-title" style={{ fontFamily: display }}>
                        {titleParts[0]}
                        <span dir="ltr" className="ab-accent" style={{ fontStyle: isRTL ? 'normal' : 'italic' }}>
                            2012
                        </span>
                        {titleParts[1] || '.'}
                    </h2>

                    <p className="ab-body" style={{ fontFamily: body }}>
                        {t(aboutConfig.body, aboutConfig.bodyAr)}
                    </p>


                    <blockquote className="ab-quote" style={{ fontFamily: display }}>
                        &ldquo;{t(aboutConfig.quote, aboutConfig.quoteAr)}&rdquo;
                    </blockquote>
                </div>
            </div>

            <style>{`
        .ab {
          --t: 0;
          --ink: color-mix(in srgb, #1d1612 calc((1 - var(--t)) * 100%), #ffffff);
          --ink-soft: color-mix(in srgb, #4a3d33 calc((1 - var(--t)) * 100%), rgba(255,255,255,.82));
          --accent: color-mix(in srgb, #8c5a1c calc((1 - var(--t)) * 100%), #f3c98b);
          --rule: color-mix(in srgb, rgba(29,22,18,.25) calc((1 - var(--t)) * 100%), rgba(243,201,139,.28));
          --bg: color-mix(in srgb, #f0e3da calc((1 - var(--t)) * 100%), #000000);
          position: relative; overflow: hidden; isolation: isolate;
          background: var(--bg);
          min-height: clamp(640px, 88vh, 900px);
          display: flex; align-items: center;
          padding: clamp(4rem, 8vw, 7rem) 0;
        }

        .ab-bg { position: absolute; inset: 0; z-index: 0; }
        .ab-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 85% center; }
        [dir='rtl'] .ab-img { transform: scaleX(-1); }
        .ab-img-dark { opacity: var(--t); }
        /* soft edge so the artwork melts into the section colour on the text side */
        .ab-fade { position: absolute; inset: 0; background: linear-gradient(to right, var(--bg) 0%, var(--bg) 34%, transparent 58%); }
        [dir='rtl'] .ab-fade { background: linear-gradient(to left, var(--bg) 0%, var(--bg) 34%, transparent 58%); }

        .ab-wrap { position: relative; z-index: 2; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
        .ab-copy { max-width: 560px; text-align: start; }

        .ab .ab-eyebrow { margin: 0 0 1.4rem; font-size: 12px; letter-spacing: .3em; text-transform: uppercase; font-weight: 700; color: var(--accent) !important; }
        [dir='rtl'] .ab .ab-eyebrow { letter-spacing: .08em; text-transform: none; }
        .ab .ab-title { margin: 0 0 1.5rem; font-weight: 400; line-height: 1.02; letter-spacing: -.02em; font-size: clamp(2.3rem, 4.8vw, 4rem); color: var(--ink) !important; text-shadow: none !important; }
        .ab .ab-title .ab-accent { display: inline-block; color: var(--accent) !important; }
        .ab .ab-body { margin: 0 0 2rem; font-size: clamp(14px, 1.2vw, 17px); line-height: 1.8; font-weight: 400; color: var(--ink-soft) !important; }


        .ab .ab-quote { margin: 0; padding-inline-start: 1.1rem; border-inline-start: 2px solid var(--accent); font-size: clamp(1.1rem, 1.7vw, 1.5rem); font-style: italic; line-height: 1.35; color: var(--ink) !important; max-width: 30ch; }
        [dir='rtl'] .ab .ab-quote { font-style: normal; }

        /* Idea → Impact marker */
        .ab-state {
          position: absolute; z-index: 3; top: clamp(1.5rem, 4vw, 3rem); right: clamp(1.5rem, 4vw, 3rem);
          display: flex; align-items: center; gap: .8rem; font-size: 11px; letter-spacing: .25em; text-transform: uppercase;
          color: var(--ink);
        }
        [dir='rtl'] .ab-state { right: auto; left: clamp(1.5rem, 4vw, 3rem); letter-spacing: .05em; text-transform: none; font-size: 13px; }
        .ab-state-a { opacity: calc(1 - var(--t) * .7); }
        .ab-state-b { opacity: calc(.3 + var(--t) * .7); color: var(--accent); }
        .ab-state-line { width: 56px; height: 1px; background: linear-gradient(90deg, var(--ink) calc((1 - var(--t)) * 100%), var(--accent) 100%); opacity: .8; }

        @media (max-width: 899px) {
          .ab { display: block; padding-top: 0; min-height: 0; }
          .ab-bg { bottom: auto; height: 74vw; }
          .ab-img { object-position: 88% center; }
          .ab-fade { background: linear-gradient(to bottom, transparent 55%, var(--bg) 100%) !important; }
          .ab-wrap { padding-top: 66vw; padding-bottom: 3.5rem; }
          .ab-state { top: 1rem; }
        }
      `}</style>
        </section>
    );
}
