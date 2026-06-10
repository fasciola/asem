import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import { campaignsConfig } from './config';
import FluidBackground from './components/FluidBackground';
import Navigation from './components/Navigation';
import FloatingButtons from './components/FloatingButtons';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import MissionSection from './sections/MissionSection';
import ServicesSection from './sections/ServicesSection';
import ExpertiseSection from './sections/ExpertiseSection';
import ReachSection from './sections/ReachSection';
import ClientsSection from './sections/ClientsSection';
import InvestmentSection from './sections/InvestmentSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

function App() {
    const lang = useLanguage();
    const [fluidActive, setFluidActive] = useState(true);

    useEffect(() => {
        const sectionIds = [
            'home',
            'about',
            'services',
            'expertise',
            'clients',
            'campaigns',
            'investment',
            'contact',
        ];

        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (sections.length === 0) {
            setFluidActive(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const anyVisible = entries.some((entry) => entry.isIntersecting);
                setFluidActive(anyVisible);
            },
            {
                threshold: 0.03,
                rootMargin: '160px',
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                overflowX: 'hidden',
                isolation: 'isolate',
                background:
                    'radial-gradient(ellipse at 50% 32%, rgba(0, 190, 230, 0.22) 0%, rgba(0, 90, 150, 0.12) 42%, transparent 72%), #050A0F',
            }}
        >
            {/* Smoky animated background on desktop and mobile */}
            <FluidBackground isActive={fluidActive} />

            {/* Static fallback glow under the WebGL canvas */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse at 50% 40%, rgba(0, 229, 255, 0.18) 0%, rgba(0, 87, 255, 0.1) 42%, transparent 72%)',
                }}
            />

            <Navigation lang={lang} />
            <FloatingButtons />

            <main style={{ position: 'relative', zIndex: 1 }}>
                <div id="home" style={{ position: 'relative', zIndex: 1 }}>
                    <HeroSection lang={lang} />
                </div>

                <div id="about" style={{ position: 'relative', zIndex: 2 }}>
                    <AboutSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <MissionSection lang={lang} />
                </div>

                <div id="services" style={{ position: 'relative', zIndex: 2 }}>
                    <ServicesSection lang={lang} />
                </div>

                <div id="expertise" style={{ position: 'relative', zIndex: 2 }}>
                    <ExpertiseSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <ReachSection lang={lang} />
                </div>

                <div id="clients" style={{ position: 'relative', zIndex: 2 }}>
                    <ClientsSection lang={lang} />
                </div>

                <div id="campaigns" style={{ position: 'relative', zIndex: 2 }}>
                    <CampaignsMergedSection lang={lang} />
                </div>

                <div id="investment" style={{ position: 'relative', zIndex: 2 }}>
                    <InvestmentSection lang={lang} />
                </div>

                <div id="contact" style={{ position: 'relative', zIndex: 2 }}>
                    <ContactSection lang={lang} />
                </div>

                <div id="footer" style={{ position: 'relative', zIndex: 2 }}>
                    <FooterSection lang={lang} />
                </div>
            </main>
        </div>
    );
}

