import { fieldSet } from "@/lib/utils";

import Icon0 from "@/assets/icon-0.svg";
import { PetEmblemIcon } from "@/components/icons/pet-emblem";
import { PetFeatureIcon } from "@/components/icons/pet-feature";

interface IconProps {
    id?: number;
    size?: number;
    width?: number;
    height?: number;
    className?: string;
    src?: string;
    alt?: string;
    onErrorImg?: string;
}

function BaseIcon({ src, size, alt, className, onErrorImg, width, height }: IconProps) {
    return (
        <img
            src={src}
            width={width || size}
            height={height || size}
            alt={alt}
            className={className}
            onError={(e) => {
                fieldSet(e.target, "src", onErrorImg || Icon0);
            }}
        />
    );
}

function PetTypeIcon({ id, ...props }: IconProps) {
    const src = `icons/petType/${id}.svg`;
    const alt = `type-${id}`;
    return <BaseIcon src={src} alt={alt} {...props} />;
}

function PetAvatarIcon({ id, ...props }: IconProps) {
    const src = `icons/petAvatar/${id}.svg`;
    const alt = `type-${id}`;
    return <BaseIcon src={src} alt={alt} {...props} />;
}

function FightWeatherIcon({ id, ...props }: IconProps) {
    const src = `icons/fightWeather/${id}.svg`;
    const alt = `weather-${id}`;
    return <BaseIcon src={src} alt={alt} {...props} />;
}

function FightBuffIcon({ id, ...props }: IconProps) {
    const src = `icons/fightBuff/${id}.svg`;
    const alt = `buff-${id}`;
    return <BaseIcon src={src} alt={alt} {...props} />;
}

export { FightBuffIcon, FightWeatherIcon, PetAvatarIcon, PetEmblemIcon, PetFeatureIcon, PetTypeIcon };
