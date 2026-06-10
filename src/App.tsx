import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimize fluid background activation
  useEffect(() => {
    if (isMobile) {
      setFluidActive(false); // Disable shader on mobile for performance
      return;
    }

    const heroEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const expertiseEl = document.getElementById('expertise');
    const clientsEl = document.getElementById('clients');
    const investmentEl = document.getElementById('investment');

    if (!heroEl || !aboutEl || !servicesEl) return;

    const sections = [heroEl, aboutEl, servicesEl, expertiseEl, clientsEl, investmentEl].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        let anyVisible = false;
        entries.forEach((entry) => {
          if (entry.isIntersecting) anyVisible = true;
        });
        setFluidActive(anyVisible);
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  // Smooth scroll behavior for Lenis-like feel without the library
  useEffect(() => {
    let scrollY = window.scrollY;
    let currentY = scrollY;
    let ticking = false;

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          currentY += (scrollY - currentY) * 0.1;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'relative', background: '#050A0F' }}>
      {/* Fluid Background - disabled on mobile */}
      {!isMobile && <FluidBackground isActive={fluidActive} />}

      {/* Mobile gradient fallback */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(0,87,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0,229,255,0.08) 0%, transparent 50%),
              #050A0F
            `,
          }}
        />
      )}

      {/* Navigation */}
      <Navigation lang={lang} />

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div id="hero-section" style={{ position: 'relative', zIndex: 1 }}>
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

        {/* Campaigns merged into a single section */}
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

// Campaigns + Digital merged section
import { campaignsConfig } from './config';

function CampaignsMergedSection({ lang }: { lang: ReturnType<typeof useLanguage> }) {
  const { t, isRTL } = lang;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const items = entry.target.querySelectorAll('.campaign-item');
            items.forEach((item, i) => {
              setTimeout(() => {
                (item as HTMLElement).style.opacity = '1';
                (item as HTMLElement).style.transform = 'translateX(0)';
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(4rem, 8vw, 8rem) 0',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '5rem',
          }}
          className="lg:grid-cols-2"
        >
          {/* Campaigns */}
          <div className="reveal">
            <p
              style={{
                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.3em',
                color: 'var(--cyan-accent, #00E5FF)',
                textTransform: 'uppercase',
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
              {campaignsConfig.items.map((item, i) => (
                <div
                  key={i}
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
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
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
                letterSpacing: '0.3em',
                color: 'var(--cyan-accent, #00E5FF)',
                textTransform: 'uppercase',
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

            {/* Social icons */}
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
                    color: 'rgba(0,229,255,0.5)',
                    transition: 'all 0.3s',
                    display: 'flex',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--cyan-accent, #00E5FF)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(0,229,255,0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {social.icon === 'instagram' && (
                      <>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </>
                    )}
                    {social.icon === 'linkedin' && (
                      <>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect width="4" height="12" x="2" y="9"/>
                        <circle cx="4" cy="4" r="2"/>
                      </>
                    )}
                    {social.icon === 'twitter' && (
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
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
