import { useEffect, useRef, useState } from 'react';
import { investmentConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface InvestmentSectionProps {
  lang: UseLanguageReturn;
}

export default function InvestmentSection({ lang }: InvestmentSectionProps) {
  const { t, isRTL } = lang;
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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
      id="investment"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(4rem, 8vw, 8rem) 0',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* Tag */}
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 22px',
              border: '1px solid rgba(0,229,255,0.2)',
              background: 'rgba(0,87,255,0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '100px',
              color: 'var(--cyan-accent, #00E5FF)',
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              marginBottom: '2rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>
            </svg>
            {t(investmentConfig.tag, investmentConfig.tagAr)}
          </span>

          {/* Title */}
          <h2
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              lineHeight: 1.15,
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
              textWrap: 'balance',
            }}
          >
            {t(investmentConfig.title, investmentConfig.titleAr)}
          </h2>

          {/* Body */}
          <p
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 17px)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            {t(investmentConfig.body, investmentConfig.bodyAr)}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              {t(investmentConfig.ctaPrimary, investmentConfig.ctaPrimaryAr)}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points={isRTL ? "12 5 5 12 12 19" : "12 5 19 12 12 19"} />
              </svg>
            </a>
            <a
              href="https://wa.me/971505822373"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ textDecoration: 'none' }}
            >
              {t(investmentConfig.ctaSecondary, investmentConfig.ctaSecondaryAr)}
            </a>
          </div>

          {/* Video */}
          <div
            style={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              border: '1px solid rgba(0,229,255,0.15)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              background: '#071B34',
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={`/${investmentConfig.poster}`}
              preload="none"
              onLoadedData={() => setVideoLoaded(true)}
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '1.5rem',
                opacity: videoLoaded ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            >
              <source src={`/${investmentConfig.video}`} type="video/mp4" />
              <img
                src={`/${investmentConfig.poster}`}
                alt="Global Investment"
                style={{ width: '100%', display: 'block' }}
              />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
