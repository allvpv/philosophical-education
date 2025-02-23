import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { Translator, NavItem } from '@/types';

import ArchiveButton from './archive_button';
import Hamburger from './hamburger';
import NavItems from './nav_items';

export default async function Nav() {
  return (
    <nav className="flex items-center">
      <ul className="hidden flex-row items-center gap-3 sm:flex">
        <NavBar />
      </ul>
      <span className="-mr-3 block sm:hidden">
        <HamburgerButton />
      </span>
    </nav>
  );
}

const getNavItems = (t: Translator, includeArchive: boolean): NavItem[] => {
  let items = [
    {
      href: '/content',
      text: t('main'),
      matchPrefix: '/content',
    },
    {
      href: '/archive/latest',
      text: t('archive'),
      matchPrefix: '/archive',
    },
  ];

  return includeArchive ? items.slice(0, -1) : items;
};

const NavBar = () => {
  const t = useTranslations('Header');
  const archiveButton = <ArchiveButton text={t('archive')} />;
  const navItems = getNavItems(t, true);

  return (
    <NextIntlClientProvider>
      <NavItems navItems={navItems} archiveButton={archiveButton} />
    </NextIntlClientProvider>
  );
};

const HamburgerButton = () => {
  const t = useTranslations('Header');
  const navItems = getNavItems(t, false);

  return (
    <NextIntlClientProvider>
      <Hamburger navItems={navItems}>
        <IconHamburger />
      </Hamburger>
    </NextIntlClientProvider>
  );
};

const IconExpandTiny = () => (
  <svg
    width="6"
    height="3"
    className="ml-2 overflow-visible"
    aria-hidden="true"
    stroke="currentColor">
    <path
      d="M 0 0
         L 3 3
         L 6 0"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

const IconHamburger = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    className="colors-toned-stroke hover:colors-toned-stroke-hover h-6 w-6 transition-colors">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 3.25 6  h 17.5
         M 3.25 12 h 17.5
         M 3.25 18 h 17.5"
    />
  </svg>
);
