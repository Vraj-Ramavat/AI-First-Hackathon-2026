import React from "react";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LogoIcon({ className = "w-7 h-7", ...props }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Dark Luxury Gold Gradients */}
        <linearGradient id="ss-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6AA" />
          <stop offset="45%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#9A7B2C" />
        </linearGradient>

        <linearGradient id="ss-gold-light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#F5E6AA" />
          <stop offset="100%" stopColor="#FFF3D1" />
        </linearGradient>

        <linearGradient id="ss-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9A7B2C" />
          <stop offset="65%" stopColor="#544315" />
          <stop offset="100%" stopColor="#2D2309" />
        </linearGradient>

        <linearGradient id="ss-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5E6AA" />
        </linearGradient>

        <radialGradient id="ss-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.38" />
          <stop offset="65%" stopColor="#C9A84C" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>

        <filter id="ss-spark-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Ambient Glow */}
      <circle cx="256" cy="256" r="224" fill="url(#ss-glow)" />

      {/* Outer Hexagonal AI Circuit Grid Boundary */}
      <polygon
        points="256,36 440,142 440,370 256,476 72,370 72,142"
        stroke="url(#ss-gold-primary)"
        strokeWidth="3.5"
        strokeOpacity="0.5"
        fill="none"
      />

      {/* Outer Circuit Nodes & Connectors */}
      <g opacity="0.9">
        <line x1="256" y1="36" x2="256" y2="80" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="256" cy="36" r="6" fill="#F5E6AA" />

        <line x1="440" y1="142" x2="402" y2="164" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="440" cy="142" r="6" fill="#C9A84C" />

        <line x1="440" y1="370" x2="402" y2="348" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="440" cy="370" r="6" fill="#C9A84C" />

        <line x1="256" y1="476" x2="256" y2="432" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="256" cy="476" r="6" fill="#9A7B2C" />

        <line x1="72" y1="370" x2="110" y2="348" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="370" r="6" fill="#C9A84C" />

        <line x1="72" y1="142" x2="110" y2="164" stroke="url(#ss-gold-primary)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="142" r="6" fill="#C9A84C" />
      </g>

      {/* Faceted Upward Vector Ribbon (Top-Right / S-Curve Upper Branch) */}
      <path d="M256 80 L376 148 L336 172 L256 126 Z" fill="url(#ss-gold-light)" />
      <path d="M376 148 L376 220 L256 290 L206 260 L256 224 L336 172 Z" fill="url(#ss-gold-primary)" />

      {/* Faceted Anchor Vector Ribbon (Bottom-Left / S-Curve Lower Branch) */}
      <path d="M136 364 L136 292 L256 222 L306 252 L256 288 L176 340 Z" fill="url(#ss-gold-primary)" />
      <path d="M256 432 L136 364 L176 340 L256 386 Z" fill="url(#ss-gold-dark)" />

      {/* Precision Cutouts creating 'S' Monogram & Neural Channels */}
      <path d="M256 126 L336 172 L256 218 L176 172 Z" fill="#0D0B08" />
      <path d="M256 294 L336 340 L256 386 L176 340 Z" fill="#0D0B08" />

      {/* Inner Glowing AI Neural Loops */}
      <path d="M256 146 L306 172 L256 198 L206 172 Z" fill="url(#ss-gold-light)" opacity="0.95" />
      <path d="M256 314 L306 340 L256 366 L206 340 Z" fill="url(#ss-gold-primary)" opacity="0.95" />

      {/* Center AI Intelligence Spark Core */}
      <g filter="url(#ss-spark-glow)">
        <polygon points="256,208 294,256 256,304 218,256" fill="url(#ss-gold-light)" />
        <polygon points="256,222 274,256 256,290 238,256" fill="url(#ss-spark-grad)" />
        <polygon points="256,238 264,256 256,274 248,256" fill="#FFF3D1" />
        <circle cx="256" cy="256" r="4.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textSize?: string;
  showBadge?: string;
}

export default function Logo({
  className = "flex items-center gap-2 group",
  iconClassName = "w-7 h-7 sm:w-8 sm:h-8",
  textSize = "text-xl sm:text-2xl",
  showBadge,
}: LogoProps) {
  return (
    <div className={className}>
      <LogoIcon className={`${iconClassName} shrink-0 text-accent transition-transform duration-300 group-hover:scale-105`} />
      <div className="flex items-center gap-1">
        <span className={`font-display font-bold ${textSize} text-text-primary tracking-tight`}>
          Stock
        </span>
        <span className={`font-display font-bold ${textSize} text-accent tracking-tight group-hover:text-accent-hover transition-colors`}>
          Saathi
        </span>
        {showBadge && (
          <span className="text-[10px] font-mono text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded ml-1">
            {showBadge}
          </span>
        )}
      </div>
    </div>
  );
}
