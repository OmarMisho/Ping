import React from 'react';

/*
 * Inline icon set.
 *
 * The project already draws all of its icons as inline SVGs, so we keep that
 * convention instead of pulling in an icon component library. These mirror the
 * Lucide glyphs used in the Figma file (scan-line, user-round, message-circle,
 * arrow-up-right, send) plus a couple of UI extras.
 */

type IconProps = React.SVGProps<SVGSVGElement> & {
  /** Stroke width. Figma uses ~1.75 for outlined icons. */
  strokeWidth?: number;
};

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: props.strokeWidth ?? 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const ScanLineIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </svg>
);

export const UserRoundIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

export const MessageCircleIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

export const ArrowUpRightIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth: strokeWidth ?? 2 })} {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth: strokeWidth ?? 2 })} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth })} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ strokeWidth, ...props }) => (
  <svg {...base({ strokeWidth: strokeWidth ?? 2.5 })} {...props} className={`animate-spin ${props.className ?? ''}`}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
