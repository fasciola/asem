import { useEffect, useRef, useState } from 'react';
import { navigationConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface NavigationProps {
    lang: UseLanguageReturn;
}
export default function Navigation({ lang }: NavigationProps) {
    const { lang: currentLang, isRTL, toggleLang, t } = lang;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const handleNavClick = (id: string) => {
        setMobileOpen(false);
        if (id === 'home') {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <>
            <nav
                ref={navRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 100,
                    padding: scrolled ? '14px 4vw' : '24px 4vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.5s ease',
                    backgroundColor: scrolled ? 'rgba(5, 10, 15, 0.85)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(0, 229, 255, 0.12)' : '1px solid transparent',
                }}
            >
                {/* Logo */}
                <a
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('home');
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
                >
                    <img
                        src="/asem-vision-logo.png"
                        alt="Asem Vision"
                        style={{
                            width: scrolled ? '60px' : '72px',  // Increased from 36px/44px
                            height: scrolled ? '60px' : '72px',  // Increased from 36px/44px
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))',
                            transition: 'all 0.5s ease',
                        }}
                    />
                    {/* AV text removed */}
                </a>

                {/* Desktop Nav */}
                <div
                    style={{
                        display: 'flex',
                        gap: '32px',
                        alignItems: 'center',
                    }}
                    className="hidden md:flex"
                >
                    {navigationConfig.links.map((item) => (
                        <button
                            key={item.targetId}
                            onClick={() => handleNavClick(item.targetId)}
                            className="font-sans-body"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#FFFFFF',
                                opacity: 0.7,
                                fontSize: '13px',
                                letterSpacing: '0.06em',
                                cursor: 'pointer',
                                transition: 'opacity 0.4s ease',
                                padding: '4px 0',
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.opacity = '0.7';
                            }}
                        >
                            {t(item.label, item.labelAr)}
                        </button>
                    ))}

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLang}
                        className="font-sans-body"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '40px',
                            padding: '8px 18px',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            letterSpacing: '0.06em',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                        }}
                    >
                        {currentLang === 'en' ? '🇸🇦 العربية' : '🇬 English'}
                    </button>

                    {/* CTA Button */}
                    <a
                        href={`https://wa.me/${navigationConfig.links.find(() => true) ? '971505822373' : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                            padding: '10px 22px',
                            fontSize: '11px',
                            textDecoration: 'none',
                        }}
                    >
                        {t('Get a Quote', 'احصل على عرض')}
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(5, 10, 15, 0.98)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    zIndex: 99,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    opacity: mobileOpen ? 1 : 0,
                    visibility: mobileOpen ? 'visible' : 'hidden',
                    transition: 'all 0.4s ease',
                }}
            >
                {navigationConfig.links.map((item) => (
                    <button
                        key={item.targetId}
                        onClick={() => handleNavClick(item.targetId)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold-primary, #d6a14f)',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            transition: 'color 0.3s',
                            fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                        }}
                    >
                        {t(item.label, item.labelAr)}
                    </button>
                ))}

                <button
                    onClick={() => {
                        toggleLang();
                        setMobileOpen(false);
                    }}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '40px',
                        padding: '12px 28px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                    }}
                >
                    {currentLang === 'en' ? '🇸🇦 Switch to Arabic' : '🇬🇧 التبديل للإنجليزية'}
                </button>

                <a
                    href="https://wa.me/971505822373"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', marginTop: '1rem' }}
                >
                    {t('Get a Quote', 'احصل على عرض')}
                </a>
            </div>
        </>
    );
}