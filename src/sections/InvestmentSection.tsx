import { useEffect, useRef, useState } from 'react';
import { investmentConfig } from '../config';
import LazyVideo from '../components/LazyVideo';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface InvestmentSectionProps {
  lang: UseLanguageReturn;
}

const IMG = '/images/cine';

const portals = [
  {
    img: `${IMG}/investment-portal-doorway.webp`,
    title: 'Market Entry',
    titleAr: 'دخول الأسواق',
    sub: 'Open the right doors, precisely',
    subAr: 'افتح الأبواب المناسبة بدقة',
  },
  {
    img: `${IMG}/investment-portal-ocean.webp`,
    title: 'Global Expansion',
    titleAr: 'التوسع العالمي',
    sub: 'From the GCC to the world',
    subAr: 'من الخليج إلى العالم',
  },
  {
    img: `${IMG}/investment-portal-stairwell.webp`,
    title: 'Luxury Positioning',
    titleAr: 'التموضع الفاخر',
    sub: 'Brands built for premium audiences',
    subAr: 'علامات تُبنى لجمهور راقٍ',
  },
];

export default function InvestmentSection({ lang }: InvestmentSectionProps) {
  const { t, isRTL } = lang;
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // reveal + scroll-linked parallax progress (--p from -1 to 1 across the viewport)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    if (!reduce) {
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const label = isRTL ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif";
  const body = isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const display = isRTL ? "'Cairo', sans-serif" : "'Instrument Serif', serif";

  return (
    <section
      ref={sectionRef}
      id="investment"
      className={`inv ${inView ? 'inv-in' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Copy */}
      <div className="inv-copy">
        <span className="inv-tag" style={{ fontFamily: label }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
          {t(investmentConfig.tag, investmentConfig.tagAr)}
        </span>

        <h2 className="inv-title" style={{ fontFamily: display }}>
          {t(investmentConfig.title, investmentConfig.titleAr)}
        </h2>

        <p className="inv-body" style={{ fontFamily: body }}>
          {t(investmentConfig.body, investmentConfig.bodyAr)}
        </p>

        <div className="inv-cta">
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
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
      </div>

      {/* Scene: planets + celestial figure */}
      <div className="inv-stage" aria-hidden="true">
        <div className="inv-glow" />
        <img className="inv-planets" src={`${IMG}/investment-planets.webp`} alt="" width={1672} height={941} loading="lazy" decoding="async" />
        <img className="inv-figure" src={`${IMG}/investment-central-figure.webp`} alt="" width={1536} height={1024} loading="lazy" decoding="async" />
      </div>

      {/* Portal cards */}
      <ul className="inv-portals">
        {portals.map((p, i) => (
          <li key={p.title} className={`inv-portal inv-portal-${i + 1}`} style={{ ['--i' as string]: i }}>
            <img src={p.img} alt="" loading="lazy" decoding="async" width={1024} height={1536} />
            <div className="inv-portal-cap">
              <strong style={{ fontFamily: label }}>{t(p.title, p.titleAr)}</strong>
              <span style={{ fontFamily: body }}>{t(p.sub, p.subAr)}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Video (unchanged content) */}
      <div className="inv-video">
        <LazyVideo src={`/${investmentConfig.video}`} poster={`/${investmentConfig.poster}`} style={{ width: '100%', display: 'block' }} />
      </div>

      <style>{`
        .inv { --p: 0; --sh: calc(100svh - 7rem); position: relative; z-index: 2; overflow: hidden; padding: clamp(4rem, 8vw, 8rem) 0 clamp(3rem, 6vw, 6rem); }

        .inv-copy {
          position: relative; z-index: 5; max-width: 860px; margin: 0 auto;
          padding: 0 clamp(1.5rem, 4vw, 3rem); text-align: center;
        }
        .inv-tag {
          display: inline-flex; align-items: center; gap: 10px; padding: 10px 22px; margin-bottom: 1.8rem;
          border: 1px solid rgba(243,201,139,.3); background: rgba(243,201,139,.07);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-radius: 100px; color: var(--gold-light, #f3c98b);
          font-size: 13px; letter-spacing: 1px; text-transform: uppercase;
        }
        .inv-title {
          margin: 0 auto 1.4rem; font-weight: 400; line-height: 1.04; letter-spacing: -.02em;
          font-size: clamp(2.2rem, 5.2vw, 4.4rem); text-wrap: balance;
        }
        .inv-body { margin: 0 auto 2.2rem; max-width: 660px; font-size: clamp(14px, 1.2vw, 17px); line-height: 1.8; font-weight: 300; }
        .inv-cta { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

        /* ---- scene ---- */
        .inv-stage {
          position: relative; width: min(1280px, 100%, calc(var(--sh) * 1.2)); margin: clamp(-2rem, -3vw, 0px) auto 0;
          aspect-ratio: 16 / 8.2; pointer-events: none;
        }
        .inv-glow {
          position: absolute; left: 50%; top: 52%; width: 60%; aspect-ratio: 1; border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(243,201,139,.30) 0%, rgba(243,201,139,.08) 45%, transparent 70%);
          filter: blur(30px);
        }
        .inv-planets, .inv-figure {
          position: absolute; left: 50%; display: block; height: auto; max-width: none;
          /* the artwork is cyan; shift it toward the site's gold */
          filter: hue-rotate(-140deg) saturate(.95);
          opacity: 0; transition: opacity 1.2s ease;
        }
        .inv-in .inv-planets, .inv-in .inv-figure { opacity: 1; }
        .inv-planets {
          width: 118%; top: 2%;
          transform: translate(-50%, calc(var(--p) * -48px));
        }
        .inv-figure {
          width: 66%; top: 6%;
          transform: translate(-50%, calc(var(--p) * -22px));
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 98%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 98%);
          animation: invBreath 9s ease-in-out infinite;
        }
        @keyframes invBreath {
          0%, 100% { scale: 1; }
          50%      { scale: 1.025; }
        }

        /* ---- portal cards ---- */
        .inv-portals {
          position: relative; z-index: 6; list-style: none; margin: calc(var(--sh) * -0.14) auto 0; padding: 0 clamp(1.5rem, 4vw, 3rem);
          max-width: min(1000px, calc(var(--sh) * 0.85 + 2 * clamp(1.5rem, 4vw, 3rem))); display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(.75rem, 2vw, 1.75rem);
          align-items: start;
        }
        .inv-portal {
          position: relative; overflow: hidden; aspect-ratio: 2 / 3; border-radius: 22px;
          border: 1px solid rgba(243,201,139,.28);
          box-shadow: 0 30px 60px rgba(0,0,0,.5);
          opacity: 0; transform: translateY(36px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), border-color .3s;
          transition-delay: calc(var(--i) * 150ms);
        }
        .inv-portal-2 { margin-top: clamp(-3rem, -4vw, -1rem); }
        .inv-in .inv-portal { opacity: 1; transform: none; }
        .inv-in .inv-portal:hover { transform: translateY(-8px); border-color: rgba(243,201,139,.7); transition-delay: 0s; }
        .inv-portal img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          filter: hue-rotate(-140deg) saturate(.9);
          transition: transform 1.1s cubic-bezier(.16,1,.3,1);
        }
        .inv-portal:hover img { transform: scale(1.06); }
        .inv-portal-cap {
          position: absolute; left: 0; right: 0; bottom: 0; padding: 3rem 1.1rem 1.1rem;
          background: linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.55) 55%, transparent 100%);
          display: flex; flex-direction: column; gap: 3px; text-align: start;
        }
        .inv-portal-cap strong { font-size: clamp(13px, 1.3vw, 16px); font-weight: 600; color: #fff; letter-spacing: .02em; }
        .inv-portal-cap span { font-size: clamp(11px, 1vw, 13px); color: rgba(255,255,255,.78); line-height: 1.4; font-weight: 300; }

        /* ---- video ---- */
        .inv-video {
          position: relative; max-width: 1000px; margin: clamp(3rem, 6vw, 5rem) auto 0;
          width: calc(100% - 2 * clamp(1.5rem, 4vw, 3rem));
          border-radius: 1.5rem; overflow: hidden; background: #000000;
          border: 1px solid rgba(243,201,139,.18); box-shadow: 0 30px 60px rgba(0,0,0,.4);
        }
        .inv-video video { width: 100%; display: block; transition: opacity .5s; }

        @media (max-width: 760px) {
          .inv-stage { aspect-ratio: 4 / 3.6; }
          .inv-planets { width: 150%; }
          .inv-figure { width: 98%; }
          .inv-portal { border-radius: 14px; aspect-ratio: 3 / 5; }
          .inv-portal-cap { padding: 2rem .6rem .7rem; }
          .inv-portal-cap span { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .inv-figure { animation: none; }
          .inv-planets, .inv-figure, .inv-portal { transition: none; opacity: 1; transform: none; }
          .inv-planets { transform: translateX(-50%); }
          .inv-figure { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
