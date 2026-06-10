import { footerConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface FooterSectionProps {
  lang: UseLanguageReturn;
}

export default function FooterSection({ lang }: FooterSectionProps) {
  const { t, isRTL } = lang;

  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        width: '100%',
        padding: '4rem 0 2rem',
        zIndex: 2,
        borderTop: '1px solid rgba(0,229,255,0.08)',
        background: 'rgba(5,10,15,0.95)',
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
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            textAlign: 'center',
          }}
          className="md:flex-row md:justify-between md:text-left md:items-start"
        >
          {/* Logo & Tagline */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '0.5rem',
              }}
            >
              <img
                src="/asem-vision-logo.png"
                alt="Asem Vision"
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.3))',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: 'var(--cyan-accent, #00E5FF)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  textTransform: 'uppercase',
                }}
              >
                Asem Vision
              </span>
            </div>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
              }}
            >
              {t(footerConfig.tagline, footerConfig.taglineAr)}
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {footerConfig.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--cyan-accent, #00E5FF)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                {t(link.label, link.labelAr)}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              fontFamily: isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif",
            }}
          >
            {t(footerConfig.copyright, footerConfig.copyrightAr)}
          </p>
        </div>
      </div>
    </footer>
  );
}
