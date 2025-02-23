import * as React from 'react';

import {
  LogoWide,
  LogoIcon,
  LogoWideLegacy,
  LogoIconLegacy,
} from '@/assets/logo';

import ThemeSwitcher from './theme_switcher';
import LocaleSwitcher from './locale_switcher';
import { LocaleType } from './locale_switcher';
import MonoToggle from './mono_toggle';
import HeaderBackground from './header_background';
import Nav from './nav';

import { useTranslations } from 'next-intl';
import { getThemesWithTranslation } from '@/helpers/themes';

const HeaderSeparator = () => (
  <div className="colors-border h-6 w-0 translate-x-1/2 border-l-2" />
);

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('Themes');
  const themes = getThemesWithTranslation(t);
  const localeSanitized = locale === 'pl' ? 'pl' : 'en';

  return (
    <React.Fragment>
      <HeaderBackground />
      <Logo />
      <nav
        className="colors-text-navbar min-[710px]:pl-7 relative mx-auto flex h-full max-w-6xl
          items-center justify-start gap-5 px-4 text-sm font-medium md:gap-7 md:px-12
          xs:px-6">
        <span className="order-1">
          <Nav />
        </span>
        <span className="order-2 mr-1 flex w-[82px] grow justify-start sm:justify-end">
          <LocaleSwitcherButton locale={localeSanitized} />
        </span>
        <span className="order-4 -ml-2 hidden md:block">
          <HeaderSeparator />
        </span>
        <span className="order-5">
          <MonoToggle>
            <IconEye />
          </MonoToggle>
        </span>
        <span className="order-6">
          <ThemeSwitcher themes={themes} />
        </span>
      </nav>
    </React.Fragment>
  );
}

export function LocaleSwitcherButton({
  locale,
}: {
  locale: LocaleType;
}): JSX.Element {
  const fullNames = {
    en: 'English',
    pl: 'Polski',
  };

  return (
    <LocaleSwitcher fullNames={fullNames} currentLocale={locale}>
      <span
        className="colors-button-nav hover:colors-button-nav-amplify flex w-max items-center
          rounded-lg transition-colors">
        <div className="py-1 pl-2.5 pr-[6px]">
          <IconGlobe />
        </div>
        <div className="colors-text-toned font-normal uppercase">{locale}</div>
        <div className="py-1 pl-[0px] pr-3">
          <IconExpandTiny />
        </div>
      </span>
    </LocaleSwitcher>
  );
}

const Logo = () => (
  <div className="absolute-center colors-logo absolute z-[99] scale-[0.80]">
    <LogoWide className="hidden lg:block" />
    <LogoIcon className="block lg:hidden" />
  </div>
);

const LogoLegacy = () => (
  <div className="absolute-center colors-logo-legacy absolute z-[99] mt-[2px]">
    <LogoWideLegacy className="hidden lg:block" />
    <LogoIconLegacy className="block lg:hidden" />
  </div>
);

const IconEye = () => (
  <svg fill="none" viewBox="0 0 24 24" className="colors-eye h-[22px] w-[22px]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      className="fill-accent-soft colors-fullfill"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.0}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      className="fill-accent-hard colors-fullfill"
    />
  </svg>
);

const IconGlobe = () => (
  <svg fill="none" viewBox="0 0 24 24" className="colors-toned-stroke h-4 w-4">
    <circle cx="12" cy="12" r="9" className="colors-fill" strokeWidth={2.0} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 12 21
            C 14.485 21 16.5 16.97 16.5 12
            S 14.485 3 12 3

            M 12 21
            C 9.515 21 7.5 16.97 7.5 12
            S 9.515 3 12 3

            M 19.843 7.582
            A 11.953 11.953 0 0 1 12 10.5
            C 9.002 10.5 6.26 9.4 4.157 7.582

            M 20.716 14.253
            A 17.919 17.919 0 0 1 12 16.5
            C 8.838 16.5 5.867 15.685 3.284 14.253"
      strokeWidth={1.9}
    />
  </svg>
);

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
