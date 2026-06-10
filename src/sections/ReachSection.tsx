import { useEffect, useRef } from 'react';
import { reachConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ReachSectionProps {
  lang: UseLanguageReturn;
}

export default function ReachSection({ lang }: ReachSectionProps) {
  const { t, isRTL } = lang;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stagger flags
            const flags = entry.target.querySelectorAll('.flag-item');
            flags.forEach((flag, i) => {
              setTimeout(() => {
                (flag as HTMLElement).style.opacity = '1';
                (flag as HTMLElement).style.transform = 'scale(1)';
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
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
          textAlign: 'center',
        }}
      >
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
            {t(reachConfig.tagline, reachConfig.taglineAr)}
          </p>

          <h2
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '2rem',
              color: '#ffffff',
            }}
          >
            <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
              {t('Pan-GCC', 'تغطية')}
            </span>
            <br />
            {t('Coverage.', 'شاملة للخليج.')}
          </h2>

          <p
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: '3rem',
            }}
          >
            {t(reachConfig.body, reachConfig.bodyAr)}
          </p>

          {/* Country flags */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {reachConfig.countries.map((country) => (
              <div
                key={country.name}
                className="flag-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  background: 'rgba(0,87,255,0.06)',
                  border: '1px solid rgba(0,229,255,0.15)',
                  borderRadius: '1rem',
                  opacity: 0,
                  transform: 'scale(0.8)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  minWidth: '100px',
                }}
              >
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{country.flag}</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {t(country.name, country.nameAr)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
