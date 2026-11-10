import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

interface LazyVideoProps {
    src: string;
    poster?: string;
    style?: CSSProperties;
    className?: string;
}

/**
 * Muted looping video that downloads only when it is near the viewport,
 * plays while visible and pauses (and stops decoding) when scrolled away.
 */
export default function LazyVideo({ src, poster, style, className }: LazyVideoProps) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let loaded = false;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!loaded) {
                        video.src = src;
                        loaded = true;
                    }
                    if (!reduce) video.play().catch(() => undefined);
                } else if (loaded) {
                    video.pause();
                }
            },
            { rootMargin: '250px 0px' }
        );
        io.observe(video);

        return () => io.disconnect();
    }, [src]);

    return <video ref={ref} className={className} style={style} poster={poster} muted loop playsInline preload="none" />;
}
