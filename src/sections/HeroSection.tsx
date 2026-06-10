import { heroConfig } from '../config';
import RainOnGlass from '../components/RainOnGlass';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface HeroSectionProps {
    lang: UseLanguageReturn;
}

export default function HeroSection({ lang }: HeroSectionProps) {
    const { t, isRTL } = lang;
    const textShadow = '0 2px 24px rgba(0,0,0,0.55)';

    return (
        <section
            id="home"
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                isolation: 'isolate',
                background: '#050A0F',
            }}
        >
            {/* WebGL rain-on-glass background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                }}
            >
                <RainOnGlass />
            </div>

            {/* Dark overlay keeps the hero text readable */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    background:
                        'linear-gradient(135deg, rgba(5,10,15,0.82) 0%, rgba(5,10,15,0.58) 45%, rgba(5,10,15,0.40) 100%)',
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '900px',
                    padding: '7rem 2rem 5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <p
                    style={{
                        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(10px, 1.2vw, 12px)',
                        letterSpacing: '0.3em',
                        color: 'var(--cyan-accent, #00E5FF)',
                        textTransform: 'uppercase',
                        marginBottom: '2rem',
                        textShadow,
                        fontWeight: 500,
                    }}
                >
                    {t(heroConfig.eyebrow, heroConfig.eyebrowAr)}
                </p>

                <h1
                    style={{
                        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                        fontWeight: 600,
                        lineHeight: 1.15,
                        color: '#ffffff',
                        marginBottom: '2rem',
                        textShadow,
                        textWrap: 'balance',
                    }}
                >
                    <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
                        {t(heroConfig.titleLine1, heroConfig.titleLine1Ar)}
                    </span>
                    <br />
                    {t(heroConfig.titleLine2, heroConfig.titleLine2Ar)}
                </h1>

                <p
                    style={{
                        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                        fontSize: 'clamp(14px, 1.5vw, 18px)',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.82)',
                        fontWeight: 300,
                        maxWidth: '600px',
                        marginBottom: '3rem',
                        textShadow,
                    }}
                >
                    {t(heroConfig.description, heroConfig.descriptionAr)}
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <a
                        href="#services"
                        onClick={(event) => {
                            event.preventDefault();
                            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary"
                        style={{ textDecoration: 'none' }}
                    >
                        {t(heroConfig.ctaPrimary, heroConfig.ctaPrimaryAr)}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                            style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points={isRTL ? '12 5 5 12 12 19' : '12 5 19 12 12 19'} />
                        </svg>
                    </a>

                    <a
                        href="#contact"
                        onClick={(event) => {
                            event.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-outline"
                        style={{ textDecoration: 'none' }}
                    >
                        {t(heroConfig.ctaSecondary, heroConfig.ctaSecondaryAr)}
                    </a>
                </div>
            </div>

            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    zIndex: 10,
                    animation: 'heroBounce 2s infinite',
                    color: 'var(--cyan-accent, #00E5FF)',
                    opacity: 0.55,
                }}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            <style>{`
        @keyframes heroBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          #home [style*="heroBounce"] {
            animation: none !important;
          }
        }
      `}</style>
        </section>
    );
}
