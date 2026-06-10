import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { servicesConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ServicesSectionProps {
  lang: UseLanguageReturn;
}

// Lucide icon mapping
const iconMap: Record<string, ReactNode> = {
  megaphone: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
  ),
  users: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  target: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  monitor: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
  ),
  palette: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
  ),
  zap: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
};

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const { t, isRTL } = lang;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(4rem, 8vw, 8rem) 0',
        zIndex: 2,
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 80%, rgba(0,87,255,0.1) 0%, transparent 30%),
            radial-gradient(circle at 85% 15%, rgba(0,229,255,0.1) 0%, transparent 35%)
          `,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* Section header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
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
            {t(servicesConfig.tagline, servicesConfig.taglineAr)}
          </p>
          <h2
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
              {t('Integrated', 'حلول')}
            </span>
            <br />
            {t('Solutions.', 'متكاملة.')}
          </h2>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {servicesConfig.items.map((service) => (
            <div
              key={service.title}
              className="reveal glass-card"
              style={{ cursor: 'default' }}
            >
              {/* Service image */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(0,229,255,0.15)',
                }}
              >
                <img
                  src={`/${service.image}`}
                  alt={t(service.title, service.titleAr)}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLImageElement).style.transform = 'scale(1)';
                  }}
                />
              </div>

              {/* Icon */}
              <div style={{ color: 'var(--cyan-accent, #00E5FF)', marginBottom: '1rem' }}>
                {iconMap[service.icon]}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  marginBottom: '0.75rem',
                  color: '#ffffff',
                }}
              >
                {t(service.title, service.titleAr)}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                }}
              >
                {t(service.desc, service.descAr)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
