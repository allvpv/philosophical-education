'use client';

import clsx from 'clsx';

import { Link, usePathname } from '@/i18n/routing';

export default function ArchiveButton({ text }: { text: string }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith('/archive');

  return (
    <span
      className={clsx(
        'duration-50 relative flex items-stretch rounded-full transition-colors',
        isActive && 'colors-button-nav hover:colors-button-nav-amplify',
      )}>
      <Link
        className="flex items-center px-[12.5px] py-1 xl:px-[15px]"
        href="/archive/latest">
        {text}
      </Link>
    </span>
  );
}
