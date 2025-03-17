import { PetAvatarIcon } from "@/components/icons.tsx";
import { cn } from "@/lib/utils.ts";

const colors: Record<number, string[]> = {
    0: ["#33cc66", "#c9cbd8", "#9b6ec6"],
    1: ["#a8f9f0", "#3eb9b9", "#4dc4c2"],
    2: ["#ffec2e", "#ba1b1b", "#775b4e"],
    3: ["#0bdd30", "#c5fa74", "#284f17"],
};

interface PetEmblemProps {
    id: number;
    size?: number;
    className?: string;
}

export function PetEmblemIcon({ id, size = 32, className }: PetEmblemProps) {
    const color = colors[3] || colors[1];
    id = id - 300000;
    return (
        <div className={cn("relative", className)}>
            <svg width={size} height={size} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)">
                    <path
                        d="M26.0 4.5 L25.3 11.3 30.0 15.05 30.0 15.1 24.8 14.25 Q24.5 11.8 23.0 9.8 L26.0 4.5 M29.9 15.15 L25.3 19.15 26.05 25.85 26.05 25.9 18.95 25.4 15.05 29.9 16.15 24.65 Q18.9 24.4 21.15 22.7 L26.05 25.85 22.55 21.4 Q24.45 19.25 24.8 16.4 L29.9 15.15 M15.0 29.95 L14.95 30.0 11.05 25.4 4.65 25.8 9.3 22.9 Q11.3 24.35 13.85 24.65 L15.0 29.95 M4.6 25.8 L4.5 25.8 4.5 25.65 5.05 19.3 0.05 15.0 0.0 14.95 5.15 11.05 4.6 4.3 10.95 5.1 14.95 0.0 15.0 0.05 19.15 5.15 26.0 4.3 26.0 4.4 Q23.65 6.25 21.25 8.05 L21.1 7.95 Q19.2 6.5 16.9 6.15 L15.0 0.05 13.9 6.1 Q11.65 6.3 9.8 7.45 L4.65 4.35 8.25 8.65 8.25 8.7 8.2 8.7 8.2 8.75 Q6.0 10.95 5.5 13.85 L0.05 15.0 5.4 15.85 Q5.6 18.85 7.5 21.2 L4.6 25.8"
                        fill={color[0]}
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M26.0 4.5 L23.0 9.8 Q24.5 11.8 24.8 14.25 L30.0 15.1 29.9 15.15 24.8 16.4 Q24.45 19.25 22.55 21.4 L26.05 25.85 21.15 22.7 Q18.9 24.4 16.15 24.65 L15.05 29.9 15.0 29.95 13.85 24.65 Q11.3 24.35 9.3 22.9 L4.65 25.8 4.6 25.8 7.5 21.2 Q5.6 18.85 5.4 15.85 L0.05 15.0 5.5 13.85 Q6.0 10.95 8.2 8.75 L8.25 8.7 8.25 8.65 4.65 4.35 9.8 7.45 Q11.65 6.3 13.9 6.1 L15.0 0.05 16.9 6.15 Q19.2 6.5 21.1 7.95 L21.25 8.05 Q23.65 6.25 26.0 4.4 L26.0 4.5 M23.7 15.35 Q23.7 12.0 21.15 9.55 18.6 7.25 15.2 7.25 11.65 7.25 9.15 9.55 L9.05 9.7 Q6.7 12.1 6.7 15.35 6.7 18.65 9.0 21.0 L9.15 21.15 Q11.65 23.5 15.2 23.5 18.7 23.5 21.5 20.85 23.7 18.5 23.7 15.35"
                        fill={color[1]}
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M23.7 15.35 Q23.7 18.5 21.5 20.85 18.7 23.5 15.2 23.5 11.65 23.5 9.15 21.15 L9.0 21.0 Q6.7 18.65 6.7 15.35 6.7 12.1 9.05 9.7 L9.15 9.55 Q11.65 7.25 15.2 7.25 18.6 7.25 21.15 9.55 23.7 12.0 23.7 15.35"
                        fill={color[2]}
                        fillRule="evenodd"
                        stroke="none"
                    />
                </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center" style={{ width: size, height: size }}>
                <div className="rounded-full overflow-hidden">
                    <PetAvatarIcon id={id} size={size * 0.55} />
                </div>
            </div>

            <svg
                className="absolute top-0 lef-0"
                width={size}
                height={size}
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform="matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)">
                    <path
                        d="M6.75 15.2 Q6.75 12.0 9.1 9.65 L9.2 9.55 Q11.65 7.25 15.25 7.25 L15.95 7.25 Q9.25 12.5 10.25 21.75 L9.2 20.9 9.05 20.75 Q6.75 18.45 6.75 15.2"
                        fill="#ffffff"
                        fillOpacity="0.2"
                        fillRule="evenodd"
                        stroke="none"
                    />
                    <path
                        d="M11.55 9.3 Q11.95 9.4 11.8 10.1 L10.7 11.8 9.5 13.15 Q8.95 13.05 8.85 12.75 L8.85 12.4 Q9.15 10.8 10.6 9.7 11.2 9.2 11.55 9.3 M9.85 14.75 L9.55 15.25 Q9.2 15.55 8.85 15.5 8.3 15.4 8.2 15.0 L8.25 14.6 Q8.35 13.8 9.15 13.9 10.0 14.0 9.85 14.75"
                        fill="#ffffff"
                        fillRule="evenodd"
                        stroke="none"
                    />
                </g>
            </svg>
        </div>
    );
}
