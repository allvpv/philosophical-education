'use client';

import Link from 'next/link';
import clsx from 'clsx';

import { PropsWithChildren } from 'react';
import { usePathname } from '@/navigation';
import { Listbox } from '@headlessui/react';

import { NavItem } from '@/types';

export default function Hamburger({
  navItems,
  locale,
  children,
}: PropsWithChildren<{
  navItems: NavItem[];
  locale: string;
}>) {
  const pathname = usePathname();

  return (
    <Listbox>
      <Listbox.Button className="hover:colors-amplify-filter fix-safari block transition-[filter]">
        {children}
      </Listbox.Button>
      <Listbox.Options
        className="colors-dialog colors-border absolute translate-y-1 rounded-lg border-4 py-3">
        <ul className="font-sans text-base font-medium">
          {navItems.map((item, i) => {
            const isActive = pathname.startsWith(item.matchPrefix);

            return (
              <li
                className={clsx(
                  'py-3 pl-6 pr-10',
                  isActive && 'colors-dialog-selected',
                )}
                key={i}>
                <Link
                  locale={locale}
                  href={item.href}
                  className="hover:colors-amplify-filter transition-[filter]">
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </Listbox.Options>
    </Listbox>
  );
}
