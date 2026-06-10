import { useEffect, useRef } from 'react';
import { expertiseConfig } from '../config'; // or import from your config file
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ExpertiseSectionProps {
    lang: UseLanguageReturn;
}

export default function ExpertiseSection({ lang }: ExpertiseSectionProps) {
    const { t, isRTL } = lang;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        const elements =
            sectionRef.current?.querySelectorAll<HTMLElement>('.reveal');

        elements?.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const translatedTitle = t(expertiseConfig.title, expertiseConfig.titleAr);
    const titleParts = translatedTitle.split('2024'); // example split, adjust as needed

    return (
        <section
            ref={sectionRef}
            id="expertise"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
                position: 'relative',
                width: '100%',
                padding: 'clamp(4rem, 8vw, 8rem) 0',
                zIndex: 2,
                overflow: 'hidden',
            }}
        >
            {/* Background gradient accents */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `
            radial-gradient(
              circle at 20% 80%,
              rgba(0, 229, 255, 0.08) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(0, 87, 255, 0.1) 0%,
              transparent 35%
            )
          `,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 clamp(1.5rem, 4vw, 3rem)',
                }}
            >
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
                    {/* Content */}
                    <div
                        className={`reveal ${isRTL ? 'lg:order-2' : 'lg:order-1'
                            }`}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            textAlign: isRTL ? 'right' : 'left',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: isRTL
                                    ? "'Cairo', sans-serif"
                                    : "'Space Grotesk', sans-serif",
                                fontSize: '12px',
                                letterSpacing: isRTL ? '0.08em' : '0.3em',
                                color: 'var(--cyan-accent, #00E5FF)',
                                textTransform: isRTL ? 'none' : 'uppercase',
                                marginBottom: '1.5rem',
                                fontWeight: 700,
                            }}
                        >
                            {t(expertiseConfig.tagline, expertiseConfig.taglineAr)}
                        </p>

                        <h2
                            style={{
                                fontFamily: isRTL
                                    ? "'Cairo', sans-serif"
                                    : "'Space Grotesk', sans-serif",
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                fontWeight: 600,
                                lineHeight: 1.15,
                                marginBottom: '2rem',
                                color: '#ffffff',
                            }}
                        >
                            {titleParts[0]}

                            <span
                                dir="ltr"
                                style={{
                                    display: 'inline-block',
                                    color: 'var(--cyan-accent, #00E5FF)',
                                }}
                            >
                                2024
                            </span>

                            {titleParts[1] || '.'}
                        </h2>

                        <p
                            style={{
                                fontFamily: isRTL
                                    ? "'Cairo', sans-serif"
                                    : "'Inter', sans-serif",
                                fontSize: 'clamp(14px, 1.2vw, 18px)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: 300,
                                lineHeight: isRTL ? 2 : 1.8,
                                maxWidth: '600px',
                                marginLeft: isRTL ? 'auto' : 0,
                                marginRight: isRTL ? 0 : 'auto',
                            }}
                        >
                            {t(expertiseConfig.body, expertiseConfig.bodyAr)}
                        </p>

                        {/* Statistics (optional) */}
                        {expertiseConfig.stats && (
                            <div
                                className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-start"
                                style={{
                                    marginTop: '3rem',
                                    paddingTop: '3rem',
                                    borderTop: '1px solid rgba(0, 229, 255, 0.15)',
                                }}
                            >
                                {expertiseConfig.stats.map((stat) => (
                                    <div
                                        key={`${stat.value}-${stat.label}`}
                                        className="max-sm:!text-center"
                                        style={{
                                            textAlign: isRTL ? 'right' : 'left',
                                        }}
                                    >
                                        <span
                                            dir="ltr"
                                            style={{
                                                display: 'block',
                                                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                                                color: 'var(--cyan-accent, #00E5FF)',
                                                fontWeight: 600,
                                                fontFamily: "'Space Grotesk', sans-serif",
                                            }}
                                        >
                                            {stat.value}
                                        </span>

                                        <span
                                            style={{
                                                display: 'block',
                                                marginTop: '0.5rem',
                                                fontSize: '11px',
                                                textTransform: isRTL ? 'none' : 'uppercase',
                                                letterSpacing: isRTL ? '0.05em' : '0.15em',
                                                color: 'rgba(0, 229, 255, 0.6)',
                                                fontFamily: isRTL
                                                    ? "'Cairo', sans-serif"
                                                    : "'Space Grotesk', sans-serif",
                                            }}
                                        >
                                            {t(stat.label, stat.labelAr)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Video */}
                    <div
                        className={`reveal ${isRTL ? 'lg:order-1' : 'lg:order-2'
                            }`}
                        style={{
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '4 / 5',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                border: '1px solid rgba(0, 229, 255, 0.3)',
                                background: 'rgba(7, 27, 52, 0.35)',
                                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.25)',
                            }}
                        >
                            <video
                                src={`/${expertiseConfig.videoSrc}`}
                                poster={`/${expertiseConfig.videoPoster}`}
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.9)',
                                }}
                            />

                            {/* Optional overlay */}
                            <div
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    background: `
                    linear-gradient(
                      to top,
                      rgba(3, 13, 25, 0.45) 0%,
                      transparent 45%
                    )
                  `,
                                }}
                            />
                        </div>

                        {/* Quote card (hidden on smaller screens) */}
                        <div
                            className="hidden xl:block"
                            style={{
                                position: 'absolute',
                                bottom: '-2rem',
                                right: isRTL ? 'auto' : '-2rem',
                                left: isRTL ? '-2rem' : 'auto',
                                width: 'min(300px, 75%)',
                                padding: '2rem',
                                borderRadius: '1rem',
                                background: 'rgba(7, 27, 52, 0.9)',
                                border: '1px solid rgba(0, 229, 255, 0.25)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
                                textAlign: isRTL ? 'right' : 'left',
                            }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="rgba(0, 229, 255, 0.3)"
                                strokeWidth="1.5"
                                aria-hidden="true"
                                style={{
                                    display: 'block',
                                    marginBottom: '1rem',
                                    transform: isRTL ? 'scaleX(-1)' : 'none',
                                }}
                            >
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
                            </svg>

                            <p
                                style={{
                                    marginBottom: '1rem',
                                    color: 'rgba(255, 255, 255, 0.72)',
                                    fontFamily: isRTL
                                        ? "'Cairo', sans-serif"
                                        : "'Inter', sans-serif",
                                    fontSize: '14px',
                                    fontStyle: isRTL ? 'normal' : 'italic',
                                    lineHeight: isRTL ? 1.9 : 1.6,
                                }}
                            >
                                &ldquo;{t(expertiseConfig.quote, expertiseConfig.quoteAr)}&rdquo;
                            </p>

                            <span
                                style={{
                                    display: 'block',
                                    color: 'var(--cyan-accent, #00E5FF)',
                                    fontFamily: isRTL
                                        ? "'Cairo', sans-serif"
                                        : "'Space Grotesk', sans-serif",
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: isRTL ? '0.05em' : '0.2em',
                                    textTransform: isRTL ? 'none' : 'uppercase',
                                }}
                            >
                                — Expertise Team
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}