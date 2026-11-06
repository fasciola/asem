interface FlagProps {
    /** Flag emoji (e.g. "🇸🇦") or a two-letter ISO code. Rendered from local SVGs because Windows has no flag emoji. */
    flag: string;
    height?: number;
    label?: string;
}

function toCode(flag: string): string {
    const points = Array.from(flag).map((ch) => ch.codePointAt(0) ?? 0);
    if (points.length === 2 && points.every((p) => p >= 0x1f1e6 && p <= 0x1f1ff)) {
        return points.map((p) => String.fromCharCode(p - 0x1f1e6 + 97)).join('');
    }
    return flag.toLowerCase();
}

export default function Flag({ flag, height = 28, label }: FlagProps) {
    const code = toCode(flag);
    return (
        <img
            src={`/flags/${code}.svg`}
            alt={label ?? ''}
            aria-hidden={label ? undefined : true}
            width={Math.round((height * 4) / 3)}
            height={height}
            loading="lazy"
            decoding="async"
            style={{ display: 'block', height, width: 'auto', borderRadius: 3, boxShadow: '0 0 0 1px rgba(255,255,255,.18)' }}
        />
    );
}
