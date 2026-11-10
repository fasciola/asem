import { servicesConfig } from '../config';
import type { UseLanguageReturn } from '../hooks/useLanguage';

interface MarqueeStripProps {
    lang: UseLanguageReturn;
}

export default function MarqueeStrip({ lang }: MarqueeStripProps) {
    const { t, isRTL } = lang;
    const words = servicesConfig.items.map((item) => t(item.title, item.titleAr));

    const track = (hidden: boolean) => (
        <ul className="ms-track" aria-hidden={hidden || undefined}>
            {words.map((word, i) => (
                <li key={`${word}-${i}`}>
                    <span className="ms-word">{word}</span>
                    <svg className="ms-star" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"
                        />
                    </svg>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="ms" dir="ltr" aria-label={t('Our services', 'خدماتنا')}>
            <div className="ms-inner" data-rtl={isRTL ? 'true' : 'false'}>
                {track(false)}
                {track(true)}
                {track(true)}
            </div>

            <style>{`
        .ms {
          position: relative; overflow: hidden;
          border-block: 1px solid rgba(243,201,139,.22);
          background: linear-gradient(90deg, rgba(0,0,0,.92), rgba(14,14,14,.85), rgba(0,0,0,.92));
          padding: clamp(1rem, 2.2vw, 1.6rem) 0;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
        }
        .ms-inner { display: flex; width: max-content; animation: msScroll 38s linear infinite; }
        .ms-inner[data-rtl='true'] { animation-direction: reverse; }
        .ms:hover .ms-inner { animation-play-state: paused; }
        .ms-track { display: flex; flex-shrink: 0; align-items: center; margin: 0; padding: 0; list-style: none; }
        .ms-track li { display: flex; align-items: center; }
        .ms-word {
          font-family: 'Instrument Serif', 'Playfair Display', serif;
          font-size: clamp(1.4rem, 3.2vw, 2.6rem); font-style: italic; line-height: 1;
          color: var(--gold-light, #f3c98b); white-space: nowrap; letter-spacing: -.01em;
        }
        .ms-inner[data-rtl='true'] .ms-word { font-family: 'Cairo', sans-serif; font-style: normal; font-weight: 600; }
        .ms-star { margin: 0 clamp(1.2rem, 3vw, 2.6rem); color: rgba(255,255,255,.55); flex-shrink: 0; }
        @keyframes msScroll { to { transform: translateX(-33.3333%); } }
        @media (prefers-reduced-motion: reduce) {
          .ms-inner { animation: none; }
          .ms { overflow-x: auto; }
        }
      `}</style>
        </div>
    );
}
