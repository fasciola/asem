import { useEffect, useRef } from 'react';
import { missionConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface MissionSectionProps {
  lang: UseLanguageReturn;
}

export default function MissionSection({ lang }: MissionSectionProps) {
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
            {t(missionConfig.tagline, missionConfig.taglineAr)}
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
              {t(missionConfig.title, missionConfig.titleAr).split(' ')[0]}
            </span>{' '}
            {t(missionConfig.title, missionConfig.titleAr).split(' ').slice(1).join(' ')}
          </h2>

          <p
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            {t(missionConfig.body, missionConfig.bodyAr)}
          </p>
        </div>
      </div>
    </section>
  );
}
