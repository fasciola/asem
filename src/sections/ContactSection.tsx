import { useEffect, useRef } from 'react';
import { contactConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface ContactSectionProps {
  lang: UseLanguageReturn;
}

export default function ContactSection({ lang }: ContactSectionProps) {
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
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem, 8vw, 8rem) 0',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Background Video (desktop only) */}
      <div
        className="hidden md:block"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        >
          <source src="/videos/contact-ambience.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(circle at 50% 40%, rgba(5,10,15,0.85) 0%, rgba(5,10,15,0.6) 50%)',
        }}
      />

      {/* Content */}
      <div
        className="reveal"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* Glass Card */}
        <div
          style={{
            background: 'rgba(7,27,52,0.8)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: '2rem',
            padding: 'clamp(2rem, 4vw, 4rem)',
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#ffffff',
            }}
          >
            <span style={{ color: 'var(--cyan-accent, #00E5FF)' }}>
              {t(contactConfig.title1, contactConfig.title1Ar)}
            </span>
            <br />
            {t(contactConfig.title2, contactConfig.title2Ar)}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}
          >
            {t(contactConfig.subtitle, contactConfig.subtitleAr)}
          </p>

          {/* License */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto 2rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(0,87,255,0.1)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '8px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-accent, #00E5FF)" strokeWidth="2">
              <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <span
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
              }}
            >
              {t(contactConfig.license, contactConfig.licenseAr)}
            </span>
          </div>

          {/* Contact Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Email */}
            <a
              href={`mailto:${contactConfig.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s',
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--cyan-accent, #00E5FF)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              {contactConfig.email}
            </a>

            {/* Phone */}
            <a
              href={`tel:${contactConfig.phone.replace(/\s/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s',
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--cyan-accent, #00E5FF)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {contactConfig.phone}
            </a>
          </div>

          {/* CTA Button */}
          <a
            href={`https://wa.me/${contactConfig.whatsapp}?text=Hi%2C%20I%20want%20to%20discuss%20a%20marketing%20project`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginRight: '8px' }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            {t(contactConfig.cta, contactConfig.ctaAr)}
          </a>
        </div>
      </div>
    </section>
  );
}
