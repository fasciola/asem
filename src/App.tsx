import { Suspense, lazy, useEffect, useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import Navigation from './components/Navigation';
import FloatingButtons from './components/FloatingButtons';
import HeroSection from './sections/HeroSection';
import MarqueeStrip from './sections/MarqueeStrip';

// Heavy / below-the-fold code is split out so the first paint only needs React + the hero.
const FluidBackground = lazy(() => import('./components/FluidBackground'));
const BelowFold = lazy(() => import('./BelowFold'));

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };

function App() {
    const lang = useLanguage();
    const [ready, setReady] = useState(false);

    // Start loading the rest of the page once the browser is idle after first paint.
    useEffect(() => {
        const idle = (window as IdleWindow).requestIdleCallback;
        const id = idle ? idle(() => setReady(true), { timeout: 1200 }) : window.setTimeout(() => setReady(true), 300);
        // if the user scrolls early, don't wait
        const early = () => setReady(true);
        window.addEventListener('scroll', early, { once: true, passive: true });
        return () => {
            window.removeEventListener('scroll', early);
            if (!idle) window.clearTimeout(id);
        };
    }, []);

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                overflowX: 'hidden',
                isolation: 'isolate',
                background: '#000000',
            }}
        >
            {/* Smoky animated background (three.js loads after first paint) */}
            {ready && (
                <Suspense fallback={null}>
                    <FluidBackground isActive />
                </Suspense>
            )}


            <Navigation lang={lang} />
            <FloatingButtons />

            <main style={{ position: 'relative', zIndex: 1 }}>
                <div id="home" style={{ position: 'relative', zIndex: 1 }}>
                    <HeroSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <MarqueeStrip lang={lang} />
                </div>

                {ready && (
                    <Suspense fallback={<div style={{ minHeight: '120vh' }} />}>
                        <BelowFold lang={lang} />
                    </Suspense>
                )}
            </main>
        </div>
    );
}

export default App;
