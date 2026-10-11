import React from 'react';
import BrandMark from './BrandMark';

interface AppHeaderProps {
  /** Small pill shown on the right. Pass `null` to hide it. */
  badge?: string | null;
  /** Optional element rendered after the badge (e.g. a live indicator). */
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * Founder app header: brand mark + wordmark on the left, pill badge on the right.
 * Matches Figma "App header" (390x72, 24px side padding, 9px wordmark gap).
 */
const AppHeader: React.FC<AppHeaderProps> = ({
  badge = 'Private chat',
  trailing,
  className = '',
}) => (
  <header
    className={`h-[72px] bg-white flex items-center justify-between gap-3 px-6 flex-shrink-0 ${className}`}
  >
    <div className="flex items-center gap-[9px]">
      <BrandMark size={32} />
      <span className="text-[19px] font-bold leading-none text-ink">Founder</span>
    </div>

    <div className="flex items-center gap-2">
      {badge && (
        <span className="px-[10px] py-[5px] rounded-full bg-founder-soft text-founder-deep text-[11px] font-semibold leading-none whitespace-nowrap">
          {badge}
        </span>
      )}
      {trailing}
    </div>
  </header>
);

export default AppHeader;
