import { cn } from "@/lib/utils";

interface PetFeatureIcon {
    id: number;
    size?: number;
    className?: string;
}

export function PetFeatureIcon({ size = 20, className }: PetFeatureIcon) {
    const text = "羽村";
    const height = size;
    const width = size * 2;
    const fontSize = size * 0.65;
    return (
        <div className={cn("relative", className)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 21.6" style={{ width, height }}>
                <g transform="matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)">
                    <path
                        d="M5.45 1.0 L39.6 1.0 43.85 5.25 43.85 16.35 39.6 20.65 5.45 20.65 1.15 16.35 1.15 5.25 5.45 1.0"
                        fill="#000000"
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M0.0 5.1 L0.15 4.8 4.7 0.2 5.0 0.1 5.2 0.0 39.85 0.0 40.05 0.1 40.3 0.2 44.85 4.8 45.0 5.1 45.0 16.5 44.85 16.85 40.3 21.45 40.05 21.55 39.85 21.6 5.2 21.6 5.0 21.55 4.7 21.45 0.15 16.85 0.0 16.5 0.0 5.1 M5.45 1.0 L1.15 5.25 1.15 16.35 5.45 20.65 39.6 20.65 43.85 16.35 43.85 5.25 39.6 1.0 5.45 1.0"
                        fill="#00ffff"
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M5.95 6.45 L5.95 15.15 2.3 15.15 2.3 6.45 5.95 6.45 M6.3 5.55 L2.35 5.55 6.3 1.7 6.3 5.55 M38.85 1.7 L42.8 5.55 38.85 5.55 38.85 1.7 M38.85 20.05 L38.85 16.2 42.8 16.2 38.85 20.05 M39.2 6.4 L42.7 6.4 42.7 15.25 39.2 15.25 39.2 6.4 M6.3 16.2 L6.3 20.05 2.35 16.2 6.3 16.2"
                        fill="#ffff66"
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M5.95 6.45 L2.3 6.45 2.3 15.15 5.95 15.15 5.95 6.45 M6.3 5.55 L6.3 1.7 2.35 5.55 6.3 5.55 M5.45 1.0 L39.6 1.0 43.85 5.25 43.85 16.35 39.6 20.65 5.45 20.65 1.15 16.35 1.15 5.25 5.45 1.0 M38.85 1.7 L38.85 5.55 42.8 5.55 38.85 1.7 M39.2 6.4 L39.2 15.25 42.7 15.25 42.7 6.4 39.2 6.4 M38.85 20.05 L42.8 16.2 38.85 16.2 38.85 20.05 M6.3 16.2 L2.35 16.2 6.3 20.05 6.3 16.2"
                        fill="#ffff66"
                        fillOpacity="0.0"
                        fillRule="evenodd"
                        stroke="none"
                    />
                </g>
            </svg>
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    fontSize: fontSize,
                    color: "#ffff66",
                    width: width,
                    height: height,
                }}
            >
                {text}
            </div>
        </div>
    );
}
