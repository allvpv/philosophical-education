'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

import { NavItem } from '@/types';

import clsx from 'clsx';

export default function NavItems({
  navItems,
  archiveButton,
}: {
  navItems: NavItem[];
  archiveButton: JSX.Element;
}) {
  const pathname = usePathname();
  const locale = useLocale();

  console.log(`Current link is ${locale}`);

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
            <Link className="px-[12.5px] py-1 xl:px-[15px]" href={item.href}>
              {item.text}
            </Link>
          </li>
        );
      })}
      <li>{archiveButton}</li>
    </>
  );
}
