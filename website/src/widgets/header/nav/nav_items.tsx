'use client';

import Link from 'next/link';
import { usePathname } from '@/navigation';

import { NavItem } from '@/types';

import clsx from 'clsx';

export default function NavItems({
  locale,
  navItems,
  archiveButton,
}: {
  locale: string;
  navItems: NavItem[];
  archiveButton: JSX.Element;
}) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item, i) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <li
            className={clsx(
              'items-stretch rounded-full py-1 transition-[filter] transition-colors',
              isActive && 'colors-button-nav hover:colors-button-nav-amplify',
            )}
            key={i}>
            <Link
              className="px-[12.5px] py-1 xl:px-[15px]"
              href={item.href}
              locale={locale === 'pl' ? 'pl' : 'en'}>
              {item.text}
            </Link>
          </li>
        );
      })}
      <li>{archiveButton}</li>
    </>
  );
}
