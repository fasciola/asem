import { useEffect, useRef } from 'react';
import { clientsConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ClientsSectionProps {
  lang: UseLanguageReturn;
}

export default function ClientsSection({ lang }: ClientsSectionProps) {
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

  const clients = clientsConfig.clients;

  return (
    <section
      ref={sectionRef}
      id="clients"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(4rem, 8vw, 6rem) 0',
        zIndex: 2,
      }}
    >
      {/* Section header */}
      <div
        className="reveal"
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(3rem, 5vw, 4rem)',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
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
          {t(clientsConfig.tagline, clientsConfig.taglineAr)}
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
            {t('Trusted By', 'يثق بنا')}
          </span>
          <br />
          {t('Leading Brands.', 'رواد السوق.')}
        </h2>
      </div>

      {/* Client Logo Grid — static, no animation */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
        className="clients-grid"
      >
        {clients.map((client) => (
          <div
            key={client.logo}
            className="client-grid-item"
            style={{
              background: 'rgba(0,87,255,0.06)',
              border: '1px solid rgba(0,229,255,0.15)',
              borderRadius: '1rem',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '0.75rem',
              transition: 'all 0.35s ease',
              cursor: 'default',
              minHeight: '130px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(0,229,255,0.4)';
              el.style.background = 'rgba(0,87,255,0.12)';
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = '0 12px 30px rgba(0,87,255,0.2)';
              const img = el.querySelector('img');
              if (img) {
                (img as HTMLElement).style.filter = 'grayscale(0%) opacity(1)';
                (img as HTMLElement).style.transform = 'scale(1.04)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(0,229,255,0.15)';
              el.style.background = 'rgba(0,87,255,0.06)';
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
              const img = el.querySelector('img');
              if (img) {
                (img as HTMLElement).style.filter = 'grayscale(100%) opacity(0.7)';
                (img as HTMLElement).style.transform = 'scale(1)';
              }
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: '100px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`/${client.logo}`}
                alt={t(client.name, client.nameAr)}
                loading="lazy"
                decoding="async"
                width="100"
                height="56"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const initial = t(client.name, client.nameAr).charAt(0);
                    parent.innerHTML = `<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#0057FF,#00E5FF);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:600;font-family:Space Grotesk,sans-serif;">${initial}</div>`;
                  }
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'grayscale(100%) opacity(0.7)',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            {/* Name */}
            <span
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
                transition: 'color 0.3s',
                lineHeight: 1.3,
              }}
            >
              {t(client.name, client.nameAr)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .clients-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .clients-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
