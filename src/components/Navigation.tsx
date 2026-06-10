import { useEffect, useState } from 'react';
import { navigationConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface NavigationProps {
    lang: UseLanguageReturn;
}

export default function Navigation({ lang }: NavigationProps) {
    const { lang: currentLang, isRTL, toggleLang, t } = lang;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleNavClick = (id: string) => {
        setMobileOpen(false);

        if (id === 'home') {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }

        const element = document.getElementById(id);

        if (element) {
            const offset = 88;
            const top =
                element.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                left: 0,
                behavior: 'smooth',
            });
        }
    };

    const navBackground = scrolled || mobileOpen
        ? 'rgba(5, 10, 15, 0.9)'
        : 'rgba(5, 10, 15, 0.5)';

    return (
        <>
            <nav
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    width: '100%',
                    height: scrolled ? '72px' : '88px',
                    padding: '0 clamp(1rem, 4vw, 3rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: navBackground,
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
                    transition: 'all 0.35s ease',
                }}
            >
                <button
                    type="button"
                    onClick={() => handleNavClick('home')}
                    aria-label="Go to home"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: 0,
                        background: 'transparent',
                        padding: 0,
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src="/asem-vision-logo.png"
                        alt="Asem Vision"
                        style={{
                            width: scrolled ? '54px' : '66px',
                            height: scrolled ? '54px' : '66px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.35))',
                            transition: 'all 0.35s ease',
                        }}
                    />
                </button>

                {/* Desktop navigation */}
                <div
                    className="hidden md:flex"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 'clamp(1rem, 2vw, 2rem)',
                        minWidth: 0,
                    }}
                >
                    {navigationConfig.links.map((item) => (
                        <button
                            key={item.targetId}
                            type="button"
                            onClick={() => handleNavClick(item.targetId)}
                            style={{
                                background: 'transparent',
                                border: 0,
                                color: '#ffffff',
                                opacity: 0.72,
                                fontSize: '13px',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                                padding: '0.35rem 0',
                                whiteSpace: 'nowrap',
                                transition: 'opacity 0.25s ease, color 0.25s ease',
                                fontFamily: isRTL
                                    ? "'Cairo', sans-serif"
                                    : "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.opacity = '1';
                                event.currentTarget.style.color = 'var(--cyan-accent, #00E5FF)';
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.opacity = '0.72';
                                event.currentTarget.style.color = '#ffffff';
                            }}
                        >
                            {t(item.label, item.labelAr)}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={toggleLang}
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            borderRadius: '999px',
                            padding: '8px 16px',
                            color: '#ffffff',
                            fontSize: '12px',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontFamily: isRTL
                                ? "'Cairo', sans-serif"
                                : "'Space Grotesk', sans-serif",
                        }}
                    >
                        {currentLang === 'en' ? 'العربية' : 'English'}
                    </button>

                    <a
                        href="https://wa.me/971505822373"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                            padding: '10px 20px',
                            fontSize: '11px',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {t('Get a Quote', 'احصل على عرض')}
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="md:hidden"
                    onClick={() => setMobileOpen((value) => !value)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                    style={{
                        position: 'relative',
                        zIndex: 1002,
                        width: '46px',
                        height: '46px',
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: '1px solid rgba(0, 229, 255, 0.22)',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#ffffff',
                        cursor: 'pointer',
                    }}
                >
                    <span
                        style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            borderRadius: '999px',
                            background: '#ffffff',
                            transform: mobileOpen
                                ? 'translateY(8px) rotate(45deg)'
                                : 'translateY(0) rotate(0)',
                            transition: 'transform 0.25s ease',
                        }}
                    />

                    <span
                        style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            borderRadius: '999px',
                            background: '#ffffff',
                            opacity: mobileOpen ? 0 : 1,
                            transition: 'opacity 0.2s ease',
                        }}
                    />

                    <span
                        style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            borderRadius: '999px',
                            background: '#ffffff',
                            transform: mobileOpen
                                ? 'translateY(-8px) rotate(-45deg)'
                                : 'translateY(0) rotate(0)',
                            transition: 'transform 0.25s ease',
                        }}
                    />
                </button>
            </nav>

            {/* Mobile menu */}
            <div
                dir={isRTL ? 'rtl' : 'ltr'}
                className="md:hidden"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.35rem',
                    padding: '7rem 1.5rem 2rem',
                    background:
                        'radial-gradient(ellipse at 50% 35%, rgba(0, 229, 255, 0.16) 0%, transparent 58%), rgba(5, 10, 15, 0.96)',
                    backdropFilter: 'blur(26px)',
                    WebkitBackdropFilter: 'blur(26px)',
                    opacity: mobileOpen ? 1 : 0,
                    visibility: mobileOpen ? 'visible' : 'hidden',
                    pointerEvents: mobileOpen ? 'auto' : 'none',
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(-12px)',
                    transition:
                        'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease',
                }}
            >
                {navigationConfig.links.map((item) => (
                    <button
                        key={item.targetId}
                        type="button"
                        onClick={() => handleNavClick(item.targetId)}
                        style={{
                            border: 0,
                            background: 'transparent',
                            color: '#ffffff',
                            fontSize: 'clamp(1.35rem, 6vw, 2rem)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            letterSpacing: isRTL ? '0' : '0.04em',
                            fontFamily: isRTL
                                ? "'Cairo', sans-serif"
                                : "'Space Grotesk', sans-serif",
                        }}
                    >
                        {t(item.label, item.labelAr)}
                    </button>
                ))}

                <div
                    style={{
                        width: 'min(260px, 70vw)',
                        height: '1px',
                        margin: '0.5rem 0',
                        background:
                            'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent)',
                    }}
                />

                <button
                    type="button"
                    onClick={() => {
                        toggleLang();
                        setMobileOpen(false);
                    }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        borderRadius: '999px',
                        padding: '12px 26px',
                        color: '#ffffff',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: isRTL
                            ? "'Cairo', sans-serif"
                            : "'Space Grotesk', sans-serif",
                    }}
                >
                    {currentLang === 'en' ? 'العربية' : 'English'}
                </button>

                <a
                    href="https://wa.me/971505822373"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    onClick={() => setMobileOpen(false)}
                    style={{
                        marginTop: '0.5rem',
                        textDecoration: 'none',
                    }}
                >
                    {t('Get a Quote', 'احصل على عرض')}
                </a>
            </div>
        </>
    );
}
