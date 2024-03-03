import { useTranslations } from 'next-intl';
import { Translator, NavItem } from '@/types';

import ArchiveButton from './archive_button';
import Hamburger from './hamburger';
import NavItems from './nav_items';

export default async function Nav({ locale }: { locale: string }) {
  return (
    <nav className="flex items-center">
      <ul className="hidden flex-row items-center gap-3 sm:flex">
        <NavBar locale={locale} />
      </ul>
      <span className="-mr-3 block sm:hidden">
        <HamburgerButton locale={locale} />
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

const NavBar = ({ locale }: { locale: string }) => {
  const t = useTranslations('Header');

  return (
    <NavItems
      locale={locale}
      navItems={getNavItems(t, true)}
      archiveButton={<ArchiveButton text={t('archive')} />}
    />
  );
};

const HamburgerButton = ({ locale }: { locale: string }) => {
  const t = useTranslations('Header');

  return (
    <Hamburger navItems={getNavItems(t, false)} locale={locale}>
      <IconHamburger />
    </Hamburger>
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