function CampaignsMergedSection({ lang }: { lang: ReturnType<typeof useLanguage> }) {
    const { t, isRTL } = lang;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('visible');

                    const items = entry.target.querySelectorAll('.campaign-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            const element = item as HTMLElement;
                            element.style.opacity = '1';
                            element.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                });
            },
            { threshold: 0.1 }
        );

        sectionRef.current
            ?.querySelectorAll('.reveal')
            .forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                width: '100%',
                padding: 'clamp(4rem, 8vw, 8rem) 0',
                overflow: 'hidden',
                background: 'transparent',
                zIndex: 2,
            }}
        >
            {/* Mobile-visible smoky glow for this section */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse at 55% 45%, rgba(0, 229, 255, 0.22) 0%, rgba(0, 120, 180, 0.14) 38%, transparent 72%), radial-gradient(ellipse at 80% 25%, rgba(0, 87, 255, 0.12) 0%, transparent 52%)',
                    filter: 'blur(24px)',
                    transform: 'scale(1.08)',
                    opacity: 1,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 clamp(1.5rem, 4vw, 3rem)',
                }}
            >
                <div
                    className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-20"
                >
                    {/* Campaigns */}
                    <div className="reveal">
                        <p
                            style={{
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                                fontSize: '12px',
                                letterSpacing: isRTL ? '0.08em' : '0.3em',
                                color: 'var(--cyan-accent, #00E5FF)',
                                textTransform: isRTL ? 'none' : 'uppercase',
                                marginBottom: '1.5rem',
                                fontWeight: 700,
                            }}
                        >
                            {t(campaignsConfig.tagline, campaignsConfig.taglineAr)}
                        </p>

                        <h2
                            style={{
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 600,
                                lineHeight: 1.1,
                                marginBottom: '2rem',
                                color: '#ffffff',
                            }}
                        >
                            <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
                                {t('Impactful', 'تفعيلات')}
                            </span>
                            <br />
                            {t('Activations.', 'مؤثرة.')}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {campaignsConfig.items.map((item, index) => (
                                <div
                                    key={`${item.text}-${index}`}
                                    className="campaign-item"
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        color: 'rgba(255,255,255,0.75)',
                                        opacity: 0,
                                        transform: isRTL ? 'translateX(20px)' : 'translateX(-20px)',
                                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--cyan-accent, #00E5FF)"
                                        strokeWidth="2"
                                        style={{ flexShrink: 0 }}
                                        aria-hidden="true"
                                    >
                                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                    </svg>

                                    <span
                                        style={{
                                            fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                                            fontSize: '15px',
                                            fontWeight: 300,
                                        }}
                                    >
                                        {t(item.text, item.textAr)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Digital */}
                    <div className="reveal" id="digital">
                        <p
                            style={{
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                                fontSize: '12px',
                                letterSpacing: isRTL ? '0.08em' : '0.3em',
                                color: 'var(--cyan-accent, #00E5FF)',
                                textTransform: isRTL ? 'none' : 'uppercase',
                                marginBottom: '1.5rem',
                                fontWeight: 700,
                            }}
                        >
                            {t('Digital', 'الرقمي')}
                        </p>

                        <h2
                            style={{
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 600,
                                lineHeight: 1.1,
                                marginBottom: '2rem',
                                color: '#ffffff',
                            }}
                        >
                            <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
                                {t('Social Media', 'وسائل التواصل')}
                            </span>
                            <br />
                            {t('Excellence.', 'الاجتماعي.')}
                        </h2>

                        <p
                            style={{
                                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                                fontSize: 'clamp(14px, 1.2vw, 17px)',
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 300,
                                lineHeight: 1.8,
                                marginBottom: '2rem',
                            }}
                        >
                            {t(
                                'Our digital team delivers targeted campaigns through content creation, audience segmentation, and performance-driven strategies to maximize reach and engagement.',
                                'يعمل فريقنا الرقمي على تنفيذ حملات موجهة من خلال صناعة المحتوى واستهداف الجمهور بدقة لتحقيق أعلى مستويات الوصول والتفاعل.'
                            )}
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {[
                                { icon: 'instagram', label: 'Instagram' },
                                { icon: 'linkedin', label: 'LinkedIn' },
                                { icon: 'twitter', label: 'Twitter' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    style={{
                                        color: 'rgba(0,229,255,0.55)',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                    }}
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        {social.icon === 'instagram' && (
                                            <>
                                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                            </>
                                        )}

                                        {social.icon === 'linkedin' && (
                                            <>
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect width="4" height="12" x="2" y="9" />
                                                <circle cx="4" cy="4" r="2" />
                                            </>
                                        )}

                                        {social.icon === 'twitter' && (
                                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                        )}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
