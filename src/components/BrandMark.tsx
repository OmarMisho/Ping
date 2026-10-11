import React from 'react';
import { ScanLineIcon } from './icons';

interface BrandMarkProps {
  /** Outer square size in px. Figma uses 32 in the app header. */
  size?: number;
  className?: string;
}

/**
 * Founder brand mark: a soft-yellow rounded square holding a scan-line glyph.
 * Matches Figma "Brand mark" (32x32, radius 10).
 */
const BrandMark: React.FC<BrandMarkProps> = ({ size = 32, className = '' }) => (
  <div
    className={`bg-founder flex items-center justify-center rounded-[10px] flex-shrink-0 ${className}`}
    style={{ width: size, height: size }}
  >
    <ScanLineIcon
      className="text-ink"
      style={{ width: size * 0.6875, height: size * 0.6875 }}
    />
  </div>
);

export default BrandMark;
